"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  IconHistory,
  IconSearch,
  IconX,
  IconCheck,
  IconTruck,
  IconStore,
  IconClock,
  IconWhatsApp
} from "./Icons";

export default function TrackOrderModal() {
  const {
    isTrackOrderOpen,
    setIsTrackOrderOpen,
    orders,
    settings,
    t
  } = useStore();

  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  if (!isTrackOrderOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const clean = query.trim().toLowerCase();
    const cleanDigits = query.replace(/\D/g, "");

    const found = orders.find((o) => {
      const matchId = o.orderId.toLowerCase() === clean || o.orderId.toLowerCase().includes(clean);
      const matchPhone = cleanDigits.length >= 7 && o.customer && o.customer.phone && o.customer.phone.includes(cleanDigits);
      return matchId || matchPhone;
    });

    setSearchResult(found || null);
    setSearched(true);
  };

  const getStepActiveIndex = (status) => {
    switch (status) {
      case "Placed":
        return 1;
      case "Confirmed & Packing":
      case "Preparing":
        return 2;
      case "Ready for Pickup / Out for Delivery":
      case "Out for Delivery":
      case "Ready":
        return 3;
      case "Delivered":
      case "Delivered / Collected":
      case "Completed":
        return 4;
      default:
        return 2;
    }
  };

  const currentStep = searchResult ? getStepActiveIndex(searchResult.status) : 1;

  const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
  const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsTrackOrderOpen(false);
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-window" style={{ maxWidth: "560px" }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IconHistory size={18} style={{ color: "#0f766e" }} />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#09090b" }}>
                {t("track_title")}
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                {t("track_subtitle")}
              </p>
            </div>
          </div>

          <button
            className="btn-close-drawer"
            onClick={() => setIsTrackOrderOpen(false)}
            title="Close"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: "20px" }}>
          {/* Search Form */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                className="form-control"
                placeholder={t("input_order_id") + " or mobile"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ paddingLeft: "12px", width: "100%" }}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap"
              }}
            >
              <IconSearch size={15} />
              <span>{t("btn_search_order")}</span>
            </button>
          </form>

          {/* Search Results */}
          {searched && !searchResult && (
            <div
              style={{
                textAlign: "center",
                padding: "24px 16px",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px dashed #cbd5e1"
              }}
            >
              <p style={{ margin: 0, fontSize: "0.88rem", color: "#64748b" }}>
                {t("no_order_found")}
              </p>
            </div>
          )}

          {searchResult && (
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "16px",
                background: "#ffffff"
              }}
            >
              {/* Top Meta */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: "1px solid #f1f5f9",
                  paddingBottom: "12px",
                  marginBottom: "14px"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>
                    {t("order_ticket_id")}
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f766e", fontFamily: "monospace" }}>
                    #{searchResult.orderId}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      background: "#f0fdf4",
                      color: "#16a34a",
                      border: "1px solid #bbf7d0",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "0.78rem",
                      fontWeight: 600
                    }}
                  >
                    {searchResult.status}
                  </span>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "3px" }}>
                    {searchResult.date}
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div style={{ marginBottom: "16px" }}>
                <div className="order-stepper">
                  <div className={`step-node ${currentStep >= 1 ? "active" : ""}`}>
                    <div className="node-circle">1</div>
                    <div className="node-label">{t("status_placed")}</div>
                  </div>
                  <div className={`step-line ${currentStep >= 2 ? "active" : ""}`}></div>
                  <div className={`step-node ${currentStep >= 2 ? "active" : ""}`}>
                    <div className="node-circle">2</div>
                    <div className="node-label">{t("status_preparing")}</div>
                  </div>
                  <div className={`step-line ${currentStep >= 3 ? "active" : ""}`}></div>
                  <div className={`step-node ${currentStep >= 3 ? "active" : ""}`}>
                    <div className="node-circle">3</div>
                    <div className="node-label">
                      {searchResult.orderType === "delivery" ? "Out for Delivery" : "Ready for Pickup"}
                    </div>
                  </div>
                  <div className={`step-line ${currentStep >= 4 ? "active" : ""}`}></div>
                  <div className={`step-node ${currentStep >= 4 ? "active" : ""}`}>
                    <div className="node-circle">4</div>
                    <div className="node-label">{t("status_delivered")}</div>
                  </div>
                </div>
              </div>

              {/* Details List */}
              <div style={{ fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Order Method:</span>
                  <strong>
                    {searchResult.orderType === "delivery" ? "Doorstep Delivery" : "Store Self-Pickup"}
                  </strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Customer:</span>
                  <span>{searchResult.customer.fullName} ({searchResult.customer.phone})</span>
                </div>

                {searchResult.orderType === "delivery" && searchResult.customer.address && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Address:</span>
                    <span style={{ textAlign: "right", maxWidth: "60%" }}>
                      {searchResult.customer.doorNo ? `${searchResult.customer.doorNo}, ` : ""}
                      {searchResult.customer.floor ? `${searchResult.customer.floor}, ` : ""}
                      {searchResult.customer.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Items Summary */}
              <div style={{ background: "#f8fafc", borderRadius: "6px", padding: "10px", fontSize: "0.8rem", marginBottom: "16px" }}>
                <div style={{ fontWeight: 600, color: "#334155", marginBottom: "6px" }}>Ordered Products</div>
                {searchResult.items.map((it, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span style={{ color: "#475569" }}>
                      {it.quantity} × {it.name}
                    </span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>
                      Rs. {it.price * it.quantity}
                    </span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #e2e8f0", marginTop: "6px", paddingTop: "6px", display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                  <span>Total Amount</span>
                  <span style={{ color: "#0f766e" }}>Rs. {searchResult.subtotal}</span>
                </div>
              </div>

              {/* WhatsApp Support Query */}
              <a
                href={`https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20checking%20status%20for%20Order%20Ticket%20%23${searchResult.orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  width: "100%",
                  padding: "9px"
                }}
              >
                <IconWhatsApp size={16} />
                <span>Contact Dispatch Desk on WhatsApp</span>
              </a>
            </div>
          )}

          {/* Quick Recent Orders if not searched */}
          {!searched && orders.length > 0 && (
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>
                Recent Browser Orders
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {orders.slice(0, 3).map((o) => (
                  <div
                    key={o.orderId}
                    onClick={() => {
                      setSearchResult(o);
                      setSearched(true);
                      setQuery(o.orderId);
                    }}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      padding: "10px 12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      background: "#fafafa"
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#0f766e", fontSize: "0.88rem" }}>
                        #{o.orderId}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        {o.date} • {o.items.length} items
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "#16a34a" }}>
                        {o.status}
                      </span>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#09090b" }}>
                        Rs. {o.subtotal}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
