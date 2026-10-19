import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { toPersianDigits } from '../../utils/formatters';
import {
  ArrowUpDown,
  X,
  PackageOpen,
  Check,
} from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    filteredProducts,
    activeFilters,
    setFilter,
    resetFilters,
    brands,
    categories,
    toggleBrandFilter,
    toggleAttributeFilter,
  } = useStore();

  const sortOptions = [
    { id: 'newest', label: 'جدیدترین' },
    { id: 'bestselling', label: 'پرفروش‌ترین' },
    { id: 'cheapest', label: 'ارزان‌ترین' },
    { id: 'expensive', label: 'گران‌ترین' },
    { id: 'popular', label: 'محبوب‌ترین خریداران' },
  ] as const;

  // Find active category and brand labels for active tags
  const activeCategory = categories.find((c) => c.id === activeFilters.categoryId);

  return (
    <div className="w-full space-y-4">
      {/* Top Bar: Sort and Active Count */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        
        {/* Sort Tabs / Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto text-xs py-1">
          <span className="text-slate-400 font-medium flex items-center gap-1 ml-2">
            <ArrowUpDown className="w-3.5 h-3.5" />
            مرتب‌سازی:
          </span>
          {sortOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter('sortBy', opt.id)}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap font-semibold ${
                activeFilters.sortBy === opt.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-xs text-slate-500 font-medium mr-auto">
          نمایش <span className="font-extrabold text-blue-600">{toPersianDigits(filteredProducts.length)}</span> کالا
        </div>
      </div>

      {/* Active Filter Tags */}
      {(activeFilters.categoryId ||
        activeFilters.brandIds.length > 0 ||
        activeFilters.inStockOnly ||
        activeFilters.searchQuery ||
        (activeFilters.minRating || 0) > 0 ||
        Object.keys(activeFilters.attributes).some((k) => activeFilters.attributes[k].length > 0)) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
          <span className="text-xs text-slate-400 font-medium">فیلترهای فعال:</span>

          {activeFilters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
              جستجو: «{activeFilters.searchQuery}»
              <button onClick={() => setFilter('searchQuery', '')} className="hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {activeCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
              دسته: {activeCategory.name}
              <button onClick={() => setFilter('categoryId', null)} className="hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {activeFilters.brandIds.map((bId) => {
            const br = brands.find((b) => b.id === bId);
            if (!br) return null;
            return (
              <span
                key={bId}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200"
              >
                برند: {br.name}
                <button onClick={() => toggleBrandFilter(bId)} className="hover:text-indigo-900">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            );
          })}

          {activeFilters.inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
              فقط کالاهای موجود
              <button onClick={() => setFilter('inStockOnly', false)} className="hover:text-emerald-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {Object.entries(activeFilters.attributes).map(([attrName, vals]) =>
            vals.map((v) => (
              <span
                key={`${attrName}-${v}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
              >
                {attrName}: {v}
                <button
                  onClick={() => toggleAttributeFilter(attrName, v)}
                  className="hover:text-slate-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}

          <button
            onClick={resetFilters}
            className="text-xs text-rose-500 hover:text-rose-700 font-semibold underline mr-2"
          >
            پاک کردن همه فیلترها
          </button>
        </div>
      )}

      {/* Grid of Products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4 shadow-xs">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <PackageOpen className="w-10 h-10" />
          </div>
          <h4 className="text-base font-extrabold text-slate-800">
            هیچ کالایی مطابق با فیلترهای انتخابی یافت نشد
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            لطفاً عبارت جست‌وجو را تغییر دهید یا برخی از فیلترهای برند، قیمت یا ویژگی‌ها را غیرفعال فرمایید.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
          >
            حذف تمام فیلترها و مشاهده همه کالاها
          </button>
        </div>
      )}
    </div>
  );
};
