import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice, toPersianDigits } from '../../utils/formatters';
import { Product, Order, OrderStatus, Coupon, FilterConfig } from '../../types/store';
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
  Settings,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Eye,
  Search,
  Check,
  ShieldCheck,
  Percent,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    orders,
    filterConfigs,
    updateFilterConfig,
    coupons,
    addCoupon,
    deleteCoupon,
    storeSettings,
    updateStoreSettings,
    updateOrderStatus,
    addProduct,
    deleteProduct,
    categories,
    brands,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'filters' | 'coupons' | 'settings'>('dashboard');

  // Search & filter state inside admin
  const [productSearch, setProductSearch] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // New product form
  const [newProd, setNewProd] = useState({
    title: '',
    titleEn: '',
    sku: `ARA-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
    categoryId: 'cat-mobile',
    brandId: 'brand-apple',
    basePrice: 50000000,
    discountPrice: 47000000,
    stock: 10,
    mainImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'محصول باکیفیت جدید با گارانتی ۱۸ ماهه شرکتی.',
    fullDescription: 'توضیحات تکمیلی کالا همراه با مشخصات استاندارد و بسته‌بندی پلمپ.',
    isPublished: true,
    isFeatured: true,
    isSpecialOffer: false,
    isNewArrival: true,
    colorOption: 'مشکی',
  });

  // New coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(15);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(5000000);
  const [newCouponMaxCap, setNewCouponMaxCap] = useState(2000000);

  if (!isAdminOpen) return null;

  // Calculate high-level metrics
  const totalSalesRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.finalAmount, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'processing' || o.status === 'pending_payment').length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.title.trim()) {
      showToast('لطفاً عنوان کالا را وارد کنید');
      return;
    }

    addProduct({
      title: newProd.title,
      titleEn: newProd.titleEn,
      slug: newProd.title.toLowerCase().replace(/\s+/g, '-'),
      sku: newProd.sku,
      categoryId: newProd.categoryId,
      brandId: newProd.brandId,
      basePrice: Number(newProd.basePrice),
      discountPrice: newProd.discountPrice ? Number(newProd.discountPrice) : undefined,
      stock: Number(newProd.stock),
      mainImage: newProd.mainImage,
      gallery: [newProd.mainImage],
      shortDescription: newProd.shortDescription,
      fullDescription: newProd.fullDescription,
      isPublished: newProd.isPublished,
      isFeatured: newProd.isFeatured,
      isSpecialOffer: newProd.isSpecialOffer,
      isNewArrival: newProd.isNewArrival,
      rating: 5.0,
      reviewCount: 1,
      salesCount: 0,
      variants: [
        {
          id: `var-${Date.now()}`,
          sku: `${newProd.sku}-01`,
          title: `${newProd.colorOption}`,
          attributes: { 'رنگ': newProd.colorOption },
          price: Number(newProd.basePrice),
          discountPrice: newProd.discountPrice ? Number(newProd.discountPrice) : undefined,
          stock: Number(newProd.stock),
          colorCode: '#0f172a',
        }
      ],
      specifications: {
        'گارانتی': '۱۸ ماهه شرکتی',
        'کشور سازنده': 'اصلی با رجیستری معتبر'
      },
      tags: ['جدید', 'فروشگاه آرا'],
    });

    setIsAddProductModalOpen(false);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: Number(newCouponPercent),
      minOrderAmount: Number(newCouponMinOrder),
      maxDiscountAmount: Number(newCouponMaxCap),
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      isActive: true,
      usageLimit: 500,
    });
    setNewCouponCode('');
  };

  const filteredAdminProducts = products.filter((p) =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col h-[90vh]">
        
        {/* Top Bar */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                پنل مدیریت جامع فروشگاه آرا
              </h3>
              <p className="text-[11px] text-slate-400">
                کنترل کاتالوگ محصولات، فیلترهای پویا، سفارش‌ها و تنظیمات
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Sidebar + Main Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar */}
          <aside className="w-full md:w-56 bg-slate-50 border-b md:border-b-0 md:border-l border-slate-200 p-3 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>داشبورد و آمار</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>مدیریت محصولات</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>سفارش‌ها ({toPersianDigits(orders.length)})</span>
            </button>

            <button
              onClick={() => setActiveTab('filters')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'filters'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>سیستم فیلترهای پویا</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'coupons'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>کدهای تخفیف</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>تنظیمات فروشگاه</span>
            </button>
          </aside>

          {/* Main Work Area */}
          <main className="flex-1 p-5 sm:p-6 overflow-y-auto bg-slate-100/50">
            
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-semibold">فروش قطعی کل</span>
                      <DollarSign className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-lg font-black text-slate-900">
                      {formatPrice(totalSalesRevenue)}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      +{toPersianDigits(18)}٪ نسبت به دوره قبل
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-semibold">تعداد کل سفارش‌ها</span>
                      <ShoppingBag className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-lg font-black text-slate-900">
                      {toPersianDigits(orders.length)} سفارش
                    </div>
                    <span className="text-[11px] text-blue-600 font-semibold">
                      {toPersianDigits(pendingOrdersCount)} در انتظار ارسال
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-semibold">کالاهای ثبت‌شده</span>
                      <Package className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="text-lg font-black text-slate-900">
                      {toPersianDigits(products.length)} کالا
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      در {toPersianDigits(categories.length)} دسته‌بندی
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-semibold">هشدار موجودی انبار</span>
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="text-lg font-black text-amber-600">
                      {toPersianDigits(lowStockProducts.length)} کالا
                    </div>
                    <span className="text-[11px] text-amber-700 font-semibold">
                      موجودی کمتر از ۵ عدد
                    </span>
                  </div>

                </div>

                {/* Simulated Weekly Sales Chart */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">نمودار فروش هفته جاری</h4>
                      <p className="text-xs text-slate-400">گزارش روزانه تراکنش‌های پرداخت‌شده</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      رشد مثبت فروش
                    </span>
                  </div>

                  <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-slate-100">
                    {[
                      { day: 'شنبه', amount: 34000000, height: '45%' },
                      { day: 'یکشنبه', amount: 48000000, height: '60%' },
                      { day: 'دوشنبه', amount: 72000000, height: '85%' },
                      { day: 'سه‌شنبه', amount: 55000000, height: '68%' },
                      { day: 'چهارشنبه', amount: 92000000, height: '98%' },
                      { day: 'پنج‌شنبه', amount: 64000000, height: '78%' },
                      { day: 'جمعه', amount: 81000000, height: '90%' },
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition whitespace-nowrap font-mono">
                          {formatPrice(bar.amount)}
                        </span>
                        <div
                          className="w-full bg-blue-600 hover:bg-blue-500 rounded-t-xl transition-all duration-300"
                          style={{ height: bar.height }}
                        />
                        <span className="text-xs font-semibold text-slate-600">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Low Stock Warning List */}
                {lowStockProducts.length > 0 && (
                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-3">
                    <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      کالاهای نیازمند شارژ سریع انبار:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {lowStockProducts.map((p) => (
                        <div key={p.id} className="bg-white p-2.5 rounded-xl border border-amber-200 flex justify-between items-center">
                          <span className="font-semibold text-slate-800 line-clamp-1">{p.title}</span>
                          <span className="font-bold text-rose-600 shrink-0 font-mono">
                            تنها {toPersianDigits(p.stock)} عدد
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <input
                      type="text"
                      placeholder="جست‌وجو در عنوان یا کد کالا..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 pr-9 text-xs outline-hidden focus:border-blue-500"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  </div>

                  <button
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن محصول جدید</span>
                  </button>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                        <tr>
                          <th className="p-3">تصویر و عنوان کالا</th>
                          <th className="p-3">کد SKU</th>
                          <th className="p-3">قیمت پایه</th>
                          <th className="p-3">قیمت تخفیف</th>
                          <th className="p-3">موجودی</th>
                          <th className="p-3">وضعیت</th>
                          <th className="p-3 text-center">عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAdminProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/60">
                            <td className="p-3 flex items-center gap-2.5 max-w-xs">
                              <img src={p.mainImage} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0" />
                              <span className="font-bold text-slate-800 line-clamp-1">{p.title}</span>
                            </td>
                            <td className="p-3 font-mono text-slate-500">{p.sku}</td>
                            <td className="p-3 font-semibold text-slate-700">{formatPrice(p.basePrice)}</td>
                            <td className="p-3 font-bold text-blue-600">
                              {p.discountPrice ? formatPrice(p.discountPrice) : '—'}
                            </td>
                            <td className="p-3">
                              <span className={`font-mono font-bold ${p.stock <= 5 ? 'text-amber-600' : 'text-slate-800'}`}>
                                {toPersianDigits(p.stock)}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                فعال
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                                title="حذف کالا"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                        <tr>
                          <th className="p-3">شماره سفارش</th>
                          <th className="p-3">نام مشتری</th>
                          <th className="p-3">مبلغ پرداختی</th>
                          <th className="p-3">شیوه ارسال</th>
                          <th className="p-3">وضعیت فعلی</th>
                          <th className="p-3">تغییر وضعیت</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50/60">
                            <td className="p-3 font-mono font-bold text-slate-800">{ord.orderNumber}</td>
                            <td className="p-3">
                              <span className="font-semibold text-slate-800 block">{ord.customerName}</span>
                              <span className="text-[11px] text-slate-400 font-mono">{ord.customerPhone}</span>
                            </td>
                            <td className="p-3 font-bold text-blue-600">{formatPrice(ord.finalAmount)}</td>
                            <td className="p-3 text-slate-600">{ord.shippingMethod}</td>
                            <td className="p-3">
                              <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700">
                                {ord.status === 'processing' && 'در حال پردازش'}
                                {ord.status === 'shipped' && 'ارسال شده'}
                                {ord.status === 'delivered' && 'تحویل شده'}
                                {ord.status === 'pending_payment' && 'در انتظار پرداخت'}
                                {ord.status === 'cancelled' && 'لغو شده'}
                              </span>
                            </td>
                            <td className="p-3">
                              <select
                                value={ord.status}
                                onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                                className="bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs outline-hidden font-medium"
                              >
                                <option value="pending_payment">در انتظار پرداخت</option>
                                <option value="processing">در حال پردازش</option>
                                <option value="shipped">ارسال شده (تحویل پست)</option>
                                <option value="delivered">تحویل داده شده</option>
                                <option value="cancelled">لغو سفارش</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. DYNAMIC FILTER MANAGEMENT */}
            {activeTab === 'filters' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 text-xs text-blue-800">
                  مدیر گرامی، از این بخش می‌توانید نمایش هر فیلتر در نوار کناری فروشگاه را فعال یا غیرفعال کنید.
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
                  {filterConfigs.map((cfg) => (
                    <div key={cfg.id} className="p-4 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-slate-800 block">{cfg.title}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          نوع فیلتر: {cfg.type} {cfg.attributeName && `(${cfg.attributeName})`}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                          <input
                            type="checkbox"
                            checked={cfg.isActive}
                            onChange={(e) => updateFilterConfig(cfg.id, { isActive: e.target.checked })}
                            className="w-4 h-4 rounded-md text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className={cfg.isActive ? 'text-emerald-600' : 'text-slate-400'}>
                            {cfg.isActive ? 'نمایش در فروشگاه' : 'مخفی'}
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. COUPONS MANAGEMENT */}
            {activeTab === 'coupons' && (
              <div className="space-y-5">
                {/* Add coupon form */}
                <form onSubmit={handleCreateCoupon} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-800">تعریف کد تخفیف جدید:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-500 mb-1 block">کد تخفیف (لاتین):</label>
                      <input
                        type="text"
                        placeholder="OFF50"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 mb-1 block">درصد تخفیف:</label>
                      <input
                        type="number"
                        value={newCouponPercent}
                        onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 mb-1 block">حداقل خرید (تومان):</label>
                      <input
                        type="number"
                        value={newCouponMinOrder}
                        onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 mb-1 block">سقف تخفیف (تومان):</label>
                      <input
                        type="number"
                        value={newCouponMaxCap}
                        onChange={(e) => setNewCouponMaxCap(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ثبت کد تخفیف</span>
                    </button>
                  </div>
                </form>

                {/* Coupons list */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <tr>
                        <th className="p-3">کد تخفیف</th>
                        <th className="p-3">میزان تخفیف</th>
                        <th className="p-3">حداقل سفارش</th>
                        <th className="p-3">سقف تخفیف</th>
                        <th className="p-3">تعداد استفاده</th>
                        <th className="p-3 text-center">حذف</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {coupons.map((c) => (
                        <tr key={c.id}>
                          <td className="p-3 font-mono font-bold text-blue-700">{c.code}</td>
                          <td className="p-3 font-bold text-slate-800">
                            {c.discountPercent ? `${toPersianDigits(c.discountPercent)}٪` : formatPrice(c.discountAmount || 0)}
                          </td>
                          <td className="p-3 font-mono">{formatPrice(c.minOrderAmount || 0)}</td>
                          <td className="p-3 font-mono">{formatPrice(c.maxDiscountAmount || 0)}</td>
                          <td className="p-3 font-mono">{toPersianDigits(c.usedCount)} بار</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => deleteCoupon(c.id)}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. STORE SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs max-w-xl text-xs">
                <h4 className="font-extrabold text-sm text-slate-800">پیکربندی هویت و تنظیمات عمومی</h4>

                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">نام فروشگاه:</label>
                  <input
                    type="text"
                    value={storeSettings.storeName}
                    onChange={(e) => updateStoreSettings({ storeName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">شعار برند:</label>
                  <input
                    type="text"
                    value={storeSettings.slogan}
                    onChange={(e) => updateStoreSettings({ slogan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">شماره تلفن پشتیبانی:</label>
                    <input
                      type="text"
                      value={storeSettings.phone}
                      onChange={(e) => updateStoreSettings({ phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">حداقل خرید برای ارسال رایگان:</label>
                    <input
                      type="number"
                      value={storeSettings.freeShippingThreshold}
                      onChange={(e) => updateStoreSettings({ freeShippingThreshold: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">متن اعلان بالای سایت:</label>
                  <input
                    type="text"
                    value={storeSettings.announcementText}
                    onChange={(e) => updateStoreSettings({ announcementText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={storeSettings.announcementActive}
                      onChange={(e) => updateStoreSettings({ announcementActive: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>فعال بودن نوار اعلان بنر بالای سایت</span>
                  </label>
                </div>
              </div>
            )}

          </main>

        </div>

        {/* Modal: Add Product */}
        {isAddProductModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-extrabold text-sm text-slate-900">افزودن محصول جدید به کاتالوگ</h4>
                <button
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">عنوان کامل محصول (فارسی):</label>
                  <input
                    type="text"
                    required
                    value={newProd.title}
                    onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">دسته‌بندی:</label>
                    <select
                      value={newProd.categoryId}
                      onChange={(e) => setNewProd({ ...newProd, categoryId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">برند:</label>
                    <select
                      value={newProd.brandId}
                      onChange={(e) => setNewProd({ ...newProd, brandId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">قیمت پایه (تومان):</label>
                    <input
                      type="number"
                      required
                      value={newProd.basePrice}
                      onChange={(e) => setNewProd({ ...newProd, basePrice: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">قیمت تخفیف (تومان):</label>
                    <input
                      type="number"
                      value={newProd.discountPrice}
                      onChange={(e) => setNewProd({ ...newProd, discountPrice: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">موجودی انبار:</label>
                    <input
                      type="number"
                      required
                      value={newProd.stock}
                      onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">آدرس تصویر محصول (URL):</label>
                  <input
                    type="url"
                    required
                    value={newProd.mainImage}
                    onChange={(e) => setNewProd({ ...newProd, mainImage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-left"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">توضیح کوتاه:</label>
                  <textarea
                    rows={2}
                    value={newProd.shortDescription}
                    onChange={(e) => setNewProd({ ...newProd, shortDescription: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20"
                  >
                    ذخیره و انتشار کالا
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
