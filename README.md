# Noor Essentials

A modern e-commerce platform built for NOOR-G, focused on premium fashion, fragrances, accessories, and curated essentials. This repository contains the full storefront, customer account flows, and a role-based admin dashboard built with Next.js, MongoDB, Tailwind CSS, and NextAuth.

## Overview

Noor Essentials is designed to provide a polished shopping experience for customers while giving store administrators complete control over products, collections, stock, customer order management, payments, and product content.

The project combines:

- Customer-facing storefront with collection pages, product listings, search, wishlist, and cart
- Secure admin portal for managing inventory, orders, customers, reviews, and store settings
- Flexible MongoDB-backed data layer with Mongoose models
- Authentication with Google OAuth and email/password admin login
- Media uploads and product image management through Vercel Blob

## Features

### Customer experience

- Home page with hero banner, featured collections, and marketing sections
- Product listings with category and collection filtering
- Search and product detail pages
- New arrivals and sale sections
- Wishlist and cart flows
- User account management with addresses and order history
- Checkout experience for order placement
- Review and rating support for products

### Admin capabilities

- Dashboard with order summary and inventory alerts
- Product creation and update workflows
- Category and collection management
- Order processing and order detail views
- Customer management and account overview
- Inventory monitoring for low-stock and out-of-stock variants
- Payment and review management
- Store settings and branding configuration

### Authentication and authorization

- NextAuth integration for session management
- Google sign-in support
- Admin-only credential login for protected areas
- Role-based route protection for `/admin` sections

## Tech Stack

- Next.js 16 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- NextAuth v5
- Zustand for global state
- React Query for client-side data fetching
- Framer Motion for UI motion
- Vercel Blob for asset uploads
- bcryptjs for password hashing

## Project Structure

```text
noorg_client/
├── public/                     # Static assets and product/category images
├── scripts/
│   └── seed.ts                # Seed starter categories, products, and admin user
├── src/
│   ├── app/
│   │   ├── (admin)/           # Admin dashboard and management screens
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (shop)/            # Storefront pages
│   │   ├── (user)/            # Customer account pages
│   │   ├── api/               # Route handlers for products, orders, carts, users, admin actions
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── ...
│   ├── components/            # Reusable UI and feature components
│   ├── hooks/                 # Custom hooks
│   ├── lib/
│   │   ├── api/                # API client wrappers and types
│   │   ├── db/                # MongoDB connection and Mongoose models
│   │   ├── auth.ts            # Auth configuration
│   │   ├── auth-server.ts     # Server-side auth helpers
│   │   ├── constants.ts       # App constants, routes, enums, tags
│   │   ├── metadata.ts        # SEO metadata
│   │   ├── mockData.ts
│   │   ├── productFilters.ts
│   │   ├── utils.ts
│   │   └── validations/
│   ├── store/                 # Zustand stores
│   ├── styles/                # Styling files
│   └── types/
├── .env.example               # Environment variable template
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── README.md
└── ...
```

## Requirements

Before running the project, make sure you have:

- Node.js 18 or later
- npm or yarn
- MongoDB instance (local or cloud such as MongoDB Atlas)
- Google Cloud OAuth client credentials
- Vercel Blob token for image uploads

## Environment Variables

Create a `.env.local` file based on `.env.example`.

```bash
cp .env.example .env.local
```

Required variables:

```bash
AUTH_SECRET=your-auth-secret-here
AUTH_GOOGLE_ID=your-google-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-google-client-secret
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/noor-essentials
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/noor-essentials
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_password
```

### Variable explanations

- `AUTH_SECRET`: Secret used by NextAuth for signing secure tokens. Generate it using:

```bash
npm run auth-secret
```

- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`: Credentials from Google Cloud Console for Google OAuth login.
- `MONGODB_URI` / `DATABASE_URL`: MongoDB connection string used by the app.
- `BLOB_READ_WRITE_TOKEN`: Token for Vercel Blob uploads used by admin image upload workflows.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: Used by the seed script to create the initial administrator account.

## Installation

```bash
npm install
```

## Database and Initial Setup

This project expects a live MongoDB connection. Once your environment variables are configured, initialize the database with the seed script:

```bash
npm run seed
```

The seed script will:

- create or update app settings
- create the admin user based on `ADMIN_EMAIL`
- initialize core collections/categories
- seed starter products for the storefront

## Run the Application

Development mode:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## Admin Access

After seeding, sign in at:

```text
/admin/login
```

The admin user is created based on the configured `ADMIN_EMAIL` and can be given a password via `ADMIN_PASSWORD` during seeding. Google login is also supported, but the protected admin routes require the authenticated user role to be `ADMIN`.

## Key Application Routes

### Storefront

- `/` — Homepage
- `/shop` — Product catalog
- `/collections` — Collection overview
- `/collections/[slug]` — Collection details
- `/products/[slug]` — Product details
- `/search` — Search results
- `/cart` — Shopping cart
- `/wishlist` — Saved items
- `/checkout` — Checkout flow
- `/account` — Customer account dashboard

### Admin

- `/admin` — Dashboard
- `/admin/orders` — Manage orders
- `/admin/inventory` — Inventory overview and stock alerts
- `/admin/categories` — Product categories and collections
- `/admin/customers` — Customer list
- `/admin/reviews` — Reviews moderation
- `/admin/payments` — Payment records
- `/admin/settings` — Site branding and configuration

## Data Model Highlights

The app uses Mongoose models for:

- `User`
- `Product`
- `Collection`
- `Order`
- `Payment`
- `Review`
- `Setting`
- `Cart`

These models support the business flows needed for a full e-commerce experience, from browsing products to handling orders and maintaining store configuration.

## Deployment

This project is ready for deployment on platforms such as Vercel.

Recommended deployment steps:

1. Push the repository to GitHub
2. Import the project into Vercel
3. Add all required environment variables in the Vercel dashboard
4. Ensure the MongoDB connection is accessible from the deployed environment
5. Run `npm run build` to verify production readiness
6. Run the seed script once in the target environment if the database is empty

## Notes

- The project uses a MongoDB-first architecture and assumes database connectivity for most store functions.
- Admin uploads depend on a valid `BLOB_READ_WRITE_TOKEN`.
- Store pages and API routes rely on app settings and product metadata managed within the database.

## License

This project is private and intended for the NOOR-G business use case unless otherwise specified by the project owner.

## Support

For setup or environment issues, review the environment variables and confirm the MongoDB and auth providers are configured correctly before running the app.