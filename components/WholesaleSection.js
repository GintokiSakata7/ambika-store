"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  IconBuilding,
  IconBoxes,
  IconWhatsApp,
  IconShieldCheck,
  IconTruck,
  IconPlus,
  IconCheck
} from "./Icons";

export default function WholesaleSection() {
  const {
    wholesaleProducts,
    addToCart,
    settings,
    t
  } = useStore();

  const [inquiry, setInquiry] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    area: "",
    itemsRequired: "Commercial Phenyl 5L Cartons & Toilet Acid 5L"
  });

  const [inquirySent, setInquirySent] = useState(false);

  const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
  const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!inquiry.contactPerson || !inquiry.phone) return;

    let msg = `[WHOLESALE & BULK INQUIRY - MAJIN STUDIOS]\n`;
    msg += `Shop/Business: ${inquiry.businessName || "Retail Shop / Distributor"}\n`;
    msg += `Contact Person: ${inquiry.contactPerson}\n`;
    msg += `Phone: ${inquiry.phone}\n`;
    msg += `Area / City: ${inquiry.area || "Local Area"}\n`;
    msg += `Requirements: ${inquiry.itemsRequired}\n`;
    msg += `--------------------------------\n`;
    msg += `Please send wholesale catalog & trade pricing list.`;

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 3500);
  };

  return (
    <section className="wholesale-section" style={{ padding: "32px 0 48px" }}>
      <div className="container">
        {/* Top Wholesale Header Banner */}
        <div
          style={{
            background: "#0f172a",
            color: "#ffffff",
            borderRadius: "12px",
            padding: "28px 24px",
            marginBottom: "32px",
            border: "1px solid #1e293b"
          }}
        >
          <div style={{ maxWidth: "760px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.1)",
                padding: "4px 10px",
                borderRadius: "4px",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#5eead4",
                marginBottom: "12px"
              }}
            >
              <IconBuilding size={14} />
              <span>DIRECT FACTORY COMMERCIAL &amp; RESELLER SUPPLY</span>
            </div>

            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 10px", color: "#ffffff" }}>
              {t("wholesale_banner_title")}
            </h2>

            <p style={{ fontSize: "0.92rem", color: "#94a3b8", lineHeight: 1.5, margin: "0 0 20px" }}>
              {t("wholesale_banner_desc")}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.82rem", color: "#cbd5e1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <IconShieldCheck size={16} style={{ color: "#2dd4bf" }} />
                <span>Standardized Industrial Formulations</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <IconTruck size={16} style={{ color: "#2dd4bf" }} />
                <span>Pallet &amp; Carton Dispatch</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <IconBoxes size={16} style={{ color: "#2dd4bf" }} />
                <span>GST Invoicing Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wholesale Product Grid */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#09090b", margin: 0 }}>
                Wholesale Cartons &amp; Commercial Drums
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#64748b", margin: "3px 0 0" }}>
                Order directly in master cartons or bulk canisters with volume discounts
              </p>
            </div>
          </div>

          <div className="wholesale-grid">
            {wholesaleProducts.map((p) => {
              const savings = p.mrp ? p.mrp - p.price : 0;
              return (
                <div key={p.id} className="wholesale-card">
                  <div className="wholesale-card-img">
                    <img src={p.image} alt={p.name} loading="lazy" />
                    {p.badge && <span className="wholesale-badge">{p.badge}</span>}
                  </div>

                  <div className="wholesale-card-body">
                    <div className="wholesale-card-unit">{p.unit}</div>
                    <h4 className="wholesale-card-title">{p.name}</h4>
                    <p className="wholesale-card-desc">{p.description}</p>

                    <div className="wholesale-card-footer">
                      <div>
                        <div className="wholesale-price">Rs. {p.price}</div>
                        {p.mrp && <div className="wholesale-mrp">MRP Rs. {p.mrp} (Save Rs. {savings})</div>}
                      </div>

                      <button
                        className="btn-primary"
                        onClick={() => addToCart(p, 1)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 14px",
                          fontSize: "0.85rem"
                        }}
                      >
                        <IconPlus size={15} />
                        <span>{t("btn_add")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wholesale Quick WhatsApp Inquiry Card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "24px",
            maxWidth: "720px",
            margin: "0 auto"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "1.2rem", color: "#09090b" }}>
              Request Custom Wholesale Quotation
            </h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
              For schools, hospitals, hardware stores, and distributors needing ongoing monthly supply
            </p>
          </div>

          <form onSubmit={handleSendInquiry}>
            <div className="form-grid" style={{ marginBottom: "16px" }}>
              <div className="form-group">
                <label>Shop / Establishment Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sri Balaji Supermarket"
                  value={inquiry.businessName}
                  onChange={(e) => setInquiry({ ...inquiry, businessName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Contact Person Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramesh Reddy"
                  required
                  value={inquiry.contactPerson}
                  onChange={(e) => setInquiry({ ...inquiry, contactPerson: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="10-digit number"
                  required
                  maxLength={10}
                  value={inquiry.phone}
                  onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>City / Colony Area</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Kukatpally, Hyderabad"
                  value={inquiry.area}
                  onChange={(e) => setInquiry({ ...inquiry, area: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>Requirement / Items Needed</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 10 cartons White Phenyl 5L, 5 bags Bleaching powder"
                  value={inquiry.itemsRequired}
                  onChange={(e) => setInquiry({ ...inquiry, itemsRequired: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-checkout-drawer"
              style={{
                width: "100%",
                background: "#16a34a",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              <IconWhatsApp size={18} />
              <span>{inquirySent ? "Inquiry Prepared!" : t("wholesale_inquiry_btn")}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
