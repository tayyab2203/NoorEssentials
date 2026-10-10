"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product/ProductCard";
import { useQuery } from "react-query";
import { Container } from "@/components/layout/Container";
import { ROUTES, DEFAULT_CATEGORIES, SITE_NAME } from "@/lib/constants";
import { useCollections } from "@/lib/api/products";
import { useAppSettings } from "@/lib/api/settings";
import type { Product } from "@/types";

const HERO_BG_IMAGE = "/hero-banner.jpg";
const GOLD = "#C4A747";
const CREAM = "#F5F3EE";
const DARK = "#333333";

type HomepageReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string; image: string | null };
  product: { name: string; slug: string };
};

const STATIC_HOME_REVIEWS: HomepageReview[] = [
  {
    id: "static-1",
    rating: 5,
    comment:
      "Quality is premium and stitching is very neat. Delivery was fast too.",
    createdAt: "2026-01-01T00:00:00.000Z",
    user: { name: "Ahmed R.", image: null },
    product: { name: "Cotton Collection", slug: "" },
  },
  {
    id: "static-2",
    rating: 5,
    comment:
      "Loved the fabric and finishing—looks even better in real life. Highly recommended.",
    createdAt: "2026-01-02T00:00:00.000Z",
    user: { name: "Ayesha K.", image: null },
    product: { name: "Lawn Collection", slug: "" },
  },
  {
    id: "static-3",
    rating: 4,
    comment:
      "Comfortable for daily wear and the color stayed perfect after wash.",
    createdAt: "2026-01-03T00:00:00.000Z",
    user: { name: "Hassan M.", image: null },
    product: { name: "Everyday Essentials", slug: "" },
  },
  {
    id: "static-4",
    rating: 5,
    comment:
      "Beautiful design and very soft fabric. The overall experience was smooth.",
    createdAt: "2026-01-04T00:00:00.000Z",
    user: { name: "Fatima S.", image: null },
    product: { name: "New Arrivals", slug: "" },
  },
];

