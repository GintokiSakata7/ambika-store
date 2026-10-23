# Margin Studios Chemicals — House Cleaning Shop Website

A clean, modern, professional e-commerce and demo website for **Margin Studios Chemicals** (by **Margin Studio**), specialized in housekeeping chemicals and domestic cleaning supplies with instant WhatsApp ordering and delivery address routing.

---

## 🌟 Key Features

1. **Brand & Identity**:
   - Company Name: **Margin Studio**
   - Store Name: **Margin Studios Chemicals**
   - WhatsApp Order Line: **+91 94915 54114**
   - Clean, human, professional design (calm clean teal, slate, and crisp white — no garish rainbow gradients).

2. **Full House Cleaning Product Catalog**:
   - **Concentrated White Phenol (Phenyl)**: 1L & 5L Canisters
   - **Bathroom & Tile Cleaning Acids**: High potency diluted safe-grade formulas
   - **Pure Naphthalene Balls (Mothballs)**: 200g & 500g jumbo freshness packs
   - **Stable Bleaching Powder**: 1kg chlorine disinfectant packs
   - **Brooms & Mops**: Dust-free soft grass broom (*Phool Jhadu*), heavy duty coconut hard broom (*Kharata*), 360° telescopic flat mop stick
   - **Floor Wipers**: 20-inch streak-free rubber blade with stainless steel rod
   - **Scrubbers & Utilities**: Stainless steel wire scrubbers, green nylon scrub pads, unbreakable 20L virgin plastic bucket + mug, rubber safety gloves, and microfiber cloths.
   - **Money-Saver Combo Bundles**: 3 pre-packaged bundles that instantly qualify for home delivery.

3. **Smart Cart & Delivery Threshold System**:
   - **Delivery Requirement**: Doorstep delivery available for orders **₹500 and above**.
   - **Interactive Visual Progress Tracker**: Real-time progress bar in the cart drawer.
     - Under ₹500: Displays *"Add ₹X more to unlock Doorstep Delivery"*.
     - Above ₹500: Turns green and unlocks *"Congratulations! Your cart qualifies for Doorstep Delivery (> ₹500)"*.
   - **Store Pickup Option**: Customers can also select *"Store Self-Pickup"* without any minimum amount.

4. **Delivery Address & WhatsApp Redirection**:
   - When the customer proceeds to checkout, the site collects:
     - Full Name
     - 10-digit Mobile Number
     - Complete Delivery Address (House/Flat No., Street, Locality)
     - Landmark
     - Pincode / Area Code
     - Preferred Delivery Slot
     - Payment Preference (Cash on Delivery / UPI on Delivery)
     - Special Handling Notes (e.g., *"Handle acid bottles upright"*)
   - Generates a beautifully formatted WhatsApp message and redirects to:
     `https://wa.me/919491554114?text=...`
   - Includes a **"Copy Message"** fallback button if pop-up blockers are active.

---

## 🚀 How to Run & Preview

### Option A: Local Server (Already running)
The local server is running on:
```
http://localhost:61191
```
Open that link in your web browser (Chrome, Edge, Brave, Firefox, etc.) to test the site live.

### Option B: Open Directly
You can also double-click `index.html` directly in your file explorer (`c:\Local Disk (D)\Majin Studios WORK\house cleaning\index.html`).

---

## 📁 File Structure

```
house cleaning/
├── index.html              # Main HTML markup with SEO and semantic structure
├── css/
│   └── styles.css          # Clean, professional, human design system & responsiveness
├── js/
│   ├── products.js         # Complete catalog of 18 products and 3 combos
│   ├── cart.js             # Cart state, ₹500 delivery threshold & WhatsApp message formatter
│   └── app.js              # UI controller, live search, category filtering & modals
├── assets/
│   └── images/             # Studio product photography (hero, phenyl, brooms, bleach, etc.)
└── README.md               # Documentation and usage guide
```
