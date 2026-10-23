"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import {
  IconDroplet,
  IconFlask,
  IconShield,
  IconBrush,
  IconCheck,
  IconX,
  IconSparkles,
  IconAward
} from "./Icons";

export default function WhyCleaningMatters() {
  const { t } = useStore();

  return (
    <section className="why-cleaning-section" style={{ padding: "40px 0 32px", backgroundColor: "#ffffff" }}>
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#f0fdfa",
              color: "#0f766e",
              border: "1px solid #ccfbf1",
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "0.78rem",
              fontWeight: "700",
              marginBottom: "8px",
              textTransform: "uppercase"
            }}
          >
            <IconSparkles size={14} />
            <span>Health &amp; Everyday Hygiene</span>
          </div>

          <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#09090b", margin: "0 0 8px" }}>
            Why Proper Cleaning Essentials Matter
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
            Everyday surfaces carry bacteria, hard-water mineral scale, dust mites, and damp odors. Using the right chemical concentration keeps your home sanitized and pests away.
          </p>
        </div>

        {/* 4 Pillars of House Cleaning */}
        <div className="pillars-grid" style={{ marginBottom: "40px" }}>
          {/* Pillar 1: Phenyl */}
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background: "#f0fdfa", color: "#0f766e" }}>
              <IconDroplet size={22} />
            </div>
            <h4>Floor Disinfection &amp; Fly Control</h4>
            <p>
              Daily mopping with concentrated pine white phenyl kills 99.9% of bacteria, eliminates damp floor odors, and naturally repels houseflies and crawling ants.
            </p>
          </div>

          {/* Pillar 2: Bathroom Acid */}
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
              <IconFlask size={22} />
            </div>
            <h4>Hard Water &amp; Scale Removal</h4>
            <p>
              Tap water leaves stubborn yellow limescale on tiles and toilet pans. Our stabilized descaling acid breaks down deposits in minutes without damaging ceramic glaze.
            </p>
          </div>

          {/* Pillar 3: Naphthalene Balls */}
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background: "#f8fafc", color: "#475569" }}>
              <IconShield size={22} />
            </div>
            <h4>Moth &amp; Pest Repellent</h4>
            <p>
              Pure snow-white naphthalene balls slowly evaporate in wardrobes, sinks, and shoe racks to protect silks and woolens from silverfish, cockroaches, and monsoon fungus.
            </p>
          </div>

          {/* Pillar 4: Brooms & Mops */}
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background: "#f1f5f9", color: "#0f172a" }}>
              <IconBrush size={22} />
            </div>
            <h4>Dust-Free Natural Sweeping</h4>
            <p>
              Crafted from long hill grass with reinforced bindings. Gathers micro-dust without shedding grass particles, keeping tile and marble floors scratch-free.
            </p>
          </div>
        </div>

        {/* Comparison Table: Market Diluted vs Majin Studios Direct */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px 20px",
            overflowX: "auto"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#09090b", margin: "0 0 4px" }}>
              Standard Market Products vs. Majin Studios Direct Supply
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
              See why direct manufacturer sourcing gives you better cleanliness and saves your budget
            </p>
          </div>

          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>Feature</th>
                  <th style={{ width: "32%", color: "#dc2626" }}>Ordinary Market Brands</th>
                  <th style={{ width: "33%", color: "#0f766e" }}>Majin Studios Direct</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Chemical Concentration</strong>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Pine oil &amp; active germicides</div>
                  </td>
                  <td style={{ color: "#dc2626" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <IconX size={15} />
                      <span>Heavily diluted with water &amp; colored dyes</span>
                    </div>
                  </td>
                  <td style={{ color: "#0f766e", fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <IconCheck size={15} />
                      <span>Thick concentrated pine oil emulsion</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Broom Grass &amp; Binding</strong>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Durability &amp; dust shedding</div>
                  </td>
                  <td style={{ color: "#dc2626" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <IconX size={15} />
                      <span>Loose plastic ties; sheds yellow dust</span>
                    </div>
                  </td>
                  <td style={{ color: "#0f766e", fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <IconCheck size={15} />
                      <span>Pure hill grass with nylon wire bind</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Naphthalene Purity</strong>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Residue &amp; evaporation</div>
                  </td>
                  <td style={{ color: "#dc2626" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <IconX size={15} />
                      <span>Chalk adulterants leave powder stains</span>
                    </div>
                  </td>
                  <td style={{ color: "#0f766e", fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <IconCheck size={15} />
                      <span>99.5% pure snow-white; zero stain residue</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Pricing &amp; Value</strong>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Middlemen commission</div>
                  </td>
                  <td style={{ color: "#dc2626" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <IconX size={15} />
                      <span>High retail shop &amp; distributor markups</span>
                    </div>
                  </td>
                  <td style={{ color: "#0f766e", fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <IconCheck size={15} />
                      <span>Direct depot price — save 30% to 40%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
