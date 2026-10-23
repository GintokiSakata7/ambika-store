// App Controller for Margin Studios Chemicals
// Handles UI Rendering, Search, Filtering, Modals, and WhatsApp Checkout

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const productsGrid = document.getElementById("products-grid");
  const combosGrid = document.getElementById("combos-grid");
  const categoryChips = document.querySelectorAll(".cat-chip");
  const searchInput = document.getElementById("product-search-input");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  const resultsCountText = document.getElementById("results-count-text");

  // Cart DOM Elements
  const cartTrigger = document.getElementById("cart-button-trigger");
  const cartBackdrop = document.getElementById("cart-backdrop");
  const btnCloseCart = document.getElementById("btn-close-cart");
  const cartItemsList = document.getElementById("cart-items-list");
  const cartBadgeCount = document.getElementById("cart-badge-count");
  const cartSubtotalPreview = document.getElementById("cart-subtotal-preview");
  const cartFootSubtotal = document.getElementById("cart-foot-subtotal");
  const cartFootDeliveryStatus = document.getElementById("cart-foot-delivery-status");
  const cartFootTotal = document.getElementById("cart-foot-total");
  const btnOpenCheckout = document.getElementById("btn-open-checkout");
  const btnClearCart = document.getElementById("btn-clear-cart");

  // Delivery Tracker in Cart
  const trackerStatusValue = document.getElementById("tracker-status-value");
  const trackerProgressFill = document.getElementById("tracker-progress-fill");
  const trackerHelperText = document.getElementById("tracker-helper-text");

  // Checkout Modal Elements
  const checkoutModal = document.getElementById("checkout-modal");
  const btnCloseCheckout = document.getElementById("btn-close-checkout");
  const checkoutThresholdAlert = document.getElementById("checkout-threshold-alert");
  const checkoutThresholdAlertText = document.getElementById("checkout-threshold-alert-text");
  const typeCardDelivery = document.getElementById("type-card-delivery");
  const typeCardPickup = document.getElementById("type-card-pickup");
  const radioDelivery = document.getElementById("radio-delivery");
  const radioPickup = document.getElementById("radio-pickup");
  const addressGroup = document.getElementById("address-group");
  const landmarkGroup = document.getElementById("landmark-group");
  const pincodeGroup = document.getElementById("pincode-group");
  const btnSendWhatsAppFinal = document.getElementById("btn-send-whatsapp-final");
  const btnCopyOrderText = document.getElementById("btn-copy-order-text");
  const modalItemCount = document.getElementById("modal-item-count");
  const modalTotalAmount = document.getElementById("modal-total-amount");
  const modalItemsPreview = document.getElementById("modal-items-preview");

  // Product Quick View Modal
  const productModal = document.getElementById("product-detail-modal");
  const btnCloseProductModal = document.getElementById("btn-close-product-modal");
  const modalProductTitle = document.getElementById("modal-product-title");
  const modalProductBody = document.getElementById("modal-product-body");

  // Toast Container
  const toastContainer = document.getElementById("toast-container");

  // State
  let currentCategory = "all";
  let searchQuery = "";
  let itemQuantities = {}; // In-card quantity state

  // ==========================================
  // 1. Toast Notification Helper
  // ==========================================
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "✓";
    if (type === "warning") icon = "⚠️";
    if (type === "info") icon = "ℹ️";

    toast.innerHTML = `
      <span style="font-size: 1.1rem; font-weight: bold;">${icon}</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ==========================================
  // 2. Render Products
  // ==========================================
  function renderProducts() {
    let filtered = PRODUCTS.filter((item) => {
      const matchesCategory = currentCategory === "all" || item.category === currentCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.name.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.potency.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    resultsCountText.textContent = `Showing ${filtered.length} products`;

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🔍</div>
          <h3 style="font-size: 1.2rem; color: #1e293b; margin-bottom: 6px;">No products found</h3>
          <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 16px;">We couldn't find any house cleaning items matching "${searchQuery}".</p>
          <button class="btn-outline" id="btn-reset-filters">Clear Search & View All</button>
        </div>
      `;
      const resetBtn = document.getElementById("btn-reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          searchInput.value = "";
          searchQuery = "";
          clearSearchBtn.classList.remove("active");
          currentCategory = "all";
          categoryChips.forEach(chip => chip.classList.toggle("active", chip.dataset.category === "all"));
          renderProducts();
        });
      }
      return;
    }

    productsGrid.innerHTML = filtered.map((prod) => {
      const qty = itemQuantities[prod.id] || 1;
      const savings = prod.mrp - prod.price;

      return `
        <article class="product-card" data-id="${prod.id}">
          <div class="product-media-wrapper">
            <img src="${prod.image}" alt="${prod.name}" loading="lazy">
            <span class="product-badge-float ${prod.badge.toLowerCase().replace(/\s+/g, '-')}">${prod.badge}</span>
            <button class="product-quick-view-btn" data-action="quickview" data-id="${prod.id}" title="Quick View">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>

          <div class="product-body">
            <div class="product-category-row">
              <span class="product-category-tag">${prod.categoryName}</span>
              <span class="product-unit-text">${prod.unit}</span>
            </div>

            <h3 class="product-title" title="${prod.name}">${prod.name}</h3>

            <div class="product-potency-spec">
              <span>🛡️</span>
              <span>${prod.potency}</span>
            </div>

            <p class="product-desc-snippet">${prod.description}</p>

            <div class="product-footer">
              <div class="product-price-row">
                <span class="product-curr-price">₹${prod.price}</span>
                <span class="product-mrp-price">₹${prod.mrp}</span>
                <span class="product-save-badge">Save ₹${savings}</span>
              </div>

              <div class="product-actions-row">
                <div class="qty-counter">
                  <button class="qty-btn" data-action="decrease-qty" data-id="${prod.id}">-</button>
                  <span class="qty-display" id="qty-val-${prod.id}">${qty}</span>
                  <button class="qty-btn" data-action="increase-qty" data-id="${prod.id}">+</button>
                </div>

                <button class="btn-add-cart" data-action="add-to-cart" data-id="${prod.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  // ==========================================
  // 3. Render Combos
  // ==========================================
  function renderCombos() {
    combosGrid.innerHTML = COMBOS.map((combo) => {
      const itemsListHtml = combo.items.map((it) => `
        <li>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>${it}</span>
        </li>
      `).join("");

      return `
        <article class="combo-card">
          <div class="combo-media">
            <img src="${combo.image}" alt="${combo.name}" loading="lazy">
            <span class="combo-delivery-tag">🚚 Qualifies for Home Delivery</span>
          </div>

          <div class="combo-body">
            <h3 class="combo-title">${combo.name}</h3>
            <p class="combo-desc">${combo.description}</p>

            <ul class="combo-includes-list">
              ${itemsListHtml}
            </ul>

            <div class="combo-footer">
              <div class="combo-price-block">
                <span class="price">₹${combo.price}</span>
                <span class="mrp">₹${combo.mrp}</span>
                <div style="font-size: 0.75rem; color: #15803d; font-weight: 700; margin-top: 2px;">
                  Save ₹${combo.savings} on Bundle
                </div>
              </div>

              <button class="btn-primary" data-action="add-combo" data-id="${combo.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                <span>Add Bundle</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  // ==========================================
  // 4. Cart State Observer
  // ==========================================
  cartManager.subscribe((state) => {
    // 1. Header Badges
    cartBadgeCount.textContent = state.totalItems;
    cartSubtotalPreview.textContent = `₹${state.subtotal}`;

    // 2. Cart Tracker inside drawer
    trackerStatusValue.textContent = `₹${state.subtotal} / ₹${state.deliveryMinimum}`;
    trackerProgressFill.style.width = `${state.deliveryProgressPercent}%`;

    if (state.isDeliveryEligible) {
      trackerProgressFill.classList.add("eligible");
      trackerHelperText.className = "delivery-helper-text success";
      trackerHelperText.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Congratulations! Your cart qualifies for Doorstep Delivery (> ₹500).</span>
      `;
      cartFootDeliveryStatus.textContent = "Eligible (Above ₹500)";
      cartFootDeliveryStatus.style.color = "#15803d";
    } else {
      trackerProgressFill.classList.remove("eligible");
      trackerHelperText.className = "delivery-helper-text warning";
      trackerHelperText.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Add <strong>₹${state.remainingForDelivery}</strong> more to unlock Home Delivery.</span>
      `;
      cartFootDeliveryStatus.textContent = `Requires ₹${state.remainingForDelivery} more`;
      cartFootDeliveryStatus.style.color = "#b45309";
    }

    // 3. Cart Footer Totals
    cartFootSubtotal.textContent = `₹${state.subtotal}`;
    cartFootTotal.textContent = `₹${state.subtotal}`;

    // 4. Checkout Modal Sync
    modalItemCount.textContent = state.totalItems;
    modalTotalAmount.textContent = `₹${state.subtotal}`;

    // 5. Render Cart Items inside Drawer
    renderCartDrawerItems(state);
  });

  function renderCartDrawerItems(state) {
    if (state.items.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
          </svg>
          <h4>Your cart is empty</h4>
          <p>Explore our house cleaning supplies and add items to your cart.</p>
          <a href="#products-section" class="btn-outline" onclick="document.getElementById('cart-backdrop').classList.remove('open')">
            Browse Products
          </a>
        </div>
      `;
      return;
    }

    cartItemsList.innerHTML = state.items.map((item) => {
      const lineTotal = item.price * item.quantity;
      return `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
          <div class="cart-item-details">
            <div class="cart-item-name" title="${item.name}">${item.name}</div>
            <div class="cart-item-unit">${item.unit}</div>
            <div class="cart-item-price">₹${item.price} × ${item.quantity} = ₹${lineTotal}</div>
          </div>
          <div class="cart-item-actions">
            <div class="cart-item-qty">
              <button class="cart-qty-btn" data-cart-action="dec" data-id="${item.id}">-</button>
              <span class="cart-qty-val">${item.quantity}</span>
              <button class="cart-qty-btn" data-cart-action="inc" data-id="${item.id}">+</button>
            </div>
            <button class="cart-item-del-btn" data-cart-action="del" data-id="${item.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              <span>Remove</span>
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  // ==========================================
  // 5. Product Grid & Combos Click Handling
  // ==========================================
  productsGrid.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    const action = target.dataset.action;
    const prodId = target.dataset.id;
    if (!prodId) return;

    const product = PRODUCTS.find((p) => p.id === prodId);
    if (!product) return;

    if (action === "increase-qty") {
      itemQuantities[prodId] = (itemQuantities[prodId] || 1) + 1;
      const display = document.getElementById(`qty-val-${prodId}`);
      if (display) display.textContent = itemQuantities[prodId];
    } else if (action === "decrease-qty") {
      if ((itemQuantities[prodId] || 1) > 1) {
        itemQuantities[prodId] -= 1;
        const display = document.getElementById(`qty-val-${prodId}`);
        if (display) display.textContent = itemQuantities[prodId];
      }
    } else if (action === "add-to-cart") {
      const qty = itemQuantities[prodId] || 1;
      cartManager.addItem(product, qty);
      showToast(`Added ${qty} × ${product.name} to cart!`);
      // Reset card counter
      itemQuantities[prodId] = 1;
      const display = document.getElementById(`qty-val-${prodId}`);
      if (display) display.textContent = 1;
    } else if (action === "quickview") {
      openProductQuickView(product);
    }
  });

  combosGrid.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    const action = target.dataset.action;
    const comboId = target.dataset.id;
    const combo = COMBOS.find((c) => c.id === comboId);
    if (!combo) return;

    if (action === "add-combo") {
      cartManager.addCombo(combo);
      showToast(`Added combo: "${combo.name}" to cart! Doorstep delivery unlocked.`);
      openCartDrawer();
    }
  });

  // Cart Drawer Action Buttons (+/- / Remove)
  cartItemsList.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    const action = target.dataset.cartAction;
    const id = target.dataset.id;
    if (!id) return;

    const currentItem = cartManager.cart.find((it) => it.id === id);
    if (!currentItem) return;

    if (action === "inc") {
      cartManager.updateQuantity(id, currentItem.quantity + 1);
    } else if (action === "dec") {
      cartManager.updateQuantity(id, currentItem.quantity - 1);
    } else if (action === "del") {
      cartManager.removeItem(id);
      showToast(`Item removed from cart`, "info");
    }
  });

  // ==========================================
  // 6. Search & Category Filters
  // ==========================================
  categoryChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      categoryChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentCategory = chip.dataset.category;
      renderProducts();
    });
  });

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    clearSearchBtn.classList.toggle("active", searchQuery.length > 0);
    renderProducts();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.classList.remove("active");
    renderProducts();
  });

  // ==========================================
  // 7. Cart Drawer & Modal Controls
  // ==========================================
  function openCartDrawer() {
    cartBackdrop.classList.add("open");
  }

  function closeCartDrawer() {
    cartBackdrop.classList.remove("open");
  }

  cartTrigger.addEventListener("click", openCartDrawer);
  btnCloseCart.addEventListener("click", closeCartDrawer);
  cartBackdrop.addEventListener("click", (e) => {
    if (e.target === cartBackdrop) {
      closeCartDrawer();
    }
  });

  btnClearCart.addEventListener("click", () => {
    if (cartManager.cart.length === 0) return;
    if (confirm("Are you sure you want to clear your cart?")) {
      cartManager.clear();
      showToast("Cart has been cleared", "info");
    }
  });

  // ==========================================
  // 8. Checkout Modal Flow & Delivery Logic
  // ==========================================
  btnOpenCheckout.addEventListener("click", () => {
    const state = cartManager.getState();
    if (state.items.length === 0) {
      showToast("Please add items to cart before proceeding", "warning");
      return;
    }

    closeCartDrawer();
    openCheckoutModal();
  });

  function openCheckoutModal() {
    const state = cartManager.getState();

    // Check delivery threshold warning
    const isDelivery = radioDelivery.checked;
    if (isDelivery && !state.isDeliveryEligible) {
      checkoutThresholdAlert.style.display = "flex";
      checkoutThresholdAlertText.innerHTML = `
        <strong>Doorstep Delivery Notice:</strong> Your current cart total is <strong>₹${state.subtotal}</strong>. 
        Our minimum order for home delivery is <strong>₹500</strong> (Add ₹${state.remainingForDelivery} more). 
        You can still place an order for <strong>Store Pickup</strong>, or proceed anyway with your special request.
      `;
    } else {
      checkoutThresholdAlert.style.display = "none";
    }

    // Render Mini Preview of Cart in Modal
    modalItemsPreview.innerHTML = state.items.map((item, idx) => `
      <div>${idx + 1}. ${item.name} (${item.unit}) × ${item.quantity} = ₹${item.price * item.quantity}</div>
    `).join("");

    checkoutModal.classList.add("open");
  }

  function closeCheckoutModal() {
    checkoutModal.classList.remove("open");
  }

  btnCloseCheckout.addEventListener("click", closeCheckoutModal);
  checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) closeCheckoutModal();
  });

  // Order Type Toggling (Delivery vs Store Pickup)
  function handleOrderTypeChange(type) {
    const state = cartManager.getState();
    if (type === "delivery") {
      radioDelivery.checked = true;
      typeCardDelivery.classList.add("active");
      typeCardPickup.classList.remove("active");
      addressGroup.style.display = "flex";
      landmarkGroup.style.display = "flex";
      pincodeGroup.style.display = "flex";
      document.getElementById("cust-address").required = true;
      document.getElementById("cust-pincode").required = true;

      if (!state.isDeliveryEligible) {
        checkoutThresholdAlert.style.display = "flex";
      } else {
        checkoutThresholdAlert.style.display = "none";
      }
    } else {
      radioPickup.checked = true;
      typeCardPickup.classList.add("active");
      typeCardDelivery.classList.remove("active");
      addressGroup.style.display = "none";
      landmarkGroup.style.display = "none";
      pincodeGroup.style.display = "none";
      document.getElementById("cust-address").required = false;
      document.getElementById("cust-pincode").required = false;
      checkoutThresholdAlert.style.display = "none";
    }
  }

  typeCardDelivery.addEventListener("click", () => handleOrderTypeChange("delivery"));
  typeCardPickup.addEventListener("click", () => handleOrderTypeChange("pickup"));

  // Collect and Validate Customer Details
  function getCustomerFormData() {
    const fullName = document.getElementById("cust-name").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const address = document.getElementById("cust-address").value.trim();
    const landmark = document.getElementById("cust-landmark").value.trim();
    const pincode = document.getElementById("cust-pincode").value.trim();
    const timeSlot = document.getElementById("cust-slot").value;
    const paymentMethod = document.getElementById("cust-payment").value;
    const notes = document.getElementById("cust-notes").value.trim();
    const orderType = radioDelivery.checked ? "delivery" : "pickup";

    if (!fullName) {
      alert("Please enter your full name.");
      document.getElementById("cust-name").focus();
      return null;
    }

    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      document.getElementById("cust-phone").focus();
      return null;
    }

    if (orderType === "delivery") {
      if (!address) {
        alert("Please enter your complete delivery address.");
        document.getElementById("cust-address").focus();
        return null;
      }
      if (!pincode || pincode.length < 5) {
        alert("Please enter a valid delivery pincode.");
        document.getElementById("cust-pincode").focus();
        return null;
      }
    }

    return {
      fullName,
      phone,
      address,
      landmark,
      pincode,
      timeSlot,
      paymentMethod,
      notes,
      orderType
    };
  }

  // Final WhatsApp Submission
  btnSendWhatsAppFinal.addEventListener("click", () => {
    const customerData = getCustomerFormData();
    if (!customerData) return;

    const state = cartManager.getState();
    if (state.items.length === 0) {
      showToast("Your cart is empty!", "warning");
      return;
    }

    // Check if delivery is chosen and order is below 500
    if (customerData.orderType === "delivery" && !state.isDeliveryEligible) {
      const proceedAnyway = confirm(
        `Note: Doorstep delivery is normally for orders above ₹500.\nYour current order is ₹${state.subtotal}.\n\nDo you want to send this order to WhatsApp for special confirmation anyway?`
      );
      if (!proceedAnyway) return;
    }

    // Generate WhatsApp URL
    const waUrl = cartManager.generateWhatsAppUrl(customerData, customerData.orderType);

    // Provide friendly notice and launch WhatsApp in new tab
    showToast("Opening WhatsApp with your order summary...", "success");

    // Open WhatsApp
    const opened = window.open(waUrl, "_blank");

    if (!opened || opened.closed || typeof opened.closed === "undefined") {
      // Pop-up blocker fallback: redirect directly
      window.location.href = waUrl;
    }

    // Close checkout modal
    closeCheckoutModal();
  });

  // Copy Order Text to Clipboard
  btnCopyOrderText.addEventListener("click", () => {
    const customerData = getCustomerFormData();
    if (!customerData) return;

    const message = cartManager.generateWhatsAppMessage(customerData, customerData.orderType);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message).then(() => {
        showToast("Order message copied to clipboard! You can paste it into WhatsApp.", "info");
      }).catch(() => {
        fallbackCopyText(message);
      });
    } else {
      fallbackCopyText(message);
    }
  });

  function fallbackCopyText(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Order message copied to clipboard!", "info");
  }

  // ==========================================
  // 9. Quick View Product Modal
  // ==========================================
  function openProductQuickView(prod) {
    modalProductTitle.textContent = prod.name;
    const savings = prod.mrp - prod.price;

    modalProductBody.innerHTML = `
      <div class="product-modal-grid">
        <div class="product-modal-image">
          <img src="${prod.image}" alt="${prod.name}">
        </div>
        <div class="product-modal-details">
          <span class="spec-badge">${prod.categoryName} • ${prod.unit}</span>
          <h3>${prod.name}</h3>

          <div class="product-price-row" style="margin-bottom: 12px;">
            <span class="product-curr-price" style="font-size: 1.5rem;">₹${prod.price}</span>
            <span class="product-mrp-price" style="font-size: 1rem;">₹${prod.mrp}</span>
            <span class="product-save-badge">Save ₹${savings}</span>
          </div>

          <p style="font-size: 0.88rem; color: #475569; line-height: 1.5;">${prod.description}</p>

          <div class="usage-box">
            <strong>Usage & Safety Instructions:</strong><br>
            ${prod.usage}
          </div>

          <ul class="product-modal-features">
            ${prod.features.map(f => `
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0f766e" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${f}</span>
              </li>
            `).join("")}
          </ul>

          <div style="display: flex; gap: 12px; margin-top: 20px;">
            <button class="btn-primary" id="modal-add-to-cart-btn" style="flex: 1;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
              <span>Add to Cart (₹${prod.price})</span>
            </button>
            <a href="https://wa.me/919491554114?text=Hi%20Margin%20Studio%20Chemicals%2C%20I%20want%20to%20order%20${encodeURIComponent(prod.name)}%20(${encodeURIComponent(prod.unit)})" 
               target="_blank" 
               class="btn-whatsapp-cta" 
               style="padding: 10px 14px; font-size: 0.85rem;">
              Direct WA
            </a>
          </div>
        </div>
      </div>
    `;

    const addBtn = document.getElementById("modal-add-to-cart-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        cartManager.addItem(prod, 1);
        showToast(`Added ${prod.name} to cart!`);
        productModal.classList.remove("open");
      });
    }

    productModal.classList.add("open");
  }

  btnCloseProductModal.addEventListener("click", () => productModal.classList.remove("open"));
  productModal.addEventListener("click", (e) => {
    if (e.target === productModal) productModal.classList.remove("open");
  });

  // Footer year update
  const yrSpan = document.getElementById("current-year");
  if (yrSpan) yrSpan.textContent = new Date().getFullYear();

  // Initial Renders
  renderProducts();
  renderCombos();
});
