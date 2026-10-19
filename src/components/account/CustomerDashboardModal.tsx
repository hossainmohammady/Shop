import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice, toPersianDigits } from '../../utils/formatters';
import { Order, OrderStatus } from '../../types/store';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Package,
  Calendar,
  ChevronLeft,
  Trash2,
  ShoppingCart,
  Eye,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

export const CustomerDashboardModal: React.FC = () => {
  const {
    isDashboardOpen,
    setIsDashboardOpen,
    currentUser,
    orders,
    wishlistIds,
    products,
    toggleWishlist,
    clearWishlist,
    moveAllWishlistToCart,
    addToCart,
    setSelectedProductForModal,
    dashboardActiveTab,
    setDashboardActiveTab,
  } = useStore();

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  const activeTab = dashboardActiveTab;
  const setActiveTab = setDashboardActiveTab;

  if (!isDashboardOpen) return null;

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const statusMap: Record<OrderStatus, { text: string; bg: string; textCol: string; icon: any }> = {
    pending_payment: { text: 'در انتظار پرداخت', bg: 'bg-amber-50', textCol: 'text-amber-700', icon: Clock },
    processing: { text: 'در حال پردازش و بسته‌بندی', bg: 'bg-blue-50', textCol: 'text-blue-700', icon: Package },
    shipped: { text: 'تحویل به اداره پست / ارسال شده', bg: 'bg-indigo-50', textCol: 'text-indigo-700', icon: Truck },
    delivered: { text: 'تحویل داده شده به مشتری', bg: 'bg-emerald-50', textCol: 'text-emerald-700', icon: CheckCircle2 },
    cancelled: { text: 'لغو شده', bg: 'bg-rose-50', textCol: 'text-rose-700', icon: AlertCircle },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                حساب کاربری: {currentUser?.name || 'کاربر گرامی'}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {currentUser?.phone} | {currentUser?.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDashboardOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>سفارش‌های من ({toPersianDigits(orders.length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3.5 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>علاقه‌مندی‌ها ({toPersianDigits(wishlistProducts.length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3.5 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>نشانی‌های تحویل</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>مشخصات حساب</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: Orders History */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((ord) => {
                  const s = statusMap[ord.status] || statusMap.processing;
                  const StatusIcon = s.icon;

                  return (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-white transition space-y-4 shadow-xs"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-slate-800 font-mono text-sm">
                            {ord.orderNumber}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${s.bg} ${s.textCol}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {s.text}
                          </span>
                        </div>

                        <span className="text-slate-400 font-mono">
                          {new Date(ord.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                      </div>

                      {/* Items Row */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto">
                          {ord.items.map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image}
                              alt=""
                              title={`${item.productTitle} (${item.quantity} عدد)`}
                              className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                            />
                          ))}
                        </div>

                        <div className="text-left">
                          <span className="text-xs text-slate-400 block font-medium">مبلغ پرداختی:</span>
                          <span className="text-sm font-extrabold text-slate-900">
                            {formatPrice(ord.finalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Footer & Tracking */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">روش ارسال:</span>
                          <span>{ord.shippingMethod}</span>
                          {ord.paymentTrackingCode && (
                            <>
                              <span className="text-slate-300">|</span>
                              <span className="font-mono text-slate-600">کد رهگیری: {ord.paymentTrackingCode}</span>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>مشاهده فاکتور کامل</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center space-y-2">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">شما تاکنون سفارشی ثبت نکرده‌اید.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Wishlist (Dedicated Management Section) */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              
              {/* Wishlist Header & Quick Actions */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-rose-500" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      کالاهای ذخیره‌شده و علاقه‌مندی‌ها
                    </h4>
                    <p className="text-xs text-slate-500">
                      محصولات نشان‌شده توسط شما جهت دسترسی سریع و خرید در آینده
                    </p>
                  </div>
                </div>

                {wishlistProducts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={moveAllWishlistToCart}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      title="افزودن تمامی کالاهای موجود این لیست به سبد خرید"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>انتقال همه به سبد خرید</span>
                    </button>

                    <button
                      onClick={clearWishlist}
                      className="px-3 py-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                      title="حذف کلیه کالاهای ذخیره شده"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>پاک‌سازی لیست</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist Items Grid */}
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlistProducts.map((p) => {
                    const isOutOfStock = p.stock <= 0 && p.variants.every((v) => v.stock <= 0);
                    const effectivePrice = p.discountPrice || p.basePrice;
                    const hasDiscount = p.discountPrice && p.discountPrice < p.basePrice;

                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between gap-3 group"
                      >
                        <div className="flex gap-3.5">
                          {/* Thumbnail */}
                          <div
                            onClick={() => {
                              setSelectedProductForModal(p);
                              setIsDashboardOpen(false);
                            }}
                            className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50 cursor-pointer relative"
                          >
                            <img
                              src={p.mainImage}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {hasDiscount && (
                              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                                تخفیف
                              </span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <h4
                                onClick={() => {
                                  setSelectedProductForModal(p);
                                  setIsDashboardOpen(false);
                                }}
                                className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-relaxed cursor-pointer"
                                title={p.title}
                              >
                                {p.title}
                              </h4>
                              <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                                کد کالا: {p.sku}
                              </span>
                            </div>

                            {/* Stock status indicator */}
                            <div className="mt-1">
                              {!isOutOfStock ? (
                                <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  موجود در انبار ({toPersianDigits(p.stock)} عدد)
                                </span>
                              ) : (
                                <span className="text-[11px] text-rose-500 font-semibold inline-flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  در حال حاضر ناموجود
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Price & Action Row */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          {/* Price */}
                          <div className="flex flex-col">
                            {hasDiscount && (
                              <span className="text-[11px] text-slate-400 line-through">
                                {formatPrice(p.basePrice)}
                              </span>
                            )}
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                              {formatPrice(effectivePrice)}
                            </span>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1.5">
                            {/* Inspect product */}
                            <button
                              onClick={() => {
                                setSelectedProductForModal(p);
                                setIsDashboardOpen(false);
                              }}
                              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition"
                              title="مشاهده جزئیات محصول"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Add to Cart */}
                            <button
                              onClick={() => {
                                if (p.variants.length > 1) {
                                  setSelectedProductForModal(p);
                                  setIsDashboardOpen(false);
                                } else {
                                  addToCart(p);
                                }
                              }}
                              disabled={isOutOfStock}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                isOutOfStock
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                              }`}
                              title="افزودن به سبد خرید"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>خرید</span>
                            </button>

                            {/* Remove from wishlist */}
                            <button
                              onClick={() => toggleWishlist(p.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="حذف از لیست علاقه‌مندی‌ها"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty Wishlist State */
                <div className="py-14 text-center space-y-4 bg-slate-50/60 rounded-3xl border border-slate-200/80 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mx-auto shadow-xs">
                    <Heart className="w-8 h-8 fill-rose-500/20" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">
                      لیست کالاهای ذخیره‌شده شما خالی است
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                      با کلیک بر روی آیکون قلب در کارت هر محصول، کالاهای مورد علاقه خود را ذخیره کنید تا در آینده بدون نیاز به جست‌وجو، سریعاً به آن‌ها دسترسی داشته باشید.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsDashboardOpen(false);
                      const elem = document.getElementById('catalog-section');
                      elem?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-2 shadow-md shadow-blue-500/20"
                  >
                    <span>مشاهده و کاوش محصولات فروشگاه</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-3">
              {currentUser?.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {addr.title}
                    </span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
                        نشانی پیش‌فرض
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed">{addr.fullAddress}</p>
                  <div className="flex items-center gap-4 text-slate-500 font-mono pt-1">
                    <span>گیرنده: {addr.receiverName}</span>
                    <span>همراه: {addr.phone}</span>
                    <span>کد پستی: {addr.postalCode}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Profile Details */}
          {activeTab === 'profile' && (
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 max-w-lg space-y-4 text-xs">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser?.avatar}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{currentUser?.name}</h4>
                  <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    نقش کاربری: مدیر کل فروشگاه (دسترسی کامل)
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">شماره تلفن همراه:</span>
                  <span className="font-bold font-mono text-slate-800">{currentUser?.phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">پست الکترونیکی:</span>
                  <span className="font-bold font-mono text-slate-800">{currentUser?.email}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">تاریخ عضویت:</span>
                  <span className="font-mono text-slate-800">۱۴۰۴/۱۰/۲۰</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Order Invoice Submodal if clicked */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-extrabold text-sm text-slate-900">
                  فاکتور سفارش {selectedOrderDetails.orderNumber}
                </h4>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <p><b>گیرنده:</b> {selectedOrderDetails.customerName} ({selectedOrderDetails.customerPhone})</p>
                <p><b>آدرس:</b> {selectedOrderDetails.address.fullAddress}</p>
                <p><b>کد رهگیری بانکی:</b> {selectedOrderDetails.paymentTrackingCode}</p>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                {selectedOrderDetails.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{it.productTitle}</span>
                      {it.variantTitle && <span className="text-slate-400 block text-[11px]">{it.variantTitle}</span>}
                    </div>
                    <span className="font-bold text-slate-900">{formatPrice(it.total)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-blue-600">
                <span>مبلغ نهایی پرداخت شده:</span>
                <span>{formatPrice(selectedOrderDetails.finalAmount)}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
