import { connectDB } from "@/lib/db/mongodb";
import { Setting } from "@/lib/db/models";
import { DEFAULT_APP_SETTINGS } from "@/lib/constants";
import type { AppSettings } from "@/types";

function asSettings(raw: Record<string, unknown> | null | undefined): AppSettings {
  return {
    appName: (typeof raw?.appName === "string" && raw.appName.trim()) || DEFAULT_APP_SETTINGS.appName,
    appDescription:
      (typeof raw?.appDescription === "string" && raw.appDescription.trim()) ||
      DEFAULT_APP_SETTINGS.appDescription,
    logoUrl: (typeof raw?.logoUrl === "string" && raw.logoUrl.trim()) || DEFAULT_APP_SETTINGS.logoUrl,
    contactEmail:
      (typeof raw?.contactEmail === "string" && raw.contactEmail.trim()) ||
      DEFAULT_APP_SETTINGS.contactEmail,
    contactPhone:
      (typeof raw?.contactPhone === "string" && raw.contactPhone.trim()) ||
      DEFAULT_APP_SETTINGS.contactPhone,
    address: (typeof raw?.address === "string" && raw.address.trim()) || DEFAULT_APP_SETTINGS.address,
    whatsappNumber:
      (typeof raw?.whatsappNumber === "string" && raw.whatsappNumber.trim()) ||
      DEFAULT_APP_SETTINGS.whatsappNumber,
    bannerAnnouncement:
      (typeof raw?.bannerAnnouncement === "string" && raw.bannerAnnouncement) ||
      DEFAULT_APP_SETTINGS.bannerAnnouncement,
    updatedAt: raw?.updatedAt ? new Date(raw.updatedAt as string | number | Date).toISOString() : undefined,
  };
}

/** Server-side store branding. Falls back to defaults if the database is unavailable. */
export async function getAppSettings(): Promise<AppSettings> {
  try {
    await connectDB();
    const setting = await Setting.findOne().lean();
    return asSettings(setting as Record<string, unknown> | null);
  } catch (e) {
    console.warn("[settings] Falling back to defaults:", e);
    return asSettings(null);
  }
}
