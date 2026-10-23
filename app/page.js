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
import AdminModal from "../components/AdminModal";
import ProductDetailModal from "../components/ProductDetailModal";
import Toast from "../components/Toast";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import Footer from "../components/Footer";

export default function HomePage() {
  const { products, setIsAdminOpen } = useStore();

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
      {/* Header */}
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

      {/* Admin Demo Modal */}
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
  );
}
