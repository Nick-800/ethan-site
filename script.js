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
   * Returns validation error message or null if valid
   */
  function validateInput(value) {
    if (value === "") {
      return "الرجاء إدخال كمية صالحة / Please enter a valid quantity";
    }
    
    const num = Number(value);
    
    if (isNaN(num)) {
      return "الرجاء إدخال كمية صالحة / Please enter a valid quantity";
    }
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
      
      // Hide results visually and semantically
      totalDisplay.innerHTML = ""; 
      totalDisplay.classList.remove("visible");
      return;
    }

    // Success flow - Clear errors
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

  /**
   * Clears form field error styles on user typing
   */
  function clearErrorsOnType() {
    if (quantityInput.classList.contains("input-invalid")) {
      quantityInput.classList.remove("input-invalid");
      quantityInput.removeAttribute("aria-invalid");
      errorDisplay.textContent = "";
    }
  }
});
