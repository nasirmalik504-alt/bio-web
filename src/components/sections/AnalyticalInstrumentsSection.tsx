import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Gauge, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  Award, 
  Plus, 
  Check, 
  Eye
} from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';
import { Product } from '../../types';
import { INSTRUMENTS_PRODUCTS_DATA } from '../../data/productsData';
import { ProductDetailModal } from '../products/ProductDetailModal';

export const AnalyticalInstrumentsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { addItem, hasItem } = useQuoteStore();

  const subcategories = useMemo(() => {
    const subs = new Set<string>();
    INSTRUMENTS_PRODUCTS_DATA.forEach((p) => {
      if (p.subcategory) subs.add(p.subcategory);
    });
    return ['all', ...Array.from(subs)];
  }, []);

  const filteredInstruments = useMemo(() => {
    return INSTRUMENTS_PRODUCTS_DATA.filter((inst) => {
      const matchSub = selectedSubcategory === 'all' || inst.subcategory === selectedSubcategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || (
        inst.name.toLowerCase().includes(q) ||
        inst.manufacturerCatNo.toLowerCase().includes(q) ||
        (inst.subcategory || '').toLowerCase().includes(q) ||
        (inst.description || '').toLowerCase().includes(q)
      );
      return matchSub && matchQuery;
    });
  }, [selectedSubcategory, searchQuery]);

  return (
    <div className="space-y-8 text-[#5F708A]">
      
      {/* Top Controls Bar: Search & Subcategory Pills */}
      <div className="bg-white p-6 rounded-3xl border border-[#E6ECF5] shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#23324D] font-display flex items-center gap-2">
              <Gauge className="w-5 h-5 text-[#6EA8FE]" />
              <span>Laboratory Instruments Catalogue ({INSTRUMENTS_PRODUCTS_DATA.length} Models)</span>
            </h3>
            <p className="text-xs text-[#5F708A] mt-1 font-light">
              Supplied by <strong>Biobusiness Development Agency</strong> from reputed ISO/CE certified international and domestic manufacturers.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA7BC]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model (e.g. LMFD1060C, AAS4M, APT2000T)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-[#23324D] placeholder-[#9AA7BC] text-xs focus:outline-none focus:border-[#6EA8FE] focus:ring-2 focus:ring-[#6EA8FE]/10"
            />
          </div>
        </div>

        {/* Subcategory Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubcategory === sub
                  ? 'bg-[#23324D] text-white shadow-2xs'
                  : 'bg-[#FAFBFD] text-[#5F708A] hover:bg-[#F4F8FC] border border-[#E6ECF5]'
              }`}
            >
              {sub === 'all' ? '🌐 All Instruments' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Specification Cards Grid (WITHOUT Image Blocks) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstruments.map((inst) => {
          const isAdded = hasItem(inst.id);
          return (
            <motion.div
              key={inst.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-[#E6ECF5] p-6 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between group hover:border-[#6EA8FE]"
            >
              <div className="space-y-3">
                
                {/* Header Badge */}
                <div className="flex items-center justify-end text-[11px] font-mono">
                  <span className="text-[#7CC9A5] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ISO/CE Certified
                  </span>
                </div>

                {/* Instrument Name */}
                <h4 
                  onClick={() => setSelectedProduct(inst)}
                  className="text-lg font-extrabold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors cursor-pointer"
                >
                  {inst.name}
                </h4>

                <p className="text-xs text-[#5F708A] font-light line-clamp-2 leading-relaxed">
                  {inst.description}
                </p>

                {/* Manufacturer & Supply Specs Box */}
                <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] space-y-2 text-xs font-sans">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#9AA7BC] font-medium">Manufacturer:</span>
                    <span className="font-bold text-[#23324D] flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#6EA8FE]" />
                      Reputed ISO/CE Manufacturers
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#9AA7BC] font-medium">Supplier & Service:</span>
                    <span className="font-bold text-[#6EA8FE] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#7CC9A5]" />
                      Biobusiness Development Agency
                    </span>
                  </div>
                  {inst.subcategory && (
                    <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#E6ECF5]">
                      <span className="text-[#9AA7BC] font-medium">Category:</span>
                      <span className="font-mono text-[#5F708A] font-semibold">{inst.subcategory}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2 border-t border-[#E6ECF5]">
                <button
                  onClick={() => addItem(inst)}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                    isAdded
                      ? 'bg-[#EAF7F2] border border-[#7CC9A5] text-[#23324D]'
                      : 'bg-[#6EA8FE] hover:bg-[#5B95F5] text-white shadow-2xs'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-[#7CC9A5]" /> Added to Quote
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Add to Quote Basket
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedProduct(inst)}
                  className="p-3 rounded-xl bg-[#F4F8FC] hover:bg-[#E6ECF5] border border-[#E6ECF5] text-[#23324D] transition-all cursor-pointer shadow-2xs"
                  title="View Specification Details"
                >
                  <Eye className="w-4 h-4 text-[#6EA8FE]" />
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          allProducts={INSTRUMENTS_PRODUCTS_DATA}
          onSelectProduct={(p: Product) => setSelectedProduct(p)}
        />
      )}

    </div>
  );
};
