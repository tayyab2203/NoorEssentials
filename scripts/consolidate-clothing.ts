/**
 * Fold legacy clothing collections (Lawn, Cotton, Linen, and similar) into Clothing.
 * Run: npx tsx scripts/consolidate-clothing.ts
 */
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

import { connectDB } from "../src/lib/db/mongodb";
import { Collection } from "../src/lib/db/models";
import { consolidateClothingCategories } from "../src/lib/db/consolidateClothing";

async function main() {
  await connectDB();
  const before = await Collection.find({}, { name: 1, slug: 1 }).sort({ displayOrder: 1 }).lean();
  console.log("Before:");
  before.forEach((collection) => console.log(`- ${collection.name} (${collection.slug})`));

  const merged = await consolidateClothingCategories();
  console.log(merged.length ? `Merged:\n${merged.map((item) => `- ${item}`).join("\n")}` : "Nothing to merge.");

  const after = await Collection.find({}, { name: 1, slug: 1 }).sort({ displayOrder: 1 }).lean();
  console.log("After:");
  after.forEach((collection) => console.log(`- ${collection.name} (${collection.slug})`));
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
