// ---------------------------------------------------------------------------
// Site
// ---------------------------------------------------------------------------

export const SITE_NAME = "Noor Essentials";
export const SITE_DESCRIPTION = "Noor Essentials — Premium Clothing, Perfumes, Ladies Accessories, Mobile Accessories & Shoes";

/** Logo image path — replace public/noor-logo.jpeg with your logo file. */
export const LOGO_PATH = "/noor-logo.png";

export const ROUTES = {
  home: "/",
  shop: "/shop",
  collections: "/collections",
  newArrivals: "/collections/new-arrivals",
  sale: "/sale",
  search: "/search",
  about: "/about",
  contact: "/contact",
  cart: "/cart",
  wishlist: "/wishlist",
  login: "/login",
  signup: "/signup",
  account: "/account",
  checkout: "/checkout",
} as const;

export const ADMIN_ROUTES = {
  dashboard: "/admin",
  categories: "/admin/categories",
  categoriesNew: "/admin/categories/new",
  categoryDetail: (id: string) => `/admin/categories/${id}`,
  categoryEdit: (id: string) => `/admin/categories/${id}/edit`,
  categoryProductNew: (categoryId: string) => `/admin/categories/${categoryId}/products/new`,
  categoryProductEdit: (categoryId: string, productId: string) => `/admin/categories/${categoryId}/products/${productId}/edit`,
  /** Edit product - requires categoryId. Falls back to categories list if not provided. */
  productEdit: (productId: string, categoryId?: string) =>
    categoryId ? `/admin/categories/${categoryId}/products/${productId}/edit` : "/admin/categories",
  orders: "/admin/orders",
  orderDetail: (id: string) => `/admin/orders/${id}`,
  customers: "/admin/customers",
  customerDetail: (id: string) => `/admin/customers/${id}`,
  inventory: "/admin/inventory",
  reviews: "/admin/reviews",
  payments: "/admin/payments",
  settings: "/admin/settings",
  newArrivals: "/admin/new-arrivals",
  sale: "/admin/sale",
} as const;

export const COLORS = {
  primaryDark: "#333333",
  goldAccent: "#C4A747",
  cream: "#F5F3EE",
  sage: "#5BA383",
} as const;

// ---------------------------------------------------------------------------
// Enums (as const objects for type-safe string literals)
// ---------------------------------------------------------------------------

export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

/** Pakistani payment methods (mock flow) */
export const PAYMENT_METHOD = {
  EASYPAISA: "EASYPAISA",
  JAZZCASH: "JAZZCASH",
  BANK_TRANSFER: "BANK_TRANSFER",
} as const;

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PRODUCT_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
  OUT_OF_STOCK: "OUT_OF_STOCK",
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const REVIEW_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

export const USER_ROLE = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

// ---------------------------------------------------------------------------
// Product options
// ---------------------------------------------------------------------------

export const SIZE_OPTIONS = [
  "STANDARD",
  "ONE_SIZE",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "30ml",
  "50ml",
  "100ml",
] as const;

export type SizeOption = (typeof SIZE_OPTIONS)[number];

export const COLOR_OPTIONS = [
  "White",
  "Black",
  "Navy",
  "Grey",
  "Beige",
  "Cream",
  "Brown",
  "Burgundy",
  "Red",
  "Pink",
  "Sage",
  "Green",
  "Blue",
  "Khaki",
  "Gold",
  "Silver",
  "Multi",
] as const;

export type ColorOption = (typeof COLOR_OPTIONS)[number];

/** Map color names to hex for swatches (approximate). */
export const COLOR_SWATCH_HEX: Record<string, string> = {
  White: "#ffffff",
  Black: "#000000",
  Navy: "#000080",
  Grey: "#808080",
  Beige: "#f5f5dc",
  Cream: "#fffdd0",
  Brown: "#8b4513",
  Burgundy: "#800020",
  Red: "#dc2626",
  Pink: "#ec4899",
  Sage: "#5BA383",
  Green: "#22c55e",
  Blue: "#3b82f6",
  Khaki: "#c3b091",
  Gold: "#D4AF37",
  Silver: "#C0C0C0",
  Multi: "linear-gradient(90deg,#ec4899,#3b82f6,#22c55e)",
};

export const MATERIAL_TYPES = [
  "Cotton",
  "Lawn",
  "Linen",
  "Silk",
  "Chiffon",
  "Leather",
  "Velvet",
  "Denim",
  "Metal",
  "Silver",
  "Gold Plated",
  "Silicone",
  "Tempered Glass",
  "Polycarbonate",
  "Rubber",
  "Synthetic",
  "Wool",
  "Polyester",
  "Viscose",
  "Rayon",
  "Cashmere",
  "Blend",
  "Other",
] as const;

export type MaterialType = (typeof MATERIAL_TYPES)[number];

// ---------------------------------------------------------------------------
// Default Categories & App Settings
// ---------------------------------------------------------------------------

export const DEFAULT_CATEGORIES = [
  {
    name: "Clothing",
    slug: "clothing",
    description: "Premium lawn, cotton, linen, and festive wear designed for comfort and everyday elegance.",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    displayOrder: 1,
  },
  {
    name: "Perfumes",
    slug: "perfumes",
    description: "Signature fragrances, attars, and luxury scents to leave a lasting impression.",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    displayOrder: 2,
  },
  {
    name: "Ladies Accessories",
    slug: "ladies-accessories",
    description: "Handbags, exquisite jewellery, scarves, and curated fashion accessories.",
    image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&w=800&q=80",
    displayOrder: 3,
  },
  {
    name: "Mobile Accessories",
    slug: "mobile-accessories",
    description: "Premium protective cases, fast chargers, earbuds, cables, and tech essentials.",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
    displayOrder: 4,
  },
  {
    name: "Shoes",
    slug: "shoes",
    description: "Handcrafted traditional khussas, comfortable flats, elegant heels, and everyday footwear.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    displayOrder: 5,
  },
] as const;

export const DEFAULT_APP_SETTINGS = {
  appName: "Noor Essentials",
  appDescription:
    "Noor Essentials — Your premier destination for clothing, perfumes, ladies accessories, mobile accessories, and shoes.",
  logoUrl: "/noor-logo.png",
  contactEmail: "contact@nooressentials.com",
  contactPhone: "+92 319 0409623",
  address: "Lahore, Pakistan",
  whatsappNumber: "923190409623",
  bannerAnnouncement: "Free delivery on orders over PKR 2,999",
} as const;
