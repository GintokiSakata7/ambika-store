"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  IconTruck,
  IconStore,
  IconWhatsApp,
  IconX,
  IconCheck,
  IconMapPin,
  IconNavigation
} from "./Icons";

export default function CheckoutModal() {
  const {
    cart,
    subtotal,
    deliveryMinimum,
    isDeliveryEligible,
    remainingForDelivery,
    isCheckoutOpen,
    setIsCheckoutOpen,
    createOrder,
    generateWhatsAppUrl,
    showToast,
    settings,
    t
  } = useStore();

  const [orderType, setOrderType] = useState(isDeliveryEligible ? "delivery" : "pickup");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    altPhone: "",
    doorNo: "",
    floor: "",
    address: "",
    landmark: "",
    pincode: "",
    timeSlot: "Anytime Today",
    notes: ""
  });

  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // GPS Auto-Fill (Session only)
  const handleGpsAutoFill = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "error");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        setLocating(false);
        showToast(t("gps_success"), "success");

        // Attempt reverse geocoding via Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              const road = data.address.road || data.address.suburb || data.address.neighbourhood || "";
              const city = data.address.city || data.address.town || data.address.state_district || "";
              const post = data.address.postcode || "";

              setFormData((prev) => ({
                ...prev,
                address: prev.address ? prev.address : `${road}${road && city ? ", " : ""}${city}`,
                pincode: prev.pincode ? prev.pincode : post
              }));
            }
          }
        } catch (e) {
          // If network fetch fails, coordinates are still stored for delivery map link
        }
      },
      (err) => {
        setLocating(false);
        showToast("Location permission denied or unavailable.", "info");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      showToast("Please enter your name", "error");
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      showToast("Please enter a valid 10-digit mobile number", "error");
      return;
    }

    if (orderType === "delivery") {
      if (!isDeliveryEligible) {
        showToast(
          `Home delivery requires min. Rs. ${deliveryMinimum} order (Add Rs. ${remainingForDelivery} more or choose Store Pickup)`,
          "error"
        );
        return;
      }

      if (!formData.address.trim()) {
        showToast("Please enter your street address or colony", "error");
        return;
      }

      if (!formData.pincode.trim()) {
        showToast("Please enter your delivery pincode", "error");
        return;
      }
    }

    setSubmitting(true);

    try {
      // 1. Create order and get ticket
      const newOrder = createOrder(formData, orderType, coords);

      // 2. Build WhatsApp URL
      const waUrl = generateWhatsAppUrl(newOrder);

      showToast(`Order Ticket #${newOrder.orderId} Created!`, "success");

      setTimeout(() => {
        setSubmitting(false);
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }, 500);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      showToast("Failed creating order. Please contact dispatch directly.", "error");
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCheckoutOpen(false);
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-window">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3>
              <IconMapPin size={18} style={{ color: "#0f766e" }} />
              <span>{t("checkout_title")}</span>
            </h3>
            <p>Direct Booking with Majin Studios Dispatch (+91 {settings.whatsappNumber})</p>
          </div>
          <button
            className="btn-close-drawer"
            onClick={() => setIsCheckoutOpen(false)}
            title="Close modal"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Order Type Toggle: Home Delivery vs Store Pickup */}
          <div className="delivery-order-type-picker">
            <label
              className={`type-radio-card ${orderType === "delivery" ? "active" : ""}`}
              onClick={() => {
                if (isDeliveryEligible) {
                  setOrderType("delivery");
                } else {
                  showToast(t("delivery_min_alert", { diff: remainingForDelivery }), "info");
                  setOrderType("delivery");
                }
              }}
            >
              <input
                type="radio"
                name="orderType"
                value="delivery"
                checked={orderType === "delivery"}
                onChange={() => setOrderType("delivery")}
              />
              <div className="type-card-info">
                <h5>
                  <IconTruck size={16} className="inline-icon" />
                  <span>Home Delivery</span>
                </h5>
                <p>
                  {isDeliveryEligible ? "Free Delivery Unlocked!" : `Min order Rs. ${deliveryMinimum}`}
                </p>
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
                <h5>
                  <IconStore size={16} className="inline-icon" />
                  <span>Store Self-Pickup</span>
                </h5>
                <p>100% Free (No minimum order)</p>
              </div>
            </label>
          </div>

          {/* Alert if Delivery is selected but subtotal < 500 */}
          {orderType === "delivery" && !isDeliveryEligible && (
            <div className="checkout-threshold-warning">
              <div>
                <strong>Minimum Order Notice:</strong> Subtotal is <strong>Rs. {subtotal}</strong>. Home delivery is available for orders above <strong>Rs. {deliveryMinimum}</strong> (Add Rs. {remainingForDelivery} more). Or select <strong>Store Self-Pickup</strong> to proceed now.
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit}>
            <div className="form-grid">
              {/* Customer Name */}
              <div className="form-group">
                <label htmlFor="fullName">
                  {t("name_label")} <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="form-control"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Mobile Phone */}
              <div className="form-group">
                <label htmlFor="phone">
                  {t("phone_label")} <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="form-control"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength={10}
                  required
                />
              </div>

              {/* Home Delivery Specific Fields */}
              {orderType === "delivery" ? (
                <>
                  {/* GPS Auto-Fill Button */}
                  <div className="form-group full-width" style={{ marginTop: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={handleGpsAutoFill}
                        disabled={locating}
                        className="btn-outline"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          fontSize: "0.82rem",
                          color: "#0f766e",
                          borderColor: "#0f766e"
                        }}
                      >
                        <IconNavigation size={14} />
                        <span>{locating ? t("gps_locating") : t("gps_button")}</span>
                      </button>

                      {coords && (
                        <span style={{ fontSize: "0.78rem", color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                          <IconCheck size={14} /> GPS Pin Attached
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="doorNo">{t("door_flat_label")}</label>
                    <input
                      type="text"
                      id="doorNo"
                      className="form-control"
                      placeholder="e.g. Flat 302, D-Block"
                      value={formData.doorNo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="floor">{t("floor_label")}</label>
                    <input
                      type="text"
                      id="floor"
                      className="form-control"
                      placeholder="e.g. 3rd Floor / Ground Floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="address">
                      {t("street_label")} <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="form-control"
                      placeholder="e.g. Station Road, Near Main Market"
                      value={formData.address}
                      onChange={handleInputChange}
                      required={orderType === "delivery"}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="landmark">{t("landmark_label")}</label>
                    <input
                      type="text"
                      id="landmark"
                      className="form-control"
                      placeholder="e.g. Opp. Water Tank"
                      value={formData.landmark}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode">
                      {t("pincode_label")} <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      className="form-control"
                      placeholder="e.g. 500001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      maxLength={6}
                      required={orderType === "delivery"}
                    />
                  </div>
                </>
              ) : (
                /* Store Pickup Details */
                <div
                  className="form-group full-width"
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "14px",
                    marginTop: "8px"
                  }}
                >
                  <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <IconStore size={20} style={{ color: "#0f766e", marginTop: "2px" }} />
                    <div>
                      <strong style={{ fontSize: "0.9rem", color: "#09090b" }}>
                        {t("store_address_title")}
                      </strong>
                      <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#64748b" }}>
                        {t("store_address_detail")}
                      </p>
                      <small style={{ color: "#16a34a", fontWeight: 600, display: "block", marginTop: "4px" }}>
                        No delivery fee. Collect directly at counter with Ticket ID.
                      </small>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price & Submit Bar */}
            <div
              style={{
                borderTop: "1px solid #e2e8f0",
                marginTop: "20px",
                paddingTop: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ fontSize: "0.78rem", color: "#64748b" }}>Payable on Delivery / Pickup</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f766e" }}>
                  Rs. {subtotal}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || (orderType === "delivery" && !isDeliveryEligible)}
                className="btn-checkout-drawer"
                style={{
                  background: orderType === "delivery" && !isDeliveryEligible ? "#94a3b8" : "#16a34a",
                  cursor: orderType === "delivery" && !isDeliveryEligible ? "not-allowed" : "pointer",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: 600
                }}
              >
                <IconWhatsApp size={16} />
                <span>{submitting ? "Booking..." : t("btn_place_order")}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
