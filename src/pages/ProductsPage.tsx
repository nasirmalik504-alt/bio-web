import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { PRODUCTS_DATA } from '../data/productsData';
import { CATEGORY_TAXONOMY } from '../data/categoryTaxonomy';
import { Product } from '../types';
import { ProductCardItem } from '../components/products/ProductCardItem';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { QualikemsChemicalsSection } from '../components/sections/QualikemsChemicalsSection';
import { Search, Sparkles, SlidersHorizontal, Layers, ChevronRight } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSubcategory = searchParams.get('subcategory') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    const sub = searchParams.get('subcategory');
    if (cat) setSelectedCategory(cat);
    if (sub) setSelectedSubcategory(sub);
  }, [searchParams]);

  // Find active Level 1 taxonomy object
  const activeTaxonomyCategory = useMemo(() => {
    return CATEGORY_TAXONOMY.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  // Configure Fuse.js Fuzzy Search Engine across fields
  const fuse = useMemo(() => {
    return new Fuse(PRODUCTS_DATA, {
      keys: [
        { name: 'name', weight: 0.35 },
        { name: 'model', weight: 0.2 },
        { name: 'sku', weight: 0.2 },
        { name: 'series', weight: 0.15 },
        { name: 'category', weight: 0.15 },
        { name: 'subcategory', weight: 0.15 },
        { name: 'material', weight: 0.1 },
        { name: 'searchTerms', weight: 0.1 },
        { name: 'features', weight: 0.05 },
        { name: 'applications', weight: 0.05 },
        { name: 'description', weight: 0.05 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 1,
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS_DATA;

    // Apply Level 1 Main Category Filter
    if (selectedCategory !== 'all') {
      const matchCat = selectedCategory.toLowerCase().replace(/-/g, ' ');
      result = result.filter((p) => {
        const cat = (p.category || '').toLowerCase().replace(/-/g, ' ');
        const sub = (p.subcategory || '').toLowerCase().replace(/-/g, ' ');
        return cat.includes(matchCat) || matchCat.includes(cat) || sub.includes(matchCat);
      });
    }

    // Apply Level 2 Subcategory Filter
    if (selectedSubcategory !== 'all' && !selectedSubcategory.startsWith('all-')) {
      const matchSub = selectedSubcategory.toLowerCase().replace(/-/g, ' ');
      result = result.filter((p) => {
        const sub = (p.subcategory || '').toLowerCase().replace(/-/g, ' ');
        return sub.includes(matchSub) || matchSub.includes(sub);
      });
    }

    // Apply Fuse.js Search
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery.trim());
      const searchMatchedIds = new Set(searchResults.map((r) => r.item.id));
      result = result.filter((p) => searchMatchedIds.has(p.id));
    }

    return result;
  }, [searchQuery, selectedCategory, selectedSubcategory, fuse]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory('all');
    if (catId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
  };

  const handleSubcategoryChange = (subId: string) => {
    setSelectedSubcategory(subId);
    if (subId.startsWith('all-')) {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({ category: selectedCategory, subcategory: subId });
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#FAFBFD] min-h-screen relative overflow-hidden text-[#5F708A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6ECF5] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              Scientific Product Catalogue Engine ({PRODUCTS_DATA.length} Items)
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#23324D] tracking-tight font-display">
            EXPLORE OUR <span className="text-[#6EA8FE]">CERTIFIED CATALOGUE</span>
          </h1>

          <p className="text-[#5F708A] text-base font-light leading-relaxed">
            Multi-level scientific navigation across Liquid Handling, Filtration, Glassware, Plasticware, Chemicals, Analytical Instruments, and Safety Essentials.
          </p>
        </div>

        {/* 2-Level Category Control Container */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6ECF5] space-y-5 shadow-2xs">
          
          {/* Search Input Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9AA7BC]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, Cat No, product name (RAMBO, SF-NY, 0.22um, 25mm), material, or application..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] text-[#23324D] placeholder-[#9AA7BC] focus:outline-none focus:border-[#6EA8FE] focus:ring-2 focus:ring-[#6EA8FE]/10 text-sm font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#E6ECF5] text-[#23324D] hover:bg-[#CDD8E7] text-xs font-mono font-bold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Main Category Chips */}
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9AA7BC] mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#6EA8FE]" />
              <span>Product Categories</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCategory === 'all'
                    ? 'bg-[#6EA8FE] text-white shadow-2xs'
                    : 'bg-[#FAFBFD] text-[#5F708A] hover:bg-[#F4F8FC] border border-[#E6ECF5]'
                }`}
              >
                <span>🌐 All Products</span>
              </button>
              {CATEGORY_TAXONOMY.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'bg-[#23324D] text-white shadow-2xs'
                      : 'bg-[#FAFBFD] text-[#5F708A] hover:bg-[#F4F8FC] border border-[#E6ECF5]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Animated Subcategory Bar */}
          <AnimatePresence mode="wait">
            {activeTaxonomyCategory && (
              <motion.div
                key={activeTaxonomyCategory.id}
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="pt-3 border-t border-[#E6ECF5] space-y-2 overflow-hidden"
              >
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6EA8FE] flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>{activeTaxonomyCategory.label} Subcategories</span>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {activeTaxonomyCategory.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubcategoryChange(sub.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedSubcategory === sub.id
                          ? 'bg-[#6EA8FE] text-white shadow-2xs'
                          : 'bg-[#F4F8FC] text-[#5F708A] hover:text-[#23324D] hover:bg-[#E6ECF5] border border-[#E6ECF5]'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs text-[#5F708A] px-2 font-mono">
          <span>
            Showing <strong className="text-[#23324D] font-bold">{filteredProducts.length}</strong> of {PRODUCTS_DATA.length} products
          </span>
          {searchQuery && (
            <span className="text-[#6EA8FE] font-bold">
              Results for "{searchQuery}"
            </span>
          )}
        </div>

        {/* Product Cards Grid OR Qualikems Chemicals Dedicated Section */}
        {selectedCategory === 'chemicals' ? (
          <QualikemsChemicalsSection />
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white border border-[#E6ECF5] rounded-3xl p-8 shadow-2xs">
            <SlidersHorizontal className="w-12 h-12 text-[#9AA7BC] mx-auto" />
            <h3 className="text-xl font-bold text-[#23324D]">No products found in this category</h3>
            <p className="text-xs text-[#5F708A] max-w-md mx-auto font-light">
              Try resetting subcategory filters or searching by SKU, model, or material keyword.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSubcategory('all');
                setSearchParams({});
              }}
              className="px-6 py-2.5 rounded-xl bg-[#6EA8FE] text-white text-xs font-bold cursor-pointer hover:bg-[#5B95F5] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCardItem
                key={product.id}
                product={product}
                onViewDetails={(p: Product) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          allProducts={PRODUCTS_DATA}
          onSelectProduct={(p: Product) => setSelectedProduct(p)}
        />
      )}

    </div>
  );
};
