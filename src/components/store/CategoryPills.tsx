import React from 'react';
import { useStore } from '../../context/StoreContext';
import { toPersianDigits } from '../../utils/formatters';
import {
  Smartphone,
  Laptop,
  Headphones,
  Coffee,
  Footprints,
  Layers,
  Sparkles,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-6 h-6" />,
  Phone: <Smartphone className="w-6 h-6" />,
  Laptop: <Laptop className="w-6 h-6" />,
  Headphones: <Headphones className="w-6 h-6" />,
  Coffee: <Coffee className="w-6 h-6" />,
  Footprints: <Footprints className="w-6 h-6" />,
};

export const CategoryPills: React.FC = () => {
  const { categories, products, activeFilters, setFilter } = useStore();

  const getProductCount = (catId: string) => {
    return products.filter((p) => {
      if (p.categoryId === catId) return true;
      const subCats = categories.filter((c) => c.parentId === catId).map((c) => c.id);
      return subCats.includes(p.categoryId);
    }).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>دسته‌بندی‌های منتخب فروشگاه</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            دسترسی سریع به کاتالوگ کالاهای دیجیتال، تکنولوژی و سبک زندگی
          </p>
        </div>

        <button
          onClick={() => {
            setFilter('categoryId', null);
            const elem = document.getElementById('catalog-section');
            elem?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <span>مشاهده همه محصولات</span>
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories
          .filter((c) => !c.parentId)
          .map((cat) => {
            const isSelected = activeFilters.categoryId === cat.id;
            const count = getProductCount(cat.id);
            const icon = (cat.iconName && iconMap[cat.iconName]) || <Layers className="w-6 h-6" />;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  setFilter('categoryId', isSelected ? null : cat.id);
                  const elem = document.getElementById('catalog-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group cursor-pointer rounded-2xl p-4 transition-all duration-300 flex flex-col items-center text-center border relative overflow-hidden ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25 scale-102'
                    : 'bg-white text-slate-800 border-slate-200/80 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:scale-110'
                  }`}
                >
                  {icon}
                </div>

                <h3 className="font-bold text-xs sm:text-sm line-clamp-1">{cat.name}</h3>
                
                <span
                  className={`text-[11px] mt-1 font-medium ${
                    isSelected ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {toPersianDigits(count)} کالا
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};
