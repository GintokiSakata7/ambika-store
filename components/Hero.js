"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import { IconShoppingBag, IconWhatsApp, IconCheck, IconTruck, IconStore } from "./Icons";

export default function Hero() {
  const { settings, t } = useStore();

  const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
  const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-pill">
            <span className="dot"></span>
            <span>Direct Manufacturer Supply • {settings.storeName}</span>
          </div>

          <h2 className="hero-title">
            Direct Cleaning Chemicals &amp; Essentials
          </h2>

          <p className="hero-description" style={{ fontSize: "0.95rem", color: "#64748b", margin: "0 0 16px" }}>
            High-potency white phenyl, safe bathroom descaling acids, pure mothballs, bleaching powders, brooms and mops.
          </p>

          <div className="hero-bullets" style={{ marginBottom: "20px" }}>
            <div className="bullet-item">
              <IconTruck size={16} className="bullet-icon" />
              <span>Free Delivery on ₹{settings.deliveryMinimum}+</span>
            </div>
            <div className="bullet-item">
              <IconStore size={16} className="bullet-icon" />
              <span>Store Pickup (100% Free)</span>
            </div>
            <div className="bullet-item">
              <IconCheck size={16} className="bullet-icon" />
              <span>Concentrated Pine Formulations</span>
            </div>
            <div className="bullet-item">
              <IconWhatsApp size={16} className="bullet-icon" />
              <span>1-Tap WhatsApp Booking</span>
            </div>
          </div>

          <div className="hero-cta-group">
            <a href="#catalog-section" className="btn-primary">
              <IconShoppingBag size={17} />
              <span>{t("nav_products")}</span>
            </a>
            <a
              href={`https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20please%20send%20product%20details.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-cta"
            >
              <IconWhatsApp size={17} />
              <span>WhatsApp Order</span>
            </a>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img
            src="/images/hero.jpg"
            alt="Majin Studios - Cleaning Supplies"
            loading="lazy"
          />
          <div className="hero-floating-badge">
            <div className="floating-badge-text">
              <h4>{settings.storeName}</h4>
              <p>Direct supply depot</p>
            </div>
            <span className="delivery-condition-chip">
              <IconTruck size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
              Delivery &gt; ₹{settings.deliveryMinimum}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
