import connectDB from "../lib/mongodb";
import Mess from "../models/Mess";

export default async function sitemap() {
  const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();

  let messes = [];
  try {
    await connectDB();
    messes = await Mess.find({ status: "published", isDeleted: false })
      .select("_id updatedAt")
      .lean();
  } catch {}

  const staticRoutes = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/advertise`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/list-your-mess`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const messRoutes = messes.map((mess) => ({
    url: `${base}/messlisting/${mess._id}`,
    lastModified: mess.updatedAt || now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...messRoutes];
}
