import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Mess from "@/models/Mess";
import Advertisement from "@/models/Advertisement";
import Review from "@/models/Review";
import SupportTicket from "@/models/SupportTicket";
import AuditLog from "@/models/AuditLog";
import { requireAdmin } from "@/lib/auth";
import { ok } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";

const DAYS = 14;

function utcDayKey(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function buildSeries(rows) {
  const counts = new Map(rows.map((row) => [row._id, row.count]));
  const today = new Date();
  const series = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const day = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    day.setUTCDate(day.getUTCDate() - i);
    const key = utcDayKey(day);
    series.push({ date: key, count: counts.get(key) || 0 });
  }
  return series;
}

function dailySeries(Model, start, match = {}) {
  return Model.aggregate([
    { $match: { createdAt: { $gte: start }, ...match } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
}

export async function GET() {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    await connectDB();

    const today = new Date();
    const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    start.setUTCDate(start.getUTCDate() - (DAYS - 1));

    const notDeleted = { isDeleted: { $ne: true } };

    const [
      users,
      owners,
      admins,
      messes,
      published,
      pending,
      rejected,
      suspended,
      archived,
      ads,
      activeAds,
      reviews,
      openSupport,
      deletedUsers,
      deletedMesses,
      registrationRows,
      listingRows,
      usersByRoleRows,
      messesByStatusRows,
      topCityRows,
      supportByStatusRows,
      recentAuditRows,
    ] = await Promise.all([
      User.countDocuments(notDeleted),
      User.countDocuments({ ...notDeleted, role: "owner" }),
      User.countDocuments({ ...notDeleted, role: "admin" }),
      Mess.countDocuments(notDeleted),
      Mess.countDocuments({ ...notDeleted, status: "published" }),
      Mess.countDocuments({ ...notDeleted, status: "pending" }),
      Mess.countDocuments({ ...notDeleted, status: "rejected" }),
      Mess.countDocuments({ ...notDeleted, status: "suspended" }),
      Mess.countDocuments({ ...notDeleted, status: "archived" }),
      Advertisement.countDocuments(notDeleted),
      Advertisement.countDocuments({ ...notDeleted, isActive: true }),
      Review.countDocuments(notDeleted),
      SupportTicket.countDocuments({ ...notDeleted, status: "open" }),
      User.countDocuments({ isDeleted: true }),
      Mess.countDocuments({ isDeleted: true }),
      dailySeries(User, start),
      dailySeries(Mess, start),
      User.aggregate([
        { $match: notDeleted },
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Mess.aggregate([
        { $match: notDeleted },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Mess.aggregate([
        { $match: { ...notDeleted, status: "published", city: { $nin: [null, ""] } } },
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 6 },
      ]),
      SupportTicket.aggregate([
        { $match: notDeleted },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      AuditLog.find().populate("actorId", "name email").sort({ createdAt: -1 }).limit(8).lean(),
    ]);

    return ok({
      stats: {
        totals: {
          users,
          owners,
          admins,
          messes,
          published,
          pending,
          rejected,
          suspended,
          archived,
          ads,
          activeAds,
          reviews,
          openSupport,
          deletedUsers,
          deletedMesses,
        },
        registrations: buildSeries(registrationRows),
        listingsCreated: buildSeries(listingRows),
        usersByRole: usersByRoleRows.map((row) => ({ role: row._id, count: row.count })),
        messesByStatus: messesByStatusRows.map((row) => ({ status: row._id, count: row.count })),
        topCities: topCityRows.map((row) => ({ city: row._id, count: row.count })),
        supportByStatus: supportByStatusRows.map((row) => ({ status: row._id, count: row.count })),
        recentAudit: recentAuditRows.map((row) => ({
          action: row.action,
          createdAt: row.createdAt,
          actor: row.actorId ? { name: row.actorId.name, email: row.actorId.email } : null,
        })),
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
