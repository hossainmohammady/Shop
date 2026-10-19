import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice, toPersianDigits } from '../../utils/formatters';
import { X, Scale, ShoppingCart, Trash2, CheckCircle2 } from 'lucide-react';

export const CompareModal: React.FC = () => {
  const {
    isCompareOpen,
    setIsCompareOpen,
    compareIds,
    toggleCompare,
    clearCompare,
    products,
    addToCart,
    setSelectedProductForModal,
  } = useStore();

  if (!isCompareOpen) return null;

  const compareProducts = products.filter((p) => compareIds.includes(p.id));

  // Extract all unique spec keys across compared products
  const allSpecKeys = Array.from(
    new Set(compareProducts.flatMap((p) => Object.keys(p.specifications)))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">مقایسه تخصصی مشخصات فنی محصولات</h3>
              <p className="text-xs text-slate-500">مقایسه ویژگی‌ها، قیمت و امتیاز تا ۴ کالا به‌صورت هم‌زمان</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-rose-500 hover:text-rose-600 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
              >
                حذف همه
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {compareProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 text-xs text-slate-400 font-bold w-44">مشخصات کالا</th>
                    {compareProducts.map((p) => (
                      <th key={p.id} className="p-3 text-center align-top min-w-[200px]">
                        <div className="relative group flex flex-col items-center">
                          <button
                            onClick={() => toggleCompare(p.id)}
                            className="absolute -top-1 -right-1 p-1 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-100 transition"
                            title="حذف از مقایسه"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <img
                            src={p.mainImage}
                            alt=""
                            className="w-24 h-24 object-cover rounded-xl border border-slate-200 mb-2 cursor-pointer"
                            onClick={() => {
                              setSelectedProductForModal(p);
                              setIsCompareOpen(false);
                            }}
                          />
                          <span
                            onClick={() => {
                              setSelectedProductForModal(p);
                              setIsCompareOpen(false);
                            }}
                            className="font-bold text-xs text-slate-800 hover:text-blue-600 line-clamp-2 cursor-pointer"
                          >
                            {p.title}
                          </span>
                          <span className="text-sm font-extrabold text-blue-600 mt-2">
                            {formatPrice(p.discountPrice || p.basePrice)}
                          </span>
                          <button
                            onClick={() => {
                              addToCart(p);
                              setIsCompareOpen(false);
                            }}
                            className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>خرید کالا</span>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* Rating row */}
                  <tr className="bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-600">امتیاز خریداران</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center font-bold text-amber-600">
                        ⭐ {toPersianDigits(p.rating)} از ۵ ({toPersianDigits(p.reviewCount)} نظر)
                      </td>
                    ))}
                  </tr>

                  {/* Stock row */}
                  <tr>
                    <td className="p-3 font-bold text-slate-600">وضعیت موجودی</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center">
                        {p.stock > 0 ? (
                          <span className="text-emerald-600 font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            موجود ({toPersianDigits(p.stock)} عدد)
                          </span>
                        ) : (
                          <span className="text-rose-500 font-bold">ناموجود</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic specs rows */}
                  {allSpecKeys.map((key) => (
                    <tr key={key} className="hover:bg-slate-50/80">
                      <td className="p-3 font-semibold text-slate-500">{key}</td>
                      {compareProducts.map((p) => (
                        <td key={p.id} className="p-3 text-center text-slate-800">
                          {p.specifications[key] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-14 text-center space-y-3">
              <Scale className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">لیست مقایسه خالی است</h4>
              <p className="text-xs text-slate-400">
                بر روی دکمه مقایسه در کارت محصولات کلیک کنید تا مشخصات آن‌ها را کنار هم ببینید.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
