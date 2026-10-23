"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import { IconCheck, IconShield, IconX } from "./Icons";

export default function Toast() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
            style={{ cursor: "pointer" }}
          >
            {toast.type === "error" ? (
              <IconX size={15} />
            ) : toast.type === "warning" || toast.type === "info" ? (
              <IconShield size={15} />
            ) : (
              <IconCheck size={15} />
            )}
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
