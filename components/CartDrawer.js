"use client";

import React, { useRef, useState, useEffect } from "react";
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
  IconSparkles,
  IconArrowRight
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
    checkoutFulfillmentType,
    setCheckoutFulfillmentType,
    updateCartQuantity,
    removeFromCart,
    addToCart,
    getRecommendations,
    products,
    t
  } = useStore();

  const recsRef = useRef(null);

  // User's selected fulfillment in the cart drawer
  const [selectedFulfillment, setSelectedFulfillment] = useState("delivery");

  // Keep in sync with store context or eligibility
  useEffect(() => {
    if (checkoutFulfillmentType) {
      setSelectedFulfillment(checkoutFulfillmentType);
    } else {
      setSelectedFulfillment(isDeliveryEligible ? "delivery" : "pickup");
    }
  }, [checkoutFulfillmentType, isDeliveryEligible]);

  if (!isCartOpen) return null;

  const handleProceed = (mode = selectedFulfillment) => {
    setCheckoutFulfillmentType(mode);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleScrollToRecs = () => {
    if (recsRef.current) {
      recsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const recommendations = getRecommendations(null, 3);

  // Low-cost top-up products to easily reach Rs. 500 delivery threshold
  const quickAddCandidates = (products || [])
    .filter((p) => p.price <= 110 && !cart.some((c) => c.id === p.id))
    .slice(0, 3);

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
            aria-label="Close cart"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Free Delivery Threshold Tracker */}
        <div className="delivery-progress-card">
          <div className="delivery-progress-header">
            <span className="delivery-progress-title">
              <IconTruck size={15} style={{ marginRight: "6px" }} />
              Home Delivery Tracker
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
                <span>{t("delivery_unlocked")} (₹0 Delivery Fee)</span>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "8px" }}>
                <span>Add <strong>Rs. {remainingForDelivery}</strong> more for Home Delivery.</span>
                <button
                  type="button"
                  onClick={handleScrollToRecs}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#0f766e",
                    fontWeight: 700,
                    fontSize: "0.76rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                    whiteSpace: "nowrap"
                  }}
                >
                  + Add Items
                </button>
              </div>
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
                      aria-label="Decrease quantity"
                    >
                      <IconMinus size={10} />
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      title="Increase quantity"
                      aria-label="Increase quantity"
                    >
                      <IconPlus size={10} />
                    </button>
                  </div>

                  <button
                    className="btn-remove-item"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                    aria-label="Remove item"
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
              ref={recsRef}
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

        {/* Drawer Footer with Explicit Booking Choice & Clear Proceed Flow */}
        {cart.length > 0 && (
          <div className="cart-footer">
            {/* 1. Fulfillment Mode Toggle */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginBottom: "12px"
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedFulfillment("delivery");
                  setCheckoutFulfillmentType("delivery");
                }}
                style={{
                  padding: "9px 8px",
                  borderRadius: "8px",
                  border: selectedFulfillment === "delivery" ? "2px solid #0f766e" : "1px solid #e2e8f0",
                  background: selectedFulfillment === "delivery" ? "#f0fdfa" : "#f8fafc",
                  color: selectedFulfillment === "delivery" ? "#0f766e" : "#475569",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <IconTruck size={15} />
                  <span>{t("fulfillment_delivery")}</span>
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: isDeliveryEligible ? "#16a34a" : "#94a3b8",
                    fontWeight: 500
                  }}
                >
                  {isDeliveryEligible ? "Free Unlocked!" : `Min Rs. ${deliveryMinimum}`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedFulfillment("pickup");
                  setCheckoutFulfillmentType("pickup");
                }}
                style={{
                  padding: "9px 8px",
                  borderRadius: "8px",
                  border: selectedFulfillment === "pickup" ? "2px solid #0f766e" : "1px solid #e2e8f0",
                  background: selectedFulfillment === "pickup" ? "#f0fdfa" : "#f8fafc",
                  color: selectedFulfillment === "pickup" ? "#0f766e" : "#475569",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <IconStore size={15} />
                  <span>{t("fulfillment_pickup")}</span>
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "#16a34a",
                    fontWeight: 500
                  }}
                >
                  100% Free
                </span>
              </button>
            </div>

            {/* 2. Sub-500 Top-Up Assist Box when Delivery is picked */}
            {selectedFulfillment === "delivery" && !isDeliveryEligible && (
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  marginBottom: "12px",
                  fontSize: "0.78rem",
                  color: "#92400e"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: quickAddCandidates.length > 0 ? "8px" : "0"
                  }}
                >
                  <span>
                    Add <strong>Rs. {remainingForDelivery}</strong> more for Home Delivery
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFulfillment("pickup");
                      setCheckoutFulfillmentType("pickup");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0f766e",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0
                    }}
                  >
                    Use Store Pickup &rarr;
                  </button>
                </div>

                {/* Quick Add Pills */}
                {quickAddCandidates.length > 0 && (
                  <div>
                    <div style={{ fontSize: "0.71rem", color: "#78350f", marginBottom: "6px", fontWeight: 600 }}>
                      {t("quick_add_threshold")}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {quickAddCandidates.map((cand) => (
                        <button
                          key={cand.id}
                          type="button"
                          onClick={() => addToCart(cand, 1)}
                          style={{
                            background: "#ffffff",
                            border: "1px solid #fcd34d",
                            borderRadius: "5px",
                            padding: "3px 7px",
                            fontSize: "0.73rem",
                            fontWeight: 600,
                            color: "#92400e",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <IconPlus size={10} />
                          <span>{cand.name.split(" ")[0]}</span>
                          <strong>+₹{cand.price}</strong>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Main Proceed To Book Action Button */}
            {selectedFulfillment === "delivery" ? (
              isDeliveryEligible ? (
                /* Delivery Eligible */
                <button
                  className="btn-checkout-drawer"
                  onClick={() => handleProceed("delivery")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 18px",
                    background: "#16a34a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <IconTruck size={18} />
                    <span>{t("proceed_delivery_btn")}</span>
                  </span>
                  <span>Rs. {subtotal} &rarr;</span>
                </button>
              ) : (
                /* Delivery Below 500: Provide 2 immediate paths */
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button
                    className="btn-checkout-drawer"
                    onClick={() => handleProceed("pickup")}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      background: "#0f766e",
                      border: "none",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <IconStore size={17} />
                      <span>{t("switch_to_pickup")}</span>
                    </span>
                    <span>Rs. {subtotal} &rarr;</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleScrollToRecs}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "#fef3c7",
                      border: "1px dashed #d97706",
                      borderRadius: "6px",
                      color: "#92400e",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                  >
                    + Add ₹{remainingForDelivery} more to qualify for Home Delivery
                  </button>
                </div>
              )
            ) : (
              /* Store Pickup Selected */
              <button
                className="btn-checkout-drawer"
                onClick={() => handleProceed("pickup")}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "13px 18px",
                  background: "#0f766e",
                  border: "none",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(15, 118, 110, 0.25)"
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <IconStore size={18} />
                  <span>{t("proceed_pickup_btn")}</span>
                </span>
                <span>Rs. {subtotal} &rarr;</span>
              </button>
            )}

            {/* 4. Price & Payment Guarantee Breakdown */}
            <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>
                <span>{t("subtotal")} ({totalItems} items)</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>
                <span>{t("delivery_fee")}</span>
                <span style={{ color: "#16a34a", fontWeight: 700 }}>{t("free")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.98rem", fontWeight: 800, color: "#09090b", marginBottom: "6px" }}>
                <span>{t("total")}</span>
                <span style={{ color: "#0f766e" }}>Rs. {subtotal}</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748b", textAlign: "center" }}>
                ✓ {t("pay_note")}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
