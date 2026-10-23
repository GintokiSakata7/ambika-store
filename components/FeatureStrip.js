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
            <h4>Commercial Formulations</h4>
            <p>High-potency disinfectant phenyl, safe-grade toilet acids, and pure mothballs.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box">
            <IconTruck size={20} />
          </div>
          <div className="feature-info">
            <h4>Doorstep Delivery &gt; ₹{settings.deliveryMinimum}</h4>
            <p>Fast local dispatch with instant live WhatsApp confirmation & address routing.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box">
            <IconShieldCheck size={20} />
          </div>
          <div className="feature-info">
            <h4>Sealed & Leak-Proof</h4>
            <p>Child-resistant safety caps and industrial grade bottles for acids and chemicals.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box">
            <IconWhatsApp size={20} />
          </div>
          <div className="feature-info">
            <h4>Direct WhatsApp Booking</h4>
            <p>Zero friction. Select items, enter delivery address, and dispatch order instantly.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
