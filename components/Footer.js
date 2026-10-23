"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import { IconPhone, IconWhatsApp, IconMapPin } from "./Icons";

export default function Footer() {
  const { settings } = useStore();

  const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
  const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>{settings.storeName}</h4>
            <p>
              Manufacturer and distributor of house cleaning chemicals, sanitary essentials, and domestic hygiene supplies. Operated by <strong>{settings.companyName}</strong>.
            </p>
            <div style={{ background: "rgba(255,255,255,0.06)", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", color: "#94a3b8" }}>
              Direct Wholesale &amp; Retail WhatsApp Ordering
            </div>
          </div>

          <div className="footer-col">
            <h4>Product Categories</h4>
            <ul className="footer-links">
              <li><a href="#catalog-section">Concentrated White Phenyl</a></li>
              <li><a href="#catalog-section">Bathroom &amp; Tile Acids</a></li>
              <li><a href="#catalog-section">Pure Naphthalene Balls</a></li>
              <li><a href="#catalog-section">Bleach &amp; Cleaning Powders</a></li>
              <li><a href="#catalog-section">Brooms, Mops &amp; Scrubbers</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Delivery &amp; Ordering</h4>
            <ul className="footer-links">
              <li><span>Min ₹{settings.deliveryMinimum} Doorstep Home Delivery</span></li>
              <li><span>Store Self-Pickup (No Minimum)</span></li>
              <li><span>Cash / UPI on Delivery</span></li>
              <li><a href="#combos-section">Money-Saver Bundles</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact {settings.companyName}</h4>
            <div className="footer-contact-item">
              <IconPhone size={16} />
              <div>
                <strong>Customer Hotline:</strong><br />
                <a href={`tel:${settings.supportPhone}`} style={{ color: "#fff" }}>
                  {settings.supportPhone}
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <IconWhatsApp size={16} style={{ color: "#25d366" }} />
              <div>
                <strong>WhatsApp Order Desk:</strong><br />
                <a href={`https://wa.me/${cleanNumber}`} target="_blank" rel="noopener noreferrer" style={{ color: "#25d366" }}>
                  {settings.whatsappNumber}
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <IconMapPin size={16} />
              <div>
                <strong>Location:</strong><br />
                {settings.storeAddress}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved. A division of <strong>{settings.companyName}</strong>.
          </div>
          <div>
            Clean, Professional &amp; Mobile Responsive
          </div>
        </div>
      </div>
    </footer>
  );
}
