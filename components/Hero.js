"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  IconShoppingBag,
  IconWhatsApp,
  IconCheck,
  IconTruck,
  IconStore,
  IconSparkles,
  IconX,
  IconNavigation
} from "./Icons";

export default function Hero() {
  const { settings, setCatalogMode, t } = useStore();
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
  const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;

  if (dismissed) return null;

  return (
    <section className="suggestion-hero-section">
      <div className="container">
        {/* Compact Mobile Suggestion Strip (Non-intrusive, clean & clear) */}
        <div className="mobile-suggestion-card">
          <div className="suggestion-main-row">
            <div className="suggestion-icon-wrap">
              <IconSparkles size={16} style={{ color: "#0f766e" }} />
            </div>

            <div className="suggestion-text-wrap" onClick={() => setExpanded(!expanded)}>
              <div className="suggestion-badge-row">
                <span className="suggestion-pill-tag">Quick Suggestion</span>
                <span className="suggestion-tap-hint">{expanded ? "Hide Info" : "Tap for details"}</span>
              </div>
              <p className="suggestion-title">
                Free Delivery on ₹500+ • Direct Pine Phenyl, Descaling Acids &amp; Brooms
              </p>
            </div>

            <button
              className="suggestion-dismiss-btn"
              onClick={() => setDismissed(true)}
              title="Dismiss suggestion"
              aria-label="Dismiss suggestion"
            >
              <IconX size={15} />
            </button>
          </div>

          {/* Expanded Drawer on Mobile when user taps for details */}
          {expanded && (
            <div className="suggestion-expanded-content">
              <div className="suggestion-chips-grid">
                <div className="suggestion-chip">
                  <IconTruck size={14} style={{ color: "#16a34a" }} />
                  <span>Free Home Delivery ₹500+</span>
                </div>
                <div
                  className="suggestion-chip clickable"
                  onClick={() => setCatalogMode("directions")}
                >
                  <IconNavigation size={14} style={{ color: "#0f766e" }} />
                  <span>Depot Pickup (Get Maps Pin)</span>
                </div>
                <div className="suggestion-chip">
                  <IconCheck size={14} style={{ color: "#0f766e" }} />
                  <span>High Pine Oil Germ Kill</span>
                </div>
                <div
                  className="suggestion-chip clickable"
                  onClick={() => {
                    const waUrl = `https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20please%20send%20catalog%20and%20rates.`;
                    window.open(waUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  <IconWhatsApp size={14} style={{ color: "#16a34a" }} />
                  <span>1-Tap WhatsApp Booking</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Polished Hero Banner */}
        <div className="desktop-hero-banner">
          <div className="desktop-hero-left">
            <div className="desktop-hero-badge">
              <span className="dot"></span>
              <span>Direct Manufacturer Supply • {settings.storeName}</span>
            </div>

            <h2>Direct Cleaning Chemicals &amp; Household Essentials</h2>
            <p>
              High-potency concentrated white phenyl, bathroom descaling acid, naphthalene mothballs, bleaching powders, brooms, and mops.
            </p>

            <div className="desktop-hero-pills">
              <span><IconTruck size={14} /> Free Delivery on ₹{settings.deliveryMinimum}+</span>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setCatalogMode("directions")}
              >
                <IconStore size={14} /> Free Store Pickup (Get Directions)
              </span>
              <span><IconCheck size={14} /> Concentrated Formulations</span>
            </div>
          </div>

          <div className="desktop-hero-right">
            <a
              href={`https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20please%20send%20product%20details.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-cta"
            >
              <IconWhatsApp size={17} />
              <span>WhatsApp Instant Order</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
