# Spec: Premium University Backpack Product Page

An enhanced, production-grade technical specification and implementation plan for building a highly-polished, accessible, and responsive single-product e-commerce page.

---

## 1. Product Concept & Visual Identity

To elevate the user experience from a basic layout to a premium store feel, we implement a cohesive visual theme tailored to a university student demographic.

* **Product Name:** Heritage Canvas University Backpack
* **Aesthetic Theme:** "Modern Heritage" (blend of academic classic and outdoor modernism).
* **Color Palette (CSS Variables):**
  * `--primary`: `#2D5A27` (Forest Green - represents durability and campus life)
  * `--primary-hover`: `#1E3F1A`
  * `--accent`: `#D4AF37` (Muted Gold - for active states and ratings)
  * `--bg-light`: `#F9F8F6` (Warm Off-white - prevents eye strain)
  * `--text-main`: `#1C2A38` (Deep Slate - high-contrast readable text)
  * `--text-muted`: `#5C6B73` (Cool Gray - for secondary details)
  * `--surface`: `#FFFFFF` (Pure White - for card components)
  * `--error`: `#C94A29` (Terracotta Red - for validation feedback)
* **Typography:** 
  * Font Pairing: **Outfit** (modern, clean geometric sans-serif for headings) and **Inter** (highly readable sans-serif for body/details).

---

## 2. File Structure

```text
Ethan_site/
├── index.html       # Semantic markup & Accessibility anchors
├── style.css        # Premium styling, variables, grid layouts, and transitions
└── script.js        # Modern JS logic, event listeners, and safe DOM manipulation
```

---

## 3. HTML Structure (`index.html`)

We replace generic containers with semantic HTML5 tags and ensure complete WCAG 2.1 AA accessibility compliance.

### Component Breakdown

1. **Accessibility Skip Link:**
   * Allow keyboard users to bypass navigation: `<a href="#main-content" class="skip-link">Skip to content</a>`.

2. **Main Product Article:**
   * Wrap the page structure in `<main id="main-content">` and the product details in an `<article class="product-card">`.

3. **Visual Media Area (`<figure>`):**
   * Use a `<figure class="product-gallery">` wrapping the product image.
   * Image: `<img id="product-img" src="assets/backpack.jpg" alt="Olive green Heritage Canvas Backpack with leather straps next to textbooks" width="600" height="600" loading="eager">`.
   * Caption: `<figcaption class="sr-only">Olive green Heritage Canvas Backpack shown in campus setting</figcaption>` (or visible subtitle if preferred).

4. **Product Metadata & Pricing:**
   * Heading Hierarchy: `<h1>Heritage Canvas University Backpack</h1>` (Exactly one `<h1>` for SEO).
   * Fixed Price: A container with `aria-live="polite"` holding the price values.
     ```html
     <div class="price-box">
       <span class="unit-price-label">Unit Price:</span>
       <span id="unitPrice" data-price="50">50 دينار</span>
     </div>
     ```

5. **Interactive Form Controls:**
   * Build a semantic form context to capture the transaction: `<form id="purchaseForm" novalidate>`.
   * **Quantity Input Group:**
     * Include a visible label associated via `for` / `id`.
     * Set a minimum target size of `44x44px` for touch targets.
     ```html
     <div class="input-group">
       <label for="quantity">الكمية / Quantity</label>
       <input type="number" id="quantity" min="1" max="99" value="1" required aria-describedby="quantity-error">
       <span id="quantity-error" class="error-message" aria-live="assertive"></span>
     </div>
     ```

6. **Interactive Actions & Display:**
   * Replace inline event handlers (`onclick`) with standard event listeners in JS.
   * Action buttons:
     ```html
     <div class="button-group">
       <button type="submit" id="btnCalculate" class="btn btn-primary">Calculate Total / احسب الإجمالي</button>
       <button type="button" id="btnReset" class="btn btn-secondary">Reset / إعادة تعيين</button>
     </div>
     ```
   * Result Box (using accessible properties):
     ```html
     <div id="totalDisplay" class="total-display" role="status" aria-live="polite">
       <!-- Dynamic calculation content goes here -->
     </div>
     ```

---

## 4. CSS Design System (`style.css`)

Premium look using subtle gradients, modern typography, glassmorphic shadows, and micro-interactions.

### Key CSS Implementations

* **Focus States:** Custom visible focus rings for keyboard navigation.
  ```css
  *:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 2px;
  }
  ```
