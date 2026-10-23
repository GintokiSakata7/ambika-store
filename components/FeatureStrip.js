"use client";

import React from "react";
import { useStore } from "../context/StoreContext";

export default function FeatureStrip() {
  const { settings } = useStore();

  return (
    <section className="features-section">
      <div className="container features-grid">
        <div className="feature-card">
          <div className="feature-icon-box">🧪</div>
          <div className="feature-info">
            <h4>Commercial Formulations</h4>
            <p>High-potency germ-kill liquids, stable chlorine bleach, and pure mothballs.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box">🚚</div>
          <div className="feature-info">
            <h4>Doorstep Delivery &gt; ₹{settings.deliveryMinimum}</h4>
            <p>Fast local dispatch with instant live WhatsApp confirmation & address tracking.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box">🔒</div>
          <div className="feature-info">
            <h4>Sealed & Leak-Proof</h4>
            <p>Child-resistant safety caps and industrial grade bottles for acids and chemicals.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box">💬</div>
          <div className="feature-info">
            <h4>Direct WhatsApp Order</h4>
            <p>No passwords required. Choose your items, enter delivery address, and tap send.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
