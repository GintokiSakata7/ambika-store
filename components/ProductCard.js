"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  IconEye,
  IconPlus,
  IconMinus,
  IconShieldCheck,
  IconCheck,
  IconWhatsApp
} from "./Icons";

export default function ProductCard({ product }) {
  const { addToCart, setActiveProductModal, cart, settings, t } = useStore();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = cart.find((item) => item.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const savings = Math.max(0, product.mrp - product.price);

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (qty > 1) setQty(qty - 1);
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    setQty(qty + 1);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, qty);
    setJustAdded(true);
    setQty(1);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleDirectWhatsApp = (e) => {
    e.stopPropagation();
    const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
    const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;

    const msg = `Hi ${settings.storeName}, I want to order:\n` +
      `Product: ${product.name}\n` +
      `Unit: ${product.unit}\n` +
      `Qty: ${qty}\n` +
      `Price: Rs. ${product.price * qty}\n\n` +
      `Please confirm delivery / store pickup readiness. Thank you!`;

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const badgeClass = (product.badge || "").toLowerCase().replace(/\s+/g, "-");

  return (
    <article className={`product-card ${cartQty > 0 ? "in-cart" : ""}`}>
      {/* Product Image & Badges */}
      <div className="product-media-wrapper" onClick={() => setActiveProductModal(product)} style={{ cursor: "pointer" }}>
        <img src={product.image} alt={product.name} loading="lazy" />

        {product.badge && (
          <span className={`product-badge-float ${badgeClass}`}>
            {product.badge}
          </span>
        )}

        {cartQty > 0 && (
          <span className="cart-qty-indicator" title="Items in your cart">
            {cartQty} in cart
          </span>
        )}

        {/* Quick View Button */}
        <button
          className="product-quick-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            setActiveProductModal(product);
          }}
          title="Quick view product details"
          aria-label="View details"
        >
          <IconEye size={15} />
        </button>
      </div>

      {/* Product Information */}
      <div className="product-body">
        <div className="product-category-row">
          <span className="product-category-tag">{product.categoryName}</span>
          <span className="product-unit-text">{product.unit}</span>
        </div>

        <h3
          className="product-title"
          title={product.name}
          onClick={() => setActiveProductModal(product)}
          style={{ cursor: "pointer" }}
        >
          {product.name}
        </h3>

        {product.potency && (
          <div className="product-potency-spec">
            <IconShieldCheck size={13} style={{ color: "#0f766e" }} />
            <span>{product.potency}</span>
          </div>
        )}

        {/* Price Row */}
        <div className="product-footer">
          <div className="product-price-row">
            <span className="product-curr-price">Rs. {product.price}</span>
            {product.mrp > product.price && (
              <span className="product-mrp-price">Rs. {product.mrp}</span>
            )}
            {savings > 0 && (
              <span className="product-save-badge">Save Rs. {savings}</span>
            )}
          </div>

          {/* Quantity Counter & Two Actions: 1-Tap WhatsApp + Add to Cart */}
          <div className="product-actions-cluster">
            {/* Quantity Stepper */}
            <div className="qty-counter small">
              <button
                className="qty-btn"
                onClick={handleDecrease}
                title="Decrease quantity"
                aria-label="Decrease quantity"
              >
                <IconMinus size={10} />
              </button>
              <span className="qty-display">{qty}</span>
              <button
                className="qty-btn"
                onClick={handleIncrease}
                title="Increase quantity"
                aria-label="Increase quantity"
              >
                <IconPlus size={10} />
              </button>
            </div>

            {/* Direct 1-Tap WhatsApp Action */}
            <button
              className="btn-card-wa"
              onClick={handleDirectWhatsApp}
              title="Order on WhatsApp"
              aria-label="Order on WhatsApp"
            >
              <IconWhatsApp size={14} />
              <span>WhatsApp</span>
            </button>

            {/* Add to Cart with tactile confirmation */}
            <button
              className={`btn-add-cart ${justAdded ? "added-pop" : ""}`}
              onClick={handleAdd}
              aria-label="Add to cart"
            >
              {justAdded ? (
                <>
                  <IconCheck size={13} />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <IconPlus size={13} />
                  <span>{t("btn_add")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
