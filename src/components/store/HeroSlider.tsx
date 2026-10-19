import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronRight, ChevronLeft, Sparkles, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  highlight: string;
  buttonText: string;
  categoryId?: string;
  image: string;
  bgGradient: string;
  badge: string;
}

const slides: Slide[] = [
  {
    id: 'slide-1',
    title: 'پرچمداران جدید دنیای فناوری',
    subtitle: 'آیفون ۱۶ پرو مکس و سامسونگ گلکسی اس ۲۴ اولترا با ضمانت اصالت و رجیستری رسمی',
    highlight: 'تا ۴ میلیون تومان تخفیف نقدی',
    buttonText: 'مشاهده و خرید آنلاین',
    categoryId: 'cat-mobile',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
    bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
    badge: 'فروش ویژه پرچمداران ۲۰۲۶',
  },
  {
    id: 'slide-2',
    title: 'قدرت بی‌پایان پردازش و رندرینگ',
    subtitle: 'لپ‌تاپ‌های فوق حرفه‌ای MacBook Pro M3 Max و Asus ROG با کارت گرافیک‌های سری ۴۰',
    highlight: 'ارسال فوری اکسپرس رایگان',
    buttonText: 'بررسی لپ‌تاپ‌های مهندسی',
    categoryId: 'cat-laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    bgGradient: 'from-slate-950 via-blue-950 to-slate-900',
    badge: 'تخفیف ویژه لپ‌تاپ',
  },
  {
    id: 'slide-3',
    title: 'اوج لذت موسیقی با صدای Hi-Res',
    subtitle: 'هدفون‌های حرفه‌ای سونی با عمیق‌ترین فناوری حذف نویز فعال (Active Noise Cancellation)',
    highlight: 'بهترین قیمت تضمین شده',
    buttonText: 'مشاهده هدفون‌های سونی',
    categoryId: 'cat-audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    bgGradient: 'from-zinc-950 via-neutral-900 to-zinc-950',
    badge: 'کیفیت صدای استودیویی',
  },
];

export const HeroSlider: React.FC = () => {
  const { setFilter } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  const handleAction = () => {
    if (slide.categoryId) {
      setFilter('categoryId', slide.categoryId);
    }
    const elem = document.getElementById('catalog-section');
    elem?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${slide.bgGradient} text-white shadow-2xl min-h-[380px] md:min-h-[440px] flex items-center transition-all duration-700`}
      >
        {/* Background decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 md:p-14 w-full">
          
          {/* Content side */}
          <div className="md:col-span-7 space-y-4 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              {slide.title}
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
              {slide.subtitle}
            </p>

            <div className="flex items-center gap-2 text-amber-300 text-sm font-bold pt-1">
              <Zap className="w-4 h-4 fill-amber-300" />
              <span>{slide.highlight}</span>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={handleAction}
                className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition shadow-lg shadow-blue-600/30 active:scale-95"
              >
                <span>{slide.buttonText}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>گارانتی معتبر ۱۸ ماهه</span>
              </div>
            </div>
          </div>

          {/* Image Showcase */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500"></div>
              <img
                src={slide.image}
                alt={slide.title}
                className="relative w-72 h-72 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl border border-white/10 transform transition duration-500 hover:scale-105"
              />
            </div>
          </div>

        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition border border-white/10"
          aria-label="اسلاید قبلی"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition border border-white/10"
          aria-label="اسلاید بعدی"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 right-1/2 translate-x-1/2 flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-blue-500' : 'w-2 bg-white/40'
              }`}
              aria-label={`اسلاید ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
