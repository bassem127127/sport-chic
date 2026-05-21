/**
 * Sport Chic Premium Product Showcase Controller
 * Gère les filtres de catégorie, les indices de recherche, le modal des spécifications,
 * le système de formulaire de demande d'informations showroom simulé et l'i18n.
 */

import { products } from "./products.js";
import { getSupabaseConfig, saveSupabaseConfig, getSupabaseClient, testSupabaseConnection, fetchProducts, addProduct, updateProduct, deleteProduct, seedDatabase, uploadImage } from "./supabase.js";
import { getCurrentLanguage, getTranslation, translateProduct, translatePageElements, setLanguage, productTranslations } from "./translations.js";

// Cache des éléments DOM
const DOM = {
  productsGrid: document.getElementById("products-grid"),
  searchField: document.getElementById("search-input"),
  categoryButtons: document.querySelectorAll(".filter-btn"),
  sortSelect: document.getElementById("sort-select"),
  resultsCount: document.getElementById("results-count"),
  
  // Modal de Détails Showroom
  quickViewModal: document.getElementById("quick-view-modal"),
  quickViewClose: document.getElementById("quick-view-close"),
  qvBody: document.getElementById("quick-view-body"),
  
  // Modal de Demande d'Informations
  inquiryModal: document.getElementById("inquiry-modal"),
  inquiryClose: document.getElementById("inquiry-close"),
  inquiryForm: document.getElementById("inquiry-form"),
  inquirySuccessPanel: document.getElementById("inquiry-success-panel"),
  inquiryProductId: document.getElementById("inquiry-product-id"),
  inquiryProductName: document.getElementById("inquiry-product-name"),
  inquiryOkBtn: document.getElementById("inquiry-ok-btn"),
  
  // Conteneur de Notifications Toast
  toastContainer: document.getElementById("toast-container"),
  
  // Menu Mobile
  mobileMenuToggle: document.getElementById("mobile-menu-toggle"),
  navLinks: document.querySelector(".nav-links"),
  
  // Bouton de Langue Switcher
  langSwitchBtn: document.getElementById("lang-switch-btn")
};

// État Global de l'Interface
const state = {
  currentCategory: "all",
  searchQuery: "",
  sortBy: "featured",
  activeShowcaseItem: null,
  activeSelectedSize: null
};

// Global active products list inside ESM module
let activeProducts = [...products];

// Initialisation au chargement du document
document.addEventListener("DOMContentLoaded", async () => {
  // Rendre getTranslation et translations disponibles globalement pour les inline event handlers
  window.getTranslation = getTranslation;
  
  // Appliquer la langue initiale
  const initialLang = getCurrentLanguage();
  if (DOM.langSwitchBtn) {
    DOM.langSwitchBtn.textContent = initialLang === "fr" ? "AR" : "FR";
  }
  setLanguage(initialLang);

  // Initialize and check Supabase connection status
  await refreshDatabaseConnection();

  setupEventListeners();
});

/**
 * TRADUCTION DES CATÉGORIES POUR L'AFFICHAGE
 */
function translateCategory(category) {
  return getTranslation(`cat_name_${category}`);
}

/**
 * RENDU DE LA GRILLE DES PRODUITS
 * Filtre, trie et injecte le code HTML des cartes produits.
 */
