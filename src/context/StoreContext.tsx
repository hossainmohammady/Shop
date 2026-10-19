import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Product,
  Category,
  Brand,
  FilterConfig,
  ActiveFilters,
  CartItem,
  Coupon,
  Order,
  StoreSettings,
  User,
  ShippingMethod,
  Review,
  DynamicAttribute,
  ProductVariant,
} from '../types/store';
import {
  initialProducts,
  initialCategories,
  initialBrands,
  initialFilterConfigs,
  initialCoupons,
  initialShippingMethods,
  initialStoreSettings,
  demoUser,
  sampleReviews,
  initialDynamicAttributes,
} from '../data/mockData';
import { generateOrderNumber, toPersianDigits } from '../utils/formatters';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  dynamicAttributes: DynamicAttribute[];
  filterConfigs: FilterConfig[];
  coupons: Coupon[];
  shippingMethods: ShippingMethod[];
  storeSettings: StoreSettings;
  currentUser: User | null;
  reviews: Review[];
  
  // Filtering & Sorting
  activeFilters: ActiveFilters;
  filteredProducts: Product[];
  setFilter: <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => void;
  resetFilters: () => void;
  toggleAttributeFilter: (attrName: string, optionValue: string) => void;
  toggleBrandFilter: (brandId: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  shippingFee: number;
  cartTax: number;
  cartTotal: number;
  selectedShipping: ShippingMethod;
  setSelectedShipping: (ship: ShippingMethod) => void;
  
  // Wishlist & Compare
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
  moveAllWishlistToCart: () => void;
  compareIds: string[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  
  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: any, paymentMethod: 'zarinpal' | 'saman' | 'cod') => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Reviews
  addReview: (productId: string, comment: string, rating: number) => void;
  
  // Admin Operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateFilterConfig: (configId: string, updates: Partial<FilterConfig>) => void;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  deleteCoupon: (id: string) => void;
  
  // UI Controls
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  isDashboardOpen: boolean;
  setIsDashboardOpen: (open: boolean) => void;
  dashboardActiveTab: 'orders' | 'wishlist' | 'addresses' | 'profile';
  setDashboardActiveTab: (tab: 'orders' | 'wishlist' | 'addresses' | 'profile') => void;
  openDashboardTab: (tab: 'orders' | 'wishlist' | 'addresses' | 'profile') => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  
  // Notification toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const defaultActiveFilters: ActiveFilters = {
  categoryId: null,
  brandIds: [],
  minPrice: 0,
  maxPrice: 200000000,
  inStockOnly: false,
  minRating: 0,
  searchQuery: '',
  attributes: {},
  sortBy: 'newest',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // LocalStorage-backed state initialization
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ara_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories] = useState<Category[]>(initialCategories);
  const [brands] = useState<Brand[]>(initialBrands);
  const [dynamicAttributes] = useState<DynamicAttribute[]>(initialDynamicAttributes);

  const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>(() => {
    const saved = localStorage.getItem('ara_filter_configs');
    return saved ? JSON.parse(saved) : initialFilterConfigs;
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('ara_store_settings');
    return saved ? JSON.parse(saved) : initialStoreSettings;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('ara_coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [shippingMethods] = useState<ShippingMethod[]>(initialShippingMethods);
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(initialShippingMethods[0]);

  const [currentUser] = useState<User | null>(demoUser);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('ara_reviews');
    return saved ? JSON.parse(saved) : sampleReviews;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ara_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ara_wishlist');
    return saved ? JSON.parse(saved) : ['prod-iphone-16-pro', 'prod-sony-wh1000xm5'];
  });

  const [compareIds, setCompareIds] = useState<string[]>([]);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ara_orders');
    if (saved) return JSON.parse(saved);
    // Seed one completed sample order
    return [
      {
        id: 'ord-init-1',
        orderNumber: 'ARA-261015-4921',
        userId: demoUser.id,
        customerName: demoUser.name,
        customerPhone: demoUser.phone,
        address: demoUser.addresses[0],
        items: [
          {
            productId: 'prod-sony-wh1000xm5',
            productTitle: 'هدفون بی‌سیم سونی مدل WH-1000XM5 با فناوری حذف نویز فعال (ANC)',
            variantTitle: 'مشکی کلاسیک',
            sku: 'SNY-XM5-BLK',
            price: 17400000,
            quantity: 1,
            total: 17400000,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          }
        ],
        subtotal: 17400000,
        shippingFee: 0,
        discountAmount: 1500000,
        couponCode: 'NOWRUZ1405',
        tax: 0,
        finalAmount: 15900000,
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'zarinpal',
        paymentTrackingCode: 'ZP-TRK-88349210',
        shippingMethod: 'ارسال فوری اکسپرس',
        createdAt: '2026-10-15T11:20:00Z',
        updatedAt: '2026-10-16T14:30:00Z',
      }
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Active filters
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(defaultActiveFilters);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardActiveTab, setDashboardActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>('orders');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openDashboardTab = (tab: 'orders' | 'wishlist' | 'addresses' | 'profile') => {
    setDashboardActiveTab(tab);
    setIsDashboardOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('ara_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ara_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ara_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('ara_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ara_filter_configs', JSON.stringify(filterConfigs));
  }, [filterConfigs]);

  useEffect(() => {
    localStorage.setItem('ara_store_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('ara_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('ara_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Filter handlers
  const setFilter = <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setActiveFilters(defaultActiveFilters);
    showToast('فیلترها با موفقیت پاکسازی شدند');
  };

  const toggleBrandFilter = (brandId: string) => {
    setActiveFilters((prev) => {
      const exists = prev.brandIds.includes(brandId);
      const newBrands = exists
        ? prev.brandIds.filter((b) => b !== brandId)
        : [...prev.brandIds, brandId];
      return { ...prev, brandIds: newBrands };
    });
  };

  const toggleAttributeFilter = (attrName: string, optionValue: string) => {
    setActiveFilters((prev) => {
      const currentList = prev.attributes[attrName] || [];
      const exists = currentList.includes(optionValue);
      const updatedList = exists
        ? currentList.filter((v) => v !== optionValue)
        : [...currentList, optionValue];

      return {
        ...prev,
        attributes: {
          ...prev.attributes,
          [attrName]: updatedList,
        },
      };
    });
  };

  // Comprehensive Product Filtering Engine
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (!prod.isPublished) return false;

      // Category filter (match current category or parent category)
      if (activeFilters.categoryId) {
        const isExactCat = prod.categoryId === activeFilters.categoryId;
        const subCatIds = categories
          .filter((c) => c.parentId === activeFilters.categoryId)
          .map((c) => c.id);
        const isInSubCat = subCatIds.includes(prod.categoryId);

        if (!isExactCat && !isInSubCat) return false;
      }

      // Brand filter
      if (activeFilters.brandIds.length > 0) {
        if (!activeFilters.brandIds.includes(prod.brandId)) return false;
      }

      // Stock status filter
      if (activeFilters.inStockOnly) {
        const totalVariantStock = prod.variants.reduce((acc, v) => acc + v.stock, 0);
        if (prod.stock <= 0 && totalVariantStock <= 0) return false;
      }

      // Rating filter
      if (activeFilters.minRating && activeFilters.minRating > 0) {
        if (prod.rating < activeFilters.minRating) return false;
      }

      // Price filter (check effective price: discountPrice or basePrice)
      const effectivePrice = prod.discountPrice || prod.basePrice;
      if (activeFilters.minPrice !== undefined && effectivePrice < activeFilters.minPrice) {
        return false;
      }
      if (activeFilters.maxPrice !== undefined && effectivePrice > activeFilters.maxPrice) {
        return false;
      }

      // Live search query (Persian normalized search in title, titleEn, sku, tags, shortDescription)
      if (activeFilters.searchQuery.trim()) {
        const q = activeFilters.searchQuery.toLowerCase().trim();
        const inTitle = prod.title.toLowerCase().includes(q);
        const inTitleEn = prod.titleEn?.toLowerCase().includes(q);
        const inSku = prod.sku.toLowerCase().includes(q);
        const inDesc = prod.shortDescription.toLowerCase().includes(q);
        const inTags = prod.tags.some((t) => t.toLowerCase().includes(q));

        if (!inTitle && !inTitleEn && !inSku && !inDesc && !inTags) {
          return false;
        }
      }

      // Dynamic attribute filters (e.g. Color, Storage, RAM, Size)
      for (const [attrName, selectedValues] of Object.entries(activeFilters.attributes)) {
        if (selectedValues.length === 0) continue;

        // Check if any variant or product spec matches any selected value
        const matchesVariant = prod.variants.some((variant) => {
          const val = variant.attributes[attrName];
          return val && selectedValues.includes(val);
        });

        const matchesSpec =
          prod.specifications[attrName] &&
          selectedValues.some((v) => prod.specifications[attrName].includes(v));

        if (!matchesVariant && !matchesSpec) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.basePrice;
      const priceB = b.discountPrice || b.basePrice;

      switch (activeFilters.sortBy) {
        case 'cheapest':
          return priceA - priceB;
        case 'expensive':
          return priceB - priceA;
        case 'bestselling':
          return b.salesCount - a.salesCount;
        case 'popular':
          return b.rating - a.rating;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [products, categories, activeFilters]);

  // Cart operations
  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const selectedVariant = variant || (product.variants.length > 0 ? product.variants[0] : undefined);
    const cartItemId = `${product.id}-${selectedVariant ? selectedVariant.id : 'base'}`;
    const selectedPrice = selectedVariant
      ? (selectedVariant.discountPrice || selectedVariant.price)
      : (product.discountPrice || product.basePrice);

    const availableStock = selectedVariant ? selectedVariant.stock : product.stock;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > availableStock) {
          showToast(`متأسفانه حداکثر موجودی این کالا ${availableStock} عدد است.`);
          return prev;
        }
        return prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item));
      } else {
        if (quantity > availableStock) {
          showToast(`متأسفانه موجودی این کالا تنها ${availableStock} عدد است.`);
          return prev;
        }
        return [
          ...prev,
          {
            id: cartItemId,
            product,
            variant: selectedVariant,
            quantity,
            selectedPrice,
          },
        ];
      }
    });

    showToast(`«${product.title.slice(0, 30)}...» به سبد خرید اضافه شد.`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('کالا از سبد خرید حذف شد.');
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const maxStock = item.variant ? item.variant.stock : item.product.stock;
          if (newQty > maxStock) {
            showToast(`حداکثر موجودی کالا ${maxStock} عدد است.`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal === 0) return 0;
    if (appliedCoupon.minOrderAmount && cartSubtotal < appliedCoupon.minOrderAmount) {
      return 0;
    }
    if (appliedCoupon.discountPercent) {
      const calculated = (cartSubtotal * appliedCoupon.discountPercent) / 100;
      if (appliedCoupon.maxDiscountAmount && calculated > appliedCoupon.maxDiscountAmount) {
        return appliedCoupon.maxDiscountAmount;
      }
      return calculated;
    }
    if (appliedCoupon.discountAmount) {
      return Math.min(appliedCoupon.discountAmount, cartSubtotal);
    }
    return 0;
  }, [cartSubtotal, appliedCoupon]);

  const shippingFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (cartSubtotal >= storeSettings.freeShippingThreshold) return 0;
    return selectedShipping.price;
  }, [cartSubtotal, storeSettings.freeShippingThreshold, selectedShipping]);

  const cartTax = useMemo(() => {
    if (storeSettings.taxRatePercent === 0) return 0;
    const taxable = cartSubtotal - cartDiscount;
    return Math.round((taxable * storeSettings.taxRatePercent) / 100);
  }, [cartSubtotal, cartDiscount, storeSettings.taxRatePercent]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscount + shippingFee + cartTax);
  }, [cartSubtotal, cartDiscount, shippingFee, cartTax]);

  // Coupon handling
  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      setCouponError('کد تخفیف وارد شده معتبر یا فعال نیست.');
      return false;
    }

    if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
      setCouponError(
        `حداقل مبلغ سفارش برای استفاده از این کد ${new Intl.NumberFormat('fa-IR').format(
          found.minOrderAmount
        )} تومان است.`
      );
      return false;
    }

    if (found.usageLimit && found.usedCount >= found.usageLimit) {
      setCouponError('ظرفیت استفاده از این کد تخفیف به پایان رسیده است.');
      return false;
    }

    setAppliedCoupon(found);
    showToast(`کد تخفیف ${found.code} با موفقیت اعمال گردید.`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    showToast('کد تخفیف حذف گردید.');
  };

  // Wishlist & Compare
  const toggleWishlist = (productId: string) => {
    if (!currentUser) {
      showToast('برای ذخیره کالا در لیست علاقه‌مندی‌ها، لطفاً وارد حساب کاربری خود شوید.');
      return;
    }

    const targetProduct = products.find((p) => p.id === productId);
    const productTitle = targetProduct
      ? `«${targetProduct.title.slice(0, 26)}...»`
      : 'کالا';

    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`${productTitle} از لیست علاقه‌مندی‌ها حذف شد.`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`${productTitle} به لیست علاقه‌مندی‌ها ذخیره شد.`);
        return [...prev, productId];
      }
    });
  };

  const clearWishlist = () => {
    setWishlistIds([]);
    showToast('تمامی کالاها از لیست علاقه‌مندی‌ها حذف شدند.');
  };

  const moveAllWishlistToCart = () => {
    const inStockItems = products.filter(
      (p) => wishlistIds.includes(p.id) && (p.stock > 0 || p.variants.some((v) => v.stock > 0))
    );

    if (inStockItems.length === 0) {
      showToast('کالای دارای موجودی در لیست علاقه‌مندی‌ها جهت افزودن به سبد یافت نشد.');
      return;
    }

    inStockItems.forEach((p) => {
      addToCart(p);
    });

    showToast(`${toPersianDigits(inStockItems.length)} کالا با موفقیت به سبد خرید منتقل شدند.`);
  };

  const toggleCompare = (productId: string) => {
    setCompareIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        showToast('حداکثر ۴ محصول را می‌توانید به‌طور هم‌زمان مقایسه نمایید.');
        return prev;
      }
      showToast('محصول به لیست مقایسه اضافه شد.');
      return [...prev, productId];
    });
  };

  const clearCompare = () => setCompareIds([]);

  // Place order with atomic stock reduction
  const placeOrder = async (
    shippingAddress: any,
    paymentMethod: 'zarinpal' | 'saman' | 'cod'
  ): Promise<Order> => {
    if (cart.length === 0) throw new Error('سبد خرید خالی است.');

    const orderNumber = generateOrderNumber();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser?.id,
      customerName: shippingAddress.receiverName || currentUser?.name || 'مشتری گرامی',
      customerPhone: shippingAddress.phone || currentUser?.phone || '',
      address: shippingAddress,
      items: cart.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        variantTitle: item.variant?.title,
        sku: item.variant?.sku || item.product.sku,
        price: item.selectedPrice,
        quantity: item.quantity,
        total: item.selectedPrice * item.quantity,
        image: item.product.mainImage,
      })),
      subtotal: cartSubtotal,
      shippingFee,
      discountAmount: cartDiscount,
      couponCode: appliedCoupon?.code,
      tax: cartTax,
      finalAmount: cartTotal,
      status: paymentMethod === 'cod' ? 'processing' : 'pending_payment',
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
      paymentMethod,
      paymentTrackingCode: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      shippingMethod: selectedShipping.title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct stock safely (atomic reduction pattern)
    setProducts((prev) =>
      prev.map((p) => {
        const cartItemsForProduct = cart.filter((ci) => ci.product.id === p.id);
        if (cartItemsForProduct.length === 0) return p;

        const updatedVariants = p.variants.map((v) => {
          const matchingCartItem = cartItemsForProduct.find((ci) => ci.variant?.id === v.id);
          if (matchingCartItem) {
            return { ...v, stock: Math.max(0, v.stock - matchingCartItem.quantity) };
          }
          return v;
        });

        const totalDeducted = cartItemsForProduct.reduce((sum, ci) => sum + ci.quantity, 0);

        return {
          ...p,
          stock: Math.max(0, p.stock - totalDeducted),
          salesCount: p.salesCount + totalDeducted,
          variants: updatedVariants,
        };
      })
    );

    // Update coupon usage count if used
    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === appliedCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c))
      );
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
    showToast('وضعیت سفارش به‌روزرسانی شد.');
  };

  const addReview = (productId: string, comment: string, rating: number) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: currentUser?.name || 'کاربر مهمان',
      rating,
      comment,
      createdAt: 'امروز',
      verifiedPurchase: true,
      likes: 0,
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('نظر شما با موفقیت ثبت شد.');
  };

  // Admin Catalog & Settings methods
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('محصول جدید با موفقیت اضافه شد.');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('اطلاعات کالا ذخیره شد.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('کالا حذف گردید.');
  };

  const updateFilterConfig = (configId: string, updates: Partial<FilterConfig>) => {
    setFilterConfigs((prev) => prev.map((f) => (f.id === configId ? { ...f, ...updates } : f)));
    showToast('تنظیمات فیلتر ذخیره شد.');
  };

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('تنظیمات فروشگاه به‌روزرسانی شد.');
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `cp-${Date.now()}`,
      usedCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast('کد تخفیف جدید با موفقیت تعریف شد.');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('کد تخفیف حذف شد.');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        brands,
        dynamicAttributes,
        filterConfigs,
        coupons,
        shippingMethods,
        storeSettings,
        currentUser,
        reviews,
        activeFilters,
        filteredProducts,
        setFilter,
        resetFilters,
        toggleAttributeFilter,
        toggleBrandFilter,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        shippingFee,
        cartTax,
        cartTotal,
        selectedShipping,
        setSelectedShipping,
        wishlistIds,
        toggleWishlist,
        clearWishlist,
        moveAllWishlistToCart,
        compareIds,
        toggleCompare,
        clearCompare,
        orders,
        placeOrder,
        updateOrderStatus,
        addReview,
        addProduct,
        updateProduct,
        deleteProduct,
        updateFilterConfig,
        updateStoreSettings,
        addCoupon,
        deleteCoupon,
        isCartOpen,
        setIsCartOpen,
        isCompareOpen,
        setIsCompareOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductForModal,
        setSelectedProductForModal,
        isDashboardOpen,
        setIsDashboardOpen,
        dashboardActiveTab,
        setDashboardActiveTab,
        openDashboardTab,
        isAdminOpen,
        setIsAdminOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
