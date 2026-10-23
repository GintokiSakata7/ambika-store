"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  IconHistory,
  IconSearch,
  IconCheck,
  IconTruck,
  IconStore,
  IconClock,
  IconWhatsApp
} from "./Icons";

export default function TrackOrderPage() {
  const { orders, settings, setCatalogMode, t } = useStore();

  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

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
    <section className="track-order-page" style={{ padding: "20px 0 60px" }}>
      <div className="container" style={{ maxWidth: "680px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f0fdfa", color: "#0f766e", padding: "6px 12px", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700, marginBottom: "10px" }}>
            <IconHistory size={16} />
            <span>LIVE ORDER TRACKING</span>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#09090b", margin: "0 0 6px" }}>
            {t("track_title")}
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0 }}>
            {t("track_subtitle")}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <IconSearch size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Enter Ticket ID (e.g. MS-12345) or 10-digit Phone"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 40px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.92rem",
                  outline: "none"
                }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "12px 20px", fontSize: "0.9rem", whiteSpace: "nowrap" }}
            >
              {t("btn_search_order")}
            </button>
          </div>
        </form>

        {/* Recent session orders preview if not yet searched */}
        {!searched && orders.length > 0 && (
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", marginBottom: "10px", textTransform: "uppercase" }}>
              Recent Orders in this Browser:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {orders.slice(0, 3).map((ord) => (
                <div
                  key={ord.orderId}
                  onClick={() => {
                    setQuery(ord.orderId);
                    setSearchResult(ord);
                    setSearched(true);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    cursor: "pointer"
                  }}
                >
                  <div>
                    <strong style={{ color: "#0f766e", fontSize: "0.9rem" }}>#{ord.orderId}</strong>
                    <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      {ord.customer?.fullName} • {ord.totalItems} items (Rs. {ord.subtotal})
                    </div>
                  </div>
                  <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "#16a34a", background: "#f0fdf4", padding: "4px 8px", borderRadius: "4px" }}>
                    {ord.status || "Placed"} &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Result */}
        {searched && (
          searchResult ? (
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              {/* Ticket Head */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Ticket ID</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f766e", fontFamily: "monospace" }}>#{searchResult.orderId}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Order Date</div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1e293b" }}>{searchResult.date}</div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div style={{ marginBottom: "20px" }}>
                <div className="order-stepper">
                  <div className={`step-node ${currentStep >= 1 ? "active" : ""}`}>
                    <div className="node-circle">{currentStep > 1 ? "✓" : "1"}</div>
                    <div className="node-label">{t("status_placed")}</div>
                  </div>
                  <div className={`step-line ${currentStep >= 2 ? "active" : ""}`}></div>
                  <div className={`step-node ${currentStep >= 2 ? "active" : ""}`}>
                    <div className="node-circle">{currentStep > 2 ? "✓" : "2"}</div>
                    <div className="node-label">{t("status_preparing")}</div>
                  </div>
                  <div className={`step-line ${currentStep >= 3 ? "active" : ""}`}></div>
                  <div className={`step-node ${currentStep >= 3 ? "active" : ""}`}>
                    <div className="node-circle">{currentStep > 3 ? "✓" : "3"}</div>
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

              {/* Order Info */}
              <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "12px 14px", fontSize: "0.84rem", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "#64748b" }}>Fulfillment:</span>
                  <strong>{searchResult.orderType === "delivery" ? "Home Delivery" : "Store Self-Pickup"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "#64748b" }}>Customer:</span>
                  <strong>{searchResult.customer?.fullName} ({searchResult.customer?.phone})</strong>
                </div>
                {searchResult.orderType === "delivery" && searchResult.customer?.address && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: "#64748b" }}>Address:</span>
                    <span style={{ textAlign: "right", maxWidth: "60%" }}>{searchResult.customer.doorNo ? searchResult.customer.doorNo + ", " : ""}{searchResult.customer.address}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "6px", borderTop: "1px solid #e2e8f0" }}>
                  <span style={{ color: "#64748b" }}>Total Amount:</span>
                  <strong style={{ color: "#0f766e", fontSize: "0.95rem" }}>Rs. {searchResult.subtotal}</strong>
                </div>
              </div>

              {/* Follow Up on WhatsApp */}
              <a
                href={`https://wa.me/${cleanNumber}?text=Hi%20Majin%20Studios%2C%20checking%20status%20for%20Order%20Ticket%20%23${searchResult.orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "#16a34a",
                  color: "#ffffff",
                  padding: "11px 16px",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  textDecoration: "none"
                }}
              >
                <IconWhatsApp size={16} />
                <span>WhatsApp Dispatch Desk for Updates</span>
              </a>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
              <IconHistory size={40} style={{ color: "#94a3b8", margin: "0 auto 10px" }} />
              <h4 style={{ fontSize: "1.1rem", color: "#1e293b", marginBottom: "6px" }}>
                Order Not Found
              </h4>
              <p style={{ fontSize: "0.85rem", color: "#64748b", maxWidth: "380px", margin: "0 auto 16px" }}>
                {t("no_order_found")}
              </p>
              <a
                href={`https://wa.me/${cleanNumber}?text=Hi%20Majin%20Studios%2C%20I%20placed%20an%20order%20with%20ID%20${encodeURIComponent(query)}%20and%20need%20assistance.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <IconWhatsApp size={14} />
                <span>Ask on WhatsApp Directly</span>
              </a>
            </div>
          )
        )}

        {/* Back Button */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            onClick={() => setCatalogMode("retail")}
            className="btn-link-subtle"
            style={{ fontSize: "0.85rem", cursor: "pointer" }}
          >
            &larr; Back to Cleaning Catalog
          </button>
        </div>
      </div>
    </section>
  );
}
