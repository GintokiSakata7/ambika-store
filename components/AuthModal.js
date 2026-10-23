"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    loginAsAdmin,
    loginAsCustomer,
    currentUser
  } = useStore();

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleFillDemoCredentials = () => {
    setAdminEmail("admin@majinstudios.com");
    setAdminPassword("admin");
  };

  const handleOneClickDemoLogin = () => {
    setIsAutoLoggingIn(true);
    setAdminEmail("admin@majinstudios.com");
    setAdminPassword("admin");
    setTimeout(() => {
      loginAsAdmin("admin@majinstudios.com", "admin");
      setIsAutoLoggingIn(false);
    }, 400);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    loginAsAdmin(adminEmail || "admin@majinstudios.com", adminPassword || "admin");
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    loginAsCustomer(customerName, customerPhone);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAuthModalOpen(false);
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="auth-modal-window">
        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-header-brand">
            <div className="auth-shield-icon">🛡️</div>
            <div>
              <h3>Majin Studios Sign In</h3>
              <p>Demo Admin Portal & Customer Access</p>
            </div>
          </div>
          <button
            className="btn-close-drawer"
            onClick={() => setIsAuthModalOpen(false)}
            title="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${authModalTab === "admin" ? "active" : ""}`}
            onClick={() => setAuthModalTab("admin")}
          >
            🛡️ Store Admin Demo
          </button>
          <button
            className={`auth-tab-btn ${authModalTab === "customer" ? "active" : ""}`}
            onClick={() => setAuthModalTab("customer")}
          >
            👤 Customer Shopper
          </button>
        </div>

        <div className="auth-modal-body">
          {authModalTab === "admin" ? (
            <div className="auth-admin-pane">
              {/* Highlighted One-Click Demo Box */}
              <div className="demo-credentials-card">
                <div className="demo-card-head">
                  <span className="demo-pulse-dot"></span>
                  <span className="demo-card-title">Instant Demo Access</span>
                </div>
                <p className="demo-card-desc">
                  Click below to auto-fill credentials and immediately enter the Store Admin Dashboard to manage products and categories.
                </p>
                <button
                  type="button"
                  className="btn-auto-demo-login"
                  onClick={handleOneClickDemoLogin}
                  disabled={isAutoLoggingIn}
                >
                  {isAutoLoggingIn ? (
                    <span>⏳ Signing in as Admin...</span>
                  ) : (
                    <>
                      <span>⚡ One-Click Auto Credentials & Login</span>
                    </>
                  )}
                </button>
                <div className="demo-credentials-chips">
                  <span>Email: <code>admin@majinstudios.com</code></span>
                  <span>Password: <code>admin</code></span>
                </div>
              </div>

              <div className="auth-divider">
                <span>or enter manually</span>
              </div>

              {/* Manual Form */}
              <form onSubmit={handleAdminSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="admin-email">Admin Email / Username</label>
                  <input
                    id="admin-email"
                    type="text"
                    className="form-control"
                    placeholder="admin@majinstudios.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admin-password">Password</label>
                  <input
                    id="admin-password"
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <button
                    type="button"
                    className="btn-link-action"
                    onClick={handleFillDemoCredentials}
                  >
                    Auto-Fill Demo Credentials
                  </button>
                </div>

                <button type="submit" className="btn-primary full-width">
                  Sign In to Admin Dashboard →
                </button>
              </form>
            </div>
          ) : (
            <div className="auth-customer-pane">
              <div className="customer-info-box">
                <h4>Welcome to Majin Studios!</h4>
                <p>
                  You can explore our full catalog of house cleaning chemicals and book orders directly via WhatsApp. Sign in with your name or continue as a guest.
                </p>
              </div>

              <form onSubmit={handleCustomerSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="customer-name">Your Full Name (Optional)</label>
                  <input
                    id="customer-name"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customer-phone">WhatsApp Mobile Number (Optional)</label>
                  <input
                    id="customer-phone"
                    type="tel"
                    className="form-control"
                    placeholder="10-digit mobile number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    maxLength={10}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                  <button type="submit" className="btn-primary full-width">
                    Save Details & Continue Shopping
                  </button>
                  <button
                    type="button"
                    className="btn-outline full-width"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                    }}
                  >
                    Continue as Guest Shopper
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
