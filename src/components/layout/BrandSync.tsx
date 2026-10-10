"use client";

import { useEffect, useRef } from "react";
import { SITE_NAME } from "@/lib/constants";
import { useAppSettings } from "@/lib/api/settings";

function upsertIcon(rel: string, href: string) {
  const links = document.head.querySelectorAll<HTMLLinkElement>(`link[rel='${rel}']`);
  if (links.length === 0) {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
    return;
  }
  links.forEach((link) => {
    link.href = href;
  });
}

/** Keeps the browser tab icon and title in sync after settings are saved. */
export function BrandSync() {
  const { data, isFetchedAfterMount } = useAppSettings();
  const appliedName = useRef(SITE_NAME);

  useEffect(() => {
    if (!isFetchedAfterMount) return;
    const logoUrl = data?.logoUrl?.trim();
    if (!logoUrl) return;
    upsertIcon("icon", logoUrl);
    upsertIcon("shortcut icon", logoUrl);
    upsertIcon("apple-touch-icon", logoUrl);
  }, [data?.logoUrl, isFetchedAfterMount]);

  useEffect(() => {
    if (!isFetchedAfterMount) return;
    const nextName = data?.appName?.trim();
    if (!nextName) return;
    const previous = appliedName.current;
    if (previous !== nextName) {
      if (document.title === previous) {
        document.title = nextName;
      } else if (document.title.endsWith(` | ${previous}`)) {
        document.title = `${document.title.slice(0, -(previous.length + 3))} | ${nextName}`;
      }
      appliedName.current = nextName;
    }
  }, [data?.appName, isFetchedAfterMount]);

  return null;
}
