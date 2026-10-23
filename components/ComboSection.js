"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import { IconCheck, IconTruck, IconPlus } from "./Icons";

export default function ComboSection() {
  const { combos, addComboToCart, settings } = useStore();

  return (
    <section className="combos-section" id="combos-section">
      <div className="container">
        <div className="section-head-wrapper">
          <div className="section-head">
            <span className="combo-badge-guarantee">
              Doorstep Delivery Eligible (&gt; ₹{settings.deliveryMinimum})
            </span>
            <h2>Money-Saver Cleaning Bundles</h2>
            <p>
              Complete curated packages for floors, washrooms, and housekeeping utilities that immediately qualify for home delivery.
            </p>
          </div>
        </div>

        <div className="combos-grid">
          {combos.map((combo) => (
            <article key={combo.id} className="combo-card">
              <div className="combo-media">
                <img src={combo.image} alt={combo.name} loading="lazy" />
                <span className="combo-delivery-tag">
                  <IconTruck size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                  Qualifies for Home Delivery
                </span>
              </div>

              <div className="combo-body">
                <h3 className="combo-title">{combo.name}</h3>
                <p className="combo-desc">{combo.description}</p>

                <ul className="combo-includes-list">
                  {combo.items.map((item, idx) => (
                    <li key={idx}>
                      <IconCheck size={14} style={{ color: "#0f766e", flexShrink: 0 }} />
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
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <IconPlus size={15} />
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
