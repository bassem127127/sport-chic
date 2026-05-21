/**
 * Sport Chic Translation Service & Dictionary (French & Arabic)
 * Handles internationalization, localStorage persistence, document text swapping,
 * and RTL (Right-to-Left) layouts.
 */

export const translations = {
  fr: {
    // Nav links
    nav_home: "Accueil",
    nav_showroom: "Catalogue Showroom",
    nav_stores: "Points de Vente",
    btn_inquire_showroom: "Contacter le Showroom",
    search_tooltip: "Rechercher des produits",
    
    // Hero
    hero_badge: "LA COLLECTION ORANGE CINÉTIQUE",
    hero_title: "ÉLEVEZ VOS PERFORMANCES <span>SPORTIVES</span>",
    hero_tagline: "Bienvenue dans la vitrine technique Sport Chic. Découvrez nos séries limitées de maillots de sport aux finitions blanches épurées et orange cinétique. Inspectez les spécifications techniques et demandez un devis instantanément.",
    btn_discover_showroom: "Découvrir la Vitrine",
    btn_facebook: "Page Facebook",
    btn_whatsapp: "WhatsApp Showroom",
    
    // Showroom Header
    showroom_title: "Catalogue Showroom",
    showroom_subtitle: "Filtrez par discipline sportive, triez par propriétés techniques ou recherchez vos tissus athlétiques préférés ci-dessous.",
    
    // Category filters
    cat_all: "Tous les Produits",
    cat_training: "Fitness & Entraînement",
    cat_running: "Course & Cyclisme",
    cat_tennis: "Polo de Tennis",
    
    // Search & Sort placeholders
    search_placeholder: "Rechercher un maillot de sport...",
    sort_featured: "Trier : Recommandés",
    sort_price_low: "Prix : Croissant",
    sort_price_high: "Prix : Décroissant",
    sort_rating: "Avis : Les Mieux Notés",
    
    // Results
    results_inspect: "Cliquez sur un maillot pour inspecter ses spécifications techniques",
    results_found_singular: "1 produit trouvé",
    results_found_plural: "{count} produits trouvés",
    empty_title: "Aucun maillot de sport trouvé",
    empty_desc: "Essayez de modifier vos termes de recherche ou de choisir une autre catégorie.",
    
    // Inquiry Modal
    inquiry_title: "Demande d'Information Produit",
    inquiry_subtitle: "Soumettez vos coordonnées pour demander un devis de taille ou des spécifications de matériaux à nos experts.",
    label_selected_shirt: "Maillot Sélectionné",
    label_full_name: "Votre Nom Complet *",
    label_email: "Adresse E-mail *",
    label_requested_size: "Taille Demandée *",
    label_quantity: "Quantité *",
    label_additional_details: "Détails Supplémentaires de la Demande *",
    placeholder_name: "Saisissez votre nom",
    placeholder_msg: "Demander des dimensions précises, des tarifs de volume ou des fiches d'échantillons physiques...",
    btn_submit_inquiry: "Envoyer la Demande au Showroom",
    
    // Success panel
    inquiry_success_title: "Demande Envoyée !",
    inquiry_success_text: "Merci d'avoir contacté le showroom Sport Chic. Un conseiller technique vous répondra à l'adresse <strong id=\"inq-success-email\" style=\"color: var(--text-dark);\"></strong> sous 24 heures.",
    inquiry_success_code_label: "Code de Demande :",
    btn_back_to_showroom: "Retour à la Vitrine",
    
    // Quick View Modal
    qv_specs_title: "Fiche Technique & Matériaux",
    qv_sizes_title: "Tailles Disponibles :",
    btn_qv_inquiry: "Demander un Devis Showroom",
    qv_rating_sep: "•",
    qv_reviews_suffix: "avis clients",
    qv_card_details_pill: "Détails",
    qv_card_tech_btn: "Fiche Tech",
    badge_out_of_stock: "Hors Stock",
    qv_out_of_stock_alert: "Ce maillot est actuellement en rupture de stock.",
    
    // Toasts
    toast_newsletter_success: "Inscription réussie à la newsletter Sport Chic !",
    toast_inquiry_success: "Demande soumise avec succès au Showroom !",
    toast_inquiry_warning: "Veuillez remplir tous les champs obligatoires du showroom.",
    
    // Footer
    footer_desc: "Concevoir des vêtements de sport haute performance pensés pour motiver et durer. Allier innovations textiles techniques et designs de pointe.",
    newsletter_placeholder: "Rejoignez notre newsletter active",
    footer_col_showroom: "Collections Showroom",
    footer_col_inquiries: "Demandes & Devis",
    footer_col_company: "L'Entreprise",
    footer_link_running: "Hauts de Running",
    footer_link_training: "T-shirts d'Entraînement",
    footer_link_tennis: "Polos de Tennis",
    footer_link_jackets: "Vestes de Sport",
    footer_link_compression: "Sous-couches de Compression",
    footer_link_quote: "Demander un Devis",
    footer_link_group: "Commandes de Groupe",
    footer_link_specs: "Fiches Techniques Tissus",
    footer_link_appt: "Rendez-vous Showroom",
    footer_link_b2b: "Partenariats B2B",
    footer_link_mission: "Notre Mission",
    footer_link_fabrics: "Tissus Durables",
    footer_link_careers: "Recrutement",
    footer_link_press: "Espace Presse",
    footer_link_stores: "Nos Points de Vente",
    footer_copyright: "&copy; 2026 Sport Chic Inc. Catalogue de démonstration technique showroom.",
    footer_b2b_showcase: "Vitrine B2B",
    footer_quote_requests: "Demandes de Devis",
    footer_sustainable_wear: "Activewear Durable",
    
    // Dynamic Categories
    cat_name_all: "Tous",
    cat_name_training: "Entraînement",
    cat_name_running: "Running",
    cat_name_tennis: "Tennis"
  },
  ar: {
    // Nav links
    nav_home: "الرئيسية",
    nav_showroom: "كتالوج صالة العرض",
    nav_stores: "نقاط البيع",
    btn_inquire_showroom: "اتصل بصالة العرض",
    search_tooltip: "البحث عن المنتجات",
    
    // Hero
    hero_badge: "مجموعة البرتقالي الحركي المميزة",
    hero_title: "ارتقِ بأدائك <span>الرياضي</span>",
    hero_tagline: "مرحبًا بكم في معرض سبورت شيك التقني. اكتشفوا مجموعاتنا المحدودة من القمصان الرياضية بلمسات بيضاء أنيقة وبرتقالي حركي. تصفحوا المواصفات الفنية واطلبوا عرض سعر على الفور.",
    btn_discover_showroom: "اكتشف المعرض",
    btn_facebook: "صفحة فيسبوك",
    btn_whatsapp: "واتساب صالة العرض",
    
    // Showroom Header
    showroom_title: "كتالوج صالة العرض",
    showroom_subtitle: "تصفية حسب التخصص الرياضي، أو الترتيب حسب الخصائص الفنية، أو البحث عن أقمشتكم الرياضية المفضلة أدناه.",
    
    // Category filters
    cat_all: "كل المنتجات",
    cat_training: "اللياقة والتدريب",
    cat_running: "الجري وركوب الدراجات",
    cat_tennis: "قميص تنس بولو",
    
    // Search & Sort placeholders
    search_placeholder: "ابحث عن قميص رياضي...",
    sort_featured: "ترتيب: موصى به",
    sort_price_low: "السعر: من الأقل للأعلى",
    sort_price_high: "السعر: من الأعلى للأقل",
    sort_rating: "التقييم: الأعلى تقييمًا",
    
    // Results
    results_inspect: "انقر على القميص للاطلاع على مواصفاته الفنية",
    results_found_singular: "تم العثور على منتج واحد",
    results_found_plural: "تم العثور على {count} منتجات",
    empty_title: "لم يتم العثور على أي قميص رياضي",
    empty_desc: "يرجى تعديل مصطلحات البحث أو اختيار فئة أخرى.",
    
    // Inquiry Modal
    inquiry_title: "طلب معلومات المنتج",
    inquiry_subtitle: "أرسل معلومات الاتصال الخاصة بك لطلب عرض سعر للمقاس أو مواصفات المواد من خبرائنا.",
    label_selected_shirt: "القميص المختار",
    label_full_name: "الاسم الكامل *",
    label_email: "البريد الإلكتروني *",
    label_requested_size: "المقاس المطلوب *",
    label_quantity: "الكمية *",
    label_additional_details: "تفاصيل إضافية للطلب *",
    placeholder_name: "أدخل اسمك الكامل",
    placeholder_msg: "اطلب مقاسات دقيقة، أو أسعار كميات، أو عينات مادية...",
    btn_submit_inquiry: "إرسال الطلب إلى صالة العرض",
    
    // Success panel
    inquiry_success_title: "تم إرسال الطلب بنجاح!",
    inquiry_success_text: "نشكرك على تواصلك مع صالة عرض سبورت شيك. سيرد عليك مستشار فني على العنوان <strong id=\"inq-success-email\" style=\"color: var(--text-dark);\"></strong> خلال 24 ساعة.",
    inquiry_success_code_label: "رمز الطلب:",
    btn_back_to_showroom: "العودة إلى المعرض",
    
    // Quick View Modal
    qv_specs_title: "المواصفات الفنية والمواد",
    qv_sizes_title: "المقاسات المتوفرة:",
    btn_qv_inquiry: "طلب عرض سعر من صالة العرض",
    qv_rating_sep: "•",
    qv_reviews_suffix: "آراء العملاء",
    qv_card_details_pill: "تفاصيل",
    qv_card_tech_btn: "المواصفات",
    badge_out_of_stock: "خارج المخزن",
    qv_out_of_stock_alert: "هذا القميص غير متوفر حالياً في المخزن.",
    
    // Toasts
    toast_newsletter_success: "تم الاشتراك بنجاح في نشرة سبورت شيك الإخبارية!",
    toast_inquiry_success: "تم تقديم طلبك بنجاح إلى صالة العرض!",
    toast_inquiry_warning: "يرجى ملء جميع الحقول المطلوبة لصالة العرض.",
    
    // Footer
    footer_desc: "تصميم ملابس رياضية عالية الأداء مصممة للتحفيز والاستدامة. الجمع بين ابتكارات النسيج التقنية والتصميمات المتطورة والفاخرة.",
    newsletter_placeholder: "انضم إلى نشرتنا الإخبارية النشطة",
    footer_col_showroom: "مجموعات المعرض",
    footer_col_inquiries: "الطلبات وعروض الأسعار",
    footer_col_company: "الشركة",
    footer_link_running: "قمصان الجري",
    footer_link_training: "قمصان التدريب",
    footer_link_tennis: "قمصان التنس بولو",
    footer_link_jackets: "سترات رياضية",
    footer_link_compression: "طبقات الضغط الداخلية",
    footer_link_quote: "طلب عرض سعر",
    footer_link_group: "الطلبات الجماعية",
    footer_link_specs: "أوراق مواصفات الأقمشة",
    footer_link_appt: "موعد صالة العرض",
    footer_link_b2b: "شراكات B2B",
    footer_link_mission: "مهمتنا",
    footer_link_fabrics: "أقمشة مستدامة",
    footer_link_careers: "التوظيف",
    footer_link_press: "المركز الإعلامي",
    footer_link_stores: "نقاط بيعنا",
    footer_copyright: "&copy; 2026 شركة سبورت شيك. كتالوج تجريبي فني لصالة العرض.",
    footer_b2b_showcase: "معرض B2B",
    footer_quote_requests: "طلبات عروض الأسعار",
    footer_sustainable_wear: "ملابس رياضية مستدامة",
    
    // Dynamic Categories
    cat_name_all: "الكل",
    cat_name_training: "اللياقة",
    cat_name_running: "الجري",
    cat_name_tennis: "التنس"
  }
};

