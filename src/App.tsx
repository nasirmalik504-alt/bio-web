import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { useQuoteStore } from './store/useQuoteStore';

// Layout & Common Components
import { LoadingScreen } from './components/common/LoadingScreen';
import { CustomCursor } from './components/common/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { BrandsPage } from './pages/BrandsPage';
import { BrandDetailPage } from './pages/BrandDetailPage';
import { BioBrandPage } from './pages/BioBrandPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { InvoiceMakerPage } from './pages/InvoiceMakerPage';
import { DashboardPage } from './pages/DashboardPage';

// Drawers & Modals
import { QuoteDrawer } from './components/quote/QuoteDrawer';
import { ProductCatalogueModal } from './components/products/ProductCatalogueModal';

// Reset scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export const AppContent: React.FC = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/invoice-maker');

  const { isDrawerOpen, openDrawer, closeDrawer } = useQuoteStore();
  const [catalogueModalOpen, setCatalogueModalOpen] = useState(false);
  const [catalogueCategory, setCatalogueCategory] = useState('all');

  // Responsive, ultra-fast Lenis smooth scroll
  useEffect(() => {
    if (isDashboardRoute) return; // Disable smooth scroll overrides for internal dashboard

    const lenis = new Lenis({
      duration: 0.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isDashboardRoute]);

  const handleOpenCatalogue = (category: string = 'all') => {
    setCatalogueCategory(category);
    setCatalogueModalOpen(true);
  };

  // Completely isolated standalone view for internal Dashboard (No public website Navbar, Footer, or Basket)
  if (isDashboardRoute) {
    return (
      <div className="min-h-screen bg-[#F4F8FC] selection:bg-[#6EA8FE]/20 selection:text-[#23324D] font-sans">
        <ScrollToTop />
        <main className="min-h-screen">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/*" element={<DashboardPage />} />
            <Route path="/invoice-maker" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#5F708A] selection:bg-[#6EA8FE]/20 selection:text-[#23324D] relative font-sans">
      <CustomCursor />

      {/* Quick intro overlay */}
      <LoadingScreen onComplete={() => {}} />

      <ScrollToTop />

      <Navbar
        onOpenCatalogue={handleOpenCatalogue}
        onOpenQuote={openDrawer}
      />

      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/brands/:brandId" element={<BrandDetailPage />} />
          <Route path="/biobrand" element={<BioBrandPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Quick Search Catalogue Modal */}
      <ProductCatalogueModal
        isOpen={catalogueModalOpen}
        onClose={() => setCatalogueModalOpen(false)}
        initialCategory={catalogueCategory}
      />

      {/* Persistent Quote Basket Drawer */}
      <QuoteDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
