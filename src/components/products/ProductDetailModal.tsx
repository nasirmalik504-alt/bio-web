import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { useQuoteStore } from '../../store/useQuoteStore';
import { X, ShieldCheck, Download, Plus, Check, Sparkles, CheckCircle2, ArrowRight, Layers, FileText, Award, FlaskConical } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  allProducts,
  onSelectProduct,
}) => {
  const { addItem, hasItem } = useQuoteStore();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'product' | 'technical' | 'manufacturer'>('product');

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setActiveTab('product');
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const isAdded = hasItem(product.id);
  const manufacturerName = product.manufacturer || product.brand || 'Microlit';
  const catNo = product.manufacturerCatNo || product.catNo || product.sku;
  const internalSKU = product.internalSKU || product.sku;
  const manufacturerWebsite = product.manufacturerWebsite || 'https://www.microlit.com';

  const brandProducts = allProducts.filter(
    (p) => (p.manufacturer || p.brand || '').toLowerCase() === manufacturerName.toLowerCase() && p.id !== product.id
  );

  const displayImage = selectedImage || product.image;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#23324D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-white border border-[#E6ECF5] rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 border border-[#E6ECF5] text-[#23324D] hover:bg-[#F4F8FC] cursor-pointer shadow-2xs transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Authorized Distribution / In-House Banner */}
          <div className="bg-[#FAFBFD] px-6 py-3 border-b border-[#E6ECF5] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#23324D]">
              <ShieldCheck className="w-4 h-4 text-[#7CC9A5]" />
              <span>
                {manufacturerName.toLowerCase() === 'biobrand' || !product.authorizedDistributor
                  ? 'IN-HOUSE SCIENTIFIC BRAND:'
                  : 'OFFICIAL AUTHORIZED DISTRIBUTOR:'}
              </span>
              <span className="text-[#6EA8FE] font-extrabold uppercase">{manufacturerName}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-[#5F708A]">
              <span className="flex items-center gap-1 text-[#7CC9A5] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Genuine Product
              </span>
              <span>•</span>
              <span>
                {manufacturerName.toLowerCase() === 'biobrand' || !product.authorizedDistributor
                  ? 'Biobusiness In-House Product'
                  : 'Supplied by Biobusiness Development Agency'}
              </span>
            </div>
          </div>

          {/* Tab Navigation Strip */}
          <div className="px-6 pt-4 border-b border-[#E6ECF5] bg-white flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('product')}
              className={`px-5 py-3 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'product'
                  ? 'bg-[#FAFBFD] border-t-2 border-[#6EA8FE] text-[#23324D]'
                  : 'text-[#5F708A] hover:text-[#23324D]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#6EA8FE]" /> Product Overview
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`px-5 py-3 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'technical'
                  ? 'bg-[#FAFBFD] border-t-2 border-[#6EA8FE] text-[#23324D]'
                  : 'text-[#5F708A] hover:text-[#23324D]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#6EA8FE]" /> Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('manufacturer')}
              className={`px-5 py-3 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'manufacturer'
                  ? 'bg-[#FAFBFD] border-t-2 border-[#6EA8FE] text-[#23324D]'
                  : 'text-[#5F708A] hover:text-[#23324D]'
              }`}
            >
              <Award className="w-4 h-4 text-[#6EA8FE]" /> Manufacturer & Distribution
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            
            {/* TAB 1: PRODUCT OVERVIEW */}
            {activeTab === 'product' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="relative w-full h-72 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] flex items-center justify-center p-4">
                    {displayImage && !displayImage.includes('no-image') ? (
                      <img
                        src={displayImage.includes('?') ? displayImage : `${displayImage}?v=20260808_v3`}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-[#F4F8FC] border border-[#E6ECF5] flex items-center justify-center text-[#6EA8FE]">
                          <FlaskConical className="w-8 h-8 text-[#6EA8FE]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#23324D] font-display">Official Image Pending Verification</p>
                          <p className="text-[11px] font-mono text-[#9AA7BC] mt-0.5">Product specifications & variants listed below</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {product.gallery && product.gallery.filter(Boolean).length > 1 && (
                    <div className="flex gap-2">
                      {product.gallery.filter(Boolean).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(img)}
                          className={`w-16 h-16 rounded-xl border p-1 bg-[#FAFBFD] cursor-pointer ${
                            selectedImage === img ? 'border-[#6EA8FE] ring-2 ring-[#6EA8FE]/20' : 'border-[#E6ECF5]'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Meta & Action */}
                <div className="space-y-5">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase">
                      {manufacturerName} • {product.subcategory}
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#23324D] font-display mt-1">
                      {product.name}
                    </h2>
                  </div>

                  {/* Identification Numbers Box */}
                  <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] grid grid-cols-2 gap-4 font-mono text-xs">
                    {catNo ? (
                      <div>
                        <span className="text-[#9AA7BC] text-[11px] block uppercase font-bold">Manufacturer Cat No.</span>
                        <strong className="text-[#23324D] text-sm">{catNo}</strong>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[#9AA7BC] text-[11px] block uppercase font-bold">Category</span>
                        <strong className="text-[#23324D] text-sm">{product.category}</strong>
                      </div>
                    )}
                    <div>
                      <span className="text-[#9AA7BC] text-[11px] block uppercase font-bold">Internal Reference</span>
                      <span className="text-[#5F708A] font-bold">{internalSKU}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#5F708A] font-light leading-relaxed">
                    {product.description}
                  </p>

                  {/* Available Models & Capacity Sizes Table */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-[#23324D] uppercase">
                        <span>Available Volume Sizes & Cat Nos ({product.variants.length} Sizes):</span>
                      </div>
                      <div className="border border-[#E6ECF5] rounded-2xl overflow-hidden overflow-x-auto max-h-48 overflow-y-auto text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead className="sticky top-0 bg-[#23324D] text-white font-mono uppercase text-[11px]">
                            <tr>
                              <th className="p-2.5">Cat No.</th>
                              <th className="p-2.5">Volume / Size</th>
                              <th className="p-2.5">Pack</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E6ECF5]">
                            {product.variants.map((v, idx) => (
                              <tr key={idx} className="hover:bg-[#F4F8FC]">
                                <td className="p-2.5 font-mono font-bold text-[#6EA8FE]">{v.manufacturerCatNo}</td>
                                <td className="p-2.5 text-[#23324D] font-medium">{v.volume || v.diameter || '-'}</td>
                                <td className="p-2.5 text-[#5F708A]">{v.pack || '1 Pc'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 space-y-3">
                    <button
                      onClick={() => addItem(product)}
                      className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                        isAdded
                          ? 'bg-[#EAF7F2] border border-[#7CC9A5] text-[#23324D]'
                          : 'bg-[#6EA8FE] hover:bg-[#5B95F5] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-5 h-5 text-[#7CC9A5]" /> Added to Instant Quote
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" /> Add to Quote List
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TECHNICAL SPECIFICATIONS & VARIANTS */}
            {activeTab === 'technical' && (
              <div className="space-y-6">
                {/* Key Features */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-[#23324D] uppercase font-mono mb-3">Key Performance Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.features.map((feat, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs text-[#23324D] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#7CC9A5] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Specifications Map */}
                {product.technicalSpecifications && (
                  <div>
                    <h3 className="text-sm font-bold text-[#23324D] uppercase font-mono mb-3">Technical Specifications Table</h3>
                    <div className="border border-[#E6ECF5] rounded-2xl overflow-hidden text-xs">
                      {Object.entries(product.technicalSpecifications).map(([k, v], idx) => (
                        <div key={k} className={`flex p-3 ${idx % 2 === 0 ? 'bg-[#FAFBFD]' : 'bg-white'}`}>
                          <span className="w-1/3 font-bold text-[#23324D]">{k}</span>
                          <span className="w-2/3 text-[#5F708A]">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variant Matrix Table */}
                {product.variants && product.variants.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-[#23324D] uppercase font-mono mb-3">Manufacturer Product Variants</h3>
                    <div className="border border-[#E6ECF5] rounded-2xl overflow-hidden overflow-x-auto text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#23324D] text-white font-mono uppercase">
                            <th className="p-3">Manufacturer Cat No.</th>
                            {product.variants[0].diameter && <th className="p-3">Diameter</th>}
                            {product.variants[0].micron && <th className="p-3">Pore Size</th>}
                            {product.variants[0].volume && <th className="p-3">Volume</th>}
                            {product.variants[0].pack && <th className="p-3">Pack Size</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6ECF5]">
                          {product.variants.map((v, idx) => (
                            <tr key={idx} className="hover:bg-[#F4F8FC]">
                              <td className="p-3 font-mono font-bold text-[#6EA8FE]">{v.manufacturerCatNo}</td>
                              {v.diameter && <td className="p-3 text-[#23324D]">{v.diameter}</td>}
                              {v.micron && <td className="p-3 text-[#23324D]">{v.micron}</td>}
                              {v.volume && <td className="p-3 text-[#23324D]">{v.volume}</td>}
                              {v.pack && <td className="p-3 text-[#5F708A]">{v.pack}</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MANUFACTURER & BRAND DETAILS */}
            {activeTab === 'manufacturer' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-[#FAFBFD] border border-[#E6ECF5] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-[#23324D] font-display">{manufacturerName}</h3>
                      <p className="text-xs text-[#6EA8FE] font-mono font-bold mt-0.5">
                        {manufacturerName.toLowerCase() === 'biobrand' || !product.authorizedDistributor
                          ? 'Biobusiness In-House Brand • Direct Factory Guarantee'
                          : 'Authorized Distributor • Supplied by Biobusiness Development Agency'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#5F708A] leading-relaxed font-light">
                    {manufacturerName.toLowerCase() === 'biobrand' || !product.authorizedDistributor
                      ? "BioBrand is Biobusiness Development Agency's in-house scientific product line, manufactured and tested to strict laboratory quality standards for educational, clinical, and research applications."
                      : `Biobusiness Development Agency is an authorized supplier for ${manufacturerName}. All products supplied carry genuine manufacturer serial numbers, original catalogue reference codes, and direct factory warranty guarantees.`}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-white border border-[#E6ECF5] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#7CC9A5]" />
                      <span>
                        {manufacturerName.toLowerCase() === 'biobrand' || !product.authorizedDistributor
                          ? 'In-House Quality Assurance'
                          : 'Genuine Factory Product'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#E6ECF5] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#7CC9A5]" />
                      <span>
                        {manufacturerName.toLowerCase() === 'biobrand' || !product.authorizedDistributor
                          ? 'Factory Direct Supply'
                          : 'Original Warranty'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#E6ECF5] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#7CC9A5]" />
                      <span>GeM Procurement Ready</span>
                    </div>
                  </div>
                </div>

                {/* Other Products from this Manufacturer */}
                {brandProducts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono font-bold text-[#23324D] uppercase mb-3">
                      More Products from {manufacturerName}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {brandProducts.slice(0, 4).map((bp) => (
                        <div
                          key={bp.id}
                          onClick={() => onSelectProduct(bp)}
                          className="p-3 rounded-2xl bg-white border border-[#E6ECF5] hover:border-[#6EA8FE] cursor-pointer flex items-center gap-3 transition-all"
                        >
                          <img src={bp.image} alt="" className="w-12 h-12 object-contain" />
                          <div>
                            <div className="text-xs font-bold text-[#23324D] line-clamp-1">{bp.name}</div>
                            <div className="text-[10px] font-mono text-[#6EA8FE]">Cat No. {bp.manufacturerCatNo || bp.catNo}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
