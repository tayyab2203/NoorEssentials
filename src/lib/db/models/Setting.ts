import mongoose, { Schema, model, models } from "mongoose";

export interface ISetting {
  _id: mongoose.Types.ObjectId;
  appName: string;
  appDescription: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  whatsappNumber: string;
  bannerAnnouncement?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    appName: { type: String, default: "Noor Essentials" },
    appDescription: {
      type: String,
      default:
        "Noor Essentials — Your premier destination for clothing, perfumes, ladies accessories, mobile accessories, and shoes.",
    },
    logoUrl: { type: String, default: "/noor-logo.png" },
    contactEmail: { type: String, default: "contact@nooressentials.com" },
    contactPhone: { type: String, default: "+92 319 0409623" },
    address: { type: String, default: "Lahore, Pakistan" },
    whatsappNumber: { type: String, default: "923190409623" },
    bannerAnnouncement: { type: String, default: "Free delivery on orders over PKR 2,999" },
  },
  { timestamps: true }
);

SettingSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    const out = ret as unknown as Record<string, unknown> & { _id?: { toString: () => string } };
    out.id = out._id?.toString?.();
    delete out._id;
    delete out.__v;
    return out;
  },
});

export const Setting = models.Setting ?? model<ISetting>("Setting", SettingSchema);
