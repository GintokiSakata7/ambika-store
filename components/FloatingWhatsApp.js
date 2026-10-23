"use client";

import React from "react";
import { useStore } from "../context/StoreContext";

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
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.55C9.33 7.55 9 7.62 8.71 7.94C8.42 8.25 7.62 9 7.62 10.5C7.62 12 8.73 13.45 8.89 13.66C9.05 13.86 11.05 16.95 14.12 18.28C14.85 18.6 15.42 18.78 15.86 18.93C16.6 19.16 17.27 19.13 17.81 19.05C18.41 18.96 19.65 18.3 19.91 17.57C20.17 16.84 20.17 16.22 20.09 16.09C20.01 15.96 19.81 15.88 19.51 15.73C19.22 15.58 17.78 14.87 17.51 14.77C17.24 14.67 17.05 14.62 16.85 14.93C16.65 15.23 16.08 15.91 15.9 16.11C15.73 16.32 15.55 16.34 15.26 16.2C14.96 16.05 14.01 15.74 12.89 14.74C12.02 13.96 11.43 13 11.26 12.7C11.09 12.41 11.24 12.25 11.39 12.1C11.52 11.97 11.68 11.76 11.83 11.58C11.98 11.41 12.03 11.28 12.13 11.08C12.23 10.87 12.18 10.7 12.11 10.55C12.03 10.4 11.45 8.97 11.21 8.39C10.97 7.82 10.73 7.9 10.55 7.9H10.15C9.95 7.9 9.68 7.82 9.53 7.55Z" />
        </svg>
      </a>
    </aside>
  );
}
