"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Upload, Check, Store, Mail, Phone, MessageSquare, Image as ImageIcon } from "lucide-react";
import { ADMIN_ROUTES, COLORS, PAYMENT_METHOD, DEFAULT_APP_SETTINGS } from "@/lib/constants";
import { useUpdateAdminProfile } from "@/lib/api/admin";
import { useAdminSettings, useUpdateAdminSettings } from "@/lib/api/settings";
import { uploadImage } from "@/lib/api/upload";
import { getApiErrorMessage } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const updateProfile = useUpdateAdminProfile();

  // Profile state
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // App & Brand Settings state
  const { data: appSettings, isLoading: settingsLoading } = useAdminSettings();
  const updateAppSettingsMutation = useUpdateAdminSettings();

  const [appName, setAppName] = useState<string>(DEFAULT_APP_SETTINGS.appName);
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_APP_SETTINGS.logoUrl);
  const [appDescription, setAppDescription] = useState<string>(DEFAULT_APP_SETTINGS.appDescription);
  const [contactEmail, setContactEmail] = useState<string>(DEFAULT_APP_SETTINGS.contactEmail);
  const [contactPhone, setContactPhone] = useState<string>(DEFAULT_APP_SETTINGS.contactPhone);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(DEFAULT_APP_SETTINGS.whatsappNumber);
  const [address, setAddress] = useState<string>(DEFAULT_APP_SETTINGS.address);
  const [bannerAnnouncement, setBannerAnnouncement] = useState<string>(DEFAULT_APP_SETTINGS.bannerAnnouncement);

  const [logoUploading, setLogoUploading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user?.email) setEmail(session.user.email);
  }, [session?.user?.email]);

  useEffect(() => {
    if (appSettings) {
      if (appSettings.appName) setAppName(appSettings.appName);
      if (appSettings.logoUrl) setLogoUrl(appSettings.logoUrl);
      if (appSettings.appDescription) setAppDescription(appSettings.appDescription);
      if (appSettings.contactEmail) setContactEmail(appSettings.contactEmail);
      if (appSettings.contactPhone) setContactPhone(appSettings.contactPhone);
      if (appSettings.whatsappNumber) setWhatsappNumber(appSettings.whatsappNumber);
      if (appSettings.address) setAddress(appSettings.address);
      if (appSettings.bannerAnnouncement) setBannerAnnouncement(appSettings.bannerAnnouncement);
    }
  }, [appSettings]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setSettingsError(null);
    try {
      const res = await uploadImage(file, "uploads");
      setLogoUrl(res.url);
      setSettingsSuccess("Logo uploaded! Remember to click 'Save App Settings' to apply.");
    } catch (err) {
      setSettingsError(getApiErrorMessage(err));
    } finally {
      setLogoUploading(false);
      e.target.value = "";
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError(null);
    setSettingsSuccess(null);

    if (!appName.trim()) {
      setSettingsError("App Name is required");
      return;
    }

    try {
      const res = await updateAppSettingsMutation.mutateAsync({
        appName: appName.trim(),
        logoUrl: logoUrl.trim() || DEFAULT_APP_SETTINGS.logoUrl,
        appDescription: appDescription.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        whatsappNumber: whatsappNumber.trim(),
        address: address.trim(),
        bannerAnnouncement: bannerAnnouncement.trim(),
      });
      setSettingsSuccess(res.message || "App settings updated successfully!");
    } catch (err) {
      setSettingsError(getApiErrorMessage(err));
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);
    setPasswordError(null);
    setPasswordSuccess(null);
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    try {
      const res = await updateProfile.mutateAsync({
        email: email.trim(),
        currentPassword: currentPassword.trim() || undefined,
      });
      setEmailSuccess(res.message);
      setEmail(res.email);
      setCurrentPassword("");
      await updateSession?.({ user: { ...session?.user, email: res.email } });
    } catch (e) {
      setEmailError(getApiErrorMessage(e));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);
    setPasswordError(null);
    setPasswordSuccess(null);
    if (!currentPassword.trim()) {
      setPasswordError("Current password is required");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    try {
      const res = await updateProfile.mutateAsync({
        currentPassword,
        newPassword,
      });
      setPasswordSuccess(res.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setPasswordError(getApiErrorMessage(e));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: COLORS.primaryDark }}>Settings</h1>
        <p className="mt-1 text-sm text-[#333333]/70">
          Manage your business branding, app name, logo, contact info, and admin credentials.
        </p>
      </div>

      {/* 1. APP & BRAND SETTINGS (DYNAMIC APP NAME & LOGO) */}
      <div className="rounded-xl border border-[#eee] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-start gap-3 border-b border-[#eee] pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F3EE]" style={{ color: COLORS.goldAccent }}>
            <Store className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold" style={{ color: COLORS.primaryDark }}>App & Brand Settings</h2>
            <p className="text-xs text-[#333333]/70">
              Customize the store name and logo dynamically across both customer storefront and admin dashboard.
            </p>
          </div>
        </div>

        {settingsSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            <Check className="h-4 w-4 shrink-0" />
            <span>{settingsSuccess}</span>
          </div>
        )}

        {settingsError && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {settingsError}
          </div>
        )}

        <form onSubmit={handleSettingsSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* App Name */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: COLORS.primaryDark }}>
                App / Store Name *
              </label>
              <Input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g. Noor Essentials"
                className="border-[#ddd]"
                required
              />
              <p className="mt-1 text-xs text-[#333333]/60">
                Updates brand name across navbar, footer, metadata, invoices, and titles.
              </p>
            </div>

            {/* Announcement Banner */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: COLORS.primaryDark }}>
                Announcement / Header Bar
              </label>
              <Input
                type="text"
                value={bannerAnnouncement}
                onChange={(e) => setBannerAnnouncement(e.target.value)}
                placeholder="e.g. Free shipping on orders over PKR 2,999"
                className="border-[#ddd]"
              />
              <p className="mt-1 text-xs text-[#333333]/60">
                Top announcement message shown to store visitors.
              </p>
            </div>
          </div>

          {/* Logo Upload & Preview */}
          <div className="rounded-lg border border-[#eee] bg-[#fafafa] p-4">
            <label className="mb-2 block text-sm font-semibold" style={{ color: COLORS.primaryDark }}>
              Store Logo
            </label>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Logo Preview */}
              <div className="flex h-20 w-36 shrink-0 items-center justify-center rounded-lg border border-[#ddd] bg-white p-2">
                {logoUrl ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={logoUrl}
                      alt={appName || "Store Logo"}
                      fill
                      className="object-contain"
                      sizes="144px"
                      unoptimized={logoUrl.endsWith(".svg")}
                    />
                  </div>
                ) : (
                  <ImageIcon className="h-8 w-8 text-[#aaa]" />
                )}
              </div>

              {/* Upload & URL Controls */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={logoUploading}
                    className="border-[#ddd]"
                    onClick={() => logoFileInputRef.current?.click()}
                  >
                    <Upload className="mr-1.5 h-4 w-4" />
                    {logoUploading ? "Uploading..." : "Upload New Logo"}
                  </Button>
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="sr-only"
                    onChange={handleLogoUpload}
                    disabled={logoUploading}
                    aria-label="Choose a store logo"
                  />
                  <span className="text-xs text-[#333333]/60">Supports PNG, JPG, WebP, or SVG</span>
                </div>
                <Input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Or enter direct image URL (e.g. /noor-logo.png)"
                  className="border-[#ddd] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Tagline / Description */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold" style={{ color: COLORS.primaryDark }}>
              Brand Tagline & Description
            </label>
            <textarea
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              rows={2}
              placeholder="Store description for SEO and brand headers..."
              className="w-full rounded-md border border-[#ddd] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A747]"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold" style={{ color: COLORS.primaryDark }}>
                <Mail className="h-4 w-4 text-[#C4A747]" /> Contact Email
              </label>
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@nooressentials.com"
                className="border-[#ddd]"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold" style={{ color: COLORS.primaryDark }}>
                <Phone className="h-4 w-4 text-[#C4A747]" /> Contact Phone
              </label>
              <Input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+92 319 0409623"
                className="border-[#ddd]"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold" style={{ color: COLORS.primaryDark }}>
                <MessageSquare className="h-4 w-4 text-[#25D366]" /> WhatsApp Number
              </label>
              <Input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="923190409623"
                className="border-[#ddd]"
              />
              <p className="mt-1 text-xs text-[#333333]/60">Country code without + (e.g. 92319...)</p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" style={{ color: COLORS.primaryDark }}>
              Store Address / Location
            </label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Lahore, Pakistan"
              className="border-[#ddd]"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={updateAppSettingsMutation.isLoading || logoUploading}
              style={{ backgroundColor: COLORS.goldAccent, color: COLORS.primaryDark }}
              className="font-semibold px-6"
            >
              {updateAppSettingsMutation.isLoading ? "Saving Settings..." : "Save App Settings"}
            </Button>
          </div>
        </form>
      </div>

      {/* 2. ADMIN PROFILE */}
      <div className="rounded-xl border border-[#eee] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold" style={{ color: COLORS.primaryDark }}>Admin profile</h2>
        <div className="mt-4 flex items-center gap-4">
          {session?.user?.image ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
              <Image src={session.user.image} alt="" fill className="object-cover" sizes="64px" />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F3EE] text-xl font-semibold" style={{ color: COLORS.goldAccent }}>
              {session?.user?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <div>
            <p className="font-semibold" style={{ color: COLORS.primaryDark }}>{session?.user?.name ?? "—"}</p>
            <p className="text-sm text-[#333333]/70">{session?.user?.email ?? "—"}</p>
            <p className="text-xs text-[#333333]/60">Role: {(session?.user as { role?: string })?.role ?? "—"}</p>
          </div>
        </div>

        {/* Change Email */}
        <div className="mt-6 border-t border-[#eee] pt-6">
          <h3 className="mb-3 text-sm font-semibold" style={{ color: COLORS.primaryDark }}>Change email</h3>
          <form onSubmit={handleEmailSubmit} className="flex flex-wrap gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="New email"
              className="max-w-xs border-[#ddd]"
              required
            />
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="max-w-xs border-[#ddd]"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              disabled={updateProfile.isLoading}
              style={{ backgroundColor: COLORS.goldAccent, color: COLORS.primaryDark }}
            >
              {updateProfile.isLoading ? "Updating…" : "Update email"}
            </Button>
          </form>
          {emailError && (
            <p className="mt-2 text-sm text-red-600" role="alert">{emailError}</p>
          )}
          {emailSuccess && (
            <p className="mt-2 text-sm text-green-700" role="status">{emailSuccess}</p>
          )}
        </div>

        {/* Change Password */}
        <div className="mt-6 border-t border-[#eee] pt-6">
          <h3 className="mb-3 text-sm font-semibold" style={{ color: COLORS.primaryDark }}>Change password</h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-md">
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="border-[#ddd]"
              autoComplete="current-password"
            />
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 6 characters)"
              className="border-[#ddd]"
              autoComplete="new-password"
              minLength={6}
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="border-[#ddd]"
              autoComplete="new-password"
            />
            <Button
              type="submit"
              disabled={updateProfile.isLoading}
              style={{ backgroundColor: COLORS.goldAccent, color: COLORS.primaryDark }}
            >
              {updateProfile.isLoading ? "Updating…" : "Update password"}
            </Button>
          </form>
          {passwordError && (
            <p className="mt-2 text-sm text-red-600" role="alert">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="mt-2 text-sm text-green-700" role="status">{passwordSuccess}</p>
          )}
        </div>
      </div>

      {/* 3. PAYMENT METHODS */}
      <div className="rounded-xl border border-[#eee] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold" style={{ color: COLORS.primaryDark }}>Payment methods (mock)</h2>
        <p className="mt-2 text-sm text-[#333333]/70">Payments are simulated. No real gateway is connected.</p>
        <ul className="mt-4 space-y-2">
          <li className="flex items-center gap-2 rounded-lg border border-[#eee] px-4 py-3">
            <span className="font-medium" style={{ color: COLORS.primaryDark }}>Easypaisa</span>
            <span className="text-xs text-[#333333]/60">({PAYMENT_METHOD.EASYPAISA})</span>
          </li>
          <li className="flex items-center gap-2 rounded-lg border border-[#eee] px-4 py-3">
            <span className="font-medium" style={{ color: COLORS.primaryDark }}>JazzCash</span>
            <span className="text-xs text-[#333333]/60">({PAYMENT_METHOD.JAZZCASH})</span>
          </li>
          <li className="flex items-center gap-2 rounded-lg border border-[#eee] px-4 py-3">
            <span className="font-medium" style={{ color: COLORS.primaryDark }}>Bank Transfer</span>
            <span className="text-xs text-[#333333]/60">({PAYMENT_METHOD.BANK_TRANSFER})</span>
          </li>
        </ul>
        <p className="mt-4 rounded-lg bg-[#F5F3EE] px-4 py-2 text-sm text-[#333333]/80">Mock mode: reference numbers are generated; status can be updated from order detail.</p>
      </div>
    </div>
  );
}
