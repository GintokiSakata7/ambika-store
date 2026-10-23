"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "../context/StoreContext";

import Header from "../components/Header";
import Hero from "../components/Hero";
import FeatureStrip from "../components/FeatureStrip";
import ComboSection from "../components/ComboSection";
import CategoryNav from "../components/CategoryNav";
import ProductCard from "../components/ProductCard";
import WholesaleSection from "../components/WholesaleSection";
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
import { IconSearch } from "../components/Icons";

export default function HomePage() {
  const { products, currentRole, catalogMode, t } = useStore();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <>
      {/* Conditionally Render Based on Current Role */}
      {currentRole === "admin" ? (
        /* Dedicated Store Admin Dashboard (Edit products, Add/Remove Categories, Orders) */
        <AdminDashboard />
      ) : (
        /* Clean Customer Storefront (Only browse catalog, view details, and book via WhatsApp) */
        <>
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <main>
            {/* Show Wholesale Section if Wholesale Mode is active */}
            {catalogMode === "wholesale" ? (
              <WholesaleSection />
            ) : (
              <>
                {/* Hero Section */}
                <Hero />

                {/* Value Proposition Strip */}
                <FeatureStrip />

                {/* Curated Combos */}
                <ComboSection />

                {/* Product Catalog Section */}
                <section className="shop-section" id="catalog-section">
                  <div className="container">
                    <div className="section-head-wrapper">
                      <div className="section-head">
                        <h2>{t("nav_products")}</h2>
                        <p>Direct supply white phenyl, toilet acids, mothballs, bleaching powders, brooms, mops & scrubbers.</p>
                      </div>

                      <div style={{ fontSize: "0.86rem", color: "#64748b", fontWeight: "600" }}>
                        Showing {filteredProducts.length} items
                      </div>
                    </div>

                    {/* Dynamic Category Filter Chips */}
                    <CategoryNav
                      activeCategory={activeCategory}
                      onSelectCategory={setActiveCategory}
                    />

                    {/* Product Grid - Customer View (Only View & Book) */}
                    {filteredProducts.length === 0 ? (
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
                          Clear Filters & View All
                        </button>
                      </div>
                    ) : (
                      <div className="products-grid">
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
              </>
            )}
          </main>

          {/* Cart Drawer */}
          <CartDrawer />

          {/* Checkout & Delivery Address Modal */}
          <CheckoutModal />

          {/* Order Ticket & Success Modal */}
          <OrderSuccessModal />

          {/* Track Order Lookup Modal */}
          <TrackOrderModal />

          {/* Quick View Details Modal */}
          <ProductDetailModal />

          {/* Toast Notifications */}
          <Toast />

          {/* Floating WhatsApp Action Button */}
          <FloatingWhatsApp />

          {/* Footer */}
          <Footer />
        </>
      )}

      {/* Admin Demo Login & Customer Modal */}
      <AuthModal />
    </>
  );
}
