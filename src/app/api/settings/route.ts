import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Setting } from "@/lib/db/models";
import { DEFAULT_APP_SETTINGS } from "@/lib/constants";
import { success } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    let setting = await Setting.findOne().lean();
    if (!setting) {
      const created = await Setting.create(DEFAULT_APP_SETTINGS);
      setting = created.toJSON();
    }
    return success(setting);
  } catch (e) {
    console.warn("[api/settings] DB unavailable or error, falling back to defaults:", e);
    return success(DEFAULT_APP_SETTINGS);
  }
}
