"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";

export default function ProductCard({ product, onEditClick }) {
  const { addToCart, setActiveProductModal } = useStore();
  const [qty, setQty] = useState(1);

  const savings = Math.max(0, product.mrp - product.price);

  const handleDecrease = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleIncrease = () => {
    setQty(qty + 1);
  };

  const handleAdd = () => {
    addToCart(product, qty);
    setQty(1);
  };

  const badgeClass = (product.badge || "").toLowerCase().replace(/\s+/g, "-");

  return (
    <article className="product-card">
      <div className="product-media-wrapper">
        <img src={product.image} alt={product.name} loading="lazy" />

        {product.badge && (
          <span className={`product-badge-float ${badgeClass}`}>
            {product.badge}
          </span>
        )}

        {/* Quick View Button */}
        <button
          className="product-quick-view-btn"
          onClick={() => setActiveProductModal(product)}
          title="Quick view product details"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      <div className="product-body">
        <div className="product-category-row">
          <span className="product-category-tag">{product.categoryName}</span>
          <span className="product-unit-text">{product.unit}</span>
        </div>

        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        {product.potency && (
          <div className="product-potency-spec">
            <span>🛡️</span>
            <span>{product.potency}</span>
          </div>
        )}

        <p className="product-desc-snippet">{product.description}</p>

        <div className="product-footer">
          <div className="product-price-row">
            <span className="product-curr-price">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="product-mrp-price">₹{product.mrp}</span>
            )}
            {savings > 0 && (
              <span className="product-save-badge">Save ₹{savings}</span>
            )}
          </div>

          <div className="product-actions-row">
            <div className="qty-counter">
              <button className="qty-btn" onClick={handleDecrease} title="Decrease quantity">
                -
              </button>
              <span className="qty-display">{qty}</span>
              <button className="qty-btn" onClick={handleIncrease} title="Increase quantity">
                +
              </button>
            </div>

            <button className="btn-add-cart" onClick={handleAdd}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
