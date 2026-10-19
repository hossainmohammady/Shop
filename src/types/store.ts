export type CurrencyUnit = 'تومان' | 'ریال';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'store_manager' | 'inventory_manager';
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  title: string; // e.g. "خانه", "محل کار"
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  fullAddress: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  iconName?: string;
  image?: string;
  description?: string;
  order: number;
  isActive: boolean;
  subcategories?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  logo: string;
  description?: string;
  isFeatured?: boolean;
}

export interface DynamicAttribute {
  id: string;
  name: string; // e.g. "رنگ", "حافظه داخلی", "نوع رابط"
  type: 'select' | 'color' | 'text' | 'number' | 'boolean';
  options: string[]; // e.g. ["۱۲۸ گیگابایت", "۲۵۶ گیگابایت", "۵۱۲ گیگابایت"]
  unit?: string; // e.g. "گیگابایت", "میلی‌متر"
  categoryIds: string[]; // which categories show this attribute
  filterable: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string; // e.g. "مشکی تیتانیوم - ۲۵۶ گیگابایت"
  attributes: Record<string, string>; // { "رنگ": "مشکی", "حافظه داخلی": "۲۵۶ گیگابایت" }
  price: number;
  discountPrice?: number;
  stock: number;
  image?: string;
  colorCode?: string; // hex for color dots e.g. "#1e293b"
}

export interface Product {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  sku: string;
  categoryId: string;
  brandId: string;
  basePrice: number;
  discountPrice?: number;
  stock: number;
  mainImage: string;
  gallery: string[];
  shortDescription: string;
  fullDescription: string;
  isPublished: boolean;
  isFeatured: boolean;
  isSpecialOffer: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewCount: number;
  salesCount: number;
  variants: ProductVariant[];
  specifications: Record<string, string>; // e.g. { "سیستم عامل": "iOS 18", "وزن": "۱۹۹ گرم" }
  tags: string[];
  createdAt: string;
}

export interface FilterConfig {
  id: string;
  title: string;
  type: 'category' | 'brand' | 'price' | 'in_stock' | 'rating' | 'attribute';
  attributeName?: string;
  options?: string[];
  isActive: boolean;
  order: number;
}

export interface ActiveFilters {
  categoryId?: string | null;
  brandIds: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  minRating?: number;
  searchQuery: string;
  attributes: Record<string, string[]>;
  sortBy: 'newest' | 'bestselling' | 'cheapest' | 'expensive' | 'popular';
}

export interface CartItem {
  id: string; // unique item id (productId + variantId)
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  selectedPrice: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface ShippingMethod {
  id: string;
  title: string;
  price: number;
  estimatedDelivery: string;
  icon: string;
  description: string;
}

export type OrderStatus = 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'failed' | 'unpaid' | 'refunded';

export interface OrderItem {
  productId: string;
  productTitle: string;
  variantTitle?: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  address: Address;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  tax: number;
  finalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'zarinpal' | 'saman' | 'cod';
  paymentTrackingCode?: string;
  shippingMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
  likes: number;
}

export interface StoreSettings {
  storeName: string;
  slogan: string;
  primaryColor: string;
  logoUrl?: string;
  phone: string;
  email: string;
  address: string;
  freeShippingThreshold: number;
  currency: CurrencyUnit;
  taxRatePercent: number;
  darkMode: boolean;
  announcementText: string;
  announcementActive: boolean;
}
