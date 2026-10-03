export type Role = 'CUSTOMER' | 'ADMIN';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[];
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
  category: {
    id?: string;
    name: string;
    slug: string;
    parent?: Category;
  };
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
  };
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  brand: string;
  price: number;
  originalPrice: number;
  stock: number;
  quantity: number;
  totalItemPrice: number;
  image: string;
  active: boolean;
}

export interface CartSummary {
  id: string;
  userId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
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
  addressId?: string;
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

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  inStock?: boolean;
}
