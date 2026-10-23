"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_PRODUCTS, DEFAULT_COMBOS, DEFAULT_SETTINGS } from "../data/defaultProducts";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  // State initialization with hydration guard
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [combos, setCombos] = useState(DEFAULT_COMBOS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Load persisted state from localStorage after mount
  useEffect(() => {
    setMounted(true);
    try {
      const savedProducts = localStorage.getItem("margin_chemicals_products_v2");
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedSettings = localStorage.getItem("margin_chemicals_settings_v2");
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedCart = localStorage.getItem("margin_chemicals_cart_v2");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem("margin_chemicals_orders_v2");
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {
      console.warn("Error loading persisted store data", e);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("margin_chemicals_products_v2", JSON.stringify(products));
    } catch (e) {
      console.warn("Failed saving products to storage", e);
    }
  }, [products, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("margin_chemicals_settings_v2", JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed saving settings to storage", e);
    }
  }, [settings, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("margin_chemicals_cart_v2", JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed saving cart to storage", e);
    }
  }, [cart, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("margin_chemicals_orders_v2", JSON.stringify(orders));
    } catch (e) {
      console.warn("Failed saving orders to storage", e);
    }
  }, [orders, mounted]);

  // Toast Helper
  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            mrp: Number(product.mrp),
            unit: product.unit,
            image: product.image,
            categoryName: product.categoryName,
            quantity
          }
        ];
      }
    });
    showToast(`Added ${quantity} × ${product.name} to cart!`);
  };

  const addComboToCart = (combo) => {
    const comboId = "combo-" + combo.id;
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === comboId);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      } else {
        return [
          ...prev,
          {
            id: comboId,
            name: "Bundle: " + combo.name,
            price: Number(combo.price),
            mrp: Number(combo.mrp),
            unit: "Complete Set (" + combo.items.length + " items)",
            image: combo.image,
            categoryName: "Combo Value Pack",
            quantity: 1,
            isCombo: true
          }
        ];
      }
    });
    showToast(`Added "${combo.name}" to cart! Home delivery qualified.`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id, quantity) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast("Item removed from cart", "info");
  };

  const clearCart = () => {
    setCart([]);
    showToast("Cart has been cleared", "info");
  };

  // Cart Calculations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryMinimum = Number(settings.deliveryMinimum) || 500;
  const isDeliveryEligible = subtotal >= deliveryMinimum;
  const remainingForDelivery = Math.max(0, deliveryMinimum - subtotal);
  const deliveryProgressPercent = Math.min(100, Math.round((subtotal / deliveryMinimum) * 100));

  // Admin Product Edits
  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...updatedFields,
            price: Number(updatedFields.price || p.price),
            mrp: Number(updatedFields.mrp || p.mrp)
          };
        }
        return p;
      })
    );
    // Also update any matching product in current cart
    setCart((prev) =>
      prev.map((cItem) => {
        if (cItem.id === id) {
          return {
            ...cItem,
            name: updatedFields.name || cItem.name,
            price: Number(updatedFields.price !== undefined ? updatedFields.price : cItem.price),
            mrp: Number(updatedFields.mrp !== undefined ? updatedFields.mrp : cItem.mrp),
            unit: updatedFields.unit || cItem.unit
          };
        }
        return cItem;
      })
    );
    showToast("Product updated successfully!", "success");
  };

  const addProduct = (newProduct) => {
    const id = "prod-" + Date.now();
    const productWithId = {
      id,
      ...newProduct,
      price: Number(newProduct.price),
      mrp: Number(newProduct.mrp || newProduct.price),
      rating: 4.8,
      reviews: 12,
      stock: newProduct.stock || "In Stock"
    };
    setProducts((prev) => [productWithId, ...prev]);
    showToast(`Added new product: ${productWithId.name}`, "success");
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.id !== id));
    showToast("Product deleted from catalog", "info");
  };

  const resetProductsToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    setCombos(DEFAULT_COMBOS);
    setSettings(DEFAULT_SETTINGS);
    showToast("Reset all products and settings to default demo state!", "info");
  };

  // Admin Settings Update
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast("Store settings updated successfully!", "success");
  };

  // WhatsApp Order Generator
  const generateWhatsAppMessage = (customerData, orderType = "delivery") => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    const timeFormatted = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    let msg = `✨ *NEW ORDER - ${settings.storeName.toUpperCase()}* ✨\n`;
    msg += `_${settings.tagline} by ${settings.companyName}_\n`;
    msg += `📅 *Date:* ${dateFormatted} at ${timeFormatted}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `🛒 *ORDERED ITEMS (${totalItems} units):*\n`;
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      msg += `${index + 1}. *${item.name}*\n`;
      msg += `   • Pack: ${item.unit}\n`;
      msg += `   • Qty: ${item.quantity} × ₹${item.price} = *₹${itemTotal}*\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *Subtotal:* ₹${subtotal}\n`;

    if (orderType === "delivery") {
      msg += `🚚 *Order Method:* Doorstep Home Delivery\n`;
      msg += `✅ *Delivery Criteria:* ${isDeliveryEligible ? `Qualified (Above ₹${deliveryMinimum})` : `Special Request (< ₹${deliveryMinimum})`}\n`;
    } else {
      msg += `🏬 *Order Method:* Store Pickup at ${settings.companyName} Depot\n`;
    }

    msg += `💳 *Preferred Payment:* ${customerData.paymentMethod || "Cash on Delivery (COD)"}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `👤 *CUSTOMER & DELIVERY ADDRESS:*\n`;
    msg += `• *Full Name:* ${customerData.fullName || "Not provided"}\n`;
    msg += `• *Mobile Phone:* ${customerData.phone || "Not provided"}\n`;
    if (customerData.altPhone) {
      msg += `• *Alternate WhatsApp:* ${customerData.altPhone}\n`;
    }
    if (orderType === "delivery") {
      msg += `• *Delivery Address:* ${customerData.address || "Not provided"}\n`;
      msg += `• *Landmark:* ${customerData.landmark || "Not specified"}\n`;
      msg += `• *Pincode / Area:* ${customerData.pincode || "Not specified"}\n`;
      msg += `• *Preferred Slot:* ${customerData.timeSlot || "Anytime today"}\n`;
    } else {
      msg += `• *Pickup Time:* ${customerData.timeSlot || "Within business hours"}\n`;
    }

    if (customerData.notes) {
      msg += `• *Special Notes:* ${customerData.notes}\n`;
    }

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🙏 *Please confirm order availability and dispatch time. Thank you!*`;

    return msg;
  };

  const generateWhatsAppUrl = (customerData, orderType = "delivery") => {
    const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
    const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;
    const msg = generateWhatsAppMessage(customerData, orderType);
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  const recordDemoOrder = (customerData, orderType = "delivery") => {
    const newOrder = {
      orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString("en-IN"),
      customer: customerData,
      orderType,
      items: [...cart],
      totalItems,
      subtotal,
      status: "Dispatched via WhatsApp"
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <StoreContext.Provider
      value={{
        mounted,
        products,
        combos,
        settings,
        cart,
        orders,
        totalItems,
        subtotal,
        deliveryMinimum,
        isDeliveryEligible,
        remainingForDelivery,
        deliveryProgressPercent,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        activeProductModal,
        setActiveProductModal,
        toasts,
        showToast,
        removeToast,
        addToCart,
        addComboToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        updateProduct,
        addProduct,
        deleteProduct,
        resetProductsToDefault,
        updateSettings,
        generateWhatsAppMessage,
        generateWhatsAppUrl,
        recordDemoOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
