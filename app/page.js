"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "../context/StoreContext";

import Header from "../components/Header";
import Hero from "../components/Hero";
import FeatureStrip from "../components/FeatureStrip";
import ComboSection from "../components/ComboSection";
import CategoryNav from "../components/CategoryNav";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import AdminDashboard from "../components/AdminDashboard";
import AdminModal from "../components/AdminModal";
import ProductDetailModal from "../components/ProductDetailModal";
import Toast from "../components/Toast";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import Footer from "../components/Footer";

export default function HomePage() {
  const { products, currentRole, setCurrentRole, setIsAdminOpen } = useStore();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCat = activeCategory === "all" || prod.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        prod.name.toLowerCase().includes(q) ||
        prod.categoryName.toLowerCase().includes(q) ||
        (prod.description && prod.description.toLowerCase().includes(q)) ||
        (prod.potency && prod.potency.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const handleOpenEditForProduct = (product) => {
    setEditingProductId(product.id);
    setIsAdminOpen(true);
  };

  return (
    <>
      {/* Role Switcher Bar - Prominent Demo Control */}
      <div className="demo-role-banner">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem" }}>
            <span style={{ fontWeight: "700", color: "#0f172a" }}>Majin Studios Demo:</span>
            <span style={{ color: "#475569" }}>
              Currently viewing as <strong>{currentRole === "admin" ? "🛡️ Store Owner (Admin View)" : "👤 Online Shopper (Customer View)"}</strong>
            </span>
          </div>

          <div className="role-switch-pill">
            <button
              className={`role-pill-btn ${currentRole === "customer" ? "active" : ""}`}
              onClick={() => setCurrentRole("customer")}
            >
              👤 Customer Store
            </button>
            <button
              className={`role-pill-btn ${currentRole === "admin" ? "active" : ""}`}
              onClick={() => setCurrentRole("admin")}
            >
              🛡️ Demo Admin Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Conditionally Render Based on Current Role */}
      {currentRole === "admin" ? (
        /* Dedicated Store Admin Dashboard */
        <AdminDashboard />
      ) : (
        /* Customer-Facing Storefront */
        <>
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <main>
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
                    <h2>House Cleaning Essentials</h2>
                    <p>Concentrated phenyl, toilet acids, mothballs, bleaching powders, brooms, mops & scrubbers.</p>
                  </div>

                  <div style={{ fontSize: "0.86rem", color: "#64748b", fontWeight: "600" }}>
                    Showing {filteredProducts.length} items
                  </div>
                </div>

                {/* Category Filter Chips */}
                <CategoryNav
                  activeCategory={activeCategory}
                  onSelectCategory={setActiveCategory}
                />

                {/* Product Grid */}
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
                    <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🔍</div>
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
                        onEditClick={handleOpenEditForProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </main>

          {/* Cart Drawer */}
          <CartDrawer />

          {/* Checkout & Delivery Address Modal */}
          <CheckoutModal />

          {/* Quick Edit Modal */}
          <AdminModal
            initialEditingProductId={editingProductId}
            onClearInitialEdit={() => setEditingProductId(null)}
          />

          {/* Quick View Modal */}
          <ProductDetailModal />

          {/* Toast Notifications */}
          <Toast />

          {/* Floating WhatsApp Action Button */}
          <FloatingWhatsApp />

          {/* Footer */}
          <Footer />
        </>
      )}

      {/* Floating Demo Mode Switcher Pill */}
      <aside className="floating-mode-pill">
        <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#475569" }}>Demo Mode:</span>
        <button
          onClick={() => setCurrentRole(currentRole === "customer" ? "admin" : "customer")}
          className="btn-floating-role-toggle"
        >
          {currentRole === "customer" ? "Switch to 🛡️ Admin View" : "Switch to 👤 Customer View"}
        </button>
      </aside>
    </>
  );
}
