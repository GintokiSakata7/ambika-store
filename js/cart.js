// Cart Management for Margin Studios Chemicals
// Handles Cart State, LocalStorage, Delivery Threshold (₹500), and WhatsApp Redirection

const DELIVERY_MINIMUM = 500;
const WHATSAPP_NUMBER = "919491554114"; // Target: 9491554114
const CART_STORAGE_KEY = "margin_chemicals_cart_v1";

class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.listeners = [];
  }

  loadCart() {
    try {
      if (typeof localStorage !== "undefined") {
        const data = localStorage.getItem(CART_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      }
      return [];
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
      return [];
    }
  }

  saveCart() {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
      }
      this.notifyListeners();
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.getState());
  }

  notifyListeners() {
    const state = this.getState();
    this.listeners.forEach((callback) => callback(state));
  }

  getState() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const isDeliveryEligible = subtotal >= DELIVERY_MINIMUM;
    const remainingForDelivery = Math.max(0, DELIVERY_MINIMUM - subtotal);
    const deliveryProgressPercent = Math.min(100, Math.round((subtotal / DELIVERY_MINIMUM) * 100));

    return {
      items: this.cart,
      totalItems,
      subtotal,
      deliveryMinimum: DELIVERY_MINIMUM,
      isDeliveryEligible,
      remainingForDelivery,
      deliveryProgressPercent
    };
  }

  addItem(product, quantity = 1) {
    const existingIndex = this.cart.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        unit: product.unit,
        image: product.image,
        categoryName: product.categoryName,
        quantity: quantity
      });
    }
    this.saveCart();
  }

  addCombo(combo) {
    const comboId = "combo-" + combo.id;
    const existingIndex = this.cart.findIndex((item) => item.id === comboId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += 1;
    } else {
      this.cart.push({
        id: comboId,
        name: "Combo: " + combo.name,
        price: combo.price,
        mrp: combo.mrp,
        unit: "Complete Set (" + combo.items.length + " products)",
        image: combo.image,
        categoryName: "Combo Value Pack",
        quantity: 1,
        isCombo: true,
        comboDetails: combo.items
      });
    }
    this.saveCart();
  }

  updateQuantity(productId, quantity) {
    const index = this.cart.findIndex((item) => item.id === productId);
    if (index > -1) {
      if (quantity <= 0) {
        this.cart.splice(index, 1);
      } else {
        this.cart[index].quantity = quantity;
      }
      this.saveCart();
    }
  }

  removeItem(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCart();
  }

  clear() {
    this.cart = [];
    this.saveCart();
  }

  generateWhatsAppMessage(customerData, orderType = "delivery") {
    const state = this.getState();
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

    let msg = `✨ *NEW ORDER - MARGIN STUDIOS CHEMICALS* ✨\n`;
    msg += `_House Cleaning & Chemical Supplies by Margin Studio_\n`;
    msg += `📅 *Date:* ${dateFormatted} at ${timeFormatted}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `🛒 *ORDERED ITEMS (${state.totalItems} units):*\n`;
    state.items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      msg += `${index + 1}. *${item.name}*\n`;
      msg += `   • Pack: ${item.unit}\n`;
      msg += `   • Qty: ${item.quantity} × ₹${item.price} = *₹${itemTotal}*\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *Subtotal:* ₹${state.subtotal}\n`;

    if (orderType === "delivery") {
      msg += `🚚 *Order Method:* Doorstep Home Delivery\n`;
      msg += `✅ *Delivery Criteria:* ${state.isDeliveryEligible ? "Qualified (Above ₹500)" : "Special Request (< ₹500)"}\n`;
    } else {
      msg += `🏬 *Order Method:* Store Pickup at Margin Studio Shop\n`;
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
      msg += `• *Special Notes / Instructions:* ${customerData.notes}\n`;
    }

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🙏 *Please confirm order availability and dispatch time. Thank you!*`;

    return msg;
  }

  generateWhatsAppUrl(customerData, orderType = "delivery") {
    const message = this.generateWhatsAppMessage(customerData, orderType);
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  }

  generateWebWhatsAppUrl(customerData, orderType = "delivery") {
    const message = this.generateWhatsAppMessage(customerData, orderType);
    const encoded = encodeURIComponent(message);
    return `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`;
  }
}

// Global cart instance
const cartManager = new CartManager();
