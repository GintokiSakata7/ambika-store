# Ambika Chemical — React storefront and store-manager demo

A substantially expanded React + Vite storefront prototype for Ambika Chemical & House Cleaning Material in Vallabh Nagar, Mahabubnagar. The design uses a large searchable retail header, category navigation, product catalogue, product detail pages, cart and checkout, a dedicated bulk-order flow, and a separate owner dashboard.

> **Demo data notice:** product names, prices, offers, stock counts, photos/illustrations, delivery policies and orders are sample data for demonstration. Confirm all business information with the store owner before publishing.

## Run locally

Requirements: Node.js 18+ (Node.js 20+ recommended) and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

To test a production bundle locally:

```bash
npm run build
npm run preview
```

## Demo owner access

- Choose **Owner login** in the storefront or go directly to `/admin/login`.
- Demo PIN: **2468**.
- Set the shop's actual WhatsApp number under **Admin → Store settings** to enable the `wa.me` hand-off.

The demo PIN is stored as browser-session state and is **not secure authentication**. Do not use this implementation to protect real customer or business data.

## Pages and routes

### Customer storefront

| Route | Purpose |
|---|---|
| `/` | Home page, service benefits, category tiles, deals, product recommendations and bulk CTA |
| `/products` | Full catalogue with text search, category navigation, price filters, stock filter, sorting and pagination |
| `/categories/:slug` | Category-specific product list |
| `/products/:slug` | Product detail, quantity selector, wishlist, stock indicator, related products and bulk request |
| `/deals` | Discount-sorted demo product list |
| `/wishlist` | Saved products |
| `/cart` | Itemized basket, quantity changes, remove item and minimum-order progress |
| `/checkout` | Customer contact, address, PIN, location permission and order submit |
| `/bulk-orders` | Bulk enquiry / negotiated-pricing request form; accepts optional `?product=...` |
| `/order-confirmation/:id` | Order confirmation for an order saved in this browser |
| `/track-order` | Look up locally saved demo orders by reference |
| `/about` | Store information |
| `/contact` | Contact form prototype and store contact details |
| `/help` | Delivery, minimum-order, bulk pricing and safety FAQs |

### Owner / admin

| Route | Purpose |
|---|---|
| `/admin/login` | Demo owner sign-in |
| `/admin` | Overview and activity summaries |
| `/admin/products` | Create/edit/delete products, category, price, stock and image URL |
| `/admin/orders` | Inspect saved demo orders and update status |
| `/admin/bulk` | Review and update bulk enquiries |
| `/admin/settings` | Edit WhatsApp/contact settings, minimum order, bulk threshold and delivery areas |

Client-side routes are included in the app. `vercel.json` and `public/_redirects` add SPA rewrites for direct navigation/refresh on common static hosts.

## Included interactions

- Responsive desktop/mobile storefront and admin layout.
- 30 editable cleaning-supplies demo products, including **cheepuru / traditional grass brooms**, mops, phenyl, floor-care products, brushes, scrubbers, gloves, cloths, bags, household products and larger commercial containers.
- Category search and sorting, in-stock and price filters, product details and related products.
- Cart quantity/stock guards, local persistence and a configurable **₹500 minimum order** (default demo setting).
- Optional browser geolocation request plus manual delivery details. Browser location requires permission and a secure context (HTTPS or localhost); coordinates alone do not resolve to a street address.
- WhatsApp-ready order message with customer, address and line items. If a WhatsApp number is not configured, the confirmation page shows a message that can be copied instead.
- Bulk enquiry form and a configurable **₹5,000 bulk-pricing threshold**. The threshold prompts a negotiated quote; no automatic discount is guaranteed.
- Demo order tracking, wishlist, admin product CRUD, inventory snapshots, order status changes, enquiry management, store settings, and JSON data export/reset.
- Data persisted to this browser's `localStorage`, with a `_v2` namespace to avoid conflicting with an earlier demo version.

## Project structure

```text
ambika-chemical-store/
├── index.html
├── package.json
├── vercel.json
├── vite.config.js
├── public/
│   ├── _redirects
│   └── favicon.svg
└── src/
    ├── App.jsx       # Routes, storefront pages, checkout and owner dashboard
    ├── data.js       # Demo catalogue, categories and defaults
    ├── index.css     # Responsive storefront and admin design
    └── main.jsx      # React entry point
```

## Important limitations before a real launch

This is still a **front-end prototype**, not a production e-commerce backend:

1. The catalogue, cart, orders, enquiries and store settings are kept in one browser. They are not shared between customer devices or admins, and can be edited by the user.
2. Replace the demo PIN with an authentication provider plus server-side role checks. The current PIN is only for showing the owner workflow.
3. Add a backend/API and database; validate price, stock, delivery eligibility and order contents on the server. Never trust browser-submitted totals.
4. WhatsApp hand-off opens a pre-filled message; it does not guarantee the owner receives an order or that stock is reserved. Confirm orders and delivery manually until a proper order-processing workflow is implemented.
5. Add a payment provider only if the owner wants online payments; the current flow does not process payment.
6. Confirm legal business details, actual phone/WhatsApp number, product images, pack sizes, prices, taxes, stock, opening hours, PIN-code coverage, delivery charges, return/refund terms and privacy notice.
7. Use verified product labels and manufacturer-provided directions and safety information for chemical products.

## Tech stack

- React 18
- Vite 5
- Lucide React icons
- CSS with responsive layouts
- Custom lightweight History API router (no extra router dependency)
- Browser `localStorage` / `sessionStorage` for demo persistence