export const productTranslations = {
  ar: {
    "prod-zenith-knit": {
      name: "تي شيرت Zenith Aero Knit",
      badge: "جديد",
      description: "تي شيرت تدريب مصنوع من نسيج شبكي تقني مع درزات برتقالية فلورية ديناميكية. مصمم بتقنية HEAT.RDY لتوفير تهوية حرارية فائقة أثناء المجهود البدني المكثف.",
      specs: [
        "التركيب : 88% بوليستر تقني معاد تدويره، 12% ليكرا",
        "التقنية : HEAT.RDY لامتصاص فائق وعالي التهوية للرطوبة",
        "الدرزات : مسطحة مانعة للاحتكاك لراحة مثالية",
        "القصة : رياضية مريحة ومتناسقة مع شكل الجسم"
      ]
    },
    "prod-velocity-mesh": {
      name: "قميص Velocity Aero الرياضي",
      badge: "خفيف للغاية",
      description: "قميص رياضي بدون أكمام للجري عالي الأداء مع لمسات نهائية باللون البرتقالي الحركي. مصنوع من ألواح شبكية دقيقة وخفيفة للغاية لتعزيز تدفق الهواء المستمر في جميع الاتجاهات.",
      specs: [
        "التركيب : 100% بلاستيك معاد تدويره مستخرج من المحيطات",
        "التقنية : تجفيف فائق السرعة AeroFlow",
        "الوزن : نسيج شبكي خفيف للغاية بوزن 95 جرام لكل متر مربع",
        "السلامة : أشرطة برتقالية عاكسة للضوء في ظروف الإضاءة المنخفضة"
      ]
    },
    "prod-ascent-polo": {
      name: "قميص بولو Ascent الفاخر",
      badge: "فاخر",
      description: "قميص بولو تنس فاخر باللون الأبيض الناصع. مزيج من القطن العضوي الناعم وبوليستر البيكيه، يعززه ياقة مخططة باللون البرتقالي الرياضي المميز.",
      specs: [
        "التركيب : 60% قطن بيما العضوي، 40% بوليستر بيكيه معاد تدويره",
        "التقنية : نسيج SmartWeave المقاوم للتوبير والاهتراء",
        "اللمسات الأخيرة : ياقة وأساور محبوكة باللون البرتقالي المميز",
        "الحماية : مؤشر حماية من الأشعة فوق البنفسجية UPF 50+"
      ]
    },
    "prod-stratus-singlet": {
      name: "قميص Stratus Speed بدون أكمام",
      badge: "رائج",
      description: "قميص رياضي أبيض بدون أكمام مع ألواح جانبية بلون البرتقالي الشفقي. تضمن قصته المريحة حرية حركة كاملة عند الأكتاف أثناء الجري.",
      specs: [
        "التركيب : 90% بوليستر محبوك بتقنية Aero-knit، 10% إيلاستين",
        "التقنية : طرد سريع لعرق الجري بتقنية VaporShield",
        "القصة : تصميم مريح بفتحات ذراع واسعة للسباقات",
        "التهوية : ثقوب دقيقة في الظهر مقطوعة بالليزر بالكامل"
      ]
    },
    "prod-helios-base": {
      name: "قميص Helios الضاغط",
      badge: "ديناميكي",
      description: "قميص ضاغط تقني بأكمام طويلة مع مناطق دعم مستهدفة باللونين البرتقالي والأبيض. ينشط الدورة الدموية ويعزز استشفاء العضلات.",
      specs: [
        "التركيب : 82% نايلون متين مرن، 18% إيلاستين للتمدد",
        "التقنية : تنظيم حراري نشط ومتقدم بتقنية ThermoReg",
        "الدرزات : درزات برتقالية مرنة ومعززة مانعة للتمزق",
        "الدعم : ضغط وعائي عضلي مقسم حسب العضلات المستهدفة"
      ]
    },
    "prod-apex-jacket": {
      name: "سترة Sport Chic الرياضية بسحاب",
      badge: "مميز",
      description: "سترة تدريب بسحاب كامل مصممة بنسيج محبوك مزدوج لحبس الحرارة. لون أبيض أنيق مع سحابات وأكمام باللون البرتقالي الرياضي.",
      specs: [
        "التركيب : 92% بوليستر محبوك مزدوج، 8% إيلاستين إنترلوك",
        "التقنية : عزل حراري ومقاوم للرياح بتقنية WindBlock",
        "الجيوب : سحابات برتقالية غير مرئية وآمنة للمتعلقات الشخصية",
        "الياقة : ياقة مرتفعة لحماية الرقبة من البرد وتيارات الهواء"
      ]
    },
    "prod-heritage-tee": {
      name: "تي شيرت Rétro Heritage 84",
      badge: "كلاسيكي",
      description: "تي شيرت رياضي كلاسيكي مستوحى من الطراز القديم مصنوع من مزيج ثلاثي من الفلانيل المصقول فائق النعومة. يتميز بشعار مطبوع بنمط جامعي باللون البرتقالي الرياضي.",
      specs: [
        "التركيب : 50% قطن عضوي، 38% بوليستر، 12% رايون ناعم",
        "التقنية : ملمس فائق النعومة بتقنية CloudTouch الحصرية",
        "التصميم : شعار جامعي ريترو باللون البرتقالي الجذاب",
        "الشعور : قميص جيد التهوية مثالي للرياضة والأنشطة اليومية"
      ]
    }
  }
};

