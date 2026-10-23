import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site", unique: true, index: true },
    siteName: { type: String, default: "MessFinder", maxlength: 60 },
    supportEmail: { type: String, default: "support@messfinder.com", maxlength: 120 },
    supportPhone: { type: String, default: "9529942455", maxlength: 20 },
    contactName: { type: String, default: "Rohan Shinde", maxlength: 80 },
    adPricePerMonth: { type: Number, default: 500, min: 0 },
    adSlides: { type: Number, default: 4, min: 1, max: 4 },
    maintenanceMode: { type: Boolean, default: false },
    allowRegistrations: { type: Boolean, default: true },
    autoApproveListings: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
