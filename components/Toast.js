"use client";

import React from "react";
import { useStore } from "../context/StoreContext";

export default function Toast() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let icon = "✓";
        if (toast.type === "warning") icon = "⚠️";
        if (toast.type === "info") icon = "ℹ️";

        return (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
            style={{ cursor: "pointer" }}
          >
            <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{icon}</span>
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
