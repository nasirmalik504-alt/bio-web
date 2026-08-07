import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import { PRODUCTS_DATA } from '../data/productsData';
import { CATEGORY_TAXONOMY } from '../data/categoryTaxonomy';
import { Product } from '../types';
import { ProductCardItem } from '../components/products/ProductCardItem';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { QualikemsChemicalsSection } from '../components/sections/QualikemsChemicalsSection';
import { AnalyticalInstrumentsSection } from '../components/sections/AnalyticalInstrumentsSection';
import { CategoryQueryBoxBanner } from '../components/sections/CategoryQueryBoxBanner';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { generateBreadcrumbSchema, generateProductSchema } from '../lib/seo';
import { Search, SlidersHorizontal, Layers } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

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

    // Apply Fuse.js Search
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery.trim());
      const searchMatchedIds = new Set(searchResults.map((r) => r.item.id));
      result = result.filter((p) => searchMatchedIds.has(p.id));
    }

    return result;
  }, [searchQuery, selectedCategory, fuse]);

  const categoryMeta = useMemo(() => {
    switch (selectedCategory) {
      case 'liquid-handling':
        return {
          title: 'Microlit Liquid Handling Systems & Micropipettes',
          description: 'Explore Microlit micropipettes, electronic pipettes, bottle-top dispensers, and digital titrators supplied by Biobusiness.',
        };
      case 'glassware':
        return {
          title: 'Class A Borosilicate 3.3 Laboratory Glassware',
          description: 'Explore ISO certified NABL Class A borosilicate glassware, beakers, volumetric flasks, measuring cylinders, and burettes.',
        };
      case 'plasticware':
        return {
          title: 'Autoclavable Laboratory Plasticware & Consumables',
          description: 'Explore USP Class VI medical grade plasticware, microcentrifuge tubes, cryo vials, petri dishes, and PCR consumables.',
        };
      case 'filtration':
        return {
          title: 'RAMBO Syringe Filters & Membrane Discs',
          description: 'Explore syringe filters, membrane discs, filter paper, and vacuum filtration assemblies for analytical testing.',
        };
      case 'chemicals':
        return {
          title: 'Qualikems Fine Chemicals & HPLC Solvents',
          description: 'Explore AR/LR grade chemicals, HPLC solvents, biological stains, buffers, and culture media supplied by Biobusiness.',
        };
      case 'instruments':
        return {
          title: 'Laboratory Instruments & Measuring Equipment',
          description: 'Explore precision laboratory balances, pH meters, centrifuges, spectrophotometers, and hotplate stirrers.',
        };
      case 'safety':
        return {
          title: 'Safety Products, Cryo PPE & Lab Coats',
          description: 'Explore CE/EN certified nitrile gloves, cryo protection gloves, N95 masks, lab coats, and acid spill response kits.',
        };
      default:
        return {
          title: 'Scientific Product Catalogue | Liquid Handling, Glassware, Plasticware & Reagents',
          description: 'Explore certified scientific products across Liquid Handling, Glassware, Plasticware, Chemicals, Instruments, and Safety.',
        };
    }
  }, [selectedCategory]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
  };

  const breadcrumbSchema = useMemo(() => {
    const items = [{ name: 'Home', url: '/' }, { name: 'Products', url: '/products' }];
    if (selectedCategory !== 'all') {
      items.push({ name: categoryMeta.title, url: `/products?category=${selectedCategory}` });
    }
    return generateBreadcrumbSchema(items);
  }, [selectedCategory, categoryMeta]);

  return (
    <div className="pt-28 pb-20 bg-[#FAFBFD] min-h-screen relative overflow-hidden text-[#5F708A]">
      <SEO
        title={categoryMeta.title}
        description={categoryMeta.description}
        canonicalPath={selectedCategory === 'all' ? '/products' : `/products?category=${selectedCategory}`}
      />
      <StructuredData data={breadcrumbSchema} id="products-breadcrumb-schema" />
      {selectedProduct && (
        <StructuredData data={generateProductSchema(selectedProduct)} id="selected-product-schema" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#23324D] tracking-tight font-display">
            EXPLORE OUR <span className="text-[#6EA8FE]">CERTIFIED CATALOGUE</span>
          </h1>

          <p className="text-[#5F708A] text-base font-light leading-relaxed">
            Multi-level scientific navigation across Liquid Handling, Filtration, Glassware, Plasticware, Chemicals, Laboratory Instruments, and Safety Essentials.
          </p>
        </div>

        {/* Category Search & Filter Container */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6ECF5] space-y-6 shadow-2xs">
          
          {/* Search Input Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9AA7BC]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, Cat No, product name (RAMBO, SF-NY, 0.22um, 25mm), material, or application..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] text-[#23324D] placeholder-[#9AA7BC] focus:outline-none focus:border-[#6EA8FE] focus:ring-2 focus:ring-[#6EA8FE]/10 text-sm font-sans"
              aria-label="Search scientific products"
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

          {/* Category-Specific Product Query Box Banner placed right in place of subcategories */}
          <div className="pt-2">
            <CategoryQueryBoxBanner selectedCategory={selectedCategory} />
          </div>

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

        {/* Product Cards Grid OR Qualikems Chemicals OR Laboratory Instruments Dedicated Section */}
        {selectedCategory === 'chemicals' ? (
          <QualikemsChemicalsSection />
        ) : selectedCategory === 'instruments' ? (
          <AnalyticalInstrumentsSection />
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white border border-[#E6ECF5] rounded-3xl p-8 shadow-2xs">
            <SlidersHorizontal className="w-12 h-12 text-[#9AA7BC] mx-auto" />
            <h3 className="text-xl font-bold text-[#23324D]">No products found in this category</h3>
            <p className="text-xs text-[#5F708A] max-w-md mx-auto font-light">
              Try searching by SKU, model, or material keyword.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
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
