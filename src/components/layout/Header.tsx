"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Search, Heart, ShoppingBag, User, ChevronDown, ArrowUpRight } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { MobileMenu } from "./MobileMenu";
import { Container } from "./Container";
import { ROUTES, LOGO_PATH, SITE_NAME, DEFAULT_CATEGORIES } from "@/lib/constants";
import { useCollections } from "@/lib/api/products";
import { useAppSettings } from "@/lib/api/settings";
import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/lib/api/cart";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSearchOpen } from "@/components/shared/Providers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: ROUTES.about, label: "Who We Are" },
  { href: ROUTES.contact, label: "Contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { data: apiCart } = useCart({ enabled: isAuthenticated });
  const zustandCartCount = useCartStore((s) => s.getCartItemCount());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const { searchOpen, setSearchOpen } = useSearchOpen();
  const [mounted, setMounted] = useState(false);
  const { data: collections = [] } = useCollections();
  const { data: appSettings } = useAppSettings();

  const currentLogo = appSettings?.logoUrl || LOGO_PATH;
  const currentAppName = appSettings?.appName || SITE_NAME;
  const displayCollections = collections.length > 0 ? collections : DEFAULT_CATEGORIES;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch: pathname-based "active" styles can differ
  // between server HTML and the first client render.
  const activePath = mounted ? (pathname ?? "") : "";

  const cartCount = isAuthenticated && apiCart?.items
    ? apiCart.items.reduce((sum, i) => sum + i.quantity, 0)
    : zustandCartCount;
  const showCartCount = mounted ? cartCount : 0;
  const showWishlistCount = mounted ? wishlistCount : 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-noor-border/80 bg-noor-cream/95 shadow-[0_8px_30px_-24px_hsl(var(--noor-black)/0.45)]",
        "backdrop-blur-lg supports-[backdrop-filter]:bg-noor-cream/80",
        "h-[68px] md:h-[76px] lg:h-[84px]"
      )}
    >
      <Container
        noPadding
        className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-3 px-4 md:px-8 lg:gap-8 lg:px-12"
      >
        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          <MobileMenu onSearchOpen={() => setSearchOpen(true)} />
        </div>
        <Link
          href={ROUTES.home}
          className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none lg:gap-2.5"
          aria-label={`${currentAppName} home`}
        >
          <span className="shrink-0">
            <Image
              src={currentLogo}
              alt={currentAppName}
              width={112}
              height={44}
              className="h-8 w-auto object-contain sm:h-9 lg:h-11"
              priority
              sizes="112px"
              unoptimized={currentLogo.endsWith(".svg")}
              aria-hidden
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-heading text-sm font-semibold leading-tight text-noor-black min-[380px]:text-base sm:text-lg">
              {currentAppName}
            </span>
            <span className="hidden text-[9px] font-medium uppercase tracking-[0.24em] text-noor-muted md:block">
              Everyday essentials
            </span>
          </span>
        </Link>

        <nav
          className="hidden h-full items-center gap-5 xl:flex xl:gap-8"
          aria-label="Main navigation"
        >
          <Link
            href={ROUTES.home}
            className={cn(
              "relative py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-noor-gold after:transition-transform hover:text-noor-gold-dark hover:after:scale-x-100",
              activePath === ROUTES.home ? "text-noor-gold-dark" : "text-noor-black"
            )}
          >
            Home
          </Link>
          <div className="group relative flex h-full items-center">
            <Link
              href={ROUTES.collections}
              className={cn(
                "inline-flex items-center gap-1.5 py-2 text-sm font-medium transition-colors hover:text-noor-gold-dark",
                activePath === ROUTES.collections || (activePath.startsWith(`${ROUTES.collections}/`) && activePath !== ROUTES.newArrivals)
                  ? "text-noor-gold-dark"
                  : "text-noor-black"
              )}
              aria-haspopup="true"
            >
              Collections
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
            </Link>
            <div
              className="invisible absolute left-1/2 top-full z-50 w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 pt-4 opacity-0 transition-[visibility,opacity] duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
            >
              <div className="overflow-hidden rounded-xl border border-noor-border/80 bg-card shadow-[0_24px_60px_-28px_hsl(var(--noor-black)/0.38)] ring-1 ring-noor-black/5">
                <div className="flex items-end justify-between border-b border-noor-border/70 bg-noor-cream/70 px-6 py-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-noor-gold-dark">
                      Discover Noor
                    </p>
                    <h2 className="mt-1 font-heading text-xl font-semibold text-noor-black">
                      Browse collections
                    </h2>
                  </div>
                  <span className="rounded-full bg-noor-sand px-3 py-1 text-xs font-medium text-noor-muted">
                    {displayCollections.length} collections
                  </span>
                </div>

                <div className="max-h-[min(58vh,28rem)] overflow-y-auto p-3">
                  <div className="grid grid-cols-2 gap-1">
                    {displayCollections.map((c) => {
                      const href = `${ROUTES.collections}/${c.slug}`;
                      const isCollectionActive = activePath === href;

                      return (
                        <Link
                          key={("id" in c && c.id) || c.slug}
                          href={href}
                          className={cn(
                            "group/collection flex min-h-12 items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium text-noor-black transition-colors hover:bg-noor-sand focus-visible:bg-noor-sand focus-visible:outline-none",
                            isCollectionActive && "bg-noor-sand text-noor-gold-dark"
                          )}
                        >
                          <span className="truncate">{c.name}</span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-noor-muted opacity-0 transition-all group-hover/collection:-translate-y-0.5 group-hover/collection:translate-x-0.5 group-hover/collection:text-noor-gold-dark group-hover/collection:opacity-100 group-focus-visible/collection:opacity-100" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-noor-border/70 bg-noor-cream/50 p-3">
                  <Link
                    href={ROUTES.collections}
                    className="flex min-h-11 items-center justify-between rounded-lg px-4 text-sm font-semibold text-noor-gold-dark transition-colors hover:bg-noor-sand focus-visible:bg-noor-sand focus-visible:outline-none"
                  >
                    View all collections
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Link
            href={ROUTES.newArrivals}
            className={cn(
              "py-2 text-sm font-medium transition-colors hover:text-noor-gold-dark",
              activePath === ROUTES.newArrivals ? "text-noor-gold-dark" : "text-noor-black"
            )}
          >
            New Arrivals
          </Link>
          <Link
            href={ROUTES.sale}
            className={cn(
              "py-2 text-sm font-medium transition-colors hover:text-noor-gold-dark",
              activePath === ROUTES.sale ? "text-noor-gold-dark" : "text-noor-black"
            )}
          >
            Sale
          </Link>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "py-2 text-sm font-medium transition-colors hover:text-noor-gold-dark",
                activePath === href ? "text-noor-gold-dark" : "text-noor-black"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 min-h-touch min-w-touch text-noor-black transition-colors hover:bg-noor-sand hover:text-noor-gold-dark lg:h-11 lg:w-11"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5 lg:h-6 lg:w-6" />
          </Button>

          <Link href={ROUTES.wishlist} className="hidden sm:block">
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden h-10 w-10 min-h-touch min-w-touch text-noor-black transition-colors hover:bg-noor-sand hover:text-noor-gold-dark md:flex lg:h-11 lg:w-11"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
              {showWishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-noor-gold-dark px-1 text-[10px] font-medium text-noor-cream">
                  {showWishlistCount > 99 ? "99+" : showWishlistCount}
                </span>
              )}
            </Button>
          </Link>

          <Link href={ROUTES.cart} className="flex">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 min-h-touch min-w-touch text-noor-black transition-colors hover:bg-noor-sand hover:text-noor-gold-dark lg:h-11 lg:w-11"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6" />
              {showCartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-noor-gold-dark px-1 text-[10px] font-medium text-noor-cream">
                  {showCartCount > 99 ? "99+" : showCartCount}
                </span>
              )}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-10 w-10 min-h-touch min-w-touch text-noor-black transition-colors hover:bg-noor-sand hover:text-noor-gold-dark xl:flex xl:h-11 xl:w-11"
                aria-label="User menu"
              >
                <User className="h-5 w-5 lg:h-6 lg:w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {mounted && status === "authenticated" && session?.user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.account}>Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-noor-black focus:text-noor-gold-dark"
                  >
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <button
                    type="button"
                    className="w-full cursor-pointer text-left"
                    onClick={() => signIn("google")}
                  >
                    Google Sign In
                  </button>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </Container>

      <SearchBar open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
