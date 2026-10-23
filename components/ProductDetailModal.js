"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import { IconCheck, IconX, IconPlus, IconWhatsApp, IconSparkles } from "./Icons";

export default function ProductDetailModal() {
  const {
    activeProductModal,
    setActiveProductModal,
    addToCart,
    getRecommendations,
    settings,
    t
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

  const recommendedItems = getRecommendations(prod.id, 2);

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
            <IconX size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="product-detail-grid">
            <div>
              <img
                src={prod.image}
                alt={prod.name}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  borderRadius: "8px",
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
                <span className="product-curr-price" style={{ fontSize: "1.4rem" }}>Rs. {prod.price}</span>
                {prod.mrp > prod.price && (
                  <span className="product-mrp-price" style={{ fontSize: "0.95rem" }}>Rs. {prod.mrp}</span>
                )}
                {savings > 0 && (
                  <span className="product-save-badge">Save Rs. {savings}</span>
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
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px", padding: 0 }}>
                  {prod.features.map((f, i) => (
                    <li key={i} style={{ fontSize: "0.8rem", color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                      <IconCheck size={14} style={{ color: "#0f766e" }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <button
                  className="btn-primary"
                  onClick={handleAddToCart}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <IconPlus size={16} />
                  <span>Add to Cart (Rs. {prod.price})</span>
                </button>

                <a
                  href={`https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20I%20want%20to%20order%20${encodeURIComponent(prod.name)}%20(${encodeURIComponent(prod.unit)})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-cta"
                  style={{ padding: "10px 14px", fontSize: "0.84rem", display: "flex", alignItems: "center", gap: "6px" }}
                  title="Direct WhatsApp Inquiry"
                >
                  <IconWhatsApp size={16} />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Frequently Bought Together recommendation in modal */}
              {recommendedItems.length > 0 && (
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                    <IconSparkles size={13} style={{ color: "#0f766e" }} />
                    <span>Frequently paired with:</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {recommendedItems.map((r) => (
                      <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "6px 10px", borderRadius: "6px", fontSize: "0.78rem" }}>
                        <span style={{ color: "#1e293b", fontWeight: 500 }}>{r.name} - Rs. {r.price}</span>
                        <button
                          onClick={() => addToCart(r, 1)}
                          className="btn-outline"
                          style={{ padding: "2px 8px", fontSize: "0.72rem" }}
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
