"use client";

import React from "react";
import { useStore } from "../context/StoreContext";

export default function ComboSection() {
  const { combos, addComboToCart, settings } = useStore();

  return (
    <section className="combos-section" id="combos-section">
      <div className="container">
        <div className="section-head-wrapper">
          <div className="section-head">
            <span className="combo-badge-guarantee">
              ✨ Instant Home Delivery Eligible (&gt; ₹{settings.deliveryMinimum})
            </span>
            <h2>Money-Saver Cleaning Bundles</h2>
            <p>
              Hand-picked complete packages covering floors, washrooms, and daily utilities that immediately meet our doorstep delivery threshold.
            </p>
          </div>
        </div>

        <div className="combos-grid">
          {combos.map((combo) => (
            <article key={combo.id} className="combo-card">
              <div className="combo-media">
                <img src={combo.image} alt={combo.name} loading="lazy" />
                <span className="combo-delivery-tag">
                  🚚 Qualifies for Home Delivery
                </span>
              </div>

              <div className="combo-body">
                <h3 className="combo-title">{combo.name}</h3>
                <p className="combo-desc">{combo.description}</p>

                <ul className="combo-includes-list">
                  {combo.items.map((item, idx) => (
                    <li key={idx}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="combo-footer">
                  <div className="combo-price-block">
                    <span className="price">₹{combo.price}</span>
                    <span className="mrp">₹{combo.mrp}</span>
                    <div style={{ fontSize: "0.75rem", color: "#15803d", fontWeight: "700", marginTop: "2px" }}>
                      Save ₹{combo.savings} on Bundle
                    </div>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={() => addComboToCart(combo)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    <span>Add Bundle</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
