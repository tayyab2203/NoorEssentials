"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  LayoutGrid,
  Sparkles,
  Percent,
  Info,
  Mail,
  ChevronRight,
  Heart,
  User,
  HelpCircle,
  Globe,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { ROUTES, DEFAULT_CATEGORIES, LOGO_PATH, SITE_NAME } from "@/lib/constants";
import { useAppSettings } from "@/lib/api/settings";
import { useWishlistStore } from "@/store/wishlistStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useCollections } from "@/lib/api/products";

interface MobileMenuProps {
  onSearchOpen?: () => void;
}

export function MobileMenu({ onSearchOpen }: MobileMenuProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const [open, setOpen] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1279px)");
  const { data: appSettings } = useAppSettings();
  const currentLogo = appSettings?.logoUrl || LOGO_PATH;
  const currentAppName = appSettings?.appName || SITE_NAME;
  const { data: collections = [] } = useCollections();
  const displayCollections = collections.length > 0 ? collections : DEFAULT_CATEGORIES;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset submenu when menu closes
  useEffect(() => {
    if (!open) setShowCollections(false);
  }, [open]);

  // Body scroll lock when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const showWishlistCount = mounted ? wishlistCount : 0;

  const navLinks = [
    { href: ROUTES.home, label: "Home", icon: Home },
    { href: ROUTES.collections, label: "Collections", icon: LayoutGrid, hasSubmenu: true },
    { href: ROUTES.newArrivals, label: "New Arrivals", icon: Sparkles },
    { href: ROUTES.sale, label: "Sale", icon: Percent },
    { href: ROUTES.about, label: "Who We Are", icon: Info },
    { href: ROUTES.contact, label: "Contact", icon: Mail },
  ];

  const [portalMounted, setPortalMounted] = useState(false);
  useEffect(() => {
    setPortalMounted(true);
  }, []);

  if (!isMobile) return null;

  const menuContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - Full screen overlay with blur */}
          <motion.div
            key="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Container - Fixed height, only middle section scrolls */}
          <motion.div
            key="mobile-menu-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 z-[9999] flex h-full max-h-[100dvh] w-[85vw] max-w-[360px] flex-col overflow-hidden bg-card shadow-[-4px_0_20px_rgba(0,0,0,0.15)] pt-[env(safe-area-inset-top)]"
            onClick={(e) => e.stopPropagation()}
          >
              {/* Header Section - Shrink-0 so it stays fixed at top */}
              <div className="flex shrink-0 items-center justify-between border-b border-border bg-noor-cream px-4 py-4 sm:px-6 sm:py-5">
                {/* User profile (if logged in) */}
                {mounted && status === "authenticated" && session?.user ? (
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-noor-gold bg-noor-cream">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name ?? "User"}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-lg font-bold text-noor-black">
                          {session.user.name?.charAt(0) ?? "?"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-noor-black">
                        {session.user.name ?? "User"}
                      </p>
                      <p className="truncate text-xs text-noor-muted">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-w-0 items-center gap-2">
                    <Image
                      src={currentLogo}
                      alt=""
                      width={84}
                      height={32}
                      className="h-7 w-auto object-contain"
                      sizes="84px"
                      unoptimized={currentLogo.endsWith(".svg")}
                    />
                    <span className="truncate text-sm font-semibold text-noor-black">
                      {currentAppName}
                    </span>
                  </div>
                )}

                {/* Close Button - 44x44 tap area */}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-noor-black transition-all duration-200 hover:bg-card hover:text-noor-gold-dark"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links Section - Scrollable middle (flex-1 min-h-0 overflow-y-auto) */}
              <nav className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-card py-2 sm:py-4" style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                <AnimatePresence mode="wait">
                  {!showCollections ? (
                    <motion.div
                      key="main"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-0"
                    >
                      {navLinks.map((link, i) => {
                        const isActive = link.hasSubmenu 
                          ? pathname.startsWith(link.href)
                          : pathname === link.href;

                        if (link.hasSubmenu) {
                          return (
                            <motion.button
                              key={link.href}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03 }}
                              type="button"
                              onClick={() => setShowCollections(true)}
                              className={cn(
                                "flex h-[52px] w-full min-h-[44px] items-center justify-between gap-3 border-l-3 px-4 sm:px-6 transition-all duration-200",
                                isActive
                                  ? "border-noor-gold bg-noor-sand text-noor-gold-dark"
                                  : "border-transparent hover:border-noor-gold hover:bg-noor-sand hover:text-noor-gold-dark"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <link.icon
                                  className={cn(
                                    "h-5 w-5",
                                    isActive ? "text-noor-gold-dark" : "text-noor-muted"
                                  )}
                                />
                                <span className="text-base font-medium">{link.label}</span>
                              </div>
                              <ChevronRight className="h-[18px] w-[18px] text-noor-muted" />
                            </motion.button>
                          );
                        }

                        return (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <Link
                              href={link.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex h-[52px] w-full min-h-[44px] items-center gap-3 border-l-3 px-4 sm:px-6 transition-all duration-200",
                                isActive
                                  ? "border-noor-gold bg-noor-sand text-noor-gold-dark"
                                  : "border-transparent hover:border-noor-gold hover:bg-noor-sand hover:text-noor-gold-dark"
                              )}
                            >
                              <link.icon
                                className={cn(
                                  "h-5 w-5",
                                  isActive ? "text-noor-gold-dark" : "text-noor-muted"
                                )}
                              />
                              <span className="text-base font-medium">{link.label}</span>
                            </Link>
                            {/* Separator */}
                            {(i === 1 || i === 3) && (
                              <div className="border-b border-border" />
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="collections"
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "tween", duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute inset-0 flex min-h-0 flex-col bg-card"
                    >
                      <button
                        type="button"
                        onClick={() => setShowCollections(false)}
                        className="flex h-14 min-h-[44px] items-center gap-2 border-b border-border px-4 sm:px-6 text-base font-medium text-noor-black"
                      >
                        <ChevronRight className="h-5 w-5 shrink-0 rotate-180" />
                        Collections
                      </button>
                      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2" style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                        {displayCollections.map((c, i) => (
                          <motion.div
                            key={("id" in c && c.id) || c.slug}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <Link
                              href={`${ROUTES.collections}/${c.slug}`}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex h-[52px] w-full min-h-[44px] items-center gap-3 border-l-3 px-4 sm:px-6 transition-all duration-200",
                                pathname === `${ROUTES.collections}/${c.slug}`
                                  ? "border-noor-gold bg-noor-sand text-noor-gold-dark"
                                  : "border-transparent hover:border-noor-gold hover:bg-noor-sand hover:text-noor-gold-dark"
                              )}
                            >
                              <span className="flex-1 text-base font-medium">{c.name}</span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </nav>

              {/* Secondary Section - Shrink-0 so it stays fixed at bottom */}
              <div className="shrink-0 border-t border-border bg-noor-sand p-4 pb-[env(safe-area-inset-bottom)]">
                {mounted && status === "authenticated" && (
                  <Link
                    href={ROUTES.account}
                    onClick={() => setOpen(false)}
                    className="flex h-12 items-center gap-2 px-2 text-sm font-medium text-noor-black transition-colors hover:text-noor-gold-dark"
                  >
                    <User className="h-[18px] w-[18px]" />
                    My Account
                  </Link>
                )}
                <Link
                  href={ROUTES.wishlist}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center gap-2 px-2 text-sm font-medium text-noor-black transition-colors hover:text-noor-gold-dark"
                >
                  <Heart className="h-[18px] w-[18px]" />
                  Wishlist
                  {showWishlistCount > 0 && (
                    <span className="ml-auto rounded-full bg-noor-gold-dark px-2 py-0.5 text-xs font-medium text-noor-cream">
                      {showWishlistCount > 99 ? "99+" : showWishlistCount}
                    </span>
                  )}
                </Link>
                <a
                  href="#"
                  className="flex h-12 items-center gap-2 px-2 text-sm font-medium text-noor-black transition-colors hover:text-noor-gold-dark"
                  onClick={(e) => e.preventDefault()}
                >
                  <HelpCircle className="h-[18px] w-[18px]" />
                  Help & Support
                </a>
                <div className="flex h-12 items-center gap-2 px-2 text-sm font-medium text-noor-black">
                  <Globe className="h-[18px] w-[18px]" />
                  Language: English
                </div>
              </div>

              {/* Footer Section - Shrink-0, responsive padding */}
              <div className="shrink-0 border-t border-border bg-card p-4 sm:p-5">
                {/* Social media icons */}
                <div className="mb-4 flex items-center justify-center gap-4">
                  <a
                    href="#"
                    className="text-noor-muted transition-all hover:scale-110 hover:text-noor-gold-dark"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a
                    href="#"
                    className="text-noor-muted transition-all hover:scale-110 hover:text-noor-gold-dark"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href="#"
                    className="text-noor-muted transition-all hover:scale-110 hover:text-noor-gold-dark"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                </div>

                {/* Sign In / Sign Out Button */}
                {mounted && status === "authenticated" ? (
                  <button
                    type="button"
                    onClick={() => {
                      signOut({ callbackUrl: ROUTES.home });
                      setOpen(false);
                    }}
                    className="h-12 w-full rounded-lg border border-noor-error bg-card font-semibold text-noor-error transition-all duration-200 hover:bg-noor-error/10"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      signIn("google");
                    }}
                    className="h-12 w-full rounded-lg bg-noor-gold text-noor-black font-semibold transition-all duration-200"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Trigger: Hamburger - 48x48 tap area */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
          "text-noor-black transition-colors hover:bg-noor-gold/10 hover:text-noor-gold-dark",
          "lg:hidden"
        )}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu className="h-6 w-6" strokeWidth={2} />
      </button>

      {/* Portal: render menu into document.body so it overlays full page (not clipped by header) */}
      {portalMounted && typeof document !== "undefined" ? createPortal(menuContent, document.body) : null}
    </>
  );
}
