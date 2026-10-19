import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  MapPin,
  Phone,
  ArrowLeft,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { storeSettings, showToast } = useStore();
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.includes('@')) {
      showToast('لطفاً یک ایمیل معتبر وارد فرمایید.');
      return;
    }
    showToast('ایمیل شما با موفقیت در خبرنامه تخفیف‌های ویژه ثبت شد.');
    setEmailInput('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* 4 Pillars of Trust */}
      <div className="border-b border-slate-800 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">ضمانت اصالت ۱۰۰٪</h4>
                <p className="text-xs text-slate-400 mt-0.5">تضمین اصالت تمامی کالاها با گارانتی معتبر</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">ارسال سریع و مطمئن</h4>
                <p className="text-xs text-slate-400 mt-0.5">تحویل اکسپرس سراسری با بسته‌بندی ایمن</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">۷ روز ضمانت بازگشت</h4>
                <p className="text-xs text-slate-400 mt-0.5">امکان تعویض یا عودت کالا بدون قید و شرط</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">پشتیبانی ۲۴ ساعته</h4>
                <p className="text-xs text-slate-400 mt-0.5">پاسخگویی کارشناسان در تمام ایام هفته</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* About store */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-white font-extrabold text-lg">{storeSettings.storeName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              فروشگاه اینترنتی {storeSettings.storeName} با هدف ارائه کالاهای باکیفیت و اصیل، همراه با سریع‌ترین سیستم ارسال و قیمت‌گذاری منصفانه طراحی شده است. رضایت مشتری و شفافیت در ارائه خدمات، تعهد اصلی ماست.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>شماره تماس: {storeSettings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>پست الکترونیکی: {storeSettings.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>نشانی: {storeSettings.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h5 className="text-white text-sm font-bold mb-4">راهنمای خرید</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#catalog-section" className="hover:text-white transition">نحوه ثبت سفارش</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition">رویه‌های ارسال سفارش</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition">شیوه‌های پرداخت</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition">قوانین و مقررات مرجوعی</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition">پرسش‌های متداول</a></li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h5 className="text-white text-sm font-bold mb-4">خدمات مشتریان</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#catalog-section" className="hover:text-white transition">پیگیری سفارشات</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition">ضمانت اصالت کالا</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition">حریم خصوصی کاربران</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition">گزارش تخلف یا انتقاد</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition">تماس با مدیر فروشگاه</a></li>
            </ul>
          </div>

          {/* Newsletter & Trust badges */}
          <div className="space-y-5">
            <h5 className="text-white text-sm font-bold">عضویت در خبرنامه تخفیف</h5>
            <p className="text-xs text-slate-400">از آخرین کوپن‌های تخفیف و فروش‌های شگفت‌انگیز زودتر از همه باخبر شوید:</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                placeholder="آدرس ایمیل خود را بنویسید..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl py-2.5 pr-3 pl-10 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute left-1.5 top-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Simulated Trust Badges (e-Namad, Samandehi, etc.) */}
            <div className="pt-2 flex items-center gap-3">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 flex items-center gap-2 text-[11px] font-semibold text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>نماد اعتماد الکترونیکی (اینماد)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} تمامی حقوق مادی و معنوی این وب‌سایت متعلق به {storeSettings.storeName} می‌باشد.</p>
          <p className="flex items-center gap-2">
            <span>طراحی و توسعه سیستم جامع فروشگاهی با استانداردهای امنیتی بالا</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