* **Layout Structure:** Flexbox on mobile, shifting to a two-column CSS Grid layout on desktop (`@media (min-width: 768px)`).
* **Hover and State Micro-animations:** Apply smooth transition timings (`150ms-250ms`) using easing (`cubic-bezier(0.4, 0, 0.2, 1)`).
  ```css
  .btn {
    transition: background-color 0.2s ease, transform 0.1s ease;
  }
  .btn:active {
    transform: scale(0.98);
  }
  ```

---

## 5. JavaScript Logic (`script.js`)

We modularize our Javascript to avoid global namespace pollution, avoid inline attributes, and use robust validations.

### Architectural Blueprint

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("purchaseForm");
  const quantityInput = document.getElementById("quantity");
  const errorDisplay = document.getElementById("quantity-error");
  const totalDisplay = document.getElementById("totalDisplay");
  const unitPriceElement = document.getElementById("unitPrice");
  
  const UNIT_PRICE = parseFloat(unitPriceElement.dataset.price) || 50;

  // Initialize event listeners
  form.addEventListener("submit", handleCalculate);
  document.getElementById("btnReset").addEventListener("click", handleReset);
  quantityInput.addEventListener("input", clearErrorsOnType);

  /**
   * Safe input validation
   */
  function validateInput(value) {
    if (value === "" || isNaN(value)) {
      return "الرجاء إدخال كمية صالحة / Please enter a valid quantity";
    }
    const num = Number(value);
    if (!Number.isInteger(num)) {
      return "يجب أن تكون الكمية عدداً صحيحاً / Quantity must be a whole number";
    }
    if (num < 1) {
      return "يجب أن تكون الكمية 1 على الأقل / Quantity must be at least 1";
    }
    if (num > 99) {
      return "الحد الأقصى للطلب هو 99 حقيبة / Maximum purchase limit is 99";
    }
    return null; // Passes validation
  }

  /**
   * Handle calculation event
   */
  function handleCalculate(event) {
    event.preventDefault(); // Stop standard page reload
    
    const value = quantityInput.value.trim();
    const errorMessage = validateInput(value);

    if (errorMessage) {
      // Accessible error state
      quantityInput.classList.add("input-invalid");
      quantityInput.setAttribute("aria-invalid", "true");
      errorDisplay.textContent = errorMessage;
      totalDisplay.innerHTML = ""; // Clear any previous result
      return;
    }

    // Success flow
    quantityInput.classList.remove("input-invalid");
    quantityInput.removeAttribute("aria-invalid");
    errorDisplay.textContent = "";

    const qty = parseInt(value, 10);
    const totalPrice = qty * UNIT_PRICE;

    // Change contents dynamically & safely
    displayTotal(totalPrice);
  }

  /**
   * Update screen using semantic template
   */
  function displayTotal(price) {
    // Localized and structured securely
    totalDisplay.innerHTML = `
      <div class="result-card">
        <span class="result-label">الإجمالي / Total:</span>
        <strong class="result-val">${price} دينار</strong>
      </div>
    `;
    totalDisplay.classList.add("visible");
  }

  /**
   * Custom reset behavior to clean UI states
   */
  function handleReset() {
    form.reset();
    quantityInput.classList.remove("input-invalid");
    quantityInput.removeAttribute("aria-invalid");
    errorDisplay.textContent = "";
    totalDisplay.innerHTML = "";
    totalDisplay.classList.remove("visible");
  }

  function clearErrorsOnType() {
    if (quantityInput.classList.contains("input-invalid")) {
      quantityInput.classList.remove("input-invalid");
      quantityInput.removeAttribute("aria-invalid");
      errorDisplay.textContent = "";
    }
  }
});
```

---

## 6. Testing & Quality Assurance Checklist

### 1. Functional Verification
* [ ] **Valid Input Execution:** Inputting `3` displays exactly `150 دينار`.
* [ ] **Empty Input Handling:** Triggers input border color change to red, displays helpful text near the field instead of generic alerts.
* [ ] **Negative & Zero Bounds:** Inputting `0` or `-5` shows error state.
* [ ] **Non-integer Safeguard:** Inputting `2.5` displays validation warning.
* [ ] **Reset Operation:** Fully clears values, removes error styling, and wipes out calculated total.

### 2. Accessibility & Responsive Verification
* [ ] **Contrast Verification:** Text elements achieve minimum `4.5:1` contrast ratio.
* [ ] **Tab Order Flow:** Interactive elements are navigable in order (`Skip Link` -> `Input` -> `Calculate` -> `Reset`).
* [ ] **Touch Target Size:** Interactive elements meet minimum `44x44px` area on mobile layouts.
* [ ] **Mobile Responsive Layout:** Fits properly without horizontal scroll down to `360px` viewport width.
