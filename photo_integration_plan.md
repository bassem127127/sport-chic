# Sports Shirts Storefront — Photograph Integration Walkthrough

We have fully transitioned the storefront from using placeholder SVGs to displaying **high-fidelity, premium activewear photographs** from Unsplash. The entire experience now feels like a high-end luxury boutique (similar to Nike, Adidas, or SSENSE).

## 📸 Integrated Photo Assets

We selected 8 specific sports shirt designs matching your light color palette (**white, cream, peach, and vibrant orange**) with multiple colorways for dynamic swapping:

| Product Name | Category | Color Option 1 (Default) | Color Option 2 | Color Option 3 |
| :--- | :--- | :--- | :--- | :--- |
| **Aura Kinetic Tee** | Training | ⚪🍊 White Orange | ⚪ Pristine White | 🍊 Sunset Orange |
| **Apex Aero Jersey** | Running | ⚪ Racing White | 🍊 Hyper Orange | — |
| **Striker Elite Pitch Shirt** | Football | ⚪🍊 Sash White/Orange | ⚪ Classic White | — |
| **Summit Hoop Vest** | Basketball | ⚪ Varsity White | 🍊 Varsity Orange | — |
| **Court Advantage Polo** | Tennis | ⚪ Pristine Polo White | 🍊 Sienna Polo Orange | — |
| **Velo Vent Cycling Top** | Running/Cycling | ⚪🍊 Signal White/Orange | 🍊 Glow Amber | — |
| **Helix Fit Base Layer** | Gym/Training | ⚪ Seam Orange Stitch | 🍊 Inverted Orange | — |
| **Heritage 84 Athletic Tee** | Gym/Training | 🍦 Varsity Cream/Orange | 🌸 Varsity Coral | — |

---

## 🛠️ Code Changes Made

### 1. Unified Data Layer (`js/products.js`)
* Updated the `colorOptions` for each sport shirt to contain high-resolution `imageUrl` properties alongside local relative `localPath` properties inside an `images/` directory.
* Exported a helper `getProductImage(product, colorIndex)` that retrieves the correct image URL instantly.

### 2. State & UI Synchronizer (`js/app.js`)
* Replaced SVG string rendering inside the product catalog grid card, the Quick View details modal, and the sliding cart drawer with responsive `<img>` tags.
* Wireframed swatch clicks to update the product card's active image immediately by reading the corresponding index in the colorway array.
* Refactored `CartService.addItem` to store the active colorway's `imageUrl` directly inside the cart items array, guaranteeing the sliding cart displays the exact color added by the buyer.

### 3. High-End CSS Refinement (`style.css`)
* **Hero Section**: Upgraded the floating vector logo into a sleek, bordered activewear modeling frame (`.hero-shirt-photo`) that floats dynamically with subtle hover shifts.
* **Catalog Grid**: Standardized the product cards to crop photos using `object-fit: cover` with smooth zoom scaling (`scale(1.06)`) on hover.
* **Cart Drawer**: Structured small, elegant square thumbnail visual frames (`.cart-item-photo`) inside the stepper rows.
* **Details Modal**: Configured a large, high-shadow visual showcase box (`.qv-shirt-photo`) for premium resolution when a shopper inspects a shirt.

---

## 🚀 How to Launch and Test the Storefront

Because modern browsers block module file imports (`type="module"`) over raw `file:///` protocols due to security (CORS) limits, the website must be served through a local lightweight web server.

### Option A: Approve the Automated Vite Dev Server (Recommended)
You can approve the `npm install` and `npm run dev` commands on your shell. We configured it to launch instantly on:
👉 **`http://localhost:5174`**

### Option B: Use Your Own Local Web Server
If you have any other local server installed (like VS Code's **Live Server**, Python's `http.server`, or Node's `http-server`), you can run it inside the `c:\Users\Planification\Desktop\Nouveau dossier (4)` workspace directory:

```bash
# Example with Python (built-in)
python -m http.server 8000
```
Then open: **`http://localhost:8000`** in your browser.
