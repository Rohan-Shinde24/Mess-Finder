import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";
import AuditLog from "@/models/AuditLog";
import { requireAdmin } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KEY = "site";

export async function GET() {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    await connectDB();

    const settings = await Settings.findOneAndUpdate(
      { key: KEY },
      { $setOnInsert: { key: KEY } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return ok({ settings });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request) {
  try {
    const { user: admin, response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    const update = {};

    if (body.siteName !== undefined) {
      const value = String(body.siteName).trim();
      if (value.length < 2 || value.length > 60) return fail("Site name must be between 2 and 60 characters", 400);
      update.siteName = value;
    }
    if (body.supportEmail !== undefined) {
      const value = String(body.supportEmail).trim().toLowerCase();
      if (!EMAIL_RE.test(value)) return fail("Enter a valid support email address", 400);
      update.supportEmail = value;
    }
    if (body.supportPhone !== undefined) update.supportPhone = String(body.supportPhone).trim().slice(0, 20);
    if (body.contactName !== undefined) update.contactName = String(body.contactName).trim().slice(0, 80);
    if (body.adPricePerMonth !== undefined) {
      const value = Number(body.adPricePerMonth);
      if (!Number.isFinite(value) || value < 0) return fail("Ad price per month must be zero or more", 400);
      update.adPricePerMonth = value;
    }
    if (body.adSlides !== undefined) {
      const value = Number(body.adSlides);
      if (!Number.isInteger(value) || value < 1 || value > 4) return fail("Ad slides must be between 1 and 4", 400);
      update.adSlides = value;
    }
    if (body.maintenanceMode !== undefined) update.maintenanceMode = Boolean(body.maintenanceMode);
    if (body.allowRegistrations !== undefined) update.allowRegistrations = Boolean(body.allowRegistrations);
    if (body.autoApproveListings !== undefined) update.autoApproveListings = Boolean(body.autoApproveListings);

    if (!Object.keys(update).length) return fail("No valid settings provided", 400);

    await connectDB();
    const settings = await Settings.findOneAndUpdate(
      { key: KEY },
      { $set: update, $setOnInsert: { key: KEY } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    await AuditLog.create({
      actorId: admin._id,
      action: "settings.update",
      targetType: "Settings",
      targetId: String(settings._id),
      metadata: update,
    });

    return ok({ settings });
  } catch (error) {
    return handleError(error);
  }
}
