"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import { IconFlask, IconTruck, IconShieldCheck, IconWhatsApp } from "./Icons";

export default function FeatureStrip() {
  const { settings } = useStore();

  return (
    <section className="features-section">
      <div className="container features-grid">
        <div className="feature-card">
          <div className="feature-icon-box">
            <IconFlask size={20} />
          </div>
          <div className="feature-info">
            <h4>Commercial Grade</h4>
            <p>Concentrated pine phenyl, toilet acid &amp; mothballs.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box">
            <IconTruck size={20} />
          </div>
          <div className="feature-info">
            <h4>Free Delivery &gt; ₹{settings.deliveryMinimum}</h4>
            <p>Free home delivery above ₹500 or free store pickup.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box">
            <IconShieldCheck size={20} />
          </div>
          <div className="feature-info">
            <h4>Leak-Proof Packing</h4>
            <p>Sealed containers with safety caps.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box">
            <IconWhatsApp size={20} />
          </div>
          <div className="feature-info">
            <h4>1-Tap WhatsApp</h4>
            <p>Quick booking with Ticket ID &amp; live tracking.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
