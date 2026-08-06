import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { PRODUCTS_DATA } from '../../data/productsData';
import { Product } from '../../types';
import { useQuoteStore } from '../../store/useQuoteStore';
import { ProductDetailModal } from './ProductDetailModal';
import { Search, X, Plus, Check, Eye } from 'lucide-react';

interface ProductCatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export const ProductCatalogueModal: React.FC<ProductCatalogueModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { addItem, hasItem } = useQuoteStore();

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !selectedProduct) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedProduct, onClose]);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'micropipettes', label: 'Micropipettes' },
    { id: 'electronic-pipettes', label: 'Electronic Pipettes' },
    { id: 'bottle-top-dispensers', label: 'Bottle Top Dispensers' },
    { id: 'electronic-burettes', label: 'Electronic Burettes' },
    { id: 'vacuum-aspirators', label: 'Vacuum Aspirators' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const fuse = useMemo(() => {
    return new Fuse(PRODUCTS_DATA, {
      keys: ['name', 'model', 'sku', 'subcategory', 'series', 'searchTerms', 'volume'],
      threshold: 0.35,
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS_DATA;

    if (selectedCategory !== 'all') {
      const matchCat = selectedCategory.toLowerCase();
      result = result.filter((p) => {
        const sub = (p.subcategory || '').toLowerCase().replace(/\s+/g, '-');
        return sub.includes(matchCat) || matchCat.includes(sub);
      });
    }

    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery.trim());
      const searchMatchedIds = new Set(searchResults.map((r) => r.item.id));
      result = result.filter((p) => searchMatchedIds.has(p.id));
    }

    return result;
  }, [searchQuery, selectedCategory, fuse]);

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#23324D]/80 backdrop-blur-md cursor-pointer z-[99999]"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white border border-[#E6ECF5] rounded-3xl shadow-2xl overflow-hidden z-[100000] my-auto max-h-[85vh] flex flex-col"
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-30 p-6 border-b border-[#E6ECF5] bg-white space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#23324D] font-display">
                  INSTANT CATALOGUE SEARCH
                </h2>
                <p className="text-xs text-[#5F708A] font-light">
                  Search across {PRODUCTS_DATA.length} verified laboratory items
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-[#FAFBFD] hover:bg-[#FCECEF] border border-[#CDD8E7] text-[#23324D] hover:text-[#F28B82] transition-all cursor-pointer shadow-sm flex items-center gap-1.5 text-xs font-extrabold shrink-0"
                title="Close (ESC)"
              >
                <span>Close</span>
                <X className="w-4 h-4 text-[#F28B82]" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA7BC]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model, volume range, SKU, or keyword..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-[#23324D] text-xs focus:outline-none focus:border-[#6EA8FE]"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#6EA8FE] text-white shadow-2xs'
                      : 'bg-white text-[#5F708A] border border-[#E6ECF5] hover:bg-[#F4F8FC]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body with data-lenis-prevent */}
          <div data-lenis-prevent className="p-6 overflow-y-auto space-y-3 flex-1 bg-white">
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#5F708A]">
                No matching products found. Try clearing search query.
              </div>
            ) : (
              filteredProducts.map((p) => {
                const added = hasItem(p.id);
                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-white border border-[#E6ECF5] hover:border-[#CDD8E7] transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-4">
                      <img src={p.image} alt={p.name} className="w-14 h-14 object-contain rounded-xl bg-[#F4F8FC] p-1 border border-[#E6ECF5]" />
                      <div>
                        <div className="text-xs font-mono font-bold text-[#6EA8FE]">{p.sku} | {p.model}</div>
                        <h4 className="text-sm font-bold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors">
                          {p.name}
                        </h4>
                        <div className="text-xs text-[#5F708A] font-light line-clamp-1">{p.description}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="p-2.5 rounded-xl bg-[#F4F8FC] border border-[#E6ECF5] text-[#23324D] hover:bg-[#E6ECF5] text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#6EA8FE]" /> View
                      </button>
                      <button
                        onClick={() => addItem(p)}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          added
                            ? 'bg-[#EAF7F2] border border-[#7CC9A5] text-[#23324D]'
                            : 'bg-[#6EA8FE] text-white hover:bg-[#5B95F5]'
                        }`}
                      >
                        {added ? <Check className="w-3.5 h-3.5 text-[#7CC9A5]" /> : <Plus className="w-3.5 h-3.5" />}
                        {added ? 'Added' : 'Quote'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#E6ECF5] bg-[#FAFBFD] flex items-center justify-between text-xs text-[#5F708A]">
            <span className="font-mono text-[11px]">Showing {filteredProducts.length} Items</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white border border-[#CDD8E7] text-[#23324D] font-bold hover:bg-[#F4F8FC] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>

        {/* Child Modal Popup */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={selectedProduct !== null}
          onClose={() => setSelectedProduct(null)}
          allProducts={PRODUCTS_DATA}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      </div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