function renderProducts() {
  if (!DOM.productsGrid) return;

  // Traduire dynamiquement les produits pour la langue active
  const localizedProducts = activeProducts.map(product => translateProduct(product));

  // 1. Filtrer les produits
  const filtered = localizedProducts.filter(product => {
    const matchesCategory = state.currentCategory === "all" || product.category === state.currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(state.searchQuery) ||
                         product.description.toLowerCase().includes(state.searchQuery) ||
                         product.category.toLowerCase().includes(state.searchQuery);
    return matchesCategory && matchesSearch;
  });

  // 2. Trier les produits
  filtered.sort((a, b) => {
    if (state.sortBy === "price-low") return a.price - b.price;
    if (state.sortBy === "price-high") return b.price - a.price;
    if (state.sortBy === "rating") return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); // Les produits recommandés en premier
  });

  // Mettre à jour le compteur
  if (DOM.resultsCount) {
    DOM.resultsCount.textContent = getTranslation("results_found", filtered.length);
  }

  // Gérer l'état vide
  if (filtered.length === 0) {
    DOM.productsGrid.innerHTML = `
      <div class="empty-grid-state">
        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" class="orange-stroke">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h3>${getTranslation("empty_title")}</h3>
        <p>${getTranslation("empty_desc")}</p>
      </div>
    `;
    return;
  }

  // 3. Générer le contenu HTML
  DOM.productsGrid.innerHTML = filtered.map(product => {
    // Calcul des étoiles d'évaluation
    const fullStars = Math.floor(product.rating);
    const halfStar = product.rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    const starsHTML = 
      `<span class="star">★</span>`.repeat(fullStars) + 
      (halfStar ? `<span class="star half">★</span>` : "") + 
      `<span class="star empty">★</span>`.repeat(emptyStars);

    const isOutOfStock = !product.sizes || product.sizes.length === 0;
    const badgeHTML = isOutOfStock
      ? `<span class="product-badge out-of-stock">${getTranslation("badge_out_of_stock")}</span>`
      : (product.badge ? `<span class="product-badge">${product.badge}</span>` : "");

    return `
      <div class="product-card ${isOutOfStock ? "out-of-stock" : ""}" data-product-id="${product.id}">
        ${badgeHTML}
        
        <div class="product-visual">
          <div class="shirt-container">
            <img class="shirt-photo" src="${product.image}" alt="${product.name}" loading="lazy" />
          </div>
          <div class="product-actions">
            <button class="btn btn-primary quick-view-btn" data-id="${product.id}" style="padding: 10px 18px; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" style="margin-right: 4.5px;">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M1,12 C4,6 20,6 23,12 C20,18 4,18 1,12 Z"></path>
              </svg>
              ${getTranslation("qv_card_tech_btn")}
            </button>
          </div>
        </div>
        
        <div class="product-info">
          <span class="product-category-label">${translateCategory(product.category)}</span>
          <h3 class="product-title">${product.name}</h3>
          
          <div class="product-rating-row">
            <div class="stars">${starsHTML}</div>
            <span class="reviews-count">(${product.reviews})</span>
          </div>
          
          <div class="product-footer-row">
            <span class="product-price">${product.price.toFixed(2)} $</span>
            <span class="catalog-details-pill">${getTranslation("qv_card_details_pill")}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");

  attachGridInteractions();
}

/**
 * ATTACHER LES INTERACTIONS SUR LA GRILLE
 */
function attachGridInteractions() {
  const cards = DOM.productsGrid.querySelectorAll(".product-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const prodId = card.getAttribute("data-product-id");
      openQuickView(prodId);
    });
  });

  const qvBtns = DOM.productsGrid.querySelectorAll(".quick-view-btn");
  qvBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openQuickView(btn.getAttribute("data-id"));
    });
  });
}

/**
 * MODAL DE DÉTAILS DU MAILLOT (QUICK VIEW)
 */
function openQuickView(prodId) {
  const localizedProducts = activeProducts.map(product => translateProduct(product));
  const product = localizedProducts.find(p => p.id === prodId);
  if (!product) return;

  state.activeShowcaseItem = product;
  state.activeSelectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;

  renderQuickViewContent();
  DOM.quickViewModal.classList.add("open");
  document.body.style.overflow = "hidden"; // Bloquer le défilement arrière
}

function renderQuickViewContent() {
  const product = state.activeShowcaseItem;
  if (!product) return;

  // Étoiles d'évaluation
  const fullStars = Math.floor(product.rating);
  const halfStar = product.rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  const starsHTML = 
    `<span class="star">★</span>`.repeat(fullStars) + 
    (halfStar ? `<span class="star half">★</span>` : "") + 
    `<span class="star empty">★</span>`.repeat(emptyStars);

  // Spécifications techniques sous forme de liste
  const specsHTML = product.specs.map(spec => `
    <li class="qv-spec-item">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" class="orange-stroke" style="flex-shrink:0;">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${spec}</span>
    </li>
  `).join("");

  // Boutons de tailles ou message hors stock
  const isOutOfStock = !product.sizes || product.sizes.length === 0;
  const sizesHTML = isOutOfStock
    ? `
      <span class="qv-out-of-stock-alert" style="color: #ef4444; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 6px;">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" style="flex-shrink:0;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        ${getTranslation("qv_out_of_stock_alert")}
      </span>
    `
    : product.sizes.map(size => {
        const isSelected = size === state.activeSelectedSize;
        return `
          <button class="size-pill ${isSelected ? "active" : ""}" data-size="${size}">${size}</button>
        `;
      }).join("");

  DOM.qvBody.innerHTML = `
    <div class="qv-grid">
      <div class="qv-visual-panel">
        <div class="qv-shirt-box">
          <img class="qv-shirt-photo" src="${product.image}" alt="${product.name}" />
        </div>
      </div>
      
      <div class="qv-info-panel">
        <span class="qv-category">${translateCategory(product.category)}</span>
        <h2 class="qv-title">${product.name}</h2>
        
        <div class="qv-rating-line">
          <div class="stars">${starsHTML}</div>
          <span class="rating-text">${product.rating} / 5.0</span>
          <span class="reviews-sep">${getTranslation("qv_rating_sep")}</span>
          <span class="reviews-link">${product.reviews} ${getTranslation("qv_reviews_suffix")}</span>
        </div>
        
        <div class="qv-price">${product.price.toFixed(2)} $</div>
        
        <p class="qv-description">${product.description}</p>
        
        <!-- Fiche Spécifications Techniques -->
        <div class="qv-specs-section">
          <h4 class="qv-specs-title">${getTranslation("qv_specs_title")}</h4>
          <ul class="qv-specs-list">
            ${specsHTML}
          </ul>
        </div>
        
        <!-- Sélection Tailles -->
        <div class="qv-options" style="border-bottom:none; margin-bottom:0;">
          <div class="qv-option-row">
            <span class="option-label">${getTranslation("qv_sizes_title")}</span>
            <div class="size-pills">
              ${sizesHTML}
            </div>
          </div>
        </div>
        
        <div class="qv-purchase-row" style="margin-top: 24px; margin-bottom: 0;">
          ${isOutOfStock 
            ? `
              <button id="qv-inquiry-trigger-btn" class="btn btn-secondary btn-grow" disabled style="opacity: 0.5; cursor: not-allowed; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                ${getTranslation("badge_out_of_stock")}
              </button>
            `
            : `
              <button id="qv-inquiry-trigger-btn" class="btn btn-primary btn-grow">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                ${getTranslation("btn_qv_inquiry")}
              </button>
            `
          }
        </div>
      </div>
    </div>
  `;

  // Attacher les écouteurs de la vue détails
  setupQuickViewListeners();
}

function setupQuickViewListeners() {
  // Sélection de la taille
  DOM.qvBody.querySelectorAll(".size-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      state.activeSelectedSize = pill.getAttribute("data-size");
      renderQuickViewContent();
    });
  });

  // Ouverture du formulaire de demande d'informations
  const triggerBtn = document.getElementById("qv-inquiry-trigger-btn");
  if (triggerBtn && !triggerBtn.disabled) {
    triggerBtn.addEventListener("click", () => {
      // Fermer d'abord les détails
      DOM.quickViewModal.classList.remove("open");
      
      // Ouvrir le formulaire
      openInquiryModal(state.activeShowcaseItem, state.activeSelectedSize);
    });
  }
}

/**
 * FORMULAIRE DE DEMANDE SHOWROOM SIMULÉ
 */
function openInquiryModal(product, size) {
  DOM.inquiryForm.style.display = "grid";
  DOM.inquirySuccessPanel.style.display = "none";
  
  DOM.inquiryProductId.value = product.id;
  DOM.inquiryProductName.value = `${product.name} (Taille : ${size})`;
  document.getElementById("inq-size").value = size;
  
  // Vider les autres champs
  document.getElementById("inq-name").value = "";
  document.getElementById("inq-email").value = "";
  document.getElementById("inq-qty").value = "1";
  document.getElementById("inq-msg").value = "";
  
  DOM.inquiryModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeInquiryModal() {
  DOM.inquiryModal.classList.remove("open");
  document.body.style.overflow = "";
}

function handleInquirySubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById("inq-name").value.trim();
  const email = document.getElementById("inq-email").value.trim();
  const size = document.getElementById("inq-size").value;
  const qty = document.getElementById("inq-qty").value;
  const msg = document.getElementById("inq-msg").value.trim();
  
  if (!name || !email || !msg) {
    showToast(getTranslation("toast_inquiry_warning"), "warning");
    return;
  }
  
  // Cacher le formulaire, afficher le reçu de confirmation
  DOM.inquiryForm.style.display = "none";
  
  const inqCode = "DEM-" + Math.floor(100000 + Math.random() * 900000);
  document.getElementById("inq-success-email").textContent = email;
  document.getElementById("inq-success-code").textContent = inqCode;
  
  DOM.inquirySuccessPanel.style.display = "block";
  showToast(getTranslation("toast_inquiry_success"), "success");
}

/**
 * CONFIGURATION DES ÉCOUTEURS D'ÉVÉNEMENTS GÉNÉRAUX
 */
function setupEventListeners() {
  // Filtres de catégories
  DOM.categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      DOM.categoryButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentCategory = btn.getAttribute("data-category");
      renderProducts();
    });
  });

  // Recherche en temps réel
  if (DOM.searchField) {
    DOM.searchField.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Tri de l'affichage
  if (DOM.sortSelect) {
    DOM.sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Fermeture du modal de détails
  if (DOM.quickViewClose) {
    DOM.quickViewClose.addEventListener("click", () => {
      DOM.quickViewModal.classList.remove("open");
      document.body.style.overflow = "";
    });
  }

  // Fermeture du formulaire de demande d'informations
  if (DOM.inquiryClose) DOM.inquiryClose.addEventListener("click", closeInquiryModal);
  if (DOM.inquiryOkBtn) DOM.inquiryOkBtn.addEventListener("click", closeInquiryModal);

  // Fermer les fenêtres au clic sur l'arrière-plan
  window.addEventListener("click", (e) => {
    if (e.target === DOM.quickViewModal) {
      DOM.quickViewModal.classList.remove("open");
      document.body.style.overflow = "";
    }
    if (e.target === DOM.inquiryModal) {
      closeInquiryModal();
    }
    const adminModal = document.getElementById("admin-modal");
    if (e.target === adminModal) {
      adminModal.classList.remove("open");
      document.body.style.overflow = "";
    }
    const formModal = document.getElementById("admin-product-form-modal");
    if (e.target === formModal) {
      formModal.classList.remove("open");
    }
  });

  // Soumission du formulaire
  if (DOM.inquiryForm) {
    DOM.inquiryForm.addEventListener("submit", handleInquirySubmit);
  }

  // Menu burger de navigation sur mobile
  if (DOM.mobileMenuToggle) {
    DOM.mobileMenuToggle.addEventListener("click", () => {
      DOM.navLinks.classList.toggle("open");
      DOM.mobileMenuToggle.classList.toggle("active");
    });
  }

  // Clic sur le sélecteur de langue
  if (DOM.langSwitchBtn) {
    DOM.langSwitchBtn.addEventListener("click", () => {
      const current = getCurrentLanguage();
      const nextLang = current === "fr" ? "ar" : "fr";
      setLanguage(nextLang);
    });
  }

  // Écouteur personnalisé pour le changement de langue (découplé, SOLID & DRY)
  window.addEventListener("languagechange", (e) => {
    const lang = e.detail.language;
    if (DOM.langSwitchBtn) {
      DOM.langSwitchBtn.textContent = lang === "fr" ? "AR" : "FR";
    }
    // Re-rendre la grille de produits avec les nouvelles traductions
    renderProducts();
  });

  // Admin Dashboard Opening
  const adminBtn = document.getElementById("admin-dashboard-btn");
  if (adminBtn) adminBtn.addEventListener("click", openAdminModal);

  // Close Admin Modal
  const adminClose = document.getElementById("admin-close");
  if (adminClose) {
    adminClose.addEventListener("click", () => {
      const adminModal = document.getElementById("admin-modal");
      if (adminModal) adminModal.classList.remove("open");
      document.body.style.overflow = "";
    });
  }

  // Open Product Form modal button
  const addProductBtn = document.getElementById("admin-add-product-btn");
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => openProductForm(null));
  }

  // Close Product Form modal button
  const productFormClose = document.getElementById("product-form-close");
  if (productFormClose) {
    productFormClose.addEventListener("click", () => {
      const formModal = document.getElementById("admin-product-form-modal");
      if (formModal) formModal.classList.remove("open");
    });
  }

  // Submit of Supabase Config Form
  const configForm = document.getElementById("supabase-config-form");
  if (configForm) {
    configForm.addEventListener("submit", handleConfigSubmit);
  }

  // Submit of Product Edit/Add Form
  const productEditForm = document.getElementById("admin-product-edit-form");
  if (productEditForm) {
    productEditForm.addEventListener("submit", handleProductFormSubmit);
  }

  // Seed Database button
  const seedBtn = document.getElementById("admin-seed-db-btn");
  if (seedBtn) {
    seedBtn.addEventListener("click", seedDatabaseAction);
  }

  // Copy SQL Script button
  const copySqlBtn = document.getElementById("copy-sql-btn");
  if (copySqlBtn) {
    copySqlBtn.addEventListener("click", () => {
      const code = document.getElementById("sql-schema-code").textContent;
      navigator.clipboard.writeText(code).then(() => {
        showToast("Script SQL copié dans le presse-papiers !", "success");
      }).catch(err => {
        console.error("Impossible de copier", err);
      });
    });
  }
}

/**
 * ==========================================================================
 * ADMIN ACTIONS & SUPABASE CRUD SYSTEM
 * ==========================================================================
 */

async function refreshDatabaseConnection() {
  const showroomBadge = document.getElementById("db-status-badge");
  const modalBadge = document.getElementById("supabase-status-badge");
  
  const result = await testSupabaseConnection();
  const isConnected = result.success && result.tableExists;
  
  if (showroomBadge) {
    showroomBadge.className = `db-status-badge ${isConnected ? 'connected' : 'local'}`;
    const text = showroomBadge.querySelector(".db-status-text");
    if (text) text.textContent = isConnected ? "Catalogue Supabase" : "Catalogue Local";
  }
  
  if (modalBadge) {
    modalBadge.className = `connection-status-badge ${isConnected ? 'connected' : 'local'}`;
    const text = modalBadge.querySelector(".status-text");
    if (text) text.textContent = isConnected ? "Connecté" : "Non Connecté";
    const dot = modalBadge.querySelector(".status-dot");
    if (dot) dot.style.backgroundColor = isConnected ? "rgb(34, 197, 94)" : "var(--primary)";
  }
  
  const seedBtn = document.getElementById("admin-seed-db-btn");
  if (seedBtn) {
    seedBtn.style.display = result.success ? "inline-block" : "none";
  }
  
  if (isConnected) {
    try {
      activeProducts = await fetchProducts();
    } catch (e) {
      console.error("Failed to fetch products from Supabase, falling back", e);
      activeProducts = [...products];
    }
  } else {
    activeProducts = [...products];
  }
  
  renderProducts();
}

function openAdminModal() {
  const adminModal = document.getElementById("admin-modal");
  if (!adminModal) return;
  
  const { url, key } = getSupabaseConfig();
  const urlInput = document.getElementById("config-supabase-url");
  const keyInput = document.getElementById("config-supabase-key");
  if (urlInput) urlInput.value = url;
  if (keyInput) keyInput.value = key;
  
  renderAdminProducts();
  setupAdminTabSwitching();
  
  adminModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function renderAdminProducts() {
  const tableBody = document.getElementById("admin-products-table-body");
  if (!tableBody) return;
  
  if (activeProducts.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 30px; color: var(--text-light);">
          Aucun produit dans la base. Utilisez "Initier la Base (Seed)" pour peupler des maillots de démonstration.
        </td>
      </tr>
    `;
    return;
  }
  
  tableBody.innerHTML = activeProducts.map(product => {
    return `
      <tr>
        <td>
          <img src="${product.image}" class="admin-table-thumb" alt="${product.name}" />
        </td>
        <td>
          <div style="font-weight: 700; color: var(--text-dark);">${product.name}</div>
          <div style="font-size: 11px; color: var(--text-light); font-family: monospace;">${product.id}</div>
        </td>
        <td>
          <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--primary);">
            ${translateCategory(product.category)}
          </span>
        </td>
        <td style="font-family: var(--font-heading); font-weight: 800; color: var(--text-dark);">
          ${product.price.toFixed(2)} $
        </td>
        <td>
          <span style="font-weight: 700; color: #ffb800;">★</span> ${product.rating.toFixed(1)} <span style="color: var(--text-light);">(${product.reviews})</span>
        </td>
        <td>
          <div class="admin-action-btns">
            <button class="action-btn-circle edit-btn" data-id="${product.id}" title="Modifier">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button class="action-btn-circle delete delete-btn" data-id="${product.id}" title="Supprimer">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
  
  tableBody.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      openProductForm(btn.getAttribute("data-id"));
    });
  });
  
  tableBody.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      deleteProductAction(btn.getAttribute("data-id"));
    });
  });
}

function openProductForm(prodId = null) {
  const formModal = document.getElementById("admin-product-form-modal");
  const formTitle = document.getElementById("product-form-title");
  const modeInput = document.getElementById("edit-product-mode");
  const idInput = document.getElementById("prod-field-id");
  
  if (!formModal) return;
  
  document.getElementById("admin-product-edit-form").reset();
  
  document.querySelectorAll("#form-sizes-checkboxes input").forEach(cb => {
    cb.checked = cb.value !== "XXL";
  });
  
  if (prodId) {
    const product = activeProducts.find(p => p.id === prodId);
    if (!product) return;
    
    formTitle.textContent = "Modifier le maillot";
    modeInput.value = "edit";
    idInput.value = product.id;
    idInput.readOnly = true;
    
    document.getElementById("prod-field-category").value = product.category;
    document.getElementById("prod-field-name-fr").value = product.name;
    document.getElementById("prod-field-name-ar").value = product.ar_name || "";
    document.getElementById("prod-field-price").value = product.price;
    document.getElementById("prod-field-image").value = product.image;
    document.getElementById("prod-field-image-url").value = product.image;
    document.getElementById("prod-field-badge-ar").value = product.ar_badge || "";
    document.getElementById("prod-field-desc-fr").value = product.description;
    document.getElementById("prod-field-desc-ar").value = product.ar_description || "";
    
    document.querySelectorAll("#form-sizes-checkboxes input").forEach(cb => {
      cb.checked = product.sizes.includes(cb.value);
    });
    
    document.getElementById("prod-field-specs-fr").value = (product.specs || []).join("\n");
    document.getElementById("prod-field-specs-ar").value = (product.ar_specs || []).join("\n");
  } else {
    formTitle.textContent = "Ajouter un nouveau maillot";
    modeInput.value = "add";
    idInput.value = "";
    // Ensure file input is cleared when opening the form
    const fileInput = document.getElementById("prod-field-image-file");
    if (fileInput) fileInput.value = "";
    idInput.readOnly = false;
    // Open the product form modal
    formModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

async function handleProductFormSubmit(e) {
  e.preventDefault();
  
  const mode = document.getElementById("edit-product-mode").value;
  const id = document.getElementById("prod-field-id").value.trim();
  const category = document.getElementById("prod-field-category").value;
  const nameFr = document.getElementById("prod-field-name-fr").value.trim();
  const nameAr = document.getElementById("prod-field-name-ar").value.trim();
  const price = parseFloat(document.getElementById("prod-field-price").value);
  const badgeFr = document.getElementById("prod-field-badge-fr").value.trim() || null;
  const badgeAr = document.getElementById("prod-field-badge-ar").value.trim() || null;
  const descFr = document.getElementById("prod-field-desc-fr").value.trim();
  const descAr = document.getElementById("prod-field-desc-ar").value.trim();
  
  // Image handling: prioritize file upload, fallback to URL field
  const fileInput = document.getElementById("prod-field-image-file");
  const urlInput = document.getElementById("prod-field-image-url");
  let image = ""; 
  
  const sizes = Array.from(document.querySelectorAll("#form-sizes-checkboxes input:checked")).map(cb => cb.value);
  const specsFr = document.getElementById("prod-field-specs-fr").value.split("\n").map(s => s.trim()).filter(Boolean);
  const specsAr = document.getElementById("prod-field-specs-ar").value.split("\n").map(s => s.trim()).filter(Boolean);

  // Resolve image URL: if a file is selected, upload it; otherwise use URL input.
  if (fileInput && fileInput.files && fileInput.files[0]) {
    try {
      image = await uploadImage(fileInput.files[0]);
    } catch (err) {
      console.error("Image upload failed:", err);
      showToast(`Erreur d'upload d'image: ${err.message || err}`, "warning");
      return;
    }
  } else {
    image = urlInput ? urlInput.value.trim() : "";
  }
  
  if (!id || !nameFr || !descFr || isNaN(price) || !image || sizes.length === 0) {
    showToast("Veuillez remplir tous les champs requis et cocher au moins une taille.", "warning");
    return;
  }
  
  const productData = {
    id,
    name: nameFr,
    description: descFr,
    price,
    category,
    badge: badgeFr,
    image,
    sizes,
    specs: specsFr,
    rating: 5.0,
    reviews: 0,
    ar_name: nameAr || null,
    ar_badge: badgeAr || null,
    ar_description: descAr || null,
    ar_specs: specsAr.length > 0 ? specsAr : null
  };
  
  try {
    if (mode === "add") {
      if (activeProducts.some(p => p.id === id)) {
        showToast(`Un produit avec l'identifiant "${id}" existe déjà.`, "warning");
        return;
      }
      await addProduct(productData);
      showToast("Maillot ajouté avec succès à la base Supabase !", "success");
    } else {
      const existing = activeProducts.find(p => p.id === id);
      if (existing) {
        productData.rating = existing.rating;
        productData.reviews = existing.reviews;
      }
      await updateProduct(id, productData);
      showToast("Maillot modifié avec succès dans la base Supabase !", "success");
    }
    
    const formModal = document.getElementById("admin-product-form-modal");
    if (formModal) formModal.classList.remove("open");
    
    await refreshDatabaseConnection();
    renderAdminProducts();
  } catch (err) {
    console.error("Erreur lors de la soumission du produit:", err);
    showToast(`Erreur: ${err.message || err}`, "warning");
  }
}