// Initial state
export const state = {
  currentLanguage: localStorage.getItem("selected_lang") || "fr"
};

/**
 * Gets the current language string.
 */
export function getCurrentLanguage() {
  return state.currentLanguage;
}

/**
 * Translates a single text key for the current language.
 */
export function getTranslation(key, count = null) {
  const lang = state.currentLanguage;
  if (!translations[lang] || !translations[lang][key]) {
    // Fallback to french
    return translations["fr"][key] || key;
  }
  
  let translatedText = translations[lang][key];
  if (count !== null) {
    if (count === 1 && translations[lang][`${key}_singular`]) {
      return translations[lang][`${key}_singular`].replace("{count}", count);
    }
    const pluralKey = `${key}_plural`;
    if (translations[lang][pluralKey]) {
      return translations[lang][pluralKey].replace("{count}", count);
    }
  }
  
  return translatedText;
}

/**
 * Translates a product object dynamically based on current language.
 */
export function translateProduct(product) {
  const lang = state.currentLanguage;
  if (lang === "fr") return product; // Default language has fields in place
  
  // Try to use product's own localized fields if they exist (e.g. from Supabase)
  const l = lang === "ar" ? "ar" : lang;
  if (product[`${l}_name`]) {
    return {
      ...product,
      name: product[`${l}_name`] || product.name,
      badge: product[`${l}_badge`] !== undefined ? product[`${l}_badge`] : product.badge,
      description: product[`${l}_description`] || product.description,
      specs: Array.isArray(product[`${l}_specs`]) ? product[`${l}_specs`] : product.specs
    };
  }
  
  const prodTrans = productTranslations[lang]?.[product.id];
  if (!prodTrans) return product; // No translations found
  
  return {
    ...product,
    name: prodTrans.name || product.name,
    badge: prodTrans.badge !== undefined ? prodTrans.badge : product.badge,
    description: prodTrans.description || product.description,
    specs: prodTrans.specs || product.specs
  };
}

