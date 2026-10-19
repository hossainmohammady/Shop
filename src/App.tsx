/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSlider } from './components/store/HeroSlider';
import { CategoryPills } from './components/store/CategoryPills';
import { FlashDeals } from './components/store/FlashDeals';
import { ProductFilters } from './components/store/ProductFilters';
import { ProductGrid } from './components/store/ProductGrid';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { CartDrawer } from './components/store/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { CompareModal } from './components/store/CompareModal';
import { CustomerDashboardModal } from './components/account/CustomerDashboardModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';

const StoreContent: React.FC = () => {
  const { toastMessage, setIsAdminOpen } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-60 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/60 backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar />

      {/* Main Homepage Flow */}
      <main className="flex-1">
        {/* Hero Slider */}
        <HeroSlider />

        {/* Category Showcase */}
        <CategoryPills />

        {/* Flash Deals / Special Offers */}
        <FlashDeals />

        {/* Main Catalog & Dynamic Filter Section */}
        <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 scroll-mt-24">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <span>کاتالوگ و ویترین جامع محصولات</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                از نوار فیلتر سمت راست برای دسته‌بندی، برند، محدوده قیمت و ویژگی‌های فنی استفاده نمایید
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>شخصی‌سازی فیلترها و کاتالوگ در پنل مدیریت</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Dynamic Filter Sidebar */}
            <div className="lg:col-span-1 sticky top-24">
              <ProductFilters />
            </div>

            {/* Product Grid & Sorting */}
            <div className="lg:col-span-3">
              <ProductGrid />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Overlays, Drawers & Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <CompareModal />
      <CustomerDashboardModal />
      <AdminPanel />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
