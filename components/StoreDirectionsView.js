"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import {
  IconMapPin,
  IconNavigation,
  IconPhone,
  IconWhatsApp,
  IconClock,
  IconCheck,
  IconStore,
  IconSparkles
} from "./Icons";

export default function StoreDirectionsView() {
  const { settings, t, setCatalogMode } = useStore();

  const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
  const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;

  // Google Maps Universal Deep Link for native turn-by-turn navigation
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=Majin+Studios+Cleaning+Chemicals+Depot+Station+Road+Main+Market`;

  return (
    <section className="store-directions-page" style={{ padding: "20px 0 60px" }}>
      <div className="container" style={{ maxWidth: "860px" }}>
        {/* Page Top Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #0f766e 100%)",
            color: "#ffffff",
            borderRadius: "14px",
            padding: "24px 20px",
            marginBottom: "20px",
            boxShadow: "0 10px 25px -5px rgba(15, 118, 110, 0.25)"
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: "9999px", fontSize: "0.76rem", fontWeight: 600, marginBottom: "12px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80" }}></span>
            <span>OPEN NOW • COUNTER READY</span>
          </div>

          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, margin: "0 0 8px", color: "#ffffff" }}>
            Visit Majin Studios Depot
          </h2>

          <p style={{ margin: "0 0 18px", fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.5 }}>
            Pick up your cleaning chemicals in person with 100% Free Store Pickup, inspect concentrated pine samples, or load commercial 5L &amp; 20L cans directly into your vehicle.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#ffffff",
                color: "#0f172a",
                padding: "12px 18px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.88rem",
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
              }}
            >
              <IconNavigation size={18} style={{ color: "#0f766e" }} />
              <span>Get Directions in Google Maps</span>
            </a>

            <a
              href={`https://wa.me/${cleanNumber}?text=Hi%20Majin%20Studios%2C%20I%20am%20heading%20to%20your%20depot%20for%20cleaning%20supplies%20pickup.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#16a34a",
                color: "#ffffff",
                padding: "12px 18px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.88rem",
                textDecoration: "none"
              }}
            >
              <IconWhatsApp size={18} />
              <span>WhatsApp Counter Desk</span>
            </a>
          </div>
        </div>

        {/* Map Preview Card & Quick Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {/* Card 1: Depot Address & Coordinates */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#0f766e" }}>
              <IconMapPin size={20} />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#09090b", margin: 0 }}>
                Store &amp; Depot Address
              </h3>
            </div>

            <p style={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.5, margin: "0 0 12px" }}>
              <strong>Majin Studios Cleaning Supplies Depot</strong><br />
              Station Road, Opposite Main Market Water Tank<br />
              Commercial Housekeeping Wholesale Hub<br />
              Pincode: 500001
            </p>

            <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "8px", border: "1px solid #f1f5f9", fontSize: "0.8rem", color: "#64748b", marginBottom: "14px" }}>
              <strong>Landmark:</strong> 200 meters from Main Railway Station Overbridge, near Central Goods Loading Shed.
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "10px",
                fontSize: "0.84rem"
              }}
            >
              <IconNavigation size={15} />
              <span>Launch Live Google Maps GPS</span>
            </a>
          </div>

          {/* Card 2: Operating Hours & Direct Dispatch Contact */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#0f766e" }}>
              <IconClock size={20} />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#09090b", margin: 0 }}>
                Depot Working Hours
              </h3>
            </div>

            <div style={{ fontSize: "0.85rem", color: "#334155", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span>Monday – Saturday:</span>
                <strong>9:00 AM – 8:00 PM</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span>Sunday:</span>
                <strong>9:00 AM – 2:00 PM</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span>Dispatch &amp; Loading:</span>
                <strong style={{ color: "#16a34a" }}>All Day Active</strong>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <a
                href={`tel:+91${cleanNumber}`}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  background: "#f1f5f9",
                  color: "#0f172a",
                  padding: "10px",
                  borderRadius: "6px",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid #e2e8f0"
                }}
              >
                <IconPhone size={15} />
                <span>Call Counter</span>
              </a>

              <a
                href={`https://wa.me/${cleanNumber}?text=Hi%20Majin%20Studios%2C%20what%20are%20today%27s%20counter%20timings%3F`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  background: "#16a34a",
                  color: "#ffffff",
                  padding: "10px",
                  borderRadius: "6px",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                <IconWhatsApp size={15} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Counter Pickup Advantages */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "24px"
          }}
        >
          <h4 style={{ fontSize: "0.98rem", fontWeight: 700, color: "#09090b", marginBottom: "14px" }}>
            Why Visit Our Depot in Person?
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#ecfdf5", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconCheck size={16} />
              </div>
              <div>
                <strong style={{ fontSize: "0.86rem", color: "#09090b", display: "block" }}>100% Free Store Pickup</strong>
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>No minimum cart limit. Book on WhatsApp and collect in 5 minutes.</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#ecfdf5", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconCheck size={16} />
              </div>
              <div>
                <strong style={{ fontSize: "0.86rem", color: "#09090b", display: "block" }}>Check Fragrance &amp; Density</strong>
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Test our concentrated pine emulsion and tile acids on real stone before buying.</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#ecfdf5", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconCheck size={16} />
              </div>
              <div>
                <strong style={{ fontSize: "0.86rem", color: "#09090b", display: "block" }}>Instant Vehicle Loading</strong>
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Staff helps load 5L cans and 20L carboys directly into your auto or car trunk.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Products Bar */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setCatalogMode("retail")}
            className="btn-primary"
            style={{ padding: "12px 24px", fontSize: "0.9rem" }}
          >
            &larr; Back to Cleaning Catalog
          </button>
        </div>
      </div>
    </section>
  );
}