/**
 * Sweeps the DOM and updates all elements decorated with data-i18n attributes.
 */
export function translatePageElements() {
  // Translate standard textContent
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(element => {
    const key = element.getAttribute("data-i18n");
    const translation = getTranslation(key);
    
    // Check if translation requires HTML parsing
    if (key === "hero_title") {
      element.innerHTML = translation;
    } else {
      element.textContent = translation;
    }
  });

  // Translate placeholder attributes
  const inputs = document.querySelectorAll("[data-i18n-placeholder]");
  inputs.forEach(input => {
    const key = input.getAttribute("data-i18n-placeholder");
    input.setAttribute("placeholder", getTranslation(key));
  });

  // Translate title attributes
  const titledElements = document.querySelectorAll("[data-i18n-title]");
  titledElements.forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    el.setAttribute("title", getTranslation(key));
  });
}

/**
 * Sets the active language, updates page DOM state, persistent settings, and fires custom notification events.
 */
export function setLanguage(lang) {
  if (lang !== "fr" && lang !== "ar") lang = "fr";
  
  state.currentLanguage = lang;
  localStorage.setItem("selected_lang", lang);
  
  // Set html layout direction
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  
  // Apply visual changes to DOM
  translatePageElements();
  
  // Dispatch global custom event for decoupled modular updates (e.g. products re-rendering)
  window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: lang } }));
}
