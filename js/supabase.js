import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Cache du client Supabase pour éviter les réinitialisations multiples
let cachedClient = null;

/**
 * Récupère la configuration Supabase stockée localement ou dans les variables d'environnement.
 */
export function getSupabaseConfig() {
  // Safely read Vite inlined env vars. Use a try/catch to avoid
  // parser/runtime issues when `import.meta` isn't available or when
  // the source is served without a Vite build step.
  let env = {};
  try {
    env = (import.meta && import.meta.env) ? import.meta.env : {};
  } catch (e) {
    env = {};
  }

  const url = localStorage.getItem("sport_chic_supabase_url") || env.VITE_SUPABASE_URL || "";
  const key = localStorage.getItem("sport_chic_supabase_key") || env.VITE_SUPABASE_ANON_KEY || "";
  if (!url || !key) {
    // Helpful debug message when running on a host that didn't inline VITE_ vars
    console.warn("Supabase config missing: ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set at build time or saved in localStorage.");
  }
  return { url, key };
}

/**
 * Enregistre une nouvelle configuration Supabase localement dans le localStorage.
 */
export function saveSupabaseConfig(url, key) {
  if (url) localStorage.setItem("sport_chic_supabase_url", url.trim());
  else localStorage.removeItem("sport_chic_supabase_url");

  if (key) localStorage.setItem("sport_chic_supabase_key", key.trim());
  else localStorage.removeItem("sport_chic_supabase_key");

  // Réinitialiser le client en cache pour forcer une nouvelle connexion
  cachedClient = null;
}

/**
 * Initialise et renvoie le client Supabase si les clés sont disponibles.
 */
export function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: false // Pas besoin de persistance de session pour cette vitrine simple
      }
    });
    return cachedClient;
  } catch (err) {
    console.error("Erreur lors de l'initialisation du client Supabase:", err);
    return null;
  }
}

/**
 * Teste la connexion à Supabase et vérifie si la table 'products' existe.
 * @returns {Promise<{success: boolean, message: string, tableExists: boolean}>}
 */
export async function testSupabaseConnection() {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: "Identifiants Supabase manquants ou invalides.", tableExists: false };
  }

  try {
    // Tenter une requête simple pour vérifier l'accès à la table products
    const { error } = await client.from("products").select("id").limit(1);
    
    if (error) {
      // Le code d'erreur 42P01 signifie que la table n'existe pas dans Postgres
      if (error.code === "42P01") {
        return { 
          success: true, 
          message: "Connexion Supabase établie avec succès ! Cependant, la table 'products' n'existe pas.", 
          tableExists: false 
        };
      }
      throw error;
    }

    return { success: true, message: "Connexion établie avec succès et table 'products' opérationnelle !", tableExists: true };
  } catch (err) {
    console.error("Erreur de test de connexion Supabase:", err);
    return { success: false, message: `Échec de connexion: ${err.message || err}`, tableExists: false };
  }
}

/**
 * Récupère tous les produits depuis Supabase.
 */
export async function fetchProducts() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    
    // Convertir les colonnes Supabase pour correspondre au format local attendu
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      category: item.category,
      badge: item.badge || null,
      rating: parseFloat(item.rating || 5.0),
      reviews: parseInt(item.reviews || 0),
      image: item.image,
      specs: Array.isArray(item.specs) ? item.specs : [],
      sizes: Array.isArray(item.sizes) ? item.sizes : [],
      ar_name: item.ar_name || null,
      ar_badge: item.ar_badge || null,
      ar_description: item.ar_description || null,
      ar_specs: Array.isArray(item.ar_specs) ? item.ar_specs : null
    }));
  } catch (err) {
    console.error("Erreur lors de la récupération des produits Supabase:", err);
    throw err;
  }
}

/**
 * Ajoute un nouveau produit dans Supabase.
 */
export async function addProduct(product) {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase non initialisé.");

  const { data, error } = await client
    .from("products")
    .insert([product])
    .select();

  if (error) {
    console.error("Erreur Supabase lors de l'ajout du produit:", error);
    throw error;
  }
  return data;
}

/**
 * Modifie un produit existant dans Supabase.
 */
export async function updateProduct(id, updates) {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase non initialisé.");

  const { data, error } = await client
    .from("products")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.error(`Erreur Supabase lors de la mise à jour du produit ${id}:`, error);
    throw error;
  }
  return data;
}

/**
 * Supprime un produit dans Supabase.
 */
export async function deleteProduct(id) {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase non initialisé.");

  const { error } = await client
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Erreur Supabase lors de la suppression du produit ${id}:`, error);
    throw error;
  }
  return true;
}

/**
 * Remplit la base de données Supabase avec les produits de démonstration initiaux.
 * @param {Array} defaultProducts Les produits locaux d'origine.
 * @param {Object} productTranslations Les traductions en arabe associées.
 */
export async function uploadImage(file) {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase non initialisé.");

  // Ensure a bucket named 'products' exists in Supabase Storage.
  // The upload path uses a UUID to avoid collisions.
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const { error } = await client.storage.from('products').upload(fileName, file, {
    upsert: false,
    cacheControl: '3600',
    contentType: file.type
  });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw error;
  }

  // Obtain the public URL for the uploaded file.
  const { publicURL, error: urlError } = client.storage.from('products').getPublicUrl(fileName);
  if (urlError) {
    console.error('Supabase getPublicUrl error:', urlError);
    throw urlError;
  }
  return publicURL;
}

/**
 * Seed the Supabase database with initial products.
 * @param {Array} defaultProducts - Array of product objects matching the local schema.
 * @param {Object} productTranslations - Translations object (currently unused, kept for compatibility).
 */
export async function seedDatabase(defaultProducts, productTranslations) {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase not initialized.");

  // Transform products to match Supabase column expectations
  const supabaseProducts = defaultProducts.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    badge: p.badge || null,
    rating: p.rating ?? 5.0,
    reviews: p.reviews ?? 0,
    image: p.image,
    specs: p.specs || [],
    sizes: p.sizes || [],
    ar_name: p.ar_name || null,
    ar_badge: p.ar_badge || null,
    ar_description: p.ar_description || null,
    ar_specs: p.ar_specs || null
  }));

  // Upsert to avoid duplicate primary keys; onConflict uses the primary key (id)
  const { data, error } = await client.from("products").upsert(supabaseProducts, { returning: "minimal", onConflict: "id" });
  if (error) {
    console.error("Error seeding Supabase database:", error);
    throw error;
  }
  console.log("Supabase database seeded with", supabaseProducts.length, "products");
  return data;
}

