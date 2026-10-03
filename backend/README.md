# TechNova E-Commerce — Shared Backend API

**Tagline**: "Smart Technology. Smarter Shopping."  
**Niche**: Premium Electronics & Computer Accessories

The TechNova shared backend provides centralized REST APIs, PostgreSQL database management via Prisma ORM, JWT authentication, role-based authorization, simulated checkout order handling, and grounded AI shopping services for both the **Customer Application** (`customer-app`) and **Admin Dashboard Application** (`admin-app`).

---

## 🏛️ Architecture Overview

```text
  CUSTOMER APP (:3000)               ADMIN APP (:3001)
     (React / Vite)                    (React / Vite)
           │                                 │
           └────────────────┬────────────────┘
                            │ REST API (Bearer JWT)
                            ▼
                    SHARED BACKEND (:5000)
                    (Node.js + Express)
                            │ Prisma ORM
                            ▼
                    PostgreSQL Database
```

---

## 🚀 Key Features

1. **Authentication & Authorization**: Secure password hashing (`bcryptjs`), JWT issuance, customer vs admin middleware.
2. **Product Catalog**: Backend pagination, search, category/subcategory filtering, brand filtering, sorting, price range, and stock availability.
3. **Cart & Wishlist Management**: Stock validation before adding, quantity limits, duplicate item prevention.
4. **Transactional Checkout**: Atomic Prisma `$transaction` checkout creating order snapshots, reducing product stock, and clearing cart items.
5. **Admin Operations**: SaaS dashboard analytics (revenue, order counts, low stock alerts), product CRUD, category management, order status lifecycle management (`PENDING` $\rightarrow$ `CONFIRMED` $\rightarrow$ `PROCESSING` $\rightarrow$ `SHIPPED` $\rightarrow$ `DELIVERED`), user management.
6. **Grounded AI Engine**: DB-grounded AI endpoints for recommendations, natural language search, product comparisons, and specs insights.

---

## 🔑 Local Demo Credentials

> **Note**: For development and judging demo purposes only.

| Role | Email | Password |
|---|---|---|
| **ADMIN** | `admin@technova.com` | `Admin@123456` |
| **CUSTOMER** | `customer@technova.com` | `Customer@123456` |

---

## 📋 Prerequisites

* **Node.js**: v18+ (Recommended v20+)
* **PostgreSQL**: Local PostgreSQL server instance or cloud database URL (Supabase, Neon, Railway, Docker, etc.)

---

## ⚙️ Environment Variables

Create a `.env` file in `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/technova_db?schema=public"
JWT_SECRET="technova_super_secret_jwt_key_2026_hackathon_token"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:3000"
ADMIN_CLIENT_URL="http://localhost:3001"
AI_API_KEY=""
```

---

## 🛠️ Setup & Running Commands

```bash
# 1. Install Dependencies
npm install

# 2. Generate Prisma Client
npm run prisma:generate

# 3. Push Database Schema to PostgreSQL
npm run prisma:push

# 4. Seed Real Demo Data (50+ Products, Categories, Admin & Customer accounts)
npm run prisma:seed

# 5. Start Backend in Development Mode
npm run dev
```

---

## 🔌 Core API Endpoints

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` - Public customer registration
* `POST /api/auth/login` - Login & JWT issuance
* `GET /api/auth/me` - Authenticated user profile

### 🛒 Product Discovery (`/api/products`)
* `GET /api/products` - Filtered & paginated product catalog
* `GET /api/products/featured` - Highlighted products
* `GET /api/products/search?q=laptop` - Full-text search
* `GET /api/products/brands` - Brands list
* `GET /api/products/:id` - Detailed product specs & reviews

### 📁 Categories (`/api/categories`)
* `GET /api/categories` - Hierarchical parent categories with subcategories
* `GET /api/categories/:id` - Category details

### 💖 Wishlist (`/api/wishlist`)
* `GET /api/wishlist` - Get customer wishlist
* `POST /api/wishlist/items` - Add product
* `DELETE /api/wishlist/items/:productId` - Remove product

### 🛍️ Shopping Cart (`/api/cart`)
* `GET /api/cart` - Get user cart & totals
* `POST /api/cart/items` - Add item (stock validated)
* `PATCH /api/cart/items/:productId` - Update quantity
* `DELETE /api/cart/items/:productId` - Remove item
* `DELETE /api/cart` - Clear cart

### 📍 Addresses & Checkout (`/api/addresses`, `/api/orders`)
* `GET /api/addresses` / `POST /api/addresses` - Address management
* `POST /api/orders` - Transactional checkout & stock reduction
* `GET /api/orders` - Customer order history
* `GET /api/orders/:id` - Order details

### 👑 Protected Admin Panel (`/api/admin`)
* `GET /api/admin/dashboard` - Analytics metrics & low-stock alerts
* `GET /api/admin/products` / `POST` / `PATCH` / `DELETE` - Product management
* `POST /api/admin/categories` / `PATCH` / `DELETE` - Category management
* `GET /api/admin/orders` / `PATCH /api/admin/orders/:id/status` - Order lifecycle management
* `GET /api/admin/users` - User directory

### 🤖 AI Shopping Engine (`/api/api/ai` or `/api/ai`)
* `POST /api/ai/chat` - DB-grounded shopping assistant
* `POST /api/ai/recommend` - Product recommendation engine
* `POST /api/ai/compare` - Multi-product spec comparison
* `POST /api/ai/search` - Smart intent search
* `POST /api/ai/insight` - AI spec breakdown
