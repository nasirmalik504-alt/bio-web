import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuoteStore } from '../../store/useQuoteStore';
import { Search, ShoppingBag, Menu, X, ChevronDown, Award, Sparkles, Mail } from 'lucide-react';

interface NavbarProps {
  onOpenCatalogue: (category?: string) => void;
  onOpenQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCatalogue,
  onOpenQuote,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const { totalItems } = useQuoteStore();
  const quoteCount = totalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exact Updated Navigation
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/products', label: 'Products', hasMegaMenu: true },
    { path: '/brands', label: 'Authorized Brands' },
    { path: '/biobrand', label: 'BioBrand' },
  ];

  const productCategories = [
    { name: 'Liquid Handling', desc: 'Micropipettes, electronic pipettes, burettes & dispensers', icon: '🧪', category: 'liquid-handling', bg: 'bg-[#EAF7F2]' },
    { name: 'Filtration', desc: 'Syringe filters, membrane discs, filter paper & holders', icon: '🔬', category: 'filtration', bg: 'bg-[#DCEEFF]' },
    { name: 'Laboratory Glassware', desc: 'Beakers, flasks, cylinders, burettes & volumetric glass', icon: '🥛', category: 'glassware', bg: 'bg-[#EDF8FF]' },
    { name: 'Laboratory Plasticware', desc: 'Tips, centrifuge tubes, cryo vials, petri dishes & PCR', icon: '🧫', category: 'plasticware', bg: 'bg-[#FFF8D9]' },
    { name: 'Chemicals & Reagents', desc: 'Analytical reagents, solvents, culture media & buffers', icon: '⚗️', category: 'chemicals', bg: 'bg-[#EEE8FF]' },
    { name: 'Laboratory Instruments', desc: 'Balances, pH meters, centrifuges & spectrophotometers', icon: '📊', category: 'instruments', bg: 'bg-[#FFF0E8]' },
    { name: 'Safety & Essentials', desc: 'PPE, lab coats, gloves, face shields & spill kits', icon: '🥽', category: 'safety', bg: 'bg-[#FCECEF]' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-white/95 backdrop-blur-xl border-b border-[#E6ECF5] shadow-xs'
          : 'py-5 bg-gradient-to-b from-[#FAFBFD]/95 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <img
              src="/images/logo.png"
              alt="Biobusiness Development Agency"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F4F8FC] p-1.5 rounded-full border border-[#E6ECF5]">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => link.hasMegaMenu && setMegaMenuOpen(true)}
                  onMouseLeave={() => link.hasMegaMenu && setMegaMenuOpen(false)}
                >
                  <Link
                    to={link.path}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-[#23324D] bg-white shadow-2xs border border-[#E6ECF5]'
                        : 'text-[#5F708A] hover:text-[#23324D] hover:bg-white/60'
                    }`}
                  >
                    {link.label}
                    {link.hasMegaMenu && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180 text-[#6EA8FE]' : ''}`} />
                    )}
                  </Link>

                  {/* Products Mega Menu Dropdown */}
                  {link.hasMegaMenu && (
                    <AnimatePresence>
                      {megaMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[640px] bg-white backdrop-blur-2xl border border-[#E6ECF5] rounded-2xl p-4 shadow-xl z-50 grid grid-cols-2 gap-3"
                        >
                          {productCategories.map((cat, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setMegaMenuOpen(false);
                                navigate(`/products?category=${cat.category}`);
                              }}
                              className={`p-3 rounded-xl border border-[#E6ECF5] hover:border-[#CDD8E7] text-left transition-all group/item flex items-start gap-3 cursor-pointer ${cat.bg}`}
                            >
                              <span className="text-2xl p-2 rounded-lg bg-white/90 shadow-2xs">
                                {cat.icon}
                              </span>
                              <div>
                                <div className="text-xs font-bold text-[#23324D] group-hover/item:text-[#6EA8FE] transition-colors flex items-center gap-1 font-display">
                                  {cat.name}
                                </div>
                                <div className="text-[11px] text-[#5F708A] line-clamp-1 mt-0.5 font-light">
                                  {cat.desc}
                                </div>
                              </div>
                            </button>
                          ))}

                          <div className="col-span-2 mt-1 pt-3 border-t border-[#E6ECF5] flex items-center justify-between text-xs text-[#5F708A] px-2">
                            <span className="flex items-center gap-1.5 text-[#23324D] font-medium">
                              <Award className="w-4 h-4 text-[#6EA8FE]" /> ICAR, CSIR & Government Approved
                            </span>
                            <button
                              onClick={() => {
                                setMegaMenuOpen(false);
                                navigate('/products');
                              }}
                              className="text-[#6EA8FE] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              View Full Catalogue →
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/products')}
              className="p-2.5 rounded-full bg-white border border-[#E6ECF5] text-[#5F708A] hover:text-[#23324D] hover:border-[#CDD8E7] transition-all cursor-pointer shadow-2xs"
              title="Search Catalogue"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenQuote}
              className="relative px-3.5 py-2 rounded-full bg-white border border-[#E6ECF5] text-[#23324D] hover:border-[#CDD8E7] transition-all flex items-center gap-2 cursor-pointer shadow-2xs group"
            >
              <ShoppingBag className="w-4 h-4 text-[#6EA8FE] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline">Quote Basket</span>
              {quoteCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#6EA8FE] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {quoteCount}
                </span>
              )}
            </button>

            {/* Contact Button */}
            <button
              onClick={() => navigate('/contact')}
              className={`hidden sm:flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                location.pathname === '/contact'
                  ? 'bg-[#23324D] text-white'
                  : 'bg-[#6EA8FE] hover:bg-[#5B95F5] text-white hover:scale-105 active:scale-95'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white border border-[#E6ECF5] text-[#23324D]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-[#E6ECF5] px-4 pt-4 pb-6 mt-3 space-y-3 shadow-md"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                  location.pathname === link.path ? 'bg-[#DCEEFF] text-[#23324D]' : 'text-[#5F708A] hover:bg-[#F4F8FC]'
                }`}
              >
                <span>{link.label}</span>
                {link.hasMegaMenu && <Sparkles className="w-4 h-4 text-[#6EA8FE]" />}
              </Link>
            ))}

            <div className="pt-2 border-t border-[#E6ECF5] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/products');
                }}
                className="w-full py-3 rounded-xl bg-[#F4F8FC] border border-[#E6ECF5] text-[#23324D] font-bold text-xs text-center"
              >
                Search Verified Products
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/contact');
                }}
                className="w-full py-3 rounded-xl bg-[#6EA8FE] text-white font-bold text-xs text-center shadow-xs"
              >
                Contact
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
