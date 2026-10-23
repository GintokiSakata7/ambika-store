"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import {
  IconShoppingBag,
  IconX,
  IconCheck,
  IconTruck,
  IconTrash,
  IconPlus,
  IconMinus,
  IconStore,
  IconSparkles
} from "./Icons";

export default function CartDrawer() {
  const {
    cart,
    totalItems,
    subtotal,
    deliveryMinimum,
    isDeliveryEligible,
    remainingForDelivery,
    deliveryProgressPercent,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateCartQuantity,
    removeFromCart,
    addToCart,
    getRecommendations,
    t
  } = useStore();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const recommendations = getRecommendations(null, 3);

  return (
    <div
      className="cart-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCartOpen(false);
      }}
      role="dialog"
      aria-modal="true"
    >
      <aside className="cart-drawer">
        {/* Mobile Drag Handle */}
        <div className="mobile-sheet-handle" />

        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-title-wrapper">
            <IconShoppingBag size={20} />
            <h3>Your Order Cart</h3>
            <span className="cart-badge-count">{totalItems} items</span>
          </div>

          <button
            className="btn-close-drawer"
            onClick={() => setIsCartOpen(false)}
            title="Close cart"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Free Delivery Threshold Tracker */}
        <div className="delivery-progress-card">
          <div className="delivery-progress-header">
            <span className="delivery-progress-title">
              <IconTruck size={15} style={{ marginRight: "4px" }} />
              Home Delivery Progress
            </span>
            <span className="threshold-status-badge">
              Min Rs. {deliveryMinimum}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar-track">
            <div
              className={`progress-fill ${isDeliveryEligible ? "eligible" : ""}`}
              style={{ width: `${deliveryProgressPercent}%` }}
            ></div>
          </div>

          <div className={`delivery-helper-text ${isDeliveryEligible ? "success" : "warning"}`}>
            {isDeliveryEligible ? (
              <>
                <IconCheck size={14} />
                <span>{t("delivery_unlocked")}</span>
              </>
            ) : (
              <>
                <span>Add <strong>Rs. {remainingForDelivery}</strong> more for Free Delivery. (Store Pickup is always Free).</span>
              </>
            )}
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div className="cart-empty-state" style={{ textAlign: "center", padding: "40px 20px" }}>
              <IconShoppingBag size={48} style={{ margin: "0 auto 12px", color: "#94a3b8" }} />
              <h4 style={{ fontSize: "1.1rem", color: "#1e293b", marginBottom: "6px" }}>
                {t("empty_cart")}
              </h4>
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "18px" }}>
                Add white phenyl, toilet acid, brooms, naphthalene balls, or bundles.
              </p>
              <button
                className="btn-outline"
                onClick={() => setIsCartOpen(false)}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item-row">
                <img src={item.image} alt={item.name} className="cart-item-thumb" />

                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <div className="cart-item-unit">{item.unit}</div>
                  <div className="cart-item-price-unit">
                    Rs. {item.price} x {item.quantity} = <strong>Rs. {item.price * item.quantity}</strong>
                  </div>
                </div>

                <div className="cart-item-controls">
                  <div className="qty-counter small">
                    <button
                      className="qty-btn"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      title="Decrease quantity"
                    >
                      <IconMinus size={10} />
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      title="Increase quantity"
                    >
                      <IconPlus size={10} />
                    </button>
                  </div>

                  <button
                    className="btn-remove-item"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Smart Recommendation Strip in Cart */}
          {cart.length > 0 && recommendations.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                padding: "14px 12px",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#0f766e",
                  marginBottom: "10px"
                }}
              >
                <IconSparkles size={14} />
                <span>{t("frequently_bought")}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#ffffff",
                      border: "1px solid #f1f5f9",
                      borderRadius: "6px",
                      padding: "8px 10px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <img
                        src={rec.image}
                        alt={rec.name}
                        style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "4px" }}
                      />
                      <div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1e293b", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {rec.name}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                          Rs. {rec.price}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(rec, 1)}
                      className="btn-outline"
                      style={{
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <IconPlus size={12} />
                      <span>{t("btn_add")}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-line">
              <span>{t("subtotal")}</span>
              <strong>Rs. {subtotal}</strong>
            </div>

            <div className="cart-summary-line small">
              <span>Fulfillment Option</span>
              <span style={{ color: "#0f766e", fontWeight: 600 }}>
                {isDeliveryEligible ? "Home Delivery (Free)" : "Store Pickup (Free)"}
              </span>
            </div>

            <button
              className="btn-checkout-drawer"
              onClick={handleProceedToCheckout}
            >
              <span>{t("btn_checkout")}</span>
              <strong>Rs. {subtotal}</strong>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
