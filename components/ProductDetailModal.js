"use client";

import React from "react";
import { useStore } from "../context/StoreContext";

export default function ProductDetailModal() {
  const {
    activeProductModal,
    setActiveProductModal,
    addToCart,
    settings
  } = useStore();

  if (!activeProductModal) return null;

  const prod = activeProductModal;
  const savings = Math.max(0, prod.mrp - prod.price);

  const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
  const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;

  const handleAddToCart = () => {
    addToCart(prod, 1);
    setActiveProductModal(null);
  };

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveProductModal(null);
      }}
    >
      <div className="modal-window">
        <div className="modal-header">
          <h3 style={{ fontSize: "1.1rem" }}>Product Details</h3>
          <button
            className="btn-close-drawer"
            onClick={() => setActiveProductModal(null)}
            title="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <img
                src={prod.image}
                alt={prod.name}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0"
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#0f766e", fontWeight: "600", marginBottom: "4px" }}>
                {prod.categoryName} • {prod.unit}
              </div>

              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
                {prod.name}
              </h3>

              <div className="product-price-row" style={{ marginBottom: "12px" }}>
                <span className="product-curr-price" style={{ fontSize: "1.4rem" }}>₹{prod.price}</span>
                {prod.mrp > prod.price && (
                  <span className="product-mrp-price" style={{ fontSize: "0.95rem" }}>₹{prod.mrp}</span>
                )}
                {savings > 0 && (
                  <span className="product-save-badge">Save ₹{savings}</span>
                )}
              </div>

              <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: "1.5", marginBottom: "12px" }}>
                {prod.description}
              </p>

              {prod.usage && (
                <div
                  style={{
                    background: "#f0fdfa",
                    borderLeft: "3px solid #0f766e",
                    padding: "8px 12px",
                    borderRadius: "0 6px 6px 0",
                    fontSize: "0.78rem",
                    color: "#0f766e",
                    marginBottom: "14px"
                  }}
                >
                  <strong>Usage Instructions:</strong>
                  <div>{prod.usage}</div>
                </div>
              )}

              {prod.features && prod.features.length > 0 && (
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px" }}>
                  {prod.features.map((f, i) => (
                    <li key={i} style={{ fontSize: "0.8rem", color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ color: "#0f766e", fontWeight: "bold" }}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn-primary"
                  onClick={handleAddToCart}
                  style={{ flex: 1 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span>Add to Cart (₹{prod.price})</span>
                </button>

                <a
                  href={`https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20I%20want%20to%20order%20${encodeURIComponent(prod.name)}%20(${encodeURIComponent(prod.unit)})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-cta"
                  style={{ padding: "10px 14px", fontSize: "0.84rem" }}
                  title="Direct WhatsApp Inquiry"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
