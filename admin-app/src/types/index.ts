export type Role = 'CUSTOMER' | 'ADMIN';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  _count?: {
    orders: number;
    reviews: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  parent?: Category;
  subcategories?: Category[];
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  SKU: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  specifications: Record<string, any>;
  categoryId: string;
  category?: {
    id?: string;
    name: string;
    slug: string;
  };
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  SKU: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  addressSnapshot: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
  ordersByStatus: {
    status: OrderStatus;
    count: number;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
