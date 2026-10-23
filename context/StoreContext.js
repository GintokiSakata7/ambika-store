"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  DEFAULT_PRODUCTS,
  DEFAULT_COMBOS,
  DEFAULT_SETTINGS,
  DEFAULT_CATEGORIES,
  DEFAULT_WHOLESALE_PRODUCTS
} from "../data/defaultProducts";
import { TRANSLATIONS } from "../data/translations";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  // State initialization with hydration guard
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [wholesaleProducts, setWholesaleProducts] = useState(DEFAULT_WHOLESALE_PRODUCTS);
  const [combos, setCombos] = useState(DEFAULT_COMBOS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Language & Mode
  const [lang, setLangState] = useState("en"); // "en" | "te" | "hi"
  const [catalogMode, setCatalogMode] = useState("retail"); // "retail" | "wholesale"

  // Role & Auth state
  const [currentRole, setCurrentRoleState] = useState("customer"); // "customer" | "admin"
  const [currentUser, setCurrentUser] = useState(null); // { name, email, role }
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("admin"); // "admin" | "customer"

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Translation helper
  const t = (key, params = {}) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    let text = dict[key] || TRANSLATIONS.en[key] || key;
    if (typeof text === "string") {
      Object.keys(params).forEach((k) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), params[k]);
      });
    }
    return text;
  };

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem("majin_studios_lang", newLang);
    } catch (e) {}
  };

  const setCurrentRole = (role) => {
    setCurrentRoleState(role);
    try {
      localStorage.setItem("majin_studios_role", role);
    } catch (e) {
      console.warn("Failed saving role", e);
    }
  };

  const openAdminLogin = () => {
    setAuthModalTab("admin");
    setIsAuthModalOpen(true);
  };

  const openCustomerLogin = () => {
    setAuthModalTab("customer");
    setIsAuthModalOpen(true);
  };

  const loginAsAdmin = (email, password) => {
    const user = {
      name: "Majin Studios Admin",
      email: email || "admin@majinstudios.com",
      role: "admin"
    };
    setCurrentUser(user);
    setCurrentRoleState("admin");
    setIsAuthModalOpen(false);
    try {
      localStorage.setItem("majin_studios_user", JSON.stringify(user));
      localStorage.setItem("majin_studios_role", "admin");
    } catch (e) {}
    showToast("Signed in as Admin! Store controls unlocked.", "success");
    return { success: true };
  };

  const loginAsCustomer = (name, phone) => {
    const user = {
      name: name || "Customer",
      phone: phone || "",
      role: "customer"
    };
    setCurrentUser(user);
    setCurrentRoleState("customer");
    setIsAuthModalOpen(false);
    try {
      localStorage.setItem("majin_studios_user", JSON.stringify(user));
      localStorage.setItem("majin_studios_role", "customer");
    } catch (e) {}
    showToast(`Welcome ${user.name}!`, "success");
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRoleState("customer");
    try {
      localStorage.removeItem("majin_studios_user");
      localStorage.setItem("majin_studios_role", "customer");
    } catch (e) {}
    showToast("Returned to Customer Storefront", "info");
  };

  // Load persisted state from localStorage after mount
  useEffect(() => {
    setMounted(true);
    try {
      const savedLang = localStorage.getItem("majin_studios_lang");
      if (savedLang && ["en", "te", "hi"].includes(savedLang)) {
        setLangState(savedLang);
      }

      const savedProducts = localStorage.getItem("majin_studios_products_v2");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }

      const savedWholesale = localStorage.getItem("majin_studios_wholesale_v1");
      if (savedWholesale) {
        setWholesaleProducts(JSON.parse(savedWholesale));
      }

      const savedCategories = localStorage.getItem("majin_studios_categories_v2");
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }

      const savedCart = localStorage.getItem("majin_studios_cart_v2");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem("majin_studios_orders_v2");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedUser = localStorage.getItem("majin_studios_user");
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedRole = localStorage.getItem("majin_studios_role");
      if (savedRole === "admin" || savedRole === "customer") {
        setCurrentRoleState(savedRole);
      }
    } catch (e) {
      console.warn("Error loading persisted store data", e);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("majin_studios_products_v2", JSON.stringify(products));
    } catch (e) {}
  }, [products, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("majin_studios_categories_v2", JSON.stringify(categories));
    } catch (e) {}
  }, [categories, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("majin_studios_cart_v2", JSON.stringify(cart));
    } catch (e) {}
  }, [cart, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("majin_studios_orders_v2", JSON.stringify(orders));
    } catch (e) {}
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
            mrp: Number(product.mrp || product.price),
            unit: product.unit,
            image: product.image,
            categoryName: product.categoryName,
            isWholesale: !!product.isWholesale,
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
            name: "Kit: " + combo.name,
            price: Number(combo.price),
            mrp: Number(combo.mrp),
            unit: "Bundle (" + combo.items.length + " items)",
            image: combo.image,
            categoryName: "Combo Pack",
            quantity: 1,
            isCombo: true
          }
        ];
      }
    });
    showToast(`Added "${combo.name}" to cart!`);
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
  };

  // Cart Calculations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryMinimum = Number(settings.deliveryMinimum) || 500;
  const isDeliveryEligible = subtotal >= deliveryMinimum;
  const remainingForDelivery = Math.max(0, deliveryMinimum - subtotal);
  const deliveryProgressPercent = Math.min(100, Math.round((subtotal / deliveryMinimum) * 100));

  // Smart Recommendations Engine
  const getRecommendations = (activeProductId = null, limit = 4) => {
    const cartIds = cart.map((item) => item.id);
    const complements = {
      phenyl: ["acids", "brooms", "powders"],
      acids: ["accessories", "phenyl", "naphthalene"],
      naphthalene: ["phenyl", "powders", "acids"],
      powders: ["phenyl", "accessories", "brooms"],
      brooms: ["accessories", "phenyl", "acids"],
      accessories: ["phenyl", "acids", "powders"]
    };

    let targetCat = "phenyl";
    if (activeProductId) {
      const p = products.find((x) => x.id === activeProductId);
      if (p) targetCat = p.category;
    } else if (cart.length > 0) {
      const firstInCart = products.find((x) => x.id === cart[0].id);
      if (firstInCart) targetCat = firstInCart.category;
    }

    const preferredCats = complements[targetCat] || ["phenyl", "brooms", "acids"];
    const matched = products.filter(
      (p) => !cartIds.includes(p.id) && p.id !== activeProductId && preferredCats.includes(p.category)
    );
    const fallback = products.filter((p) => !cartIds.includes(p.id) && p.id !== activeProductId);

    return [...matched, ...fallback].slice(0, limit);
  };

  // Admin Product Edits
  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...updatedFields,
            price: Number(updatedFields.price !== undefined ? updatedFields.price : p.price),
            mrp: Number(updatedFields.mrp !== undefined ? updatedFields.mrp : p.mrp)
          };
        }
        return p;
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
    showToast(`Added product: ${productWithId.name}`, "success");
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.id !== id));
    showToast("Product deleted from catalog", "info");
  };

  // Category Management (Admin)
  const addCategory = ({ label, icon, id }) => {
    if (!label || !label.trim()) {
      showToast("Please enter a category name", "error");
      return false;
    }
    const cleanLabel = label.trim();
    const cleanId = (id || cleanLabel).toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    if (categories.some((c) => c.id === cleanId)) {
      showToast("Category identifier already exists", "error");
      return false;
    }
    const newCat = {
      id: cleanId,
      label: cleanLabel,
      icon: icon && icon.trim() ? icon.trim() : "package"
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${cleanLabel}" added!`, "success");
    return true;
  };

  const removeCategory = (categoryId) => {
    if (categoryId === "all") {
      showToast("Cannot delete default 'All Items' category", "error");
      return false;
    }
    const target = categories.find((c) => c.id === categoryId);
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    setProducts((prev) =>
      prev.map((p) =>
        p.category === categoryId
          ? { ...p, category: "accessories", categoryName: "General Cleaning Supplies" }
          : p
      )
    );
    showToast(`Removed category "${target ? target.label : categoryId}"`, "info");
    return true;
  };

  const updateCategory = (categoryId, updated) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...updated } : c))
    );
    showToast("Category updated successfully", "success");
  };

  const resetProductsToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    setWholesaleProducts(DEFAULT_WHOLESALE_PRODUCTS);
    setCombos(DEFAULT_COMBOS);
    setSettings(DEFAULT_SETTINGS);
    setCategories(DEFAULT_CATEGORIES);
    showToast("Reset all products to default catalog!", "info");
  };

  // Clean Order Generator (Zero Emojis, Ticket ID Based)
  const generateOrderTicketId = () => {
    return "MS-" + Math.floor(10000 + Math.random() * 90000);
  };

  const generateWhatsAppMessage = (order) => {
    const { orderId, customer, orderType, items, subtotal, coords } = order;
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

    let msg = `[MAJIN STUDIOS - ORDER TICKET #${orderId}]\n`;
    msg += `Direct Cleaning Chemicals & Supplies\n`;
    msg += `Date: ${dateFormatted} | ${timeFormatted}\n`;
    msg += `--------------------------------\n\n`;

    msg += `ORDER ITEMS (${items.reduce((s, i) => s + i.quantity, 0)} units):\n`;
    items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      msg += `${index + 1}. ${item.name}\n`;
      msg += `   Pack: ${item.unit || "Unit"}\n`;
      msg += `   Qty: ${item.quantity} x Rs. ${item.price} = Rs. ${itemTotal}\n`;
    });

    msg += `\n--------------------------------\n`;
    msg += `Subtotal: Rs. ${subtotal}\n`;
    if (orderType === "delivery") {
      msg += `Fulfilment: Home Delivery (Free above Rs. 500)\n`;
    } else {
      msg += `Fulfilment: Store Self-Pickup (Free, Majin Studios Depot)\n`;
    }
    msg += `Total Amount: Rs. ${subtotal}\n`;
    msg += `--------------------------------\n\n`;

    msg += `CUSTOMER DETAILS:\n`;
    msg += `Name: ${customer.fullName || "Customer"}\n`;
    msg += `Phone: ${customer.phone}\n`;
    if (customer.altPhone) {
      msg += `Alt Phone: ${customer.altPhone}\n`;
    }

    if (orderType === "delivery") {
      if (customer.doorNo) msg += `Door/Flat No: ${customer.doorNo}\n`;
      if (customer.floor) msg += `Floor: ${customer.floor}\n`;
      msg += `Address: ${customer.address}\n`;
      if (customer.landmark) msg += `Landmark: ${customer.landmark}\n`;
      if (customer.pincode) msg += `Pincode: ${customer.pincode}\n`;
      if (coords && coords.latitude && coords.longitude) {
        msg += `GPS Location: https://maps.google.com/?q=${coords.latitude},${coords.longitude}\n`;
      }
    } else {
      msg += `Pickup: Customer will collect at Depot.\n`;
    }

    if (customer.notes) {
      msg += `Notes: ${customer.notes}\n`;
    }

    msg += `\n--------------------------------\n`;
    msg += `Track this order anytime with Ticket ID #${orderId}.\n`;
    msg += `Please confirm dispatch / pickup readiness. Thank you!`;

    return msg;
  };

  const generateWhatsAppUrl = (order) => {
    const rawNumber = settings.whatsappNumber.replace(/\D/g, "");
    const cleanNumber = rawNumber.startsWith("91") ? rawNumber : "91" + rawNumber;
    const msg = generateWhatsAppMessage(order);
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  // Create & Register Order
  const createOrder = (customerData, orderType = "delivery", coords = null) => {
    const orderId = generateOrderTicketId();
    const newOrder = {
      orderId,
      date: new Date().toLocaleString("en-IN"),
      customer: customerData,
      orderType,
      items: [...cart],
      totalItems,
      subtotal,
      deliveryFee: 0,
      total: subtotal,
      coords,
      status: "Placed" // "Placed" | "Confirmed & Packing" | "Ready for Pickup / Out for Delivery" | "Delivered"
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setIsCheckoutOpen(false);
    clearCart();
    setIsOrderSuccessOpen(true);

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status: newStatus } : ord))
    );
    showToast(`Order #${orderId} marked as ${newStatus}`, "info");
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((ord) => ord.orderId !== orderId));
    showToast(`Order #${orderId} removed`, "info");
  };

  return (
    <StoreContext.Provider
      value={{
        mounted,
        lang,
        setLang,
        t,
        catalogMode,
        setCatalogMode,
        currentRole,
        setCurrentRole,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAdminLogin,
        openCustomerLogin,
        loginAsAdmin,
        loginAsCustomer,
        logout,
        products,
        wholesaleProducts,
        combos,
        categories,
        addCategory,
        removeCategory,
        updateCategory,
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
        isTrackOrderOpen,
        setIsTrackOrderOpen,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        lastPlacedOrder,
        setLastPlacedOrder,
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
        getRecommendations,
        updateProduct,
        addProduct,
        deleteProduct,
        resetProductsToDefault,
        createOrder,
        generateWhatsAppMessage,
        generateWhatsAppUrl,
        updateOrderStatus,
        deleteOrder
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
