"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";

export default function CheckoutModal() {
  const {
    cart,
    totalItems,
    subtotal,
    deliveryMinimum,
    isDeliveryEligible,
    remainingForDelivery,
    settings,
    isCheckoutOpen,
    setIsCheckoutOpen,
    generateWhatsAppMessage,
    generateWhatsAppUrl,
    recordDemoOrder,
    showToast
  } = useStore();

  const [orderType, setOrderType] = useState("delivery");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    landmark: "",
    pincode: "",
    timeSlot: "Anytime Today",
    paymentMethod: "Cash on Delivery (COD)",
    notes: ""
  });

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert("Please enter your full name.");
      return false;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (orderType === "delivery") {
      if (!formData.address.trim()) {
        alert("Please enter your delivery address.");
        return false;
      }
      if (!formData.pincode.trim() || formData.pincode.trim().length < 5) {
        alert("Please enter a valid pincode.");
        return false;
      }
    }
    return true;
  };

  const handleSendWhatsApp = () => {
    if (!validateForm()) return;

    if (orderType === "delivery" && !isDeliveryEligible) {
      const confirmProceed = confirm(
        `Notice: Our doorstep delivery is normally for orders above ₹${deliveryMinimum}.\nYour current subtotal is ₹${subtotal}.\n\nDo you want to send this order to WhatsApp for special confirmation anyway?`
      );
      if (!confirmProceed) return;
    }

    // Record order in demo orders list
    recordDemoOrder(formData, orderType);

    // Generate WhatsApp URL
    const url = generateWhatsAppUrl(formData, orderType);

    showToast("Opening WhatsApp with your order...", "success");

    // Open WhatsApp
    const opened = window.open(url, "_blank");
    if (!opened || opened.closed || typeof opened.closed === "undefined") {
      window.location.href = url;
    }

    setIsCheckoutOpen(false);
  };

  const handleCopyMessage = () => {
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert("Please fill in your name and phone number first.");
      return;
    }

    const msg = generateWhatsAppMessage(formData, orderType);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg).then(() => {
        showToast("Order message copied to clipboard!", "info");
      }).catch(() => {
        copyFallback(msg);
      });
    } else {
      copyFallback(msg);
    }
  };

  const copyFallback = (text) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Order message copied to clipboard!", "info");
  };

  return (
    <div
      className={`modal-overlay ${isCheckoutOpen ? "open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCheckoutOpen(false);
      }}
    >
      <div className="modal-window">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Delivery Details & WhatsApp Checkout</span>
            </h3>
            <p>Order connects directly to Margin Studio WhatsApp (+91 {settings.whatsappNumber})</p>
          </div>
          <button
            className="btn-close-drawer"
            onClick={() => setIsCheckoutOpen(false)}
            title="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Order Type Toggle */}
          <div className="delivery-order-type-picker">
            <label
              className={`type-radio-card ${orderType === "delivery" ? "active" : ""}`}
              onClick={() => setOrderType("delivery")}
            >
              <input
                type="radio"
                name="orderType"
                value="delivery"
                checked={orderType === "delivery"}
                onChange={() => setOrderType("delivery")}
              />
              <div className="type-card-info">
                <h5>🚚 Doorstep Home Delivery</h5>
                <p>Delivery available for orders above ₹{deliveryMinimum}</p>
              </div>
            </label>

            <label
              className={`type-radio-card ${orderType === "pickup" ? "active" : ""}`}
              onClick={() => setOrderType("pickup")}
            >
              <input
                type="radio"
                name="orderType"
                value="pickup"
                checked={orderType === "pickup"}
                onChange={() => setOrderType("pickup")}
              />
              <div className="type-card-info">
                <h5>🏬 Store Self-Pickup</h5>
                <p>Pick up directly at depot (No minimum order)</p>
              </div>
            </label>
          </div>

          {/* Threshold Alert for delivery */}
          {orderType === "delivery" && !isDeliveryEligible && (
            <div className="checkout-threshold-warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <strong>Home Delivery Note:</strong> Your subtotal is <strong>₹{subtotal}</strong>. Our doorstep delivery minimum is <strong>₹{deliveryMinimum}</strong> (₹{remainingForDelivery} remaining). You can add items or select Store Pickup.
              </div>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name <span className="req">*</span></label>
                <input
                  type="text"
                  id="fullName"
                  className="form-control"
                  placeholder="e.g. Rajesh Kumar"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Mobile / WhatsApp Number <span className="req">*</span></label>
                <input
                  type="tel"
                  id="phone"
                  className="form-control"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {orderType === "delivery" && (
                <>
                  <div className="form-group full-width">
                    <label htmlFor="address">Delivery Address (House/Flat, Street, Area) <span className="req">*</span></label>
                    <textarea
                      id="address"
                      className="form-control"
                      placeholder="e.g. Flat 302, Sai Residency, 4th Cross Road"
                      rows="2"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="landmark">Nearby Landmark</label>
                    <input
                      type="text"
                      id="landmark"
                      className="form-control"
                      placeholder="e.g. Near Water Tank or Temple"
                      value={formData.landmark}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode">Pincode / Area Code <span className="req">*</span></label>
                    <input
                      type="text"
                      id="pincode"
                      className="form-control"
                      placeholder="e.g. 500001"
                      maxLength="6"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="timeSlot">Preferred Time Slot</label>
                <select
                  id="timeSlot"
                  className="form-control"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                >
                  <option value="Anytime Today">Anytime Today (Standard)</option>
                  <option value="Morning (9 AM - 1 PM)">Morning (9 AM - 1 PM)</option>
                  <option value="Afternoon (1 PM - 5 PM)">Afternoon (1 PM - 5 PM)</option>
                  <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                  <option value="Tomorrow Morning">Tomorrow Morning</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Preference</label>
                <select
                  id="paymentMethod"
                  className="form-control"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                  <option value="UPI on Delivery (GPay / PhonePe / Paytm)">UPI on Delivery (GPay / PhonePe / Paytm)</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Special Instructions (Optional)</label>
                <input
                  type="text"
                  id="notes"
                  className="form-control"
                  placeholder="e.g. Call before coming, keep acid bottle upright"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </form>

          {/* Mini Summary */}
          <div className="modal-cart-mini-summary">
            <div className="head">
              <span>Order Summary ({totalItems} items)</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="modal-cart-items-preview">
              {cart.map((item, idx) => (
                <div key={idx}>
                  {idx + 1}. {item.name} ({item.unit}) × {item.quantity} = ₹{item.price * item.quantity}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn-copy-msg"
            onClick={handleCopyMessage}
            title="Copy order message to clipboard"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            <span>Copy Text</span>
          </button>

          <button
            type="button"
            className="btn-send-whatsapp"
            onClick={handleSendWhatsApp}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.55C9.33 7.55 9 7.62 8.71 7.94C8.42 8.25 7.62 9 7.62 10.5C7.62 12 8.73 13.45 8.89 13.66C9.05 13.86 11.05 16.95 14.12 18.28C14.85 18.6 15.42 18.78 15.86 18.93C16.6 19.16 17.27 19.13 17.81 19.05C18.41 18.96 19.65 18.3 19.91 17.57C20.17 16.84 20.17 16.22 20.09 16.09C20.01 15.96 19.81 15.88 19.51 15.73C19.22 15.58 17.78 14.87 17.51 14.77C17.24 14.67 17.05 14.62 16.85 14.93C16.65 15.23 16.08 15.91 15.9 16.11C15.73 16.32 15.55 16.34 15.26 16.2C14.96 16.05 14.01 15.74 12.89 14.74C12.02 13.96 11.43 13 11.26 12.7C11.09 12.41 11.24 12.25 11.39 12.1C11.52 11.97 11.68 11.76 11.83 11.58C11.98 11.41 12.03 11.28 12.13 11.08C12.23 10.87 12.18 10.7 12.11 10.55C12.03 10.4 11.45 8.97 11.21 8.39C10.97 7.82 10.73 7.9 10.55 7.9H10.15C9.95 7.9 9.68 7.82 9.53 7.55Z" />
            </svg>
            <span>Send Order to WhatsApp ({settings.whatsappNumber})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
