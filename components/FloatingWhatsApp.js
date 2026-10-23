"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import { IconWhatsApp } from "./Icons";

export default function FloatingWhatsApp() {
  const { settings } = useStore();

  const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
  const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;

  return (
    <aside className="floating-whatsapp-widget">
      <span className="wa-floating-label">Order on WhatsApp</span>
      <a
        href={`https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20I%20have%20an%20inquiry%20about%20your%20house%20cleaning%20chemicals.`}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-floating-btn"
        title="Direct WhatsApp Chat"
      >
        <IconWhatsApp size={24} />
      </a>
    </aside>
  );
}
