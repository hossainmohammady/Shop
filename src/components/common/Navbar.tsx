import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice, toPersianDigits } from '../../utils/formatters';
import {
  Search,
  ShoppingCart,
  Heart,
  Scale,
  User,
  ShieldCheck,
  ChevronDown,
  Layers,
  Sparkles,
  PhoneCall,
  Menu,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    storeSettings,
    categories,
    cart,
    wishlistIds,
    compareIds,
    setIsCartOpen,
    setIsCompareOpen,
    setIsDashboardOpen,
    openDashboardTab,
    setIsAdminOpen,
    products,
    setSelectedProductForModal,
    activeFilters,
    setFilter,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Cart total items count
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Live autocomplete results
  const searchResults = React.useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.titleEn && p.titleEn.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [searchTerm, products]);

  // Click outside listener for search autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter('searchQuery', searchTerm);
    setIsSearchFocused(false);
    // Scroll smoothly to product catalog
    const catalogElem = document.getElementById('catalog-section');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200">
      {/* Top Announcement Bar */}
      {storeSettings.announcementActive && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>{storeSettings.announcementText}</span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Right side: Mobile Menu Button & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              aria-label="منوی موبایل"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <div
              onClick={() => {
                setFilter('categoryId', null);
                setFilter('searchQuery', '');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                  {storeSettings.storeName}
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline-block font-medium">
                  {storeSettings.slogan}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Live Search Engine */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-xl mx-2 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="جست‌وجو در نام محصول، برند، مشخصات و کد کالا..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-slate-100 border border-transparent focus:border-blue-500 focus:bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl py-2.5 pr-11 pl-12 outline-hidden transition shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 flex justify-between">
                  <span>پیشنهادات فوری</span>
                  <span>{toPersianDigits(searchResults.length)} کالا یافت شد</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedProductForModal(item);
                        setIsSearchFocused(false);
                      }}
                      className="p-3 hover:bg-blue-50/70 transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.mainImage}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-1">
                            {item.title}
                          </p>
                          <span className="text-xs text-slate-400">{item.sku}</span>
                        </div>
                      </div>
                      <div className="text-left font-bold text-sm text-blue-600 whitespace-nowrap">
                        {formatPrice(item.discountPrice || item.basePrice)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer border-t border-slate-100">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    مشاهده تمامی نتایج برای «{searchTerm}»
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Left side: Action Controls (Admin, User, Wishlist, Compare, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Dedicated Admin Panel Trigger */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold transition shadow-xs"
              title="ورود به پنل مدیریت فروشگاه"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>پنل مدیریت</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
              title="مقایسه محصولات"
            >
              <Scale className="w-5 h-5" />
              {compareIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {toPersianDigits(compareIds.length)}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => openDashboardTab('wishlist')}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition hidden sm:flex"
              title="مشاهده کالاهای ذخیره‌شده (علاقه‌مندی‌ها)"
            >
              <Heart className={`w-5 h-5 ${wishlistIds.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {toPersianDigits(wishlistIds.length)}
                </span>
              )}
            </button>

            {/* Customer Dashboard Button */}
            <button
              onClick={() => openDashboardTab('orders')}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition border border-slate-200"
              title="حساب کاربری"
            >
              <User className="w-5 h-5 text-slate-600" />
              <span className="text-xs font-semibold hidden md:inline-block">حساب من</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md shadow-blue-500/20"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline-block">سبد خرید</span>
              {cartItemsCount > 0 && (
                <span className="bg-white text-blue-700 text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {toPersianDigits(cartItemsCount)}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Secondary Navigation Bar */}
        <div className="hidden lg:flex items-center justify-between py-2.5 border-t border-slate-100 text-sm">
          <div className="flex items-center gap-6">
            
            {/* Categories Dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-2 font-bold text-slate-800 hover:text-blue-600 transition py-1"
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>دسته‌بندی کالاها</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Categories Dropdown */}
              {isCategoryMenuOpen && (
                <div
                  onMouseLeave={() => setIsCategoryMenuOpen(false)}
                  className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div
                    onClick={() => {
                      setFilter('categoryId', null);
                      setIsCategoryMenuOpen(false);
                    }}
                    className={`px-4 py-2.5 text-xs font-bold cursor-pointer transition flex items-center justify-between ${
                      !activeFilters.categoryId ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>همه دسته‌بندی‌ها</span>
                    <span className="text-slate-400">{toPersianDigits(products.length)} کالا</span>
                  </div>

                  {categories
                    .filter((c) => !c.parentId)
                    .map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setFilter('categoryId', cat.id);
                          setIsCategoryMenuOpen(false);
                        }}
                        className={`px-4 py-2.5 text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                          activeFilters.categoryId === cat.id ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <nav className="flex items-center gap-6 text-slate-600 text-xs font-semibold">
              <button
                onClick={() => {
                  setFilter('categoryId', null);
                  setFilter('inStockOnly', false);
                  setFilter('searchQuery', '');
                }}
                className="hover:text-blue-600 transition"
              >
                همه محصولات
              </button>
              <button
                onClick={() => {
                  setFilter('sortBy', 'bestselling');
                  const elem = document.getElementById('catalog-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-blue-600 transition"
              >
                پرفروش‌ترین‌ها
              </button>
              <button
                onClick={() => {
                  setFilter('sortBy', 'newest');
                  const elem = document.getElementById('catalog-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-blue-600 transition"
              >
                جدیدترین‌ها
              </button>
              <button
                onClick={() => {
                  setFilter('inStockOnly', true);
                  const elem = document.getElementById('catalog-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-blue-600 transition flex items-center gap-1 text-rose-600"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>فقط کالاهای موجود</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
            <span>پشتیبانی تلفنی: {storeSettings.phone}</span>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4 px-2 space-y-3 bg-white">
            <div className="pb-3 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-400 mb-2">دسته‌بندی‌ها</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setFilter('categoryId', c.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 text-right text-xs rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 font-medium text-slate-700"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsAdminOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>ورود به پنل مدیریت فروشگاه</span>
              </button>
              <button
                onClick={() => {
                  setIsDashboardOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
              >
                <User className="w-4 h-4" />
                <span>حساب کاربری و تاریخچه سفارش‌ها</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
