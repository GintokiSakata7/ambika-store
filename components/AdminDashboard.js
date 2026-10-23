"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";

export default function AdminDashboard() {
  const {
    products,
    settings,
    orders,
    currentRole,
    setCurrentRole,
    updateProduct,
    addProduct,
    deleteProduct,
    resetProductsToDefault,
    updateSettings,
    updateOrderStatus,
    deleteOrder,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState("products"); // "products" | "orders" | "settings" | "add"
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Inline editing state: { [productId]: { price, mrp, stock } }
  const [inlineEdits, setInlineEdits] = useState({});

  // Full Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 90,
    mrp: 120,
    unit: "1 Litre Bottle",
    category: "phenyl",
    categoryName: "Phenol & Floor Cleaners",
    badge: "New Arrival",
    potency: "99.9% Germ Protection",
    stock: "In Stock",
    image: "/images/white_phenyl_cleaner.jpg",
    description: "Premium house cleaning supply formulated by Majin Studios.",
    usage: "Dilute in water as per directions."
  });

  // Settings Form State
  const [storeSettingsForm, setStoreSettingsForm] = useState({
    storeName: settings.storeName,
    companyName: settings.companyName,
    whatsappNumber: settings.whatsappNumber,
    deliveryMinimum: settings.deliveryMinimum,
    deliveryBannerNotice: settings.deliveryBannerNotice,
    supportPhone: settings.supportPhone
  });

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    const q = searchFilter.toLowerCase().trim();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const handleInlineChange = (productId, field, value) => {
    setInlineEdits((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {
          price: products.find((p) => p.id === productId)?.price,
          mrp: products.find((p) => p.id === productId)?.mrp,
          stock: products.find((p) => p.id === productId)?.stock || "In Stock"
        }),
        [field]: value
      }
    }));
  };

  const handleSaveInline = (productId) => {
    const changes = inlineEdits[productId];
    if (!changes) return;
    updateProduct(productId, changes);
    // Clear inline edit state for this item
    setInlineEdits((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const handleFullEditSave = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name.trim()) {
      alert("Please enter a product name");
      return;
    }
    addProduct(newProduct);
    setNewProduct({
      name: "",
      price: 90,
      mrp: 120,
      unit: "1 Litre Bottle",
      category: "phenyl",
      categoryName: "Phenol & Floor Cleaners",
      badge: "New Arrival",
      potency: "99.9% Germ Protection",
      stock: "In Stock",
      image: "/images/white_phenyl_cleaner.jpg",
      description: "Premium house cleaning supply formulated by Majin Studios.",
      usage: "Dilute in water as per directions."
    });
    setActiveTab("products");
  };

  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    updateSettings(storeSettingsForm);
  };

  return (
    <div className="admin-dashboard-wrapper">
      {/* Admin Top Navigation Bar */}
      <header className="admin-top-header">
        <div className="container admin-nav-flex">
          <div className="admin-brand-area">
            <span className="admin-shield-icon">🛡️</span>
            <div>
              <h2>{settings.storeName} — Admin Dashboard</h2>
              <p>Demo Store Owner & Catalog Control Center • {settings.companyName}</p>
            </div>
          </div>

          <div className="admin-nav-actions">
            <button
              onClick={() => setCurrentRole("customer")}
              className="btn-switch-customer"
              title="Switch to customer storefront view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Switch to Customer Storefront</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "30px 20px 80px" }}>
        {/* KPI Summary Cards Strip */}
        <section className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="kpi-icon-box" style={{ background: "#e0f2fe", color: "#0284c7" }}>
              📦
            </div>
            <div>
              <div className="kpi-val">{products.length}</div>
              <div className="kpi-label">Active Products in Catalog</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-box" style={{ background: "#ecfdf5", color: "#16a34a" }}>
              🚚
            </div>
            <div>
              <div className="kpi-val">₹{settings.deliveryMinimum}</div>
              <div className="kpi-label">Min Delivery Threshold</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-box" style={{ background: "#f0fdf4", color: "#25d366" }}>
              💬
            </div>
            <div>
              <div className="kpi-val" style={{ fontSize: "1.1rem" }}>{settings.whatsappNumber}</div>
              <div className="kpi-label">WhatsApp Order Desk</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-box" style={{ background: "#eef2ff", color: "#6366f1" }}>
              📑
            </div>
            <div>
              <div className="kpi-val">{orders.length}</div>
              <div className="kpi-label">Demo Orders Logged</div>
            </div>
          </div>
        </section>

        {/* Dashboard Tabs */}
        <div className="admin-main-tabs">
          <button
            className={`admin-main-tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            📦 Product Catalog & Pricing ({products.length})
          </button>
          <button
            className={`admin-main-tab-btn ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            ➕ Add New Product
          </button>
          <button
            className={`admin-main-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            📋 Incoming Orders Log ({orders.length})
          </button>
          <button
            className={`admin-main-tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Store & Delivery Settings
          </button>
        </div>

        {/* TAB 1: PRODUCT INVENTORY & PRICING */}
        {activeTab === "products" && (
          <section className="admin-content-panel">
            <div className="admin-panel-toolbar">
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", flex: 1 }}>
                <input
                  type="text"
                  placeholder="Filter by product name..."
                  className="form-control"
                  style={{ maxWidth: "280px" }}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
                <select
                  className="form-control"
                  style={{ maxWidth: "220px" }}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="phenyl">Phenol & Floor Cleaners</option>
                  <option value="acids">Acids & Toilet Cleaners</option>
                  <option value="naphthalene">Naphthalene Balls</option>
                  <option value="powders">Bleach & Powders</option>
                  <option value="brooms">Brooms, Mops & Wipers</option>
                  <option value="accessories">Scrubbers & Buckets</option>
                </select>
              </div>

              <button
                className="btn-primary"
                onClick={() => setActiveTab("add")}
                style={{ whiteSpace: "nowrap" }}
              >
                ➕ Add New Product
              </button>
            </div>

            {/* Products Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category & Pack</th>
                    <th>Price (₹)</th>
                    <th>MRP (₹)</th>
                    <th>Stock Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const currentInline = inlineEdits[p.id] || {};
                    const priceVal = currentInline.price !== undefined ? currentInline.price : p.price;
                    const mrpVal = currentInline.mrp !== undefined ? currentInline.mrp : p.mrp;
                    const stockVal = currentInline.stock !== undefined ? currentInline.stock : (p.stock || "In Stock");
                    const hasChanges = inlineEdits[p.id] !== undefined;

                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                            />
                            <div>
                              <strong style={{ fontSize: "0.88rem", color: "#0f172a", display: "block" }}>{p.name}</strong>
                              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{p.potency || "Standard"}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div style={{ fontSize: "0.82rem", color: "#334155" }}>{p.categoryName}</div>
                          <span style={{ fontSize: "0.74rem", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                            {p.unit}
                          </span>
                        </td>

                        <td>
                          <input
                            type="number"
                            className="admin-inline-input"
                            value={priceVal}
                            onChange={(e) => handleInlineChange(p.id, "price", Number(e.target.value))}
                            style={{ width: "80px" }}
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            className="admin-inline-input"
                            value={mrpVal}
                            onChange={(e) => handleInlineChange(p.id, "mrp", Number(e.target.value))}
                            style={{ width: "80px" }}
                          />
                        </td>

                        <td>
                          <select
                            className="admin-inline-input"
                            value={stockVal}
                            onChange={(e) => handleInlineChange(p.id, "stock", e.target.value)}
                            style={{
                              fontWeight: "600",
                              color: stockVal === "In Stock" ? "#16a34a" : stockVal === "Low Stock" ? "#d97706" : "#dc2626"
                            }}
                          >
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                          </select>
                        </td>

                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {hasChanges && (
                              <button
                                className="btn-admin-save"
                                onClick={() => handleSaveInline(p.id)}
                                title="Save inline edits"
                              >
                                ✓ Save
                              </button>
                            )}
                            <button
                              className="btn-outline"
                              style={{ padding: "5px 10px", fontSize: "0.78rem" }}
                              onClick={() => setEditingProduct({ ...p })}
                              title="Full edit modal"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn-admin-delete"
                              onClick={() => {
                                if (confirm(`Delete product "${p.name}"?`)) deleteProduct(p.id);
                              }}
                              title="Delete product"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 2: ADD NEW PRODUCT */}
        {activeTab === "add" && (
          <section className="admin-content-panel">
            <h3 style={{ fontSize: "1.2rem", color: "#0f172a", marginBottom: "16px" }}>
              Add New House Cleaning Item to Catalog
            </h3>

            <form onSubmit={handleCreateProduct} className="form-grid">
              <div className="form-group full-width">
                <label>Product Title <span className="req">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ultra Pine Floor Disinfectant 1L"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Selling Price (₹) <span className="req">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label>MRP (₹) <span className="req">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  value={newProduct.mrp}
                  onChange={(e) => setNewProduct({ ...newProduct, mrp: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Pack Unit / Volume <span className="req">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 1 Litre Bottle, Pack of 5"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category <span className="req">*</span></label>
                <select
                  className="form-control"
                  value={newProduct.category}
                  onChange={(e) => {
                    const catMap = {
                      phenyl: "Phenol & Floor Cleaners",
                      acids: "Acids & Toilet Cleaners",
                      naphthalene: "Pest & Odor Control",
                      powders: "Bleach & Cleaning Powders",
                      brooms: "Brooms, Mops & Wipers",
                      accessories: "Scrubbers, Buckets & Tools"
                    };
                    setNewProduct({
                      ...newProduct,
                      category: e.target.value,
                      categoryName: catMap[e.target.value] || "General Supplies"
                    });
                  }}
                >
                  <option value="phenyl">Phenol & Floor Cleaners</option>
                  <option value="acids">Acids & Toilet Cleaners</option>
                  <option value="naphthalene">Naphthalene Balls</option>
                  <option value="powders">Bleach & Powders</option>
                  <option value="brooms">Brooms, Mops & Wipers</option>
                  <option value="accessories">Scrubbers & Buckets</option>
                </select>
              </div>

              <div className="form-group">
                <label>Product Photography Image</label>
                <select
                  className="form-control"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                >
                  <option value="/images/white_phenyl_cleaner.jpg">White Phenyl / Pine Floor Cleaner</option>
                  <option value="/images/toilet_acid_cleaner.jpg">Bathroom & Toilet Acid Cleaner</option>
                  <option value="/images/naphthalene_balls.jpg">Pure Naphthalene Mothballs Pack</option>
                  <option value="/images/bleach_scrubber_bucket.jpg">Bleach Powder, Scrubbers & Bucket</option>
                  <option value="/images/brooms_and_mop.jpg">Grass Broom & Telescopic Mop Stick</option>
                  <option value="/images/cleaning_accessories.jpg">Rubber Gloves & Microfiber Cloths</option>
                </select>
              </div>

              <div className="form-group">
                <label>Potency / Badge Highlight</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 99.9% Germ Protection, Best Seller"
                  value={newProduct.potency}
                  onChange={(e) => setNewProduct({ ...newProduct, potency: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>Description & Cleaning Benefits</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group full-width" style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  🚀 Publish to Customer Storefront
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setActiveTab("products")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* TAB 3: INCOMING DEMO ORDERS LOG */}
        {activeTab === "orders" && (
          <section className="admin-content-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.2rem", color: "#0f172a" }}>
                Live WhatsApp Orders Log
              </h3>
              <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                Captures all customer orders submitted via checkout
              </span>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 20px", color: "#64748b", background: "#f8fafc", borderRadius: "10px" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📦</div>
                <h4>No Demo Orders Logged Yet</h4>
                <p style={{ fontSize: "0.86rem", marginBottom: "16px" }}>
                  Switch to Customer view, add items to cart, and click &quot;Send Order to WhatsApp&quot; to test placing orders!
                </p>
                <button
                  className="btn-outline"
                  onClick={() => setCurrentRole("customer")}
                >
                  Open Storefront to Place a Test Order
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {orders.map((ord) => (
                  <div key={ord.orderId} className="admin-order-card">
                    <div className="admin-order-head">
                      <div>
                        <strong>{ord.orderId}</strong> • <span style={{ color: "#0f766e" }}>{ord.customer?.fullName}</span>
                        <div style={{ fontSize: "0.76rem", color: "#64748b" }}>Placed: {ord.date}</div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <select
                          className="admin-inline-input"
                          value={ord.status || "New Order"}
                          onChange={(e) => updateOrderStatus(ord.orderId, e.target.value)}
                          style={{
                            fontWeight: "700",
                            background: ord.status === "Delivered" ? "#dcfce7" : ord.status === "Dispatched" ? "#e0f2fe" : "#fef3c7",
                            color: ord.status === "Delivered" ? "#15803d" : ord.status === "Dispatched" ? "#0369a1" : "#b45309"
                          }}
                        >
                          <option value="New Order">New Order</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          className="btn-admin-delete"
                          onClick={() => deleteOrder(ord.orderId)}
                          title="Delete order"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="admin-order-body">
                      <div>
                        <div style={{ fontSize: "0.78rem", color: "#64748b" }}>Customer Contact:</div>
                        <div style={{ fontSize: "0.84rem", fontWeight: "600" }}>📞 {ord.customer?.phone}</div>
                        <a
                          href={`https://wa.me/91${ord.customer?.phone?.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "0.76rem", color: "#16a34a", textDecoration: "underline" }}
                        >
                          Chat on WhatsApp
                        </a>
                      </div>

                      <div>
                        <div style={{ fontSize: "0.78rem", color: "#64748b" }}>Delivery Address:</div>
                        <div style={{ fontSize: "0.84rem" }}>
                          {ord.orderType === "delivery"
                            ? `${ord.customer?.address || "Address given"}, Pincode: ${ord.customer?.pincode || "N/A"}`
                            : "🏬 Store Self-Pickup"}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: "0.78rem", color: "#64748b" }}>Order Total:</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>
                          ₹{ord.subtotal}
                        </div>
                        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                          {ord.customer?.paymentMethod || "COD"}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px dashed #e2e8f0", fontSize: "0.78rem", color: "#334155" }}>
                      <strong>Items ({ord.items?.length || 0}):</strong>{" "}
                      {ord.items?.map((it) => `${it.name} (x${it.quantity})`).join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 4: STORE SETTINGS */}
        {activeTab === "settings" && (
          <section className="admin-content-panel">
            <h3 style={{ fontSize: "1.2rem", color: "#0f172a", marginBottom: "16px" }}>
              Store, WhatsApp & Delivery Configuration
            </h3>

            <form onSubmit={handleSaveStoreSettings} className="form-grid">
              <div className="form-group">
                <label>Store Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={storeSettingsForm.storeName}
                  onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, storeName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Parent Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={storeSettingsForm.companyName}
                  onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Order Desk Number (Without + or spaces)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="9491554114"
                  value={storeSettingsForm.whatsappNumber}
                  onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, whatsappNumber: e.target.value })}
                  required
                />
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  Orders sent via WhatsApp will be addressed to this number.
                </span>
              </div>

              <div className="form-group">
                <label>Minimum Order for Doorstep Delivery (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={storeSettingsForm.deliveryMinimum}
                  onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, deliveryMinimum: Number(e.target.value) })}
                  required
                />
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  Cart progress bar and qualification check updates automatically.
                </span>
              </div>

              <div className="form-group full-width">
                <label>Top Announcement Notice Bar</label>
                <input
                  type="text"
                  className="form-control"
                  value={storeSettingsForm.deliveryBannerNotice}
                  onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, deliveryBannerNotice: e.target.value })}
                  required
                />
              </div>

              <div className="form-group full-width" style={{ marginTop: "12px" }}>
                <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                  💾 Save & Apply Store Settings
                </button>
              </div>
            </form>

            {/* Demo Reset Option */}
            <div style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px dashed #cbd5e1" }}>
              <h4 style={{ fontSize: "1rem", color: "#b91c1c", marginBottom: "6px" }}>
                🔄 Reset Everything to Factory Demo State
              </h4>
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "14px" }}>
                If you have edited prices, added mock items, or customized settings and wish to restore the pristine demo catalog:
              </p>
              <button
                type="button"
                className="btn-outline"
                style={{ color: "#b91c1c", borderColor: "#fecaca", background: "#fef2f2" }}
                onClick={() => {
                  if (confirm("Reset all products, combos, and store settings back to original defaults?")) {
                    resetProductsToDefault();
                  }
                }}
              >
                Reset All Products & Settings to Default
              </button>
            </div>
          </section>
        )}

        {/* Full Product Edit Modal */}
        {editingProduct && (
          <div
            className="modal-overlay open"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingProduct(null);
            }}
          >
            <div className="modal-window">
              <div className="modal-header">
                <h3>✏️ Edit Product: {editingProduct.name}</h3>
                <button className="btn-close-drawer" onClick={() => setEditingProduct(null)}>✕</button>
              </div>

              <form onSubmit={handleFullEditSave} className="modal-body form-grid">
                <div className="form-group full-width">
                  <label>Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>MRP (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingProduct.mrp}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Pack Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingProduct.unit}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock Status</label>
                  <select
                    className="form-control"
                    value={editingProduct.stock || "In Stock"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Potency / Highlight Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingProduct.potency || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, potency: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={editingProduct.description || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="form-group full-width" style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                    Save Product
                  </button>
                  <button type="button" className="btn-outline" onClick={() => setEditingProduct(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
