import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Setting } from "@/lib/db/models";
import { DEFAULT_APP_SETTINGS } from "@/lib/constants";
import { successAdmin, error } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(request: Request) {
  const forbidden = await requireAdmin(request);
  if (forbidden) return forbidden;

  try {
    await connectDB();
    let setting = await Setting.findOne().lean();
    if (!setting) {
      const created = await Setting.create(DEFAULT_APP_SETTINGS);
      setting = created.toJSON();
    }
    return successAdmin(setting);
  } catch (e) {
    console.error("[api/admin/settings] GET error:", e);
    return error("Failed to load settings", 500);
  }
}

export async function PATCH(request: Request) {
  const forbidden = await requireAdmin(request);
  if (forbidden) return forbidden;

  try {
    const body = await request.json();
    await connectDB();

    const allowedFields = [
      "appName",
      "appDescription",
      "logoUrl",
      "contactEmail",
      "contactPhone",
      "address",
      "whatsappNumber",
      "bannerAnnouncement",
    ] as const;

    const update: Record<string, string> = {};
    for (const field of allowedFields) {
      if (typeof body[field] === "string") {
        update[field] = body[field].trim();
      }
    }

    if (update.appName === "") {
      return error("App name cannot be empty", 400);
    }

    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({ ...DEFAULT_APP_SETTINGS, ...update });
    } else {
      Object.assign(setting, update);
      await setting.save();
    }

    return successAdmin({
      setting: setting.toJSON(),
      message: "App settings updated successfully",
    });
  } catch (e) {
    console.error("[api/admin/settings] PATCH error:", e);
    return error("Failed to update app settings", 500);
  }
}
