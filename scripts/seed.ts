/**
 * Seed script: create admin user, initialize app settings,
 * and seed the 5 core categories and initial products for Noor Essentials.
 *
 * Categories:
 * - Clothing
 * - Perfumes
 * - Ladies Accessories
 * - Mobile Accessories
 * - Shoes
 *
 * Run: npm run seed
 * Requires: MONGODB_URI (or DATABASE_URL)
 */
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

import { hash } from "bcryptjs";
import { connectDB } from "../src/lib/db/mongodb";
import { User, Collection, Product, Setting } from "../src/lib/db/models";
import { USER_ROLE, DEFAULT_APP_SETTINGS, DEFAULT_CATEGORIES, PRODUCT_STATUS } from "../src/lib/constants";
import { consolidateClothingCategories } from "../src/lib/db/consolidateClothing";

const MONGODB_URI = process.env.MONGODB_URI ?? process.env.DATABASE_URL ?? "";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

const STARTER_PRODUCTS = [
  // 1. Clothing
  {
    name: "Embroidered Lawn Festive 3-Piece",
    slug: "embroidered-lawn-festive-3-piece",
    categorySlug: "clothing",
    description: "Intricately embroidered premium lawn suit with chiffon dupatta and dyed cotton trousers.",
    price: 6499,
    salePrice: 5499,
    material: "Lawn",
    SKU: "NE-CLO-001",
    isNewArrival: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
        altText: "Embroidered Lawn Festive 3-Piece",
        order: 0,
      },
    ],
    variants: [
      { size: "S", color: "Sage", stock: 15, variantSKU: "NE-CLO-001-SAGE-S" },
      { size: "M", color: "Sage", stock: 20, variantSKU: "NE-CLO-001-SAGE-M" },
      { size: "L", color: "Sage", stock: 10, variantSKU: "NE-CLO-001-SAGE-L" },
    ],
  },
  // 2. Perfumes
  {
    name: "Oud Royale Eau De Parfum",
    slug: "oud-royale-eau-de-parfum",
    categorySlug: "perfumes",
    description: "An opulent oriental scent blending velvety rose, smoky cambodian oud, and warm amber crystals.",
    price: 4999,
    salePrice: 4299,
    material: "Blend",
    SKU: "NE-PRF-001",
    isNewArrival: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
        altText: "Oud Royale Eau De Parfum",
        order: 0,
      },
    ],
    variants: [
      { size: "50ml", color: "Gold", stock: 25, variantSKU: "NE-PRF-001-50ML" },
      { size: "100ml", color: "Gold", stock: 15, variantSKU: "NE-PRF-001-100ML" },
    ],
  },
  // 3. Ladies Accessories
  {
    name: "Classic Quilted Leather Handbag",
    slug: "classic-quilted-leather-handbag",
    categorySlug: "ladies-accessories",
    description: "Timeless crossbody and shoulder bag featuring premium vegan leather, gold hardware, and partitioned interior.",
    price: 3899,
    salePrice: 3299,
    material: "Leather",
    SKU: "NE-ACC-001",
    isNewArrival: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
        altText: "Classic Quilted Leather Handbag",
        order: 0,
      },
    ],
    variants: [
      { size: "ONE_SIZE", color: "Black", stock: 18, variantSKU: "NE-ACC-001-BLK" },
      { size: "ONE_SIZE", color: "Beige", stock: 12, variantSKU: "NE-ACC-001-BEI" },
    ],
  },
  // 4. Mobile Accessories
  {
    name: "65W GaN Fast Charger & Braided Cable",
    slug: "65w-gan-fast-charger-braided-cable",
    categorySlug: "mobile-accessories",
    description: "Compact 65W GaN dual-port fast charger with Type-C to Type-C durable braided cable.",
    price: 2499,
    salePrice: 1999,
    material: "Polycarbonate",
    SKU: "NE-MOB-001",
    isNewArrival: false,
    images: [
      {
        url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
        altText: "65W GaN Fast Charger",
        order: 0,
      },
    ],
    variants: [
      { size: "Universal", color: "White", stock: 40, variantSKU: "NE-MOB-001-WHT" },
      { size: "Universal", color: "Black", stock: 35, variantSKU: "NE-MOB-001-BLK" },
    ],
  },
  // 5. Shoes
  {
    name: "Handcrafted Zari Velvet Khussa",
    slug: "handcrafted-zari-velvet-khussa",
    categorySlug: "shoes",
    description: "Traditional handmade khussa crafted with rich velvet, intricate golden tilla embroidery, and cushioned sole.",
    price: 3499,
    salePrice: 2899,
    material: "Velvet",
    SKU: "NE-SHOE-001",
    isNewArrival: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
        altText: "Handcrafted Zari Velvet Khussa",
        order: 0,
      },
    ],
    variants: [
      { size: "37", color: "Burgundy", stock: 8, variantSKU: "NE-SHOE-001-BUR-37" },
      { size: "38", color: "Burgundy", stock: 12, variantSKU: "NE-SHOE-001-BUR-38" },
      { size: "39", color: "Burgundy", stock: 10, variantSKU: "NE-SHOE-001-BUR-39" },
      { size: "40", color: "Burgundy", stock: 6, variantSKU: "NE-SHOE-001-BUR-40" },
    ],
  },
];

