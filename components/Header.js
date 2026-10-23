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
  IconBuilding,
  IconNavigation,
  IconMapPin
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
      {/* Desktop Top Bar */}
      <aside className="top-bar desktop-only-bar" aria-label="Store announcement">
        <div className="container top-bar-content">
          <div className="top-bar-notice">
            <span className="badge-tag">Direct Depot</span>
            <button
              onClick={() => setCatalogMode("directions")}
              style={{
                background: "none",
                border: "none",
                color: "#e2e8f0",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.78rem"
              }}
            >
              <IconMapPin size={13} style={{ color: "#4ade80" }} />
              <span>Main Market Depot • Open Now (Get Directions &rarr;)</span>
            </button>
          </div>

          <div className="top-bar-actions">
            {/* Language Selector */}
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
                title="తెలుగు"
              >
                తెలుగు
              </button>
              <span className="lang-sep">|</span>
              <button
                className={`lang-btn ${lang === "hi" ? "active" : ""}`}
                onClick={() => setLang("hi")}
                title="हिंदी"
              >
                हिंदी
              </button>
            </div>

            <a
              href={`https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20I%20have%20an%20inquiry.`}
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
          {/* Brand Logo & Name */}
          <div
            className="brand-wrapper"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setCurrentRole("customer");
              setCatalogMode("retail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="brand-logo-icon">
              <IconSparkles size={18} />
            </div>
            <div className="brand-text">
              <h1>{settings.storeName}</h1>
              <div className="brand-subtitle">
                Cleaning Chemicals Depot
              </div>
            </div>
          </div>

          {/* Desktop Search Input */}
          <div className="header-search desktop-only-search">
            <div className="search-input-wrapper">
              <IconSearch size={15} className="search-icon" />
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
                  <IconX size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Header Actions */}
          <div className="header-actions desktop-only-actions">
            {/* Mode Switcher */}
            <div className="mode-toggle-pill">
              <button
                className={`mode-btn ${catalogMode === "retail" ? "active" : ""}`}
                onClick={() => setCatalogMode("retail")}
                title="Retail Products"
              >
                Retail
              </button>
              <button
                className={`mode-btn ${catalogMode === "wholesale" ? "active" : ""}`}
                onClick={() => setCatalogMode("wholesale")}
                title="Wholesale Supply"
              >
                <IconBuilding size={12} style={{ marginRight: "3px" }} />
                Wholesale
              </button>
            </div>

            {/* Directions Link */}
            <button
              onClick={() => setCatalogMode("directions")}
              className={`btn-track-header ${catalogMode === "directions" ? "active" : ""}`}
              title="Store Location & Directions in Maps"
            >
              <IconNavigation size={13} />
              <span>Directions</span>
            </button>

            {/* Track Order */}
            <button
              onClick={() => setCatalogMode("track")}
              className={`btn-track-header ${catalogMode === "track" ? "active" : ""}`}
              title="Track order status"
            >
              <IconHistory size={13} />
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
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={openAdminLogin}
                className="btn-admin-header"
                title="Store Admin Login"
              >
                <IconLock size={13} />
                <span>Admin</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              className="cart-button-trigger"
              onClick={() => setIsCartOpen(true)}
              title="Open shopping cart"
            >
              <IconShoppingBag size={17} />
              <span className="cart-badge">{totalItems}</span>
              <span className="cart-subtotal-pill">Rs. {subtotal}</span>
            </button>
          </div>

          {/* Mobile Right Bar: Clean & Compact (Directions + Lang + Admin) */}
          <div className="mobile-header-actions">
            {/* Direct Google Maps Navigation Button */}
            <button
              onClick={() => setCatalogMode("directions")}
              className={`mobile-header-icon-btn ${catalogMode === "directions" ? "active" : ""}`}
              title="Get Directions in Maps"
              aria-label="Store Directions"
            >
              <IconNavigation size={16} />
              <span className="mobile-btn-label">Maps</span>
            </button>

            {/* Compact Lang Switcher for mobile */}
            <div className="mobile-lang-chip">
              <button
                className={lang === "en" ? "active" : ""}
                onClick={() => setLang("en")}
              >
                EN
              </button>
              <button
                className={lang === "te" ? "active" : ""}
                onClick={() => setLang("te")}
              >
                తె
              </button>
              <button
                className={lang === "hi" ? "active" : ""}
                onClick={() => setLang("hi")}
              >
                हि
              </button>
            </div>

            {/* Admin Key */}
            <button
              onClick={openAdminLogin}
              className="mobile-header-icon-btn"
              title="Admin Login"
              aria-label="Admin Login"
            >
              <IconLock size={15} />
            </button>
          </div>
        </div>

        {/* Mobile Dedicated Search Bar (Clean and prominent, app-style) */}
        <div className="mobile-search-bar-row">
          <div className="search-input-wrapper">
            <IconSearch size={15} className="search-icon" />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (catalogMode !== "retail") setCatalogMode("retail");
              }}
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
      </header>
    </>
  );
}
