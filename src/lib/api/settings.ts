import { useQuery, useMutation, useQueryClient } from "react-query";
import { DEFAULT_APP_SETTINGS } from "@/lib/constants";
import type { AppSettings } from "@/types";

export const APP_SETTINGS_QUERY_KEY = ["appSettings"] as const;
export const ADMIN_SETTINGS_QUERY_KEY = ["admin", "settings"] as const;

async function fetchAppSettings(): Promise<AppSettings> {
  try {
    const res = await fetch("/api/settings", { cache: "no-store" });
    if (!res.ok) return DEFAULT_APP_SETTINGS as AppSettings;
    const json = await res.json();
    const data = json?.data ?? json;
    return {
      appName: data?.appName || DEFAULT_APP_SETTINGS.appName,
      appDescription: data?.appDescription || DEFAULT_APP_SETTINGS.appDescription,
      logoUrl: data?.logoUrl || DEFAULT_APP_SETTINGS.logoUrl,
      contactEmail: data?.contactEmail || DEFAULT_APP_SETTINGS.contactEmail,
      contactPhone: data?.contactPhone || DEFAULT_APP_SETTINGS.contactPhone,
      address: data?.address || DEFAULT_APP_SETTINGS.address,
      whatsappNumber: data?.whatsappNumber || DEFAULT_APP_SETTINGS.whatsappNumber,
      bannerAnnouncement: data?.bannerAnnouncement || DEFAULT_APP_SETTINGS.bannerAnnouncement,
    };
  } catch {
    return DEFAULT_APP_SETTINGS as AppSettings;
  }
}

export function useAppSettings() {
  return useQuery({
    queryKey: APP_SETTINGS_QUERY_KEY,
    queryFn: fetchAppSettings,
    staleTime: 0,
    refetchOnMount: true,
    initialData: DEFAULT_APP_SETTINGS as AppSettings,
    initialDataUpdatedAt: 0,
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ADMIN_SETTINGS_QUERY_KEY,
    queryFn: async (): Promise<AppSettings> => {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load admin settings");
      const json = await res.json();
      return (json?.data ?? json) as AppSettings;
    },
    staleTime: 0,
    refetchOnMount: true,
    initialData: DEFAULT_APP_SETTINGS as AppSettings,
    initialDataUpdatedAt: 0,
  });
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<AppSettings>): Promise<{ setting: AppSettings; message: string }> => {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to update settings");
      }
      return data?.data ?? data;
    },
    onSuccess: (result) => {
      if (result?.setting) {
        queryClient.setQueryData(APP_SETTINGS_QUERY_KEY, result.setting);
        queryClient.setQueryData(ADMIN_SETTINGS_QUERY_KEY, result.setting);
      }
      queryClient.invalidateQueries(APP_SETTINGS_QUERY_KEY);
      queryClient.invalidateQueries(ADMIN_SETTINGS_QUERY_KEY);
    },
  });
}
