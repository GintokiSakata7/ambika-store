"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import {
  IconTruck,
  IconWhatsApp,
  IconLock,
  IconShield,
  IconShoppingBag,
  IconSearch,
  IconX,
  IconSparkles,
  IconGlobe,
  IconHistory,
  IconBuilding
} from "./Icons";

export default function Header({ searchQuery, setSearchQuery }) {
  const {
    settings,
    totalItems,
    subtotal,
    currentRole,
    setCurrentRole,
    currentUser,
    openAdminLogin,
    logout,
    setIsCartOpen,
    setIsTrackOrderOpen,
    lang,
    setLang,
    catalogMode,
    setCatalogMode,
    t
  } = useStore();

  const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
  const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;

  return (
    <>
      {/* Clean Top Bar with Delivery Notice & Language Switcher */}
      <aside className="top-bar" aria-label="Store announcement">
        <div className="container top-bar-content">
          <div className="top-bar-notice">
            <span className="badge-tag">Direct Supply</span>
            <span className="top-bar-notice-text">
              <IconTruck size={14} className="inline-icon" />
              <span>{t("announcement")}</span>
            </span>
          </div>

          <div className="top-bar-actions">
            {/* Language Selector: English, Telugu, Hindi */}
            <div className="lang-switcher">
              <IconGlobe size={13} style={{ color: "#94a3b8" }} />
              <button
                className={`lang-btn ${lang === "en" ? "active" : ""}`}
                onClick={() => setLang("en")}
                title="Switch to English"
              >
                ENG
              </button>
              <span className="lang-sep">|</span>
              <button
                className={`lang-btn ${lang === "te" ? "active" : ""}`}
                onClick={() => setLang("te")}
                title="తెలుగు భాషకు మార్చండి"
              >
                తెలుగు
              </button>
              <span className="lang-sep">|</span>
              <button
                className={`lang-btn ${lang === "hi" ? "active" : ""}`}
                onClick={() => setLang("hi")}
                title="हिंदी में बदलें"
              >
                हिंदी
              </button>
            </div>

            <a
              href={`https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20I%20have%20an%20inquiry%20regarding%20cleaning%20products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="top-link"
              title="Direct WhatsApp Support"
            >
              <IconWhatsApp size={13} />
              <span>WA: {settings.whatsappNumber}</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Sticky Header */}
      <header className="main-header">
        <div className="container nav-container">
          {/* Brand Logo */}
          <div
            className="brand-wrapper"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setCurrentRole("customer");
              setCatalogMode("retail");
            }}
          >
            <div className="brand-logo-icon">
              <IconSparkles size={20} />
            </div>
            <div className="brand-text">
              <h1>{settings.storeName}</h1>
              <div className="brand-subtitle">
                Cleaning Chemicals &amp; Essentials
              </div>
            </div>
          </div>

          {/* Search Input (Customer Mode) */}
          <div className="header-search">
            <div className="search-input-wrapper">
              <IconSearch size={16} className="search-icon" />
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  <IconX size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Header Right Action Buttons */}
          <div className="header-actions">
            {/* Mode Switcher: Retail vs Wholesale */}
            <div className="mode-toggle-pill">
              <button
                className={`mode-btn ${catalogMode === "retail" ? "active" : ""}`}
                onClick={() => setCatalogMode("retail")}
                title="Retail Products for Home & Small Office"
              >
                Retail
              </button>
              <button
                className={`mode-btn ${catalogMode === "wholesale" ? "active" : ""}`}
                onClick={() => setCatalogMode("wholesale")}
                title="Wholesale Supply for Shopkeepers & Bulk Buyers"
              >
                <IconBuilding size={12} style={{ marginRight: "3px" }} />
                Wholesale
              </button>
            </div>

            {/* Track Order Button */}
            <button
              onClick={() => setIsTrackOrderOpen(true)}
              className="btn-track-header"
              title="Track order status by Ticket ID"
            >
              <IconHistory size={14} />
              <span>{t("nav_track")}</span>
            </button>

            {/* Admin Access Button */}
            {currentRole === "admin" ? (
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button
                  onClick={() => setCurrentRole("admin")}
                  className="btn-admin-header active"
                  title="Go to Admin Dashboard"
                >
                  <IconShield size={14} />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={logout}
                  className="btn-link-subtle"
                  title="Sign out of Admin mode"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={openAdminLogin}
                className="btn-admin-header"
                title="Store Owner & Demo Admin Login"
              >
                <IconLock size={14} />
                <span>Admin</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              className="cart-button-trigger"
              onClick={() => setIsCartOpen(true)}
              title="Open shopping cart"
            >
              <IconShoppingBag size={18} />
              <span className="cart-badge">{totalItems}</span>
              <span className="cart-subtotal-pill">Rs. {subtotal}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
