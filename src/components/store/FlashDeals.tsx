import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Flame, Clock } from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

export const FlashDeals: React.FC = () => {
  const { products } = useStore();

  // Special offer products
  const specialProducts = products.filter((p) => p.isSpecialOffer);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (specialProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
      <div className="bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        
        {/* Header with Title and Countdown */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-rose-500/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
              <Flame className="w-7 h-7 fill-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-black">پیشنهادات شگفت‌انگیز روز</span>
                <span className="bg-amber-400 text-rose-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                  تخفیف ویژه
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-1">
                تعداد بسیار محدود با قیمت استثنایی و ارسال سریع
              </p>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center gap-2 bg-rose-950/40 px-4 py-2 rounded-2xl border border-rose-400/30">
            <Clock className="w-4 h-4 text-amber-300" />
            <span className="text-xs text-rose-200 ml-2">فرصت باقی‌مانده:</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-sm">
              <span className="w-8 h-8 rounded-lg bg-white text-rose-900 flex items-center justify-center shadow-xs">
                {toPersianDigits(String(timeLeft.hours).padStart(2, '0'))}
              </span>
              <span>:</span>
              <span className="w-8 h-8 rounded-lg bg-white text-rose-900 flex items-center justify-center shadow-xs">
                {toPersianDigits(String(timeLeft.minutes).padStart(2, '0'))}
              </span>
              <span>:</span>
              <span className="w-8 h-8 rounded-lg bg-white text-rose-900 flex items-center justify-center shadow-xs">
                {toPersianDigits(String(timeLeft.seconds).padStart(2, '0'))}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {specialProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="text-slate-900">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
