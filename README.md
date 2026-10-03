# TechNova — Smart Technology. Smarter Shopping.

> **INFYHACKATHON 2.0 Official Submission**  
> A complete, production-ready, full-stack electronics & computer accessories e-commerce ecosystem featuring a Customer Storefront, an Executive Admin SaaS Portal, a shared Node.js/Express REST API, and a grounded AI Shopping Assistant.

---

## 📌 Executive Summary

**TechNova** is a multi-tier, full-stack e-commerce platform built for the **Electronics & Computer Accessories** niche. It is engineered with strict separation of concerns, complete responsiveness across desktop, laptop, tablet, and mobile, real-time data synchronization, and robust role-based access control.

```text
                                  TECHNOVA ARCHITECTURE MATRIX
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │                                               │
                      ▼                                               ▼
         CUSTOMER APPLICATION (`/customer-app`)           ADMIN APPLICATION (`/admin-app`)
           React 18 / Vite / TS / Port 3000                 React 18 / Vite / TS / Port 3001
            (Customer Storefront Interface)                    (Executive SaaS Control Panel)
                      │                                               │
                      └───────────────────────┬───────────────────────┘
                                              ▼
                                   SHARED BACKEND (`/backend`)
                                 Node.js + Express + TypeScript + Zod
                                              │
                                              ▼
                                   PRISMA ORM & DATABASE
                              43 Seeded Products Across 25 Categories
```

---

## 🔑 Default Credentials & Access Endpoints

| Application | URL | Default Credentials | Access Role |
| :--- | :--- | :--- | :---: |
| **Customer Storefront** | [http://localhost:3000](http://localhost:3000) | `customer@technova.com` / `Customer@123456` | `CUSTOMER` |
| **Admin SaaS Portal** | [http://localhost:3001](http://localhost:3001) | `admin@technova.com` / `Admin@123456` | `ADMIN` |
| **Shared Express REST API** | [http://localhost:5000/api](http://localhost:5000/api) | JWT Bearer Authentication | Both |

---

## ✨ Core Features & Workflows

### 🛒 1. Customer Storefront (`/customer-app`)
- **Niche Homepage**: Hero section, tech category grid, hot deals carousel, featured products, and value proposition cards.
- **Catalog Navigation**: Hierarchical category taxonomy (Smartphones, Ultrabooks, 4K Displays, ANC Headphones, Mechanical Keyboards, NVMe SSDs).
- **Search & Filtering**: Multi-criteria filter sidebar (Price range slider, Brand selector, Minimum rating filter) with instant URL state syncing.
- **Product Details**: Multi-image interactive gallery, technical specifications table, stock status, ratings/reviews, and related recommendations.
- **Cart & Wishlist**: Real-time custom event dispatching (`cart-updated` & `wishlist-updated`) for instant badge count updates without page refresh.
- **Simulated Checkout**: Address management, address selection, simulated payment gateways (Credit/Debit, UPI/QR Code, COD), total price breakdown, and order placement.
- **Order Lifecycle Tracking**: 5-stage status timeline visualization (`PENDING` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).
- **Product Comparison Matrix**: Side-by-side comparison of specifications, prices, ratings, and stock across up to 4 items.
- **AI Shopping Assistant**: Grounded AI assistant drawer providing live product recommendations, price intent filtering, and tech product comparisons.

### 🛡️ 2. Admin Executive SaaS Portal (`/admin-app`)
- **Strict Role-Based Security**: Accepts only authenticated `ADMIN` accounts (`technova_admin_token`); blocks customer accounts with clear authorization feedback.
- **Executive Dashboard**: KPI Cards (Total Revenue, Total Orders, Total Products, Total Users), Recharts order distribution visualization, low-stock alerts (<10 units), and recent order activity feed.
- **Product Catalog Management**: Product directory table with search, category filter, soft deactivation, dynamic multi-image URL editor, and key-value specifications editor.
- **Category Taxonomy Tree**: Visual category/subcategory manager with creation modals and deletion protection safeguards.
- **Order Management & Advancement**: Itemized receipt view, customer shipping details, and single-click lifecycle status advancing:  
  `PENDING` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`.
- **User Directory**: Customer and Admin user directory table with registration timestamps and password hash privacy protection.

---

## 🛠️ Technology Stack

- **Frontend Customer App**: React 18, Vite 6, TypeScript 5, Tailwind CSS, Lucide Icons, Axios, React Hook Form, Zod.
- **Frontend Admin App**: React 18, Vite 6, TypeScript 5, Tailwind CSS, Recharts, TanStack Query v5, Lucide Icons, Axios.
- **Backend API**: Node.js, Express, TypeScript, Prisma ORM, JWT, bcryptjs, Helmet, CORS, Express Rate Limit, Zod.
- **Database**: Relational Database managed via Prisma ORM (`schema.prisma` with 11 models).

---

## 🚀 Quickstart & Setup Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/SUTHARSHANARAM/INFYHACKATHON-technova-smart-shopping.git
cd INFYHACKATHON-technova-smart-shopping
```

### 2️⃣ Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install customer-app dependencies
cd ../customer-app
npm install

# Install admin-app dependencies
cd ../admin-app
npm install
```

### 3️⃣ Initialize Database & Seed Products
```bash
cd ../backend

# Synchronize database schema & seed 43 products across 25 categories
npm run prisma:push
npm run prisma:seed
```

### 4️⃣ Start Development Servers

Open three separate terminal windows:

**Terminal 1 — Shared Backend API (Port 5000):**
```bash
cd backend
npm run dev
```

**Terminal 2 — Customer Application (Port 3000):**
```bash
cd customer-app
npm run dev
```

**Terminal 3 — Admin Application (Port 3001):**
```bash
cd admin-app
npm run dev
```

---

## 🧪 Production Verification & Build Check

All applications have been compiled and verified with 0 errors:

```bash
# Verify backend TypeScript compilation:
cd backend && npm run build

# Verify customer-app Vite build:
cd ../customer-app && npm run build

# Verify admin-app Vite build:
cd ../admin-app && npm run build
```

---

## 📄 License & Hackathon Compliance

This application is built for **INFYHACKATHON 2.0**. All checkout flows and payment gateways are simulated per problem statement requirements. Real payment APIs are not integrated.

*TechNova — Smart Technology. Smarter Shopping.*
