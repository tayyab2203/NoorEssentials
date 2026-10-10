"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminLoginForm } from "@/components/shared/AdminLoginForm";
import { LOGO_PATH, SITE_NAME, USER_ROLE } from "@/lib/constants";
import { useAppSettings } from "@/lib/api/settings";
import Link from "next/link";

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: settings } = useAppSettings();
  const logoUrl = settings?.logoUrl || LOGO_PATH;
  const brandName = settings?.appName || SITE_NAME;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If already logged in as admin, redirect to admin dashboard
    if (status === "authenticated" && session?.user?.role === USER_ROLE.ADMIN) {
      router.replace("/admin");
    }
  }, [session, status, router]);

  // Show loading while checking session
  if (!mounted || status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-[#333333]/70">Loading…</div>
      </div>
    );
  }

  // If authenticated but not admin, show message
  if (status === "authenticated" && session?.user?.role !== USER_ROLE.ADMIN) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <h1 className="text-xl font-semibold text-[#333333]">Access Denied</h1>
        <p className="text-sm text-[#333333]/70">
          You don&apos;t have admin privileges. Please sign in with an admin account.
        </p>
        <Link
          href="/login"
          className="text-sm font-medium text-[#C4A747] hover:underline"
        >
          Go to customer login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Image
            src={logoUrl}
            alt={brandName}
            width={160}
            height={56}
            className="mx-auto mb-4 h-12 w-auto object-contain"
            priority
            unoptimized={logoUrl.endsWith(".svg")}
          />
          <h1 className="text-2xl font-semibold text-[#333333]">Admin Sign In</h1>
          <p className="mt-2 text-sm text-[#333333]/70">
            Sign in with your admin email and password.
          </p>
        </div>
        <AdminLoginForm />
        <p className="text-center text-sm text-[#333333]/70">
          <Link href="/login" className="font-medium text-[#C4A747] hover:underline">
            Customer sign in (Google)
          </Link>
        </p>
      </div>
    </div>
  );
}
