/**
 * Sport Chic Premium Product Showcase Controller
 * Gère les filtres de catégorie, les indices de recherche, le modal des spécifications,
 * le système de formulaire de demande d'informations showroom simulé et l'i18n.
 */

import { products } from "./products.js";
import { getCurrentLanguage, getTranslation, translateProduct, translatePageElements, setLanguage } from "./translations.js";

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

// Initialisation au chargement du document
document.addEventListener("DOMContentLoaded", () => {
  // Rendre getTranslation et translations disponibles globalement pour les inline event handlers
  window.getTranslation = getTranslation;
  
  // Appliquer la langue initiale
  const initialLang = getCurrentLanguage();
  if (DOM.langSwitchBtn) {
    DOM.langSwitchBtn.textContent = initialLang === "fr" ? "AR" : "FR";
  }
  setLanguage(initialLang);

  renderProducts();
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
  const localizedProducts = products.map(product => translateProduct(product));

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

    return `
      <div class="product-card" data-product-id="${product.id}">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        
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
  const localizedProducts = products.map(product => translateProduct(product));
  const product = localizedProducts.find(p => p.id === prodId);
  if (!product) return;

  state.activeShowcaseItem = product;
  state.activeSelectedSize = product.sizes[0];

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

  // Boutons de tailles
  const sizesHTML = product.sizes.map(size => {
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
          <button id="qv-inquiry-trigger-btn" class="btn btn-primary btn-grow">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            ${getTranslation("btn_qv_inquiry")}
          </button>
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
  const triggerBtn = DOM.qvBody.getElementById("qv-inquiry-trigger-btn");
  if (triggerBtn) {
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
