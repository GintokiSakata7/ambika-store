"use client";

import React from "react";
import { useStore } from "../context/StoreContext";

export default function CartDrawer() {
  const {
    cart,
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
    clearCart
  } = useStore();

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      className={`cart-backdrop ${isCartOpen ? "open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCartOpen(false);
      }}
    >
      <aside className="cart-drawer" aria-label="Shopping Cart">
        {/* Drawer Header */}
        <div className="cart-drawer-head">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span>Your Cleaning Cart</span>
          </h3>
          <button
            className="btn-close-drawer"
            onClick={() => setIsCartOpen(false)}
            title="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Delivery Progress Tracker */}
        <div className="cart-delivery-status-box">
          <div className="delivery-status-header">
            <span>Doorstep Delivery (Min ₹{deliveryMinimum}):</span>
            <span style={{ color: isDeliveryEligible ? "#15803d" : "#0f766e" }}>
              ₹{subtotal} / ₹{deliveryMinimum}
            </span>
          </div>

          <div className="progress-track">
            <div
              className={`progress-fill ${isDeliveryEligible ? "eligible" : ""}`}
              style={{ width: `${deliveryProgressPercent}%` }}
            ></div>
          </div>

          <div className={`delivery-helper-text ${isDeliveryEligible ? "success" : "warning"}`}>
            {isDeliveryEligible ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>You qualify for Doorstep Delivery (Above ₹{deliveryMinimum})!</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Add <strong>₹{remainingForDelivery}</strong> more to unlock Home Delivery.</span>
              </>
            )}
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div className="cart-empty-state" style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🛒</div>
              <h4 style={{ fontSize: "1.1rem", color: "#1e293b", marginBottom: "6px" }}>Your cart is empty</h4>
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "18px" }}>
                Add phenyls, acids, brooms, naphthalene balls, or bundle packs.
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

                <div className="cart-item-details">
                  <div className="cart-item-name" title={item.name}>{item.name}</div>
                  <div className="cart-item-unit">{item.unit}</div>
                  <div className="cart-item-price">
                    ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-item-qty">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="cart-qty-val">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="cart-item-del-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    </svg>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Drawer Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-foot">
            <div className="cart-summary-line">
              <span>Items Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="cart-summary-line">
              <span>Home Delivery:</span>
              <span style={{ fontWeight: 600, color: isDeliveryEligible ? "#15803d" : "#b45309" }}>
                {isDeliveryEligible ? "Qualified (Above ₹" + deliveryMinimum + ")" : "Requires ₹" + remainingForDelivery + " more"}
              </span>
            </div>

            <div className="cart-summary-total">
              <span>Total Payable:</span>
              <span>₹{subtotal}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                className="btn-checkout-proceed"
                onClick={handleProceedToCheckout}
              >
                <span>Proceed to Delivery Address</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>

              <button
                className="btn-clear-cart"
                onClick={() => {
                  if (confirm("Are you sure you want to clear your cart?")) clearCart();
                }}
              >
                Clear Entire Cart
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
