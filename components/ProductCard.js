"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { IconEye, IconPlus, IconMinus, IconShieldCheck, IconCheck } from "./Icons";

export default function ProductCard({ product }) {
  const { addToCart, setActiveProductModal, cart, t } = useStore();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = cart.find((item) => item.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const savings = Math.max(0, product.mrp - product.price);

  const handleDecrease = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleIncrease = () => {
    setQty(qty + 1);
  };

  const handleAdd = () => {
    addToCart(product, qty);
    setJustAdded(true);
    setQty(1);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const badgeClass = (product.badge || "").toLowerCase().replace(/\s+/g, "-");

  return (
    <article className={`product-card ${cartQty > 0 ? "in-cart" : ""}`}>
      <div className="product-media-wrapper">
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
          onClick={() => setActiveProductModal(product)}
          title="Quick view product details"
          aria-label="View details"
        >
          <IconEye size={16} />
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
            <IconShieldCheck size={13} style={{ color: "#0f766e" }} />
            <span>{product.potency}</span>
          </div>
        )}

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

          <div className="product-actions-row">
            <div className="qty-counter">
              <button
                className="qty-btn"
                onClick={handleDecrease}
                title="Decrease quantity"
                aria-label="Decrease quantity"
              >
                <IconMinus size={11} />
              </button>
              <span className="qty-display">{qty}</span>
              <button
                className="qty-btn"
                onClick={handleIncrease}
                title="Increase quantity"
                aria-label="Increase quantity"
              >
                <IconPlus size={11} />
              </button>
            </div>

            <button
              className={`btn-add-cart ${justAdded ? "added-pop" : ""}`}
              onClick={handleAdd}
              aria-label="Add to cart"
            >
              {justAdded ? (
                <>
                  <IconCheck size={14} />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <IconPlus size={14} />
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
