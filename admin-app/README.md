# TechNova — Admin Application

**Tagline:** Smart Technology. Smarter Shopping.  
**Phase 4:** Admin Application Development (INFYHACKATHON 2.0)

---

## 🚀 Overview

`admin-app` is the dedicated, high-performance administrative control panel for the **TechNova** e-commerce platform. Built as a sleek, modern SaaS workspace, it enables store managers and system administrators to manage inventory, catalog categories, order lifecycles, and user directories in real-time.

It connects to the shared PostgreSQL-backed Express REST API (`http://localhost:5000/api`) and enforces strict role-based access control (`ADMIN` role mandatory).

---

## 🛠️ Technology Stack

- **Framework:** React 18 + Vite 6 + TypeScript 5
- **Styling:** Tailwind CSS + Lucide React Icons
- **State Management & Data Fetching:** TanStack Query v5 (React Query)
- **HTTP Client:** Axios with JWT Bearer Interceptors (`technova_admin_token`)
- **Forms & Validation:** React Hook Form + Zod Schema Validation
- **Analytics & Visualizations:** Recharts (Order Distribution, Revenue metrics)
- **Routing:** React Router v7

---

## 🔑 Key Features & Workflows

1. **Strict Admin Authentication (`/login`)**
   - Direct JWT login requiring `ADMIN` role.
   - Non-admin accounts (e.g. `CUSTOMER`) are blocked with clear feedback.
   - Isolated token storage (`technova_admin_token`) to prevent session collision with customer storefront.

2. **Executive Dashboard (`/dashboard`)**
   - Real-time KPI Cards: Total Revenue, Total Orders, Total Products, Total Users.
   - Recharts Visualizations: Order distribution by status (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`).
   - Low Stock Alert Table (<10 items in stock).
   - Recent Orders feed with status badges.

3. **Product Catalog Management (`/products`, `/products/new`, `/products/:id/edit`)**
   - Full CRUD: Create, read, edit, soft-deactivate products.
   - Dynamic Multi-Image URL list management.
   - Dynamic Key-Value Specifications Editor (e.g., `Processor: Intel i9`, `RAM: 32GB`).
   - Category assignment and real-time stock alerts.

4. **Category Taxonomy Tree (`/categories`)**
   - Hierarchical Category & Subcategory display.
   - Modal form for creating parent categories or nested subcategories.
   - Safeguarded deletion (warns if category contains subcategories or active products).

5. **Order Lifecycle Control (`/orders`, `/orders/:id`)**
   - Complete order directory with status filtering.
   - Sequential Order Lifecycle advance workflow:  
     `PENDING` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`
   - Detailed itemized receipt, pricing breakdown, shipping address view, and status timeline.

6. **User Directory (`/users`)**
   - Directory listing of registered customers and administrators.
   - Role badges (`ADMIN` / `CUSTOMER`) and registration timestamp tracking.
   - Secure view (passwords and hashes are strictly concealed).

---

## 📁 Directory Structure

```text
admin-app/
├── src/
│   ├── components/
│   │   ├── common/       # StatusBadge, LoadingSpinner
│   │   └── layout/       # AdminLayout, Sidebar, Topbar
│   ├── context/          # AuthContext, ToastContext
│   ├── pages/
│   │   ├── auth/         # LoginPage
│   │   ├── categories/   # CategoryListPage
│   │   ├── dashboard/    # DashboardPage
│   │   ├── orders/       # OrderListPage, OrderDetailPage
│   │   ├── products/     # ProductListPage, ProductCreatePage, ProductEditPage
│   │   └── users/        # UserListPage
│   ├── services/         # adminService, api client
│   ├── types/            # TypeScript interfaces & enums
│   ├── App.tsx           # Router & Providers setup
│   ├── main.tsx          # Application entrypoint
│   └── index.css         # Tailwind directives & custom scrollbars
├── .env                  # VITE_API_URL configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ⚡ Setup & Run

### Prerequisites
- Node.js (v18+)
- Shared backend running on `http://localhost:5000`

### Installation
```bash
npm install
```

### Development Server (Port 3001)
```bash
npm run dev
```

### Production Build & Typecheck
```bash
npm run build
```

---

## 🔒 Default Admin Credentials (from Database Seed)
- **Email:** `admin@technova.com`
- **Password:** `Admin@123456`
