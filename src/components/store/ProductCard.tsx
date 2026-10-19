import React from 'react';
import { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { formatPrice, calculateDiscountPercent, toPersianDigits } from '../../utils/formatters';
import {
  Heart,
  Scale,
  ShoppingCart,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    wishlistIds,
    toggleWishlist,
    compareIds,
    toggleCompare,
    setSelectedProductForModal,
  } = useStore();

  const isWishlisted = wishlistIds.includes(product.id);
  const isCompared = compareIds.includes(product.id);
  const discountPercent = calculateDiscountPercent(product.basePrice, product.discountPrice);

  const isOutOfStock = product.stock <= 0 && product.variants.every((v) => v.stock <= 0);

  // Extract unique colors for variant color dots preview
  const variantColors = React.useMemo(() => {
    const set = new Set<string>();
    product.variants.forEach((v) => {
      if (v.colorCode) set.add(v.colorCode);
    });
    return Array.from(set).slice(0, 4);
  }, [product.variants]);

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Media & Badges */}
      <div className="relative p-4 pb-0 bg-slate-50/50">
        
        {/* Floating Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-start">
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow-xs">
              {toPersianDigits(discountPercent)}٪ تخفیف
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              جدید
            </span>
          )}
        </div>

        {/* Quick action buttons on top left */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {/* Wishlist Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-xs transition-all duration-200 shadow-xs active:scale-90 ${
              isWishlisted
                ? 'bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100 shadow-rose-500/10'
                : 'bg-white/90 border border-slate-200/60 text-slate-400 hover:text-rose-500 hover:bg-white hover:border-rose-200'
            }`}
            title={isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'ذخیره در علاقه‌مندی‌ها'}
            aria-label={isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : 'hover:scale-110'
              }`}
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-xs transition shadow-xs ${
              isCompared
                ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                : 'bg-white/90 text-slate-400 hover:text-indigo-600 hover:bg-white'
            }`}
            title="مقایسه مشخصات"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image */}
        <div
          onClick={() => setSelectedProductForModal(product)}
          className="cursor-pointer overflow-hidden rounded-2xl flex items-center justify-center aspect-square"
        >
          <img
            src={product.mainImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Quick view overlay on hover */}
        <div
          onClick={() => setSelectedProductForModal(product)}
          className="absolute inset-x-4 bottom-2 py-2 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>مشاهده سریع مشخصات</span>
        </div>
      </div>

      {/* Details & Specs */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Color swatches preview */}
          {variantColors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              {variantColors.map((hex, idx) => (
                <span
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: hex }}
                />
              ))}
              <span className="text-[10px] text-slate-400 mr-1">
                {toPersianDigits(product.variants.length)} رنگ و تنوع
              </span>
            </div>
          )}

          {/* Product Title */}
          <h3
            onClick={() => setSelectedProductForModal(product)}
            className="cursor-pointer font-bold text-sm text-slate-800 group-hover:text-blue-600 transition line-clamp-2 leading-relaxed"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700">{toPersianDigits(product.rating)}</span>
              <span>({toPersianDigits(product.reviewCount)})</span>
            </div>

            {/* Stock status indicator */}
            <div>
              {!isOutOfStock ? (
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  موجود در انبار
                </span>
              ) : (
                <span className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  ناموجود
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing and Cart Button */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            {discountPercent > 0 && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.basePrice)}
              </span>
            )}
            <span className="text-sm sm:text-base font-extrabold text-slate-900">
              {formatPrice(product.discountPrice || product.basePrice)}
            </span>
          </div>

          <button
            onClick={() => {
              if (product.variants.length > 1) {
                // If product has multiple variants, open modal so user can pick color/size
                setSelectedProductForModal(product);
              } else {
                addToCart(product);
              }
            }}
            disabled={isOutOfStock}
            className={`p-2.5 sm:px-3 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
            }`}
            title="افزودن به سبد خرید"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">افزودن</span>
          </button>
        </div>

      </div>

    </div>
  );
};
