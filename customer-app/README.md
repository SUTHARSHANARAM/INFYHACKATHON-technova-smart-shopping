# TechNova — Customer Shopping Application (`customer-app`)

**Tagline**: "Smart Technology. Smarter Shopping."  
**Niche**: Premium Electronics & Computer Accessories  
**Hackathon**: INFYHACKATHON 2.0 Project

The **TechNova Customer Application** provides a modern, responsive, and feature-rich technology e-commerce experience. It consumes the shared Node.js/Express backend API and PostgreSQL database created in Phase 2.

---

## 🚀 Key Features

* **Home & Discovery**: Hero banner, niche category browser, featured flagships, hot deals, and popular brand displays.
* **Product Catalog (`/products`)**: Real-time keyword search, hierarchical category filtering, brand selection, price range min/max, rating filters, multi-field sorting (`Price Low-High`, `Price High-Low`, `Rating`, `Popular`), and pagination.
* **Product Details (`/products/:id`)**: High-res image gallery with thumbnails, real pricing & discounts, stock status, quantity selector, specs table, customer reviews submission, and grounded AI spec insights.
* **Wishlist & Cart**: Saved items management, stock-validated cart updates, move-to-cart, cart clearing.
* **Multi-Step Checkout**: Address selection/creation, order summary review, simulated payment method selection (Card, UPI, COD), and atomic order placement.
* **Order Tracking & Details**: Visual order lifecycle progression timeline (`PENDING` $\rightarrow$ `CONFIRMED` $\rightarrow$ `PROCESSING` $\rightarrow$ `SHIPPED` $\rightarrow$ `DELIVERED`).
* **Product Comparison Matrix (`/compare`)**: Side-by-side spec comparison for up to 4 items + AI Comparison Verdict.
* **TechNova AI Assistant**: Floating AI assistant panel for natural language queries, grounded product recommendations, and smart search.

---

## ⚙️ Environment Variables

Create `.env` inside `customer-app/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Setup & Running Commands

```bash
# 1. Navigate to customer-app
cd customer-app

# 2. Install Dependencies
npm install

# 3. Start Development Server
npm run dev

# 4. Build for Production
npm run build
```

---

## 🗺️ Customer App Route List

| Route | Description | Auth Required |
|---|---|---|
| `/` | Homepage with hero, categories, featured products | Public |
| `/products` | Catalog listing with search, filters, sorting | Public |
| `/products/:id` | Detailed product specs, reviews & AI insight | Public |
| `/category/:categoryId` | Category specific view | Public |
| `/search` | Search results page | Public |
| `/compare` | Multi-product comparison & AI verdict | Public |
| `/login` | Customer login | Public |
| `/register` | Customer account registration | Public |
| `/wishlist` | Saved wishlist items | **Yes** |
| `/cart` | Shopping cart | **Yes** |
| `/checkout` | Address selection & simulated payment checkout | **Yes** |
| `/order-confirmation/:id` | Order confirmation & details link | **Yes** |
| `/orders` | Order history list | **Yes** |
| `/orders/:id` | Detailed order timeline & snapshot | **Yes** |
| `/profile` | Customer profile & address management | **Yes** |