const sectionFade = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: 0.5 },
};

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return [];
  }
  try {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function fetchHomepageReviews(): Promise<HomepageReview[]> {
  const res = await fetch("/api/reviews?limit=6", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json().catch(() => []);
  return Array.isArray(data) ? (data as HomepageReview[]) : [];
}

export default function HomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success">("idle");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: homepageReviews = [] } = useQuery({
    queryKey: ["homepageReviews"],
    queryFn: fetchHomepageReviews,
  });
  const testimonials = useMemo(() => {
    const dynamic = homepageReviews.filter(
      (r) => !STATIC_HOME_REVIEWS.some((s) => s.id === r.id)
    );
    return [...STATIC_HOME_REVIEWS, ...dynamic];
  }, [homepageReviews]);
  const { data: collections = [] } = useCollections();
  const { data: appSettings } = useAppSettings();
  const brandName = appSettings?.appName || SITE_NAME;
  const bestsellers = products.slice(0, 4);
  const featuredCollections = collections.length > 0 ? collections.slice(0, 6) : DEFAULT_CATEGORIES;

  useEffect(() => {
    if (!testimonials.length) return;
    const t = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterStatus("loading");
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterEmail("");
    }, 600);
  };

  return (
    <>
      {/* 1. HERO */}
      <section
        className="relative flex min-h-[520px] w-full items-center justify-center overflow-hidden sm:min-h-[600px] md:min-h-[660px] lg:min-h-[min(780px,calc(100svh-84px))]"
        aria-label={brandName}
      >
        {/* Background image (original) */}
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_BG_IMAGE}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-noor-black/90 via-noor-black/75 to-noor-black/55"
            aria-hidden
          />
        </div>

        <motion.div
          className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div className="flex flex-col items-start text-left">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-noor-gold-light sm:text-sm"
              >
                {brandName} <span className="px-2 text-noor-cream/50">/</span> Curated with care
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-6 max-w-3xl font-heading text-[2rem] font-medium leading-[1.08] tracking-tight text-noor-cream min-[380px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Everyday elegance.
                <span className="mt-1 block text-noor-gold-light">Essentials, elevated.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="mb-9 max-w-xl text-base leading-relaxed text-noor-cream/85 sm:text-lg"
              >
                Discover considered clothing, signature fragrances, thoughtful accessories, and everyday pieces chosen to last.
              </motion.p>

              <motion.div
                className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link
                  href={ROUTES.shop}
                  className="inline-flex h-12 items-center justify-center rounded-md bg-gold-gradient px-8 text-sm font-semibold text-noor-black shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-noor-black"
                  aria-label="Shop now - view all products"
                >
                  Shop the collection
                </Link>
                <Link
                  href={ROUTES.collections}
                  className="inline-flex h-12 items-center justify-center rounded-md border border-noor-cream/55 px-8 text-sm font-semibold text-noor-cream transition-colors hover:border-noor-gold-light hover:bg-noor-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-noor-black"
                  aria-label="Explore collections"
                >
                  Explore collections
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mx-auto hidden w-full max-w-xl lg:mx-0 lg:block"
            >
              <div className="relative overflow-hidden rounded-2xl border border-noor-cream/20 bg-noor-black/45 p-7 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-10">
                <div className="absolute -right-14 -top-16 h-56 w-56 rounded-full border border-noor-gold-light/25" aria-hidden />
                <div className="absolute -right-5 -top-7 h-40 w-40 rounded-full border border-noor-gold-light/20" aria-hidden />
                <p className="relative text-xs font-semibold uppercase tracking-[0.26em] text-noor-gold-light">
                  The Noor edit
                </p>
                <p className="relative mt-5 font-heading text-7xl leading-none text-noor-cream sm:text-8xl" aria-hidden>
                  N<span className="text-noor-gold-light">.</span>
                </p>
                <p className="relative mt-5 max-w-sm text-lg leading-relaxed text-noor-cream/85 sm:text-xl">
                  Thoughtful finds for the way you live, wear, and express yourself.
                </p>
                <div className="relative mt-8 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-noor-cream/20 pt-5 text-xs font-medium uppercase tracking-[0.16em] text-noor-cream/75 sm:text-sm">
                  <span>Apparel</span>
                  <span>Fragrance</span>
                  <span>Accessories</span>
                  <span>Everyday goods</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator - desktop only, bounce */}
        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block" aria-hidden>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-white/60"
          >
            <ChevronDown size={32} aria-hidden />
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTIONS - Grid Excellence */}
      {featuredCollections.length > 0 && (
      <section className="py-12 md:py-16 lg:py-24">
        <Container>
          <motion.h2
            {...sectionFade}
            className="mb-8 text-center text-2xl font-bold text-[#333333] md:mb-10 md:text-3xl lg:mb-12 lg:text-4xl"
          >
            Featured Collections
          </motion.h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
            {featuredCollections.map((col, i) => (
              <motion.div
                key={col.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-24px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group relative h-[400px] overflow-hidden rounded-2xl md:aspect-[4/5] md:h-auto"
              >
                <Link href={`${ROUTES.collections}/${col.slug}`} className="block h-full">
                  <div className="relative h-full overflow-hidden rounded-2xl">
                    <Image
                      src={col.image || "/placeholder.svg"}
                      alt={col.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                      aria-hidden
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-xl font-bold text-white md:text-2xl lg:text-[28px]">
                      {col.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/80 md:text-base">
                      {col.description}
                    </p>
                    <motion.span
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="mt-4 inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-[#333333] md:opacity-0 md:group-hover:opacity-100"
                      style={{ backgroundColor: GOLD }}
                      transition={{ duration: 0.3 }}
                    >
                      View Collection →
                    </motion.span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      )}

      {/* 3. BESTSELLERS - Showcase */}
      <section className="py-12 md:py-16 lg:py-24" style={{ backgroundColor: CREAM }}>
        <Container>
          <motion.div
            {...sectionFade}
            className="mb-8 flex flex-col items-center justify-between gap-4 md:mb-12 lg:mb-16"
          >
            <h2 className="text-center text-3xl font-bold text-[#333333] md:text-[40px] lg:text-[48px]">
              Our Bestsellers
            </h2>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-[#333333] hover:border-[#C4A747] hover:text-[#C4A747]"
            >
              <Link href={ROUTES.shop}>View All</Link>
            </Button>
          </motion.div>
          <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
            {bestsellers.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-24px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. TESTIMONIALS - Elegant Carousel */}
      <section className="bg-[#F5F3EE] py-12 md:py-16 lg:py-24">
        <Container>
          <motion.h2
            {...sectionFade}
            className="mb-8 text-center text-2xl font-bold text-[#333333] md:mb-10 lg:mb-12 lg:text-4xl"
          >
            What Our Customers Say
          </motion.h2>
          {/* Mobile: 1 card carousel */}
          <div className="mx-4 md:mx-0 lg:hidden">
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl bg-white p-6 shadow-sm md:p-8"
                >
                  {testimonials.length === 0 ? (
                    <p className="text-sm text-[#333333]/70">No reviews yet.</p>
                  ) : (
                    <>
                      <div
                        className="flex gap-0.5 text-[#C4A747]"
                        role="img"
                        aria-label={`${testimonials[testimonialIndex].rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }, (_, j) => (
                          <span key={j} className="text-2xl lg:text-2xl">
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="mt-4 text-base italic leading-relaxed text-[#333333] md:text-lg md:leading-[1.8]">
                        &ldquo;{testimonials[testimonialIndex].comment}&rdquo;
                      </p>
                      <p className="mt-6 text-base font-semibold text-[#333333]">
                        {testimonials[testimonialIndex].user?.name ?? "Anonymous"}
                      </p>
                      <p className="mt-1 text-sm text-[#333333]/70">
                        {testimonials[testimonialIndex].product?.name ?? "Product"}
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
              {testimonials.length > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTestimonialIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === testimonialIndex ? "w-6 bg-[#C4A747]" : "w-2 bg-[#333333]/30"
                      }`}
                      aria-label={`Go to review ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Tablet: 2 cards */}
          <div className="hidden grid-cols-2 gap-6 md:grid lg:hidden">
            {testimonials.slice(0, 2).map((t, i) => (
              <motion.div
                key={t.id}
                {...sectionFade}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-white p-8 shadow-sm"
              >
                <div className="flex gap-0.5 text-2xl text-[#C4A747]" role="img" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="mt-4 text-lg italic leading-[1.8] text-[#333333]">&ldquo;{t.comment}&rdquo;</p>
                <p className="mt-6 text-base font-semibold text-[#333333]">{t.user?.name ?? "Anonymous"}</p>
                <p className="mt-1 text-sm text-[#333333]/70">{t.product?.name ?? "Product"}</p>
              </motion.div>
            ))}
          </div>
          {/* Desktop: 3 cards */}
          <div className="hidden grid-cols-3 gap-8 lg:grid">
            {testimonials.slice(0, 3).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-white p-10 shadow-md"
              >
                <div className="flex gap-0.5 text-2xl text-[#C4A747]" role="img" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="mt-4 text-lg italic leading-[1.8] text-[#333333]">&ldquo;{t.comment}&rdquo;</p>
                <p className="mt-6 text-base font-semibold text-[#333333]">{t.user?.name ?? "Anonymous"}</p>
                <p className="mt-1 text-sm text-[#333333]/70">{t.product?.name ?? "Product"}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. NEWSLETTER - Full-bleed dark block. pb-20 + -mb-20 so no gap/line before footer. */}
      <section
        className="w-full pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20"
        style={{ backgroundColor: DARK }}
      >
        <div className="mx-auto flex w-full max-w-[1400px] justify-center px-6 md:px-8 lg:px-12">
          <motion.div
            {...sectionFade}
            className="w-full max-w-[600px] text-center"
          >
            <h2 className="text-[28px] font-bold text-white md:text-[40px]">
              Get 10% Off Your First Order
            </h2>
            <p className="mt-4 text-base text-white/80 md:mt-4 md:text-[18px]">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:gap-4"
            >
              <Input
                type="email"
                placeholder="Your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={newsletterStatus === "loading"}
                required
                className="h-14 flex-1 rounded-lg border-0 bg-white px-6 text-[#333333] placeholder:text-[#333333]/60 focus-visible:ring-2 focus-visible:ring-[#C4A747] md:px-6"
              />
              <Button
                type="submit"
                disabled={newsletterStatus === "loading"}
                className="h-14 w-full rounded-lg px-8 text-white transition-transform hover:scale-105 md:w-auto md:px-8"
                style={{ backgroundColor: GOLD, color: "white" }}
              >
                {newsletterStatus === "loading"
                  ? "..."
                  : newsletterStatus === "success"
                    ? "Subscribed"
                    : "Submit"}
              </Button>
            </form>
            <p className="mt-6 text-xs text-white/60">
              By signing up you agree to our privacy policy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
