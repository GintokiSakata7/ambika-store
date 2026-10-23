"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import { IconShoppingBag, IconWhatsApp, IconCheck, IconTruck } from "./Icons";

export default function Hero() {
  const { settings } = useStore();

  const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
  const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-pill">
            <span className="dot"></span>
            <span>Commercial &amp; Domestic Supplies • {settings.companyName}</span>
          </div>

          <h2 className="hero-title">
            Professional Cleaning Chemicals &amp; Housekeeping Essentials
          </h2>

          <p className="hero-description">
            Concentrated white phenyl, safe bathroom acids, pure naphthalene mothballs, chlorine bleaching powder, soft grass brooms, mops, and heavy-duty scrubbers direct to your doorstep.
          </p>

          <div className="hero-bullets">
            <div className="bullet-item">
              <IconCheck size={16} className="bullet-icon" />
              <span>High Active Pine White Phenyl</span>
            </div>
            <div className="bullet-item">
              <IconCheck size={16} className="bullet-icon" />
              <span>Doorstep Delivery (Orders &gt; ₹{settings.deliveryMinimum})</span>
            </div>
            <div className="bullet-item">
              <IconCheck size={16} className="bullet-icon" />
              <span>Safe-Grade Bathroom &amp; Tile Acids</span>
            </div>
            <div className="bullet-item">
              <IconCheck size={16} className="bullet-icon" />
              <span>Instant WhatsApp Order Booking</span>
            </div>
          </div>

          <div className="hero-cta-group">
            <a href="#catalog-section" className="btn-primary">
              <IconShoppingBag size={17} />
              <span>Explore Products</span>
            </a>
            <a
              href={`https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20please%20send%20the%20latest%20price%20list%20and%20delivery%20details.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-cta"
            >
              <IconWhatsApp size={17} />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img
            src="/images/hero.jpg"
            alt="Majin Studios - House Cleaning Supplies & Chemicals"
          />
          <div className="hero-floating-badge">
            <div className="floating-badge-text">
              <h4>{settings.storeName}</h4>
              <p>Direct wholesale &amp; retail supply depot</p>
            </div>
            <span className="delivery-condition-chip">
              <IconTruck size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "5px" }} />
              Delivery &gt; ₹{settings.deliveryMinimum}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
