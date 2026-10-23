"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import {
  IconStar,
  IconQuote,
  IconShieldCheck,
  IconAward,
  IconTruck,
  IconTag,
  IconWhatsApp,
  IconHeartHandshake,
  IconCheck
} from "./Icons";

export default function TrustAndTestimonials() {
  const { settings, t } = useStore();

  const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
  const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;

  const reviews = [
    {
      id: 1,
      name: "Suresh Vardhan",
      role: "Apartment RWA Secretary (64 Flats)",
      rating: 5,
      date: "Verified Buyer",
      comment:
        "We order the 5L white phenyl canisters and cotton floor mops every month for our entire building. The pine smell lasts throughout the day and corridors stay fresh. Sourcing directly saves our society maintenance fund over ₹3,000 every month."
    },
    {
      id: 2,
      name: "Anitha Rao",
      role: "Homeowner & Mother",
      rating: 5,
      date: "Verified Customer",
      comment:
        "The naphthalene mothballs and bathroom descaling acid are fantastic. The acid cleared 2 years of borewell hard water stains in under 10 minutes without harsh fumes. Ordered on WhatsApp and got it delivered to my doorstep the same evening!"
    },
    {
      id: 3,
      name: "K. Venkatesh",
      role: "Supermarket & General Store Retailer",
      rating: 5,
      date: "Wholesale Partner",
      comment:
        "I take wholesale cartons of cheepuru brooms and 1L phenyl bottles for my grocery store. Customers always come back for these brooms because the grass is heavy, clean, and does not shed yellow powder."
    }
  ];

  return (
    <section className="trust-section" style={{ padding: "40px 0 48px", backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#ecfdf5",
              color: "#16a34a",
              border: "1px solid #bbf7d0",
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "0.78rem",
              fontWeight: "700",
              marginBottom: "8px",
              textTransform: "uppercase"
            }}
          >
            <IconShieldCheck size={14} />
            <span>Customer Trust &amp; Social Proof</span>
          </div>

          <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#09090b", margin: "0 0 8px" }}>
            Trusted by Families, Apartments &amp; Shopkeepers
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0 }}>
            Read real feedback from customers who rely on Majin Studios chemicals and cleaning essentials daily.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid" style={{ marginBottom: "40px" }}>
          {reviews.map((rev) => (
            <div key={rev.id} className="testimonial-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ display: "flex", gap: "2px", color: "#f59e0b" }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <IconStar key={i} size={15} />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: "600",
                    color: "#16a34a",
                    background: "#ecfdf5",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px"
                  }}
                >
                  <IconCheck size={11} />
                  <span>{rev.date}</span>
                </span>
              </div>

              <p className="testimonial-comment">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <div className="testimonial-author">
                <div className="author-avatar">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <div className="author-name">{rev.name}</div>
                  <div className="author-role">{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Founder & Owner Direct Supply Note */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "28px 24px",
            marginBottom: "32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #f1f5f9", paddingBottom: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "#f0fdfa",
                  color: "#0f766e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <IconHeartHandshake size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#09090b", margin: 0 }}>
                  A Promise from the Makers at {settings.storeName}
                </h3>
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  Direct chemical blending &amp; broom crafting depot
                </span>
              </div>
            </div>

            <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: "1.6", margin: 0 }}>
              &quot;We started {settings.storeName} with one simple goal: to provide households, apartments, and local shopkeepers with genuinely concentrated cleaning chemicals without the heavy dilution and inflated markups common in retail stores. When you buy our white phenyl or toilet acid, you get genuine high-potency pine and acid concentrates, packed safely in leak-proof containers with child-resistant caps. We stand behind every bottle and broom we dispatch.&quot;
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", paddingTop: "8px" }}>
              <div style={{ fontSize: "0.82rem", color: "#0f766e", fontWeight: "600" }}>
                — Founder &amp; Operations Team, Majin Studios
              </div>

              <a
                href={`https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20I%20want%20to%20know%20more%20about%20your%20cleaning%20chemicals.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  fontSize: "0.82rem",
                  color: "#0f766e",
                  borderColor: "#0f766e"
                }}
              >
                <IconWhatsApp size={14} />
                <span>Message Founder Desk on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Trust Guarantee Badges */}
        <div className="trust-badges-grid">
          <div className="trust-badge-card">
            <IconAward size={22} style={{ color: "#0f766e" }} />
            <div>
              <strong>100% Active Formula</strong>
              <p>No excessive water dilution</p>
            </div>
          </div>

          <div className="trust-badge-card">
            <IconShieldCheck size={22} style={{ color: "#0f766e" }} />
            <div>
              <strong>Leak-Proof &amp; Safe</strong>
              <p>Sealed child-resistant caps</p>
            </div>
          </div>

          <div className="trust-badge-card">
            <IconTag size={22} style={{ color: "#0f766e" }} />
            <div>
              <strong>Direct Factory Price</strong>
              <p>Save 30% to 40% every month</p>
            </div>
          </div>

          <div className="trust-badge-card">
            <IconTruck size={22} style={{ color: "#0f766e" }} />
            <div>
              <strong>Free Delivery on ₹{settings.deliveryMinimum}+</strong>
              <p>Or free store pickup at depot</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
