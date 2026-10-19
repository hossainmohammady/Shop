import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice, toPersianDigits } from '../../utils/formatters';
import {
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  Check,
  Search,
  Sparkles,
  Layers,
  Tag,
  Star,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

export const ProductFilters: React.FC = () => {
  const {
    filterConfigs,
    categories,
    brands,
    dynamicAttributes,
    activeFilters,
    setFilter,
    resetFilters,
    toggleBrandFilter,
    toggleAttributeFilter,
    products,
  } = useStore();

  const [brandSearch, setBrandSearch] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'flt-cat': true,
    'flt-brand': true,
    'flt-price': true,
    'flt-stock': true,
    'flt-color': true,
    'flt-storage': true,
    'flt-ram': true,
    'flt-rating': true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate active filter count
  const activeCount = React.useMemo(() => {
    let count = 0;
    if (activeFilters.categoryId) count++;
    count += activeFilters.brandIds.length;
    if (activeFilters.inStockOnly) count++;
    if ((activeFilters.minPrice || 0) > 0 || (activeFilters.maxPrice || 200000000) < 200000000) count++;
    if ((activeFilters.minRating || 0) > 0) count++;
    for (const values of Object.values(activeFilters.attributes)) {
      count += values.length;
    }
    return count;
  }, [activeFilters]);

  // Filter brands based on search
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase()) ||
    b.nameEn.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // Sorted and active filter configs
  const visibleConfigs = filterConfigs
    .filter((fc) => fc.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <aside className="w-full bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs divide-y divide-slate-100">
      
      {/* Header with Title and Reset */}
      <div className="pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-blue-600" />
          <h3 className="font-extrabold text-sm text-slate-900">فیلترهای پیشرفته</h3>
          {activeCount > 0 && (
            <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {toPersianDigits(activeCount)} فعال
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>پاک کردن همه</span>
          </button>
        )}
      </div>

      {/* Dynamic Render of Admin-configured Filter Widgets */}
      <div className="space-y-4 pt-4">
        {visibleConfigs.map((cfg) => {
          const isOpen = openSections[cfg.id] !== false;

          // Widget 1: Categories
          if (cfg.type === 'category') {
            return (
              <div key={cfg.id} className="pt-3 first:pt-0">
                <button
                  type="button"
                  onClick={() => toggleSection(cfg.id)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-blue-600 transition py-1"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-500" />
                    {cfg.title}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    <button
                      onClick={() => setFilter('categoryId', null)}
                      className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                        !activeFilters.categoryId
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>همه دسته‌بندی‌ها</span>
                      <span>{toPersianDigits(products.length)}</span>
                    </button>

                    {categories
                      .filter((c) => !c.parentId)
                      .map((cat) => {
                        const isSelected = activeFilters.categoryId === cat.id;
                        const subCats = categories.filter((sc) => sc.parentId === cat.id);

                        return (
                          <div key={cat.id} className="space-y-1">
                            <button
                              onClick={() => setFilter('categoryId', isSelected ? null : cat.id)}
                              className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                                isSelected
                                  ? 'bg-blue-50 text-blue-600 font-bold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{cat.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                            </button>

                            {/* Subcategories */}
                            {subCats.length > 0 && (
                              <div className="mr-3 border-r border-slate-200 pr-2 space-y-1">
                                {subCats.map((sc) => {
                                  const isSubSelected = activeFilters.categoryId === sc.id;
                                  return (
                                    <button
                                      key={sc.id}
                                      onClick={() => setFilter('categoryId', isSubSelected ? null : sc.id)}
                                      className={`w-full text-right px-2 py-1 rounded-lg text-[11px] transition flex items-center justify-between ${
                                        isSubSelected
                                          ? 'bg-blue-50 text-blue-600 font-bold'
                                          : 'text-slate-500 hover:text-slate-800'
                                      }`}
                                    >
                                      <span>{sc.name}</span>
                                      {isSubSelected && <Check className="w-3 h-3 text-blue-600" />}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          }

          // Widget 2: Brands
          if (cfg.type === 'brand') {
            return (
              <div key={cfg.id} className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => toggleSection(cfg.id)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-blue-600 transition py-1"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-500" />
                    {cfg.title}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="mt-3 space-y-2">
                    {/* Brand Search input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="جست‌وجوی برند..."
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 pr-8 text-xs text-slate-700 outline-hidden focus:border-blue-500"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2" />
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {filteredBrands.map((b) => {
                        const isChecked = activeFilters.brandIds.includes(b.id);
                        const count = products.filter((p) => p.brandId === b.id).length;

                        return (
                          <label
                            key={b.id}
                            className="flex items-center justify-between text-xs text-slate-700 hover:text-blue-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleBrandFilter(b.id)}
                                className="w-4 h-4 rounded-md text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                              />
                              <span className="font-medium">{b.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({b.nameEn})</span>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {toPersianDigits(count)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // Widget 3: Price Range
          if (cfg.type === 'price') {
            return (
              <div key={cfg.id} className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => toggleSection(cfg.id)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-blue-600 transition py-1"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                    {cfg.title}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>حداکثر قیمت:</span>
                      <span className="font-bold text-blue-600">
                        {formatPrice(activeFilters.maxPrice || 200000000)}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="10000000"
                      max="200000000"
                      step="2000000"
                      value={activeFilters.maxPrice || 200000000}
                      onChange={(e) => setFilter('maxPrice', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>۱۰ میلیون</span>
                      <span>۲۰۰ میلیون</span>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // Widget 4: In-Stock Only
          if (cfg.type === 'in_stock') {
            return (
              <div key={cfg.id} className="pt-4 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {cfg.title}
                  </span>
                  <input
                    type="checkbox"
                    checked={activeFilters.inStockOnly}
                    onChange={(e) => setFilter('inStockOnly', e.target.checked)}
                    className="w-4 h-4 rounded-md text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              </div>
            );
          }

          // Widget 5: Dynamic Attribute (Color, Storage, RAM, etc.)
          if (cfg.type === 'attribute' && cfg.attributeName) {
            const attrName = cfg.attributeName;
            const attrObj = dynamicAttributes.find((da) => da.name === attrName);
            const options = attrObj ? attrObj.options : cfg.options || [];
            const selectedOptions = activeFilters.attributes[attrName] || [];

            return (
              <div key={cfg.id} className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => toggleSection(cfg.id)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-blue-600 transition py-1"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    {cfg.title}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {options.map((opt) => {
                      const isSelected = selectedOptions.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleAttributeFilter(attrName, opt)}
                          className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Widget 6: Minimum Rating
          if (cfg.type === 'rating') {
            return (
              <div key={cfg.id} className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => toggleSection(cfg.id)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-blue-600 transition py-1"
                >
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    {cfg.title}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="mt-2.5 space-y-1">
                    {[4, 3, 2].map((stars) => {
                      const isSelected = activeFilters.minRating === stars;
                      return (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setFilter('minRating', isSelected ? 0 : stars)}
                          className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-50 text-amber-900 font-bold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{toPersianDigits(stars)} ستاره و بالاتر</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>

    </aside>
  );
};