async function seed() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI or DATABASE_URL");
    process.exit(1);
  }

  await connectDB();
  console.log("Connected to MongoDB");

  // 1. Seed / Upsert App Settings
  const existingSetting = await Setting.findOne();
  if (!existingSetting) {
    await Setting.create(DEFAULT_APP_SETTINGS);
    console.log("App Settings initialized with Noor Essentials branding");
  } else {
    console.log("Existing App Settings verified:", existingSetting.appName);
  }

  // 2. Seed Admin User
  if (ADMIN_EMAIL) {
    const update: { role: string; passwordHash?: string; name?: string; image?: null } = {
      role: USER_ROLE.ADMIN,
    };
    if (ADMIN_PASSWORD.length >= 8) {
      update.passwordHash = await hash(ADMIN_PASSWORD, 10);
    } else {
      console.warn("ADMIN_PASSWORD not set or too short (min 8). Admin will need to set password via DB or re-seed.");
    }
    const user = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        $set: update,
        $setOnInsert: { name: "Admin", image: null },
      },
      { new: true, upsert: true }
    );
    console.log("Admin user set:", user.email, "role:", user.role, update.passwordHash ? "(password set)" : "(no password)");
  } else {
    console.log("Set ADMIN_EMAIL and ADMIN_PASSWORD in env to create an admin user.");
  }

  // 3. Seed the 5 Core Categories / Collections
  const categoryMap: Record<string, string> = {};
  for (const cat of DEFAULT_CATEGORIES) {
    const col = await Collection.findOneAndUpdate(
      { slug: cat.slug },
      {
        $setOnInsert: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          displayOrder: cat.displayOrder,
          productIds: [],
        },
      },
      { new: true, upsert: true }
    );
    categoryMap[cat.slug] = col._id.toString();
    console.log(`Category verified: ${cat.name} (${cat.slug})`);
  }

  const mergedClothing = await consolidateClothingCategories();
  if (mergedClothing.length > 0) {
    console.log("Merged legacy clothing categories into Clothing:");
    mergedClothing.forEach((label) => console.log(`  - ${label}`));
  } else {
    console.log("Clothing is already a single category.");
  }

  // 4. Seed Starter Products if none exist
  const existingProductCount = await Product.countDocuments();
  if (existingProductCount === 0) {
    console.log("No existing products found. Seeding initial products across all 5 categories...");
    for (const p of STARTER_PRODUCTS) {
      const categoryId = categoryMap[p.categorySlug] || "";
      const createdProduct = await Product.create({
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice,
        material: p.material,
        SKU: p.SKU,
        status: PRODUCT_STATUS.ACTIVE,
        categoryId,
        isNewArrival: p.isNewArrival,
        images: p.images,
        variants: p.variants,
      });

      if (categoryId) {
        await Collection.findByIdAndUpdate(categoryId, {
          $addToSet: { productIds: createdProduct._id },
        });
      }
      console.log(`Product created: ${p.name} [${p.categorySlug}]`);
    }
  } else {
    console.log(`Products already present (${existingProductCount} products in database).`);
  }

  console.log("\nSeed completed successfully for Noor Essentials!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
