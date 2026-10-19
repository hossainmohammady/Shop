import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice, toPersianDigits } from '../../utils/formatters';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Tag,
  Truck,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartDiscount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    storeSettings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingNeeded = Math.max(
    0,
    storeSettings.freeShippingThreshold - cartSubtotal
  );
  const freeShippingProgress = Math.min(
    100,
    (cartSubtotal / storeSettings.freeShippingThreshold) * 100
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 pr-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-r border-slate-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">سبد خرید شما</h3>
              <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                {toPersianDigits(cart.length)} ردیف
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="بستن سبد"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress bar */}
          <div className="bg-blue-50/70 p-3 sm:px-5 border-b border-blue-100 text-xs">
            <div className="flex items-center justify-between mb-1 text-slate-700 font-medium">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Truck className="w-4 h-4" />
                {freeShippingNeeded === 0 ? (
                  <span className="font-bold text-emerald-600">تبریک! سفارش شما مشمول ارسال رایگان است.</span>
                ) : (
                  <span>
                    تنها <b className="font-bold text-blue-800">{formatPrice(freeShippingNeeded)}</b> تا ارسال رایگان
                  </span>
                )}
              </span>
              <span className="font-mono text-slate-500 font-bold">
                {toPersianDigits(Math.round(freeShippingProgress))}٪
              </span>
            </div>
            <div className="w-full h-1.5 bg-blue-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-slate-100">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3">
                  <img
                    src={item.product.mainImage}
                    alt={item.product.title}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-500 transition p-1"
                          title="حذف از سبد"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variant && (
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                          مدل: <span className="text-blue-700 font-semibold">{item.variant.title}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 h-7 flex items-center justify-center text-xs font-bold font-mono text-slate-800">
                          {toPersianDigits(item.quantity)}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line total price */}
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {formatPrice(item.selectedPrice * item.quantity)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">سبد خرید شما در حال حاضر خالی است</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  می‌توانید با مراجعه به بخش محصولات، کالاهای مورد علاقه خود را انتخاب کنید.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                >
                  مشاهده کاتالوگ محصولات
                </button>
              </div>
            )}
          </div>

          {/* Footer with Coupon, Totals and Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              
              {/* Coupon input */}
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="کد تخفیف (مثال: WELCOME)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition"
                    >
                      اعمال کد
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>
                  )}
                </form>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>کد {appliedCoupon.code} اعمال شد</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-rose-500 text-[11px] font-semibold"
                  >
                    حذف
                  </button>
                </div>
              )}

              {/* Subtotals Breakdown */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-slate-200 text-slate-600">
                <div className="flex justify-between">
                  <span>مجموع خرید:</span>
                  <span className="font-semibold">{formatPrice(cartSubtotal)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>تخفیف اعمال‌شده:</span>
                    <span>- {formatPrice(cartDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>هزینه ارسال:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">رایگان</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                  <span>مبلغ قابل پرداخت:</span>
                  <span className="text-base text-blue-600">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Proceed to checkout button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>تکمیل اطلاعات و تسویه‌حساب</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
