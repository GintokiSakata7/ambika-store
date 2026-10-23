"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";

export default function AdminModal({ initialEditingProductId, onClearInitialEdit }) {
  const {
    products,
    settings,
    orders,
    isAdminOpen,
    setIsAdminOpen,
    updateProduct,
    addProduct,
    deleteProduct,
    resetProductsToDefault,
    updateSettings
  } = useStore();

  const [activeTab, setActiveTab] = useState("edit"); // "edit" | "add" | "settings" | "orders"
  const [selectedProductId, setSelectedProductId] = useState(
    initialEditingProductId || (products[0] ? products[0].id : "")
  );

  // Edit Product Form State
  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const [editFormData, setEditFormData] = useState({
    name: currentProduct ? currentProduct.name : "",
    price: currentProduct ? currentProduct.price : 0,
    mrp: currentProduct ? currentProduct.mrp : 0,
    unit: currentProduct ? currentProduct.unit : "",
    category: currentProduct ? currentProduct.category : "phenyl",
    categoryName: currentProduct ? currentProduct.categoryName : "Phenol & Floor Cleaners",
    badge: currentProduct ? currentProduct.badge : "",
    potency: currentProduct ? currentProduct.potency : "",
    stock: currentProduct ? (currentProduct.stock || "In Stock") : "In Stock",
    description: currentProduct ? currentProduct.description : ""
  });

  // When selected product changes or initialEditingProductId changes
  React.useEffect(() => {
    if (initialEditingProductId) {
      setSelectedProductId(initialEditingProductId);
      setActiveTab("edit");
      const target = products.find((p) => p.id === initialEditingProductId);
      if (target) {
        setEditFormData({
          name: target.name,
          price: target.price,
          mrp: target.mrp,
          unit: target.unit,
          category: target.category,
          categoryName: target.categoryName,
          badge: target.badge,
          potency: target.potency,
          stock: target.stock || "In Stock",
          description: target.description
        });
      }
    }
  }, [initialEditingProductId, products]);

  const handleSelectProduct = (id) => {
    setSelectedProductId(id);
    const target = products.find((p) => p.id === id);
    if (target) {
      setEditFormData({
        name: target.name,
        price: target.price,
        mrp: target.mrp,
        unit: target.unit,
        category: target.category,
        categoryName: target.categoryName,
        badge: target.badge,
        potency: target.potency,
        stock: target.stock || "In Stock",
        description: target.description
      });
    }
  };

  // Add Product Form State
  const [newProdData, setNewProdData] = useState({
    name: "",
    price: 99,
    mrp: 130,
    unit: "1 Litre Bottle",
    category: "phenyl",
    categoryName: "Phenol & Floor Cleaners",
    badge: "New Arrival",
    potency: "High Potency Formula",
    stock: "In Stock",
    image: "/images/white_phenyl_cleaner.jpg",
    description: "Premium house cleaning and sanitation product.",
    usage: "Dilute in water as per directions."
  });

  // Store Settings Form State
  const [settingsFormData, setSettingsFormData] = useState({
    storeName: settings.storeName,
    companyName: settings.companyName,
    whatsappNumber: settings.whatsappNumber,
    deliveryMinimum: settings.deliveryMinimum,
    deliveryBannerNotice: settings.deliveryBannerNotice
  });

  if (!isAdminOpen) return null;

  const handleSaveProductEdit = (e) => {
    e.preventDefault();
    if (!currentProduct) return;
    updateProduct(currentProduct.id, editFormData);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProdData.name.trim()) {
      alert("Please enter a product name.");
      return;
    }
    addProduct(newProdData);
    setNewProdData({
      name: "",
      price: 99,
      mrp: 130,
      unit: "1 Litre Bottle",
      category: "phenyl",
      categoryName: "Phenol & Floor Cleaners",
      badge: "New Arrival",
      potency: "High Potency Formula",
      stock: "In Stock",
      image: "/images/white_phenyl_cleaner.jpg",
      description: "Premium house cleaning and sanitation product.",
      usage: "Dilute in water as per directions."
    });
    setActiveTab("edit");
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settingsFormData);
  };

  const handleClose = () => {
    if (onClearInitialEdit) onClearInitialEdit();
    setIsAdminOpen(false);
  };

  return (
    <div
      className={`modal-overlay ${isAdminOpen ? "open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="modal-window admin-modal-window">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3>
              <span>⚙️ Store Administration</span>
              <span className="admin-demo-badge">Interactive Demo Mode</span>
            </h3>
            <p>Edit products, adjust prices, change WhatsApp number or delivery threshold</p>
          </div>
          <button className="btn-close-drawer" onClick={handleClose} title="Close admin panel">
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs-nav">
          <button
            className={`admin-tab-btn ${activeTab === "edit" ? "active" : ""}`}
            onClick={() => setActiveTab("edit")}
          >
            <span>✏️ Edit Products</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            <span>➕ Add New Product</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <span>🔧 Store Settings</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <span>📋 Demo Orders ({orders.length})</span>
          </button>
        </div>

        {/* Tab 1: Edit Products */}
        {activeTab === "edit" && (
          <div className="modal-body">
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center" }}>
              <label style={{ fontSize: "0.84rem", fontWeight: "700", whiteSpace: "nowrap" }}>
                Select Product to Edit:
              </label>
              <select
                className="form-control"
                value={selectedProductId}
                onChange={(e) => handleSelectProduct(e.target.value)}
                style={{ flex: 1 }}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{p.price} ({p.unit})
                  </option>
                ))}
              </select>
            </div>

            {currentProduct && (
              <form onSubmit={handleSaveProductEdit} className="admin-prod-card">
                <div className="admin-prod-header">
                  <div className="admin-prod-thumb-row">
                    <img src={currentProduct.image} alt={currentProduct.name} className="admin-prod-thumb" />
                    <div>
                      <h4 style={{ fontSize: "1rem", color: "#0f172a", fontWeight: "700" }}>
                        {currentProduct.name}
                      </h4>
                      <p style={{ fontSize: "0.78rem", color: "#64748b" }}>
                        ID: {currentProduct.id} • Category: {currentProduct.categoryName}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      background: currentProduct.stock === "In Stock" ? "#dcfce7" : "#fee2e2",
                      color: currentProduct.stock === "In Stock" ? "#15803d" : "#b91c1c",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "0.74rem",
                      fontWeight: "700"
                    }}
                  >
                    {editFormData.stock}
                  </span>
                </div>

                <div className="admin-prod-inputs-grid">
                  <div className="admin-field-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-field-group">
                    <label>MRP (₹)</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={editFormData.mrp}
                      onChange={(e) => setEditFormData({ ...editFormData, mrp: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-field-group">
                    <label>Pack Unit</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editFormData.unit}
                      onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                      placeholder="e.g. 1 Litre Bottle"
                      required
                    />
                  </div>

                  <div className="admin-field-group">
                    <label>Stock Status</label>
                    <select
                      className="admin-input"
                      value={editFormData.stock}
                      onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "10px", marginTop: "10px" }}>
                  <div className="admin-field-group">
                    <label>Product Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-field-group">
                    <label>Potency / Highlight Badge</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editFormData.potency}
                      onChange={(e) => setEditFormData({ ...editFormData, potency: e.target.value })}
                      placeholder="e.g. 99.9% Germ Protection"
                    />
                  </div>
                </div>

                <div className="admin-field-group" style={{ marginTop: "10px" }}>
                  <label>Description</label>
                  <textarea
                    className="admin-input"
                    rows="2"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="admin-actions-bar">
                  <button
                    type="button"
                    className="btn-admin-delete"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${currentProduct.name}" from catalog?`)) {
                        deleteProduct(currentProduct.id);
                      }
                    }}
                  >
                    🗑️ Delete Product
                  </button>

                  <button type="submit" className="btn-admin-save">
                    💾 Save Product Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Add New Product */}
        {activeTab === "add" && (
          <div className="modal-body">
            <form onSubmit={handleCreateProduct} className="form-grid">
              <div className="form-group full-width">
                <label>Product Name <span className="req">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sparkling Glass Cleaner Spray 500ml"
                  value={newProdData.name}
                  onChange={(e) => setNewProdData({ ...newProdData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Selling Price (₹) <span className="req">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  value={newProdData.price}
                  onChange={(e) => setNewProdData({ ...newProdData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>MRP (₹) <span className="req">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  value={newProdData.mrp}
                  onChange={(e) => setNewProdData({ ...newProdData, mrp: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Pack Unit / Volume <span className="req">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 500ml Trigger Spray"
                  value={newProdData.unit}
                  onChange={(e) => setNewProdData({ ...newProdData, unit: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category <span className="req">*</span></label>
                <select
                  className="form-control"
                  value={newProdData.category}
                  onChange={(e) => {
                    const catMap = {
                      phenyl: "Phenol & Floor Cleaners",
                      acids: "Acids & Toilet Cleaners",
                      naphthalene: "Pest & Odor Control",
                      powders: "Bleach & Cleaning Powders",
                      brooms: "Brooms, Mops & Wipers",
                      accessories: "Scrubbers, Buckets & Tools"
                    };
                    setNewProdData({
                      ...newProdData,
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
                <label>Product Image</label>
                <select
                  className="form-control"
                  value={newProdData.image}
                  onChange={(e) => setNewProdData({ ...newProdData, image: e.target.value })}
                >
                  <option value="/images/white_phenyl_cleaner.jpg">Floor Cleaner / Phenyl Bottle</option>
                  <option value="/images/toilet_acid_cleaner.jpg">Toilet Cleaner & Acid Bottle</option>
                  <option value="/images/naphthalene_balls.jpg">Naphthalene Mothballs Pack</option>
                  <option value="/images/bleach_scrubber_bucket.jpg">Bleach Powder & Scrubbers</option>
                  <option value="/images/brooms_and_mop.jpg">Broom & Mop Stick</option>
                  <option value="/images/cleaning_accessories.jpg">Rubber Gloves & Cloths</option>
                </select>
              </div>

              <div className="form-group">
                <label>Badge Tag</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Best Seller / Must Have / New"
                  value={newProdData.badge}
                  onChange={(e) => setNewProdData({ ...newProdData, badge: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>Short Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Explain usage and cleaning benefits..."
                  value={newProdData.description}
                  onChange={(e) => setNewProdData({ ...newProdData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group full-width" style={{ marginTop: "10px" }}>
                <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                  ➕ Add Product to Live Storefront
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Store Settings */}
        {activeTab === "settings" && (
          <div className="modal-body">
            <form onSubmit={handleSaveSettings} className="form-grid">
              <div className="form-group">
                <label>Store Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={settingsFormData.storeName}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, storeName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Parent Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={settingsFormData.companyName}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Order WhatsApp Number (no + symbol)</label>
                <input
                  type="text"
                  className="form-control"
                  value={settingsFormData.whatsappNumber}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, whatsappNumber: e.target.value })}
                  placeholder="9491554114"
                  required
                />
              </div>

              <div className="form-group">
                <label>Minimum Doorstep Delivery Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={settingsFormData.deliveryMinimum}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, deliveryMinimum: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Top Delivery Banner Notice</label>
                <input
                  type="text"
                  className="form-control"
                  value={settingsFormData.deliveryBannerNotice}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, deliveryBannerNotice: e.target.value })}
                  required
                />
              </div>

              <div className="form-group full-width" style={{ marginTop: "10px", display: "flex", gap: "12px" }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  💾 Save Store Settings
                </button>
              </div>
            </form>

            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px dashed #cbd5e1" }}>
              <h5 style={{ fontSize: "0.9rem", color: "#b91c1c", fontWeight: "700", marginBottom: "6px" }}>
                Reset Demo Data
              </h5>
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "12px" }}>
                If you have edited prices, changed names, or deleted items and want to return to the original default catalog:
              </p>
              <button
                type="button"
                className="btn-outline"
                style={{ color: "#b91c1c", borderColor: "#fecaca", background: "#fef2f2" }}
                onClick={() => {
                  if (confirm("Reset all products, combos, and store settings back to original defaults?")) {
                    resetProductsToDefault();
                    handleClose();
                  }
                }}
              >
                🔄 Reset Everything to Demo Defaults
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Demo Orders Log */}
        {activeTab === "orders" && (
          <div className="modal-body">
            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 10px", color: "#64748b" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📦</div>
                <h4>No Demo Orders Placed Yet</h4>
                <p style={{ fontSize: "0.84rem" }}>
                  Add products to the cart and click &quot;Send Order to WhatsApp&quot; to test placing orders!
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {orders.map((ord) => (
                  <div
                    key={ord.orderId}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      background: "#f8fafc"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                      <strong>{ord.orderId} • {ord.customer?.fullName || "Anonymous"}</strong>
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0f766e" }}>
                        ₹{ord.subtotal}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.78rem", color: "#475569", lineHeight: "1.4" }}>
                      <div>📞 {ord.customer?.phone} • 📅 {ord.date}</div>
                      <div>🚚 {ord.orderType === "delivery" ? `Delivery: ${ord.customer?.address}, ${ord.customer?.pincode}` : "Store Pickup"}</div>
                      <div style={{ marginTop: "4px", color: "#0f172a" }}>
                        Items: {ord.items.map((it) => `${it.name} (x${it.quantity})`).join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="modal-footer">
          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
            * Changes persist in your browser session for demo demonstrations.
          </span>
          <button className="btn-outline" onClick={handleClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
