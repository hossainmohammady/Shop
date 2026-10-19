import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice, calculateDiscountPercent, toPersianDigits } from '../../utils/formatters';
import { ProductVariant } from '../../types/store';
import {
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  Heart,
  Scale,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Send,
  User,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForModal,
    setSelectedProductForModal,
    addToCart,
    wishlistIds,
    toggleWishlist,
    compareIds,
    toggleCompare,
    reviews,
    addReview,
    brands,
    categories,
    storeSettings,
  } = useStore();

  const product = selectedProductForModal;

  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'reviews'>('specs');

  // Review form state
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  // Initialize or update variant when modal product changes
  React.useEffect(() => {
    if (product) {
      setActiveImage(product.mainImage);
      setSelectedVariant(product.variants.length > 0 ? product.variants[0] : undefined);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const brand = brands.find((b) => b.id === product.brandId);
  const category = categories.find((c) => c.id === product.categoryId);

  const effectivePrice = selectedVariant
    ? (selectedVariant.discountPrice || selectedVariant.price)
    : (product.discountPrice || product.basePrice);

  const effectiveBasePrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const effectiveStock = selectedVariant ? selectedVariant.stock : product.stock;
  const discountPercent = calculateDiscountPercent(effectiveBasePrice, effectivePrice);

  const isWishlisted = wishlistIds.includes(product.id);
  const isCompared = compareIds.includes(product.id);

  // Product specific reviews
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(product.id, newComment.trim(), newRating);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForModal(null)}
          className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Gallery Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square flex items-center justify-center">
                <img
                  src={activeImage || product.mainImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-3 right-3 bg-rose-500 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md">
                    {toPersianDigits(discountPercent)}٪ تخفیف
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                        activeImage === img ? 'border-blue-600 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust badges */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>تضمین اصالت ۱۰۰٪ و سلامت فیزیکی کالا</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>ارسال سریع اکسپرس در بسته‌بندی پلمپ</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-indigo-600" />
                  <span>۷ روز مهلت تست و مرجوعی بدون قید و شرط</span>
                </div>
              </div>
            </div>

            {/* Info and Purchase Column */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-5">
              
              <div>
                {/* Category & Brand Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
                  {category && <span>{category.name}</span>}
                  {brand && (
                    <>
                      <span>/</span>
                      <span className="text-blue-600 font-bold">{brand.name}</span>
                    </>
                  )}
                  <span>/</span>
                  <span className="font-mono">{selectedVariant?.sku || product.sku}</span>
                </div>

                {/* Product Title */}
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                  {product.title}
                </h2>
                {product.titleEn && (
                  <p className="text-xs text-slate-400 font-mono mt-1">{product.titleEn}</p>
                )}

                {/* Rating and Reviews */}
                <div className="flex items-center gap-3 mt-3 pb-4 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{toPersianDigits(product.rating)}</span>
                  </div>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500">
                    {toPersianDigits(productReviews.length || product.reviewCount)} دیدگاه ثبت‌شده
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500">
                    {toPersianDigits(product.salesCount)} خریدار موفق
                  </span>
                </div>

                {/* Short description */}
                <p className="text-xs text-slate-600 leading-relaxed mt-3">
                  {product.shortDescription}
                </p>

                {/* Variants Selector */}
                {product.variants.length > 0 && (
                  <div className="mt-5 space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                    <span className="text-xs font-bold text-slate-700 block">
                      انتخاب رنگ و مدل:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariant?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              setSelectedVariant(v);
                              setQuantity(1);
                            }}
                            className={`p-3 rounded-xl border text-right transition flex items-center justify-between text-xs ${
                              isSelected
                                ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {v.colorCode && (
                                <span
                                  className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0"
                                  style={{ backgroundColor: v.colorCode }}
                                />
                              )}
                              <span className="font-semibold">{v.title}</span>
                            </div>
                            <span className="font-mono text-[11px] text-slate-400">
                              {v.stock > 0 ? `${toPersianDigits(v.stock)} موجود` : 'ناموجود'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Price and Add to Cart Section */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                
                {/* Price Display */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-500 font-medium block">قیمت نهایی مصرف‌کننده:</span>
                    {discountPercent > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(effectiveBasePrice)}
                      </span>
                    )}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {formatPrice(effectivePrice)}
                  </div>
                </div>

                {/* Stock status */}
                <div className="flex items-center justify-between text-xs">
                  {effectiveStock > 0 ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      موجود در انبار مرکزی ({toPersianDigits(effectiveStock)} عدد باقی‌مانده)
                    </span>
                  ) : (
                    <span className="text-rose-500 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      این مدل در حال حاضر به اتمام رسیده است
                    </span>
                  )}

                  {/* Quantity Stepper */}
                  {effectiveStock > 0 && (
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setQuantity((q) => Math.min(effectiveStock, q + 1))}
                        className="w-8 h-8 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200"
                      >
                        +
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-xs font-bold font-mono">
                        {toPersianDigits(quantity)}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200"
                      >
                        -
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(product, selectedVariant, quantity);
                      setSelectedProductForModal(null);
                    }}
                    disabled={effectiveStock <= 0}
                    className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg ${
                      effectiveStock > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>افزودن به سبد خرید</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 active:scale-95 ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-300 text-rose-500 shadow-xs'
                        : 'border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-slate-50'
                    }`}
                    title={isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'ذخیره در علاقه‌مندی‌ها'}
                    aria-label={isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                  >
                    <Heart className={`w-5 h-5 transition-transform duration-200 ${isWishlisted ? 'fill-rose-500 scale-110' : ''}`} />
                  </button>

                  <button
                    onClick={() => toggleCompare(product.id)}
                    className={`p-3.5 rounded-2xl border transition ${
                      isCompared
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    title="مقایسه کالا"
                  >
                    <Scale className="w-5 h-5" />
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom Tabs: Specs, Full Description, Reviews */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-4 border-b border-slate-200 text-xs sm:text-sm font-bold">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 transition relative ${
                  activeTab === 'specs'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                مشخصات فنی و تخصصی
              </button>
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-3 transition relative ${
                  activeTab === 'desc'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                توضیحات و نقد و بررسی
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 transition relative ${
                  activeTab === 'reviews'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                دیدگاه خریداران ({toPersianDigits(productReviews.length)})
              </button>
            </div>

            {/* Tab 1: Specs */}
            {activeTab === 'specs' && (
              <div className="mt-6 rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <div
                    key={key}
                    className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs ${
                      idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'
                    }`}
                  >
                    <span className="font-semibold text-slate-500">{key}</span>
                    <span className="sm:col-span-2 text-slate-800 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Description */}
            {activeTab === 'desc' && (
              <div className="mt-6 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <p>{product.fullDescription}</p>
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="mt-6 space-y-6">
                {/* Add new review */}
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">دیدگاه خود را درباره این محصول ثبت کنید</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= newRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="تجربه کاربری و نقاط قوت یا ضعف محصول را بنویسید..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 bg-white"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>ثبت دیدگاه</span>
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {productReviews.length > 0 ? (
                    productReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-800">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                                خریدار کالا
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="font-bold text-xs">{toPersianDigits(rev.rating)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pr-9">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-slate-400 py-4">
                      هنوز دیدگاهی برای این محصول ثبت نشده است. اولین نظر را شما بنویسید!
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
