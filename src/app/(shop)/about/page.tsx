import Image from "next/image";
import {
  Award,
  Leaf,
  Heart,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LOGO_PATH } from "@/lib/constants";
import { getAppSettings } from "@/lib/settings-server";

const CREAM = "#F5F3EE";

export default async function AboutPage() {
  const settings = await getAppSettings();
  const logo = settings.logoUrl || LOGO_PATH;
  const brandName = settings.appName;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[320px] w-full overflow-hidden bg-[#333333]">
        <Image
          src={logo}
          alt={`${brandName} brand`}
          fill
          className="object-cover opacity-80"
          priority
          sizes="100vw"
          unoptimized={logo.endsWith(".svg")}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#333333]/50 px-4 text-center text-white">
          <Image
            src={logo}
            alt={brandName}
            width={200}
            height={80}
            className="h-20 w-auto object-contain sm:h-24 md:h-28"
            priority
            sizes="200px"
            unoptimized={logo.endsWith(".svg")}
          />
          <p className="text-lg text-white/90 sm:text-xl">
            Lifestyle essentials for everyday elegance
          </p>
        </div>
      </section>

      {/* Brand story - white */}
      <section className="bg-white py-16 md:py-24">
        <Container maxWidth="narrow" className="text-center">
          <h2 className="text-3xl font-bold text-[#333333] md:text-4xl">
            Our Story
          </h2>
          <div className="mt-8 space-y-6 text-left text-[#333333]/90">
            <p className="leading-relaxed">
              <strong>{brandName}</strong> was founded with a clear purpose: to be your premier destination for everyday lifestyle essentials that never compromise on quality, aesthetics, or value.
            </p>
            <p className="leading-relaxed">
              We bring together a curated collection across five core categories:
              <strong> premium clothing</strong> crafted from the finest lawn, cotton, and festive fabrics;
              <strong> signature perfumes</strong> featuring enchanting long-lasting scents;
              <strong> elegant ladies accessories</strong> including bags, jewellery, and scarves;
              <strong> high-grade mobile accessories</strong> engineered for modern digital life; and
              <strong> handcrafted shoes</strong> combining timeless tradition with modern comfort.
            </p>
            <p className="leading-relaxed">
              Every single product at {brandName} is vetted for durability, finish, and aesthetic appeal. Thank you for welcoming {brandName} into your everyday life.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission & values - cream */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: CREAM }}
      >
        <Container>
          <h2 className="text-center text-3xl font-bold text-[#333333] md:text-4xl">
            Mission & Values
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Award,
                title: "Curated Quality",
                text: "We source and craft each item to premium standards across apparel, scents, tech, and accessories.",
              },
              {
                icon: Leaf,
                title: "Thoughtful Selection",
                text: "Carefully selected materials, skin-safe perfumes, and durable components made to last.",
              },
              {
                icon: Heart,
                title: "Customer First",
                text: "From hassle-free ordering to friendly WhatsApp customer support, your satisfaction is our priority.",
              },
              {
                icon: Sparkles,
                title: "Timeless Elegance",
                text: "Designs and essentials that elevate your lifestyle, season after season.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-xl border border-[#333333]/10 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C4A747]/20 text-[#C4A747]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#333333]">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-[#333333]/80">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Fabric philosophy - white */}
      <section className="bg-white py-16 md:py-24">
        <Container maxWidth="narrow" className="max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              <Image
                src="/hero-banner.jpg"
                alt="Fabric close-up"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#333333] md:text-4xl">
                Fabric Philosophy
              </h2>
              <p className="mt-6 leading-relaxed text-[#333333]/90">
                We believe the right fabric makes the garment. Our lawn and cotton
                collections are chosen for breathability and softness; our linen
                for its natural texture and durability. We avoid unnecessary
                synthetics and prioritise materials that age well and feel good
                on the skin.
              </p>
              <p className="mt-4 leading-relaxed text-[#333333]/90">
                Every piece comes with care instructions so you can keep your
                NOOR-G wardrobe looking and feeling its best for years to come.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Founder note - cream */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: CREAM }}
      >
        <Container maxWidth="narrow" className="text-center">
          <h2 className="text-3xl font-bold text-[#333333] md:text-4xl">
            A Note from Our Team
          </h2>
          <div className="relative mx-auto mt-10 max-w-2xl">
            <blockquote className="text-lg italic leading-relaxed text-[#333333]/90">
              &ldquo;We built NOOR-G for people who want fewer, better things.
              Our goal is to offer clothing you reach for again and again—pieces
              that become part of your story. Thank you for trusting us with
              your wardrobe.&rdquo;
            </blockquote>
            <p className="mt-6 font-medium text-[#333333]">
              — The NOOR-G Team
            </p>
          </div>
          <div className="relative mx-auto mt-10 h-48 w-48 overflow-hidden rounded-full bg-[#333333]/10">
            <Image
              src="/collection-cotton.jpg"
              alt="NOOR-G team"
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
