import { Collection, Product } from "@/lib/db/models";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

/**
 * Older store data split clothing into fabric lines such as Lawn, Cotton, Winter, Shawls, and Pret.
 * Those collections are folded into the single Clothing category.
 * Perfumes, accessories, and shoes stay as their own categories.
 */
const PROTECTED_SLUGS = new Set([
  "clothing",
  "perfumes",
  "ladies-accessories",
  "mobile-accessories",
  "shoes",
]);

const CLOTHING_HINTS = [
  "lawn",
  "cotton",
  "linen",
  "festive",
  "winter",
  "unstitched",
  "pret",
  "stole",
  "shawl",
  "boski",
  "latha",
  "khaddar",
  "karandi",
  "marina",
  "wash",
  "kurta",
  "kameez",
  "fabric",
  "ready to wear",
  "current collection",
];

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ");
}

export function isLegacyClothingCategory(name: string, slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  if (PROTECTED_SLUGS.has(normalizedSlug)) return false;
  const haystack = `${normalizeKey(name)} ${normalizeKey(slug)}`;
  return CLOTHING_HINTS.some((hint) => haystack.includes(hint));
}

export async function consolidateClothingCategories(): Promise<string[]> {
  const clothingDef = DEFAULT_CATEGORIES.find((category) => category.slug === "clothing");
  if (!clothingDef) return [];

  const clothing = await Collection.findOneAndUpdate(
    { slug: "clothing" },
    {
      $setOnInsert: {
        name: clothingDef.name,
        slug: clothingDef.slug,
        description: clothingDef.description,
        image: clothingDef.image,
        displayOrder: clothingDef.displayOrder,
        productIds: [],
      },
    },
    { new: true, upsert: true }
  );

  const others = await Collection.find({ _id: { $ne: clothing._id } });
  const legacy = others.filter((collection) =>
    isLegacyClothingCategory(collection.name ?? "", collection.slug ?? "")
  );

  const clothingId = clothing._id.toString();
  const merged: string[] = [];

  for (const collection of legacy) {
    const previousId = collection._id.toString();
    await Product.updateMany(
      { $or: [{ categoryId: previousId }, { categoryId: collection.slug }] },
      { $set: { categoryId: clothingId } }
    );
    if (collection.productIds?.length) {
      await Collection.findByIdAndUpdate(clothing._id, {
        $addToSet: { productIds: { $each: collection.productIds } },
      });
    }
    await Collection.deleteOne({ _id: collection._id });
    merged.push(`${collection.name} (${collection.slug})`);
  }

  return merged;
}
