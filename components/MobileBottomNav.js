"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import {
  IconGrid,
  IconBuilding,
  IconHistory,
  IconShoppingBag,
  IconArrowRight,
  IconGlobe
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
    lang,
    setLang,
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
              <span>View Cart &amp; Book</span>
              <IconArrowRight size={15} />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar for Mobile */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
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

        <button
          className={`nav-tab-item ${catalogMode === "wholesale" ? "active" : ""}`}
          onClick={() => {
            setCatalogMode("wholesale");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <IconBuilding size={18} />
          <span>{t("nav_wholesale")}</span>
        </button>

        <button
          className="nav-tab-item"
          onClick={() => setIsTrackOrderOpen(true)}
        >
          <IconHistory size={18} />
          <span>{t("nav_track")}</span>
        </button>

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