async function deleteProductAction(prodId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer définitivement ce maillot de sport ?")) return;
  
  try {
    await deleteProduct(prodId);
    showToast("Maillot supprimé avec succès de la base Supabase !", "success");
    await refreshDatabaseConnection();
    renderAdminProducts();
  } catch (err) {
    console.error("Erreur de suppression du produit:", err);
    showToast(`Erreur: ${err.message || err}`, "warning");
  }
}

async function handleConfigSubmit(e) {
  e.preventDefault();
  const url = document.getElementById("config-supabase-url").value.trim();
  const key = document.getElementById("config-supabase-key").value.trim();
  
  saveSupabaseConfig(url, key);
  showToast("Configuration Supabase enregistrée. Reconnexion...", "success");
  
  await refreshDatabaseConnection();
  renderAdminProducts();
}

async function seedDatabaseAction() {
  if (!confirm("Voulez-vous peupler la base de données Supabase avec les 7 maillots de démonstration d'origine ? Cela écrasera les maillots ayant les mêmes identifiants.")) return;
  
  const seedBtn = document.getElementById("admin-seed-db-btn");
  try {
    if (seedBtn) {
      seedBtn.disabled = true;
      seedBtn.textContent = "Peuplement...";
    }
    await seedDatabase(products, productTranslations);
    showToast("Base de données peuplée avec succès avec les maillots de démonstration !", "success");
    await refreshDatabaseConnection();
    renderAdminProducts();
  } catch (err) {
    console.error("Erreur de seed de la base de données:", err);
    showToast(`Échec du seed: ${err.message || err}`, "warning");
  } finally {
    if (seedBtn) {
      seedBtn.disabled = false;
      seedBtn.textContent = "Initier la Base (Seed)";
    }
  }
}

function setupAdminTabSwitching() {
  const tabs = document.querySelectorAll(".admin-tab");
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const tabTarget = tab.getAttribute("data-tab");
      document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.toggle("active", content.id === `tab-${tabTarget}`);
      });
    };
  });
}

/**
 * GESTIONNAIRE DE NOTIFICATIONS TOAST FLOOTANTES
 */
function showToast(message, type = "success") {
  if (!DOM.toastContainer) return;
  
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  // Icônes personnalisées selon l'alerte
  let icon = `
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  `;
  
  if (type === "warning") {
    icon = `
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    `;
  }
  
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-body">${message}</div>
    <button class="toast-close">×</button>
  `;
  
  DOM.toastContainer.appendChild(toast);

  // Retirer automatiquement après délai
  const removeTimer = setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, 4000);

  // Bouton de fermeture manuelle
  toast.querySelector(".toast-close").addEventListener("click", () => {
    clearTimeout(removeTimer);
    toast.remove();
  });
}

// Rendre accessible globalement pour les scripts en ligne simples
window.showToast = showToast;
