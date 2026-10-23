"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import {
  IconGrid,
  IconBuilding,
  IconNavigation,
  IconHistory,
  IconShoppingBag,
  IconArrowRight
} from "./Icons";

export default function MobileBottomNav() {
  const {
    catalogMode,
    setCatalogMode,
    setIsTrackOrderOpen,
    setIsCartOpen,
    totalItems,
    subtotal,
    currentRole,
    t
  } = useStore();

  if (currentRole === "admin") return null;

  return (
    <>
      {/* Floating Quick Checkout Bar when cart has items (Mobile Only) */}
      {totalItems > 0 && (
        <div className="mobile-floating-cart-pill" onClick={() => setIsCartOpen(true)}>
          <div className="cart-pill-content">
            <div className="cart-pill-left">
              <span className="cart-pill-count">{totalItems} items</span>
              <span className="cart-pill-divider">•</span>
              <span className="cart-pill-total">Rs. {subtotal}</span>
            </div>
            <div className="cart-pill-right">
              <span>{t("btn_checkout")}</span>
              <IconArrowRight size={15} />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar for Mobile (App Interface) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile App Navigation">
        {/* Tab 1: Products */}
        <button
          className={`nav-tab-item ${catalogMode === "retail" ? "active" : ""}`}
          onClick={() => {
            setCatalogMode("retail");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <IconGrid size={18} />
          <span>{t("nav_products")}</span>
        </button>

        {/* Tab 2: Wholesale */}
        <button
          className={`nav-tab-item ${catalogMode === "wholesale" ? "active" : ""}`}
          onClick={() => {
            setCatalogMode("wholesale");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <IconBuilding size={18} />
          <span>Wholesale</span>
        </button>

        {/* Tab 3: Store Depot & Maps Directions */}
        <button
          className={`nav-tab-item ${catalogMode === "directions" ? "active" : ""}`}
          onClick={() => {
            setCatalogMode("directions");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <IconNavigation size={18} />
          <span>Directions</span>
        </button>

        {/* Tab 4: Track Order */}
        <button
          className={`nav-tab-item ${catalogMode === "track" ? "active" : ""}`}
          onClick={() => {
            setCatalogMode("track");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <IconHistory size={18} />
          <span>{t("nav_track")}</span>
        </button>

        {/* Tab 5: Cart */}
        <button
          className="nav-tab-item cart-tab"
          onClick={() => setIsCartOpen(true)}
        >
          <div className="nav-tab-icon-wrap">
            <IconShoppingBag size={18} />
            {totalItems > 0 && <span className="nav-tab-badge">{totalItems}</span>}
          </div>
          <span>{t("nav_cart")}</span>
        </button>
      </nav>
    </>
  );
}
