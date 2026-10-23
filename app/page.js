"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useStore } from "../context/StoreContext";

import Header from "../components/Header";
import Hero from "../components/Hero";
import FeatureStrip from "../components/FeatureStrip";
import ComboSection from "../components/ComboSection";
import CategoryNav from "../components/CategoryNav";
import ProductCard from "../components/ProductCard";
import ProductSkeletonCard from "../components/ProductSkeletonCard";
import WholesaleSection from "../components/WholesaleSection";
import StoreDirectionsView from "../components/StoreDirectionsView";
import TrackOrderPage from "../components/TrackOrderPage";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import OrderSuccessModal from "../components/OrderSuccessModal";
import TrackOrderModal from "../components/TrackOrderModal";
import AdminDashboard from "../components/AdminDashboard";
import AuthModal from "../components/AuthModal";
import ProductDetailModal from "../components/ProductDetailModal";
import Toast from "../components/Toast";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";
import WhyCleaningMatters from "../components/WhyCleaningMatters";
import TrustAndTestimonials from "../components/TrustAndTestimonials";
import { IconSearch } from "../components/Icons";

export default function HomePage() {
  const { products, currentRole, catalogMode, t } = useStore();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCat = activeCategory === "all" || prod.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        prod.name.toLowerCase().includes(q) ||
        (prod.categoryName && prod.categoryName.toLowerCase().includes(q)) ||
        (prod.description && prod.description.toLowerCase().includes(q)) ||
        (prod.potency && prod.potency.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Smooth skeleton transition when switching categories
  const handleCategoryChange = (cat) => {
    setLoading(true);
    setActiveCategory(cat);
    setTimeout(() => {
      setLoading(false);
    }, 220);
  };

  return (
    <>
      {/* Conditionally Render Based on Current Role */}
      {currentRole === "admin" ? (
        /* Dedicated Store Admin Dashboard (Edit products, Add/Remove Categories, Orders) */
        <AdminDashboard />
      ) : (
        /* Clean Customer Storefront (Full-page app-like navigation) */
        <>
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <main className="main-content-flow">
            {/* View 1: Wholesale Section (Full Page) */}
            {catalogMode === "wholesale" ? (
              <WholesaleSection />
            ) : catalogMode === "directions" ? (
              /* View 2: Store & Google Maps Directions (Full Page) */
              <StoreDirectionsView />
            ) : catalogMode === "track" ? (
              /* View 3: Live Order Ticket Tracking (Full Page) */
              <TrackOrderPage />
            ) : (
              /* View 4: Retail Products & Catalog */
              <>
                {/* Non-intrusive Suggestion Hero (Sleek on mobile, refined on desktop) */}
                <Hero />

                {/* Value Proposition Strip (Desktop & tablet) */}
                <FeatureStrip />

                {/* Curated Combos */}
                <ComboSection />

                {/* Product Catalog Section */}
                <section className="shop-section" id="catalog-section">
                  <div className="container">
                    <div className="section-head-wrapper">
                      <div className="section-head">
                        <h2>{t("nav_products")}</h2>
                        <p>Direct supply white phenyl, toilet acids, mothballs, bleaching powders, brooms, mops &amp; scrubbers.</p>
                      </div>

                      <div style={{ fontSize: "0.84rem", color: "#64748b", fontWeight: "600" }}>
                        Showing {filteredProducts.length} items
                      </div>
                    </div>

                    {/* Dynamic Category Filter Chips */}
                    <CategoryNav
                      activeCategory={activeCategory}
                      onSelectCategory={handleCategoryChange}
                    />

                    {/* Product Grid with Skeleton Loading Shimmer & Micro-Animations */}
                    {loading ? (
                      <div className="products-grid">
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                          <ProductSkeletonCard key={idx} />
                        ))}
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "50px 20px",
                          background: "#fff",
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0"
                        }}
                      >
                        <IconSearch size={40} style={{ color: "#94a3b8", margin: "0 auto 10px" }} />
                        <h3 style={{ fontSize: "1.2rem", color: "#1e293b", marginBottom: "6px" }}>
                          No matching cleaning products
                        </h3>
                        <p style={{ color: "#64748b", fontSize: "0.88rem", marginBottom: "16px" }}>
                          We couldn&apos;t find any items matching &quot;{searchQuery}&quot;.
                        </p>
                        <button
                          className="btn-outline"
                          onClick={() => {
                            setSearchQuery("");
                            setActiveCategory("all");
                          }}
                        >
                          Clear Filters &amp; View All
                        </button>
                      </div>
                    ) : (
                      <div className="products-grid fade-in-grid">
                        {filteredProducts.map((prod) => (
                          <ProductCard
                            key={prod.id}
                            product={prod}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                {/* Educational: Why Proper Cleaning Matters & Quality Comparison */}
                <WhyCleaningMatters />

                {/* Social Proof: Real Customer Testimonials & Founder Trust Guarantee */}
                <TrustAndTestimonials />
              </>
            )}
          </main>

          {/* Cart Drawer Bottom-Sheet */}
          <CartDrawer />

          {/* Checkout & Delivery Address Modal */}
          <CheckoutModal />

          {/* Order Ticket & Success Modal */}
          <OrderSuccessModal />

          {/* Track Order Lookup Modal (for modal triggers) */}
          <TrackOrderModal />

          {/* Quick View Details Modal */}
          <ProductDetailModal />

          {/* Toast Notifications */}
          <Toast />

          {/* Floating WhatsApp Action Button */}
          <FloatingWhatsApp />

          {/* Footer */}
          <Footer />

          {/* Sticky Mobile Bottom Navigation & Floating Cart Bar */}
          <MobileBottomNav />
        </>
      )}

      {/* Admin Demo Login & Customer Modal */}
      <AuthModal />
    </>
  );
}
