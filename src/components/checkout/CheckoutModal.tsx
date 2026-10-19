import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice, toPersianDigits } from '../../utils/formatters';
import { Address, Order, ShippingMethod } from '../../types/store';
import {
  X,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Receipt,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    shippingMethods,
    selectedShipping,
    setSelectedShipping,
    currentUser,
    placeOrder,
    setIsDashboardOpen,
  } = useStore();

  const [currentStep, setCurrentStep] = useState<'address' | 'shipping' | 'payment' | 'gateway' | 'success'>('address');
  
  // Selected or custom address
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    currentUser?.addresses[0]?.id || 'custom'
  );

  const [customAddress, setCustomAddress] = useState<Address>({
    id: 'addr-new',
    title: 'نشانی پیش‌فرض تحویل',
    receiverName: currentUser?.name || 'حسین محمدی',
    phone: currentUser?.phone || '۰۹۱۲۳۴۵۶۷۸۹',
    province: 'تهران',
    city: 'تهران',
    postalCode: '۱۹۸۵۷۱۴۳۲۱',
    fullAddress: 'میدان ونک، خیابان ملاصدرا، پلاک ۴۲، واحد ۸',
  });

  const [paymentMethod, setPaymentMethod] = useState<'zarinpal' | 'saman' | 'cod'>('zarinpal');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Gateway Simulation Fields
  const [gatewayCard, setGatewayCard] = useState('6037-9971-4820-5514');
  const [gatewayCvv2, setGatewayCvv2] = useState('342');
  const [gatewayExpMonth, setGatewayExpMonth] = useState('08');
  const [gatewayExpYear, setGatewayExpYear] = useState('06');
  const [gatewayOtp, setGatewayOtp] = useState('784912');
  const [otpSent, setOtpSent] = useState(false);

  if (!isCheckoutOpen) return null;

  const activeAddress =
    currentUser?.addresses.find((a) => a.id === selectedAddressId) || customAddress;

  const handleProceedToPayment = () => {
    if (paymentMethod === 'cod') {
      // Cash on Delivery
      handleCompleteOrder('cod');
    } else {
      // Launch simulated gateway
      setCurrentStep('gateway');
    }
  };

  const handleCompleteOrder = async (method: 'zarinpal' | 'saman' | 'cod') => {
    setIsProcessing(true);
    try {
      const order = await placeOrder(activeAddress, method);
      setCreatedOrder(order);
      setCurrentStep('success');
    } catch (err: any) {
      alert(err.message || 'خطا در ثبت سفارش');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        
        {/* Header with Steps */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">فرایند تسویه‌حساب و پرداخت</h3>
              <p className="text-xs text-slate-500">مراحل نهایی‌سازی سفارش در محیط امن شاپرک</p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {currentStep !== 'success' && currentStep !== 'gateway' && (
          <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-around text-xs font-semibold">
            <span className={`flex items-center gap-1.5 ${currentStep === 'address' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
              <MapPin className="w-4 h-4" /> ۱. آدرس تحویل
            </span>
            <span className="text-slate-300">/</span>
            <span className={`flex items-center gap-1.5 ${currentStep === 'shipping' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
              <Truck className="w-4 h-4" /> ۲. روش ارسال
            </span>
            <span className="text-slate-300">/</span>
            <span className={`flex items-center gap-1.5 ${currentStep === 'payment' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
              <CreditCard className="w-4 h-4" /> ۳. پیش‌فاکتور و پرداخت
            </span>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: Address */}
          {currentStep === 'address' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800">انتخاب یا ویرایش نشانی تحویل سفارش:</h4>

              {currentUser && currentUser.addresses.length > 0 && (
                <div className="space-y-2">
                  {currentUser.addresses.map((addr) => (
                    <label
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border cursor-pointer block transition ${
                        selectedAddressId === addr.id
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">{addr.title}</span>
                        <span className="text-xs text-slate-500 font-medium">گیرنده: {addr.receiverName} ({addr.phone})</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{addr.fullAddress}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">کد پستی: {addr.postalCode}</p>
                    </label>
                  ))}
                </div>
              )}

              {/* Form to enter/custom address */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">مشخصات گیرنده و مقصد:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">نام و نام خانوادگی:</label>
                    <input
                      type="text"
                      value={customAddress.receiverName}
                      onChange={(e) => setCustomAddress({ ...customAddress, receiverName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">شماره تماس همراه:</label>
                    <input
                      type="text"
                      value={customAddress.phone}
                      onChange={(e) => setCustomAddress({ ...customAddress, phone: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-hidden focus:border-blue-500 font-mono text-left"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">استان و شهر:</label>
                    <input
                      type="text"
                      value={`${customAddress.province} - ${customAddress.city}`}
                      onChange={(e) => setCustomAddress({ ...customAddress, city: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">کد پستی ۱۰ رقمی:</label>
                    <input
                      type="text"
                      value={customAddress.postalCode}
                      onChange={(e) => setCustomAddress({ ...customAddress, postalCode: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-hidden focus:border-blue-500 font-mono text-left"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-slate-500 mb-1 block">آدرس پستی دقیق:</label>
                    <textarea
                      rows={2}
                      value={customAddress.fullAddress}
                      onChange={(e) => setCustomAddress({ ...customAddress, fullAddress: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => setCurrentStep('shipping')}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <span>مرحله بعد: شیوه ارسال</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Method */}
          {currentStep === 'shipping' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800">شیوه ارسال مرسوله را انتخاب کنید:</h4>

              <div className="space-y-2.5">
                {shippingMethods.map((ship) => {
                  const isSelected = selectedShipping.id === ship.id;
                  return (
                    <label
                      key={ship.id}
                      onClick={() => setSelectedShipping(ship)}
                      className={`p-4 rounded-2xl border cursor-pointer block transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="font-bold text-xs text-slate-800">{ship.title}</span>
                        </div>
                        <span className="font-bold text-xs text-blue-600">
                          {cartSubtotal >= 20000000 ? 'رایگان' : formatPrice(ship.price)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">{ship.description}</p>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">زمان تحویل: {ship.estimatedDelivery}</p>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setCurrentStep('address')}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>بازگشت به نشانی</span>
                </button>

                <button
                  onClick={() => setCurrentStep('payment')}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <span>مرحله بعد: بازبینی و پرداخت</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Invoice & Payment Selection */}
          {currentStep === 'payment' && (
            <div className="space-y-5">
              <h4 className="text-sm font-bold text-slate-800">پیش‌فاکتور سفارش و درگاه پرداخت</h4>

              {/* Items summary */}
              <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 max-h-44 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={item.product.mainImage} alt="" className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <span className="font-semibold text-slate-800 line-clamp-1">{item.product.title}</span>
                        <span className="text-[11px] text-slate-400">تعداد: {toPersianDigits(item.quantity)}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">{formatPrice(item.selectedPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>مبلغ کل کالاها:</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>تخفیف ویژه:</span>
                    <span>- {formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>هزینه بسته‌بندی و ارسال ({selectedShipping.title.slice(0, 15)}...):</span>
                  <span>{shippingFee === 0 ? 'رایگان' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>مبلغ نهایی فاکتور:</span>
                  <span className="text-blue-600">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Gateway options */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">انتخاب روش پرداخت:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    onClick={() => setPaymentMethod('zarinpal')}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                      paymentMethod === 'zarinpal'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-500" />
                      <span>درگاه زرین‌پال / کلیه کارت‌های شتاب</span>
                    </div>
                    {paymentMethod === 'zarinpal' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </label>

                  <label
                    onClick={() => setPaymentMethod('saman')}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                      paymentMethod === 'saman'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>درگاه به‌پرداخت ملت (شتاب)</span>
                    </div>
                    {paymentMethod === 'saman' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </label>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3">
                <button
                  onClick={() => setCurrentStep('shipping')}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>ویرایش شیوه ارسال</span>
                </button>

                <button
                  onClick={handleProceedToPayment}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>انتقال به درگاه امن و پرداخت {formatPrice(cartTotal)}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Bank Gateway Simulation (شاپرک) */}
          {currentStep === 'gateway' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-700 text-white rounded-2xl flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6" />
                  <div>
                    <span className="font-black text-sm block">درگاه پرداخت اینترنتی شبکه شاپرک</span>
                    <span className="text-[11px] opacity-80">سامانه پرداخت الکترونیک کارت (شاپرک)</span>
                  </div>
                </div>
                <div className="text-left font-mono font-bold text-sm bg-emerald-900/40 px-3 py-1.5 rounded-xl">
                  {formatPrice(cartTotal)}
                </div>
              </div>

              <div className="p-5 border border-slate-200 rounded-2xl space-y-4 text-xs bg-slate-50/50">
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">شماره کارت ۱۶ رقمی شتاب:</label>
                  <input
                    type="text"
                    value={gatewayCard}
                    onChange={(e) => setGatewayCard(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-mono text-center text-sm font-bold tracking-widest text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">کد CVV2:</label>
                    <input
                      type="text"
                      value={gatewayCvv2}
                      onChange={(e) => setGatewayCvv2(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-mono text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">ماه انقضا:</label>
                    <input
                      type="text"
                      value={gatewayExpMonth}
                      onChange={(e) => setGatewayExpMonth(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-mono text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">سال انقضا:</label>
                    <input
                      type="text"
                      value={gatewayExpYear}
                      onChange={(e) => setGatewayExpYear(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-mono text-center font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">رمز پویا / دوم:</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={gatewayOtp}
                      onChange={(e) => setGatewayOtp(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-xl p-2.5 font-mono text-center text-sm font-bold tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setOtpSent(true)}
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
                    >
                      {otpSent ? 'ارسال مجدد (۱:۵۴)' : 'درخواست رمز پویا'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleCompleteOrder(paymentMethod)}
                  disabled={isProcessing}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessing ? 'در حال تراکنش بانکی...' : 'پرداخت موفق و تأیید نهایی فاکتور'}</span>
                </button>

                <button
                  onClick={() => setCurrentStep('payment')}
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition"
                >
                  انصراف
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Order Success Confirmation */}
          {currentStep === 'success' && createdOrder && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h3 className="text-lg font-black text-slate-900">سفارش شما با موفقیت ثبت و پرداخت گردید!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                رسید خرید به شماره سفارش زیر صادر شد و سفارش جهت بسته‌بندی به انبار ارسال گردید.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs max-w-sm mx-auto space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">شماره سفارش:</span>
                  <span className="font-bold text-slate-900">{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">کد رهگیری بانکی:</span>
                  <span className="font-bold text-emerald-600">{createdOrder.paymentTrackingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">مبلغ پرداخت‌شده:</span>
                  <span className="font-bold text-slate-900">{formatPrice(createdOrder.finalAmount)}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setIsDashboardOpen(true);
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-500/20"
                >
                  مشاهده در سفارش‌های من
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  بازگشت به فروشگاه
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
