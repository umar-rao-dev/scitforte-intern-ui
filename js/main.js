const API_URL = "http://127.0.0.1:8000/api";

// --- ALERT FUNCTION ---
function showAlert(message, type = "info") {
  const alertContainer = document.getElementById("alert-container");
  if (!alertContainer) return; // Only for dashboard
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  alertContainer.appendChild(alert);
  setTimeout(() => alert.remove(), 5000);
}

// --- LOGIN PAGE LOGIC ---
if (window.location.pathname.includes("login.html")) {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      if (!email || !password) return alert("Please fill in all fields");

      const submitBtn = loginForm.querySelector("button[type=submit]");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Logging in...';
      submitBtn.disabled = true;

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Login failed");
        }

        const data = await res.json();
        localStorage.setItem("auth_token", data.token);
        window.location.href = "dashboard.html";
      } catch (err) {
        alert(err.message);
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });

    // Password toggle
    const toggle = document.getElementById("togglePassword");
    toggle?.addEventListener("click", () => {
      const passwordInput = document.getElementById("password");
      const icon = toggle.querySelector("i");
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.replace("bi-eye", "bi-eye-slash");
      } else {
        passwordInput.type = "password";
        icon.classList.replace("bi-eye-slash", "bi-eye");
      }
    });
  }
}

// --- DASHBOARD PAGE LOGIC ---
if (window.location.pathname.includes("dashboard.html")) {
  const token = localStorage.getItem("auth_token");
  if (!token) window.location.href = "login.html";

  // --- FETCH CATEGORIES ---
  async function fetchCategories() {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();

      const list = document.getElementById("categories-list");
      const select = document.getElementById("product-category");
      list.innerHTML = "";
      select.innerHTML = '<option value="">Select Category</option>';

      data.forEach((cat) => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerHTML = `
          <span>${cat.name}</span>
          <div class="item-actions">
            <span class="badge badge-category">ID: ${cat.id}</span>
          </div>
        `;
        list.appendChild(li);

        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
      });

      document.getElementById("categories-count").textContent = data.length;
    } catch (err) {
      console.error(err);
      showAlert("Error fetching categories", "danger");
    }
  }

  // --- FETCH PRODUCTS ---
  async function fetchProducts() {
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      const list = document.getElementById("products-list");
      list.innerHTML = "";

      data.forEach((prod) => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerHTML = `
          <span>${prod.name} - $${prod.price}</span>
          <div class="item-actions">
            <span class="badge badge-product">Category ID: ${prod.category_id}</span>
          </div>
        `;
        list.appendChild(li);
      });

      document.getElementById("products-count").textContent = data.length;
    } catch (err) {
      console.error(err);
      showAlert("Error fetching products", "danger");
    }
  }

  // --- ADD CATEGORY ---
  document.getElementById("add-category")?.addEventListener("click", async () => {
    const name = document.getElementById("category-name").value.trim();
    if (!name) return showAlert("Category name is required", "warning");

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to add category");
      showAlert("Category added successfully!", "success");
      document.getElementById("category-name").value = "";
      fetchCategories();
    } catch (err) {
      console.error(err);
      showAlert("Error adding category", "danger");
    }
  });

  // --- ADD PRODUCT ---
  document.getElementById("add-product")?.addEventListener("click", async () => {
    const name = document.getElementById("product-name").value.trim();
    const price = document.getElementById("product-price").value.trim();
    const category_id = document.getElementById("product-category").value;
    if (!name || !price || !category_id) return showAlert("All product fields are required", "warning");

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, price, category_id }),
      });
      if (!res.ok) throw new Error("Failed to add product");
      showAlert("Product added successfully!", "success");
      document.getElementById("product-name").value = "";
      document.getElementById("product-price").value = "";
      document.getElementById("product-category").value = "";
      fetchProducts();
    } catch (err) {
      console.error(err);
      showAlert("Error adding product", "danger");
    }
  });

  // --- REFRESH BUTTONS ---
  document.getElementById("refresh-categories")?.addEventListener("click", fetchCategories);
  document.getElementById("refresh-products")?.addEventListener("click", fetchProducts);

  // --- LOGOUT ---
  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem("auth_token");
    window.location.href = "login.html";
  });

  // --- INITIAL LOAD ---
  document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchProducts();
    showAlert("Welcome back! Dashboard loaded successfully.", "success");
  });
}
