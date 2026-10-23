"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  IconCheck,
  IconCopy,
  IconWhatsApp,
  IconTruck,
  IconStore,
  IconX,
  IconHistory
} from "./Icons";

export default function OrderSuccessModal() {
  const {
    isOrderSuccessOpen,
    setIsOrderSuccessOpen,
    lastPlacedOrder,
    setIsTrackOrderOpen,
    generateWhatsAppUrl,
    showToast,
    t
  } = useStore();

  const [copied, setCopied] = useState(false);

  if (!isOrderSuccessOpen || !lastPlacedOrder) return null;

  const handleCopyTicket = () => {
    try {
      navigator.clipboard.writeText(lastPlacedOrder.orderId);
      setCopied(true);
      showToast(t("btn_copied"), "success");
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      showToast(`Ticket: ${lastPlacedOrder.orderId}`, "info");
    }
  };

  const handleOpenWhatsApp = () => {
    const waUrl = generateWhatsAppUrl(lastPlacedOrder);
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenTrack = () => {
    setIsOrderSuccessOpen(false);
    setIsTrackOrderOpen(true);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOrderSuccessOpen(false);
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-window" style={{ maxWidth: "520px" }}>
        {/* Mobile Drag Handle */}
        <div className="mobile-sheet-handle" />

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#f0fdf4",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #bbf7d0"
              }}
            >
              <IconCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", margin: 0, color: "#09090b" }}>
                {t("order_success_title")}
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#64748b" }}>
                Order booked with Majin Studios Dispatch Desk
              </p>
            </div>
          </div>

          <button
            className="btn-close-drawer"
            onClick={() => setIsOrderSuccessOpen(false)}
            title="Close"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: "20px" }}>
          {/* Ticket ID Box */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
              marginBottom: "18px"
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
              {t("order_ticket_id")}
            </div>
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#0f766e",
                letterSpacing: "0.08em",
                fontFamily: "monospace",
                marginBottom: "10px"
              }}
            >
              #{lastPlacedOrder.orderId}
            </div>

            <button
              onClick={handleCopyTicket}
              className="btn-outline"
              style={{
                padding: "6px 14px",
                fontSize: "0.8rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <IconCopy size={14} />
              <span>{copied ? t("btn_copied") : t("btn_copy_id")}</span>
            </button>
          </div>

          {/* Stepper tracker preview */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#09090b", marginBottom: "10px" }}>
              Live Order Progress
            </div>

            <div className="order-stepper">
              <div className="step-node active">
                <div className="node-circle">1</div>
                <div className="node-label">{t("status_placed")}</div>
              </div>
              <div className="step-line active"></div>
              <div className="step-node active">
                <div className="node-circle">2</div>
                <div className="node-label">{t("status_preparing")}</div>
              </div>
              <div className="step-line"></div>
              <div className="step-node">
                <div className="node-circle">3</div>
                <div className="node-label">
                  {lastPlacedOrder.orderType === "delivery" ? "Out for Delivery" : "Ready for Pickup"}
                </div>
              </div>
              <div className="step-line"></div>
              <div className="step-node">
                <div className="node-circle">4</div>
                <div className="node-label">{t("status_delivered")}</div>
              </div>
            </div>
          </div>

          {/* Order Summary Snapshot */}
          <div
            style={{
              border: "1px solid #f1f5f9",
              background: "#fafafa",
              borderRadius: "6px",
              padding: "12px 14px",
              fontSize: "0.83rem",
              marginBottom: "20px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#64748b" }}>Order Method:</span>
              <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                {lastPlacedOrder.orderType === "delivery" ? (
                  <>
                    <IconTruck size={14} /> Home Delivery
                  </>
                ) : (
                  <>
                    <IconStore size={14} /> Store Self-Pickup
                  </>
                )}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#64748b" }}>Customer:</span>
              <span style={{ fontWeight: 600 }}>{lastPlacedOrder.customer.fullName} ({lastPlacedOrder.customer.phone})</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Total Amount:</span>
              <span style={{ fontWeight: 700, color: "#0f766e" }}>Rs. {lastPlacedOrder.subtotal}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={handleOpenWhatsApp}
              className="btn-checkout-drawer"
              style={{
                width: "100%",
                background: "#16a34a",
                color: "#ffffff",
                padding: "12px 16px",
                fontSize: "0.95rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer"
              }}
            >
              <IconWhatsApp size={18} />
              <span>{t("btn_place_order")}</span>
            </button>

            <button
              onClick={handleOpenTrack}
              className="btn-outline"
              style={{
                width: "100%",
                padding: "10px 16px",
                fontSize: "0.88rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <IconHistory size={16} />
              <span>{t("btn_track")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
