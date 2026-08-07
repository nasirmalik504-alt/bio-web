import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useQuoteStore } from '../../store/useQuoteStore';
import { Plus, Check, Eye, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

interface ProductCardItemProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCardItem: React.FC<ProductCardItemProps> = ({
  product,
  onViewDetails,
}) => {
  const { addItem, hasItem } = useQuoteStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isAdded = hasItem(product.id);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onViewDetails(product);
    }
  };

  const isInstrument =
    product.category === 'Laboratory Instruments' ||
    product.category === 'Analytical Instruments' ||
    (product.image && product.image.includes('no-image'));

  const manufacturerName = product.manufacturer || product.brand || 'BioBrand';
  const catNo = isInstrument ? '' : (product.manufacturerCatNo || product.catNo || product.sku);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="p-6 rounded-3xl bg-white border border-[#E6ECF5] hover:border-[#6EA8FE] shadow-2xs hover:shadow-md flex flex-col justify-between space-y-4 group transition-all focus:outline-none focus:ring-2 focus:ring-[#6EA8FE]"
    >
      {/* If NOT an instrument and HAS real image, render Product Image Box */}
      {!isInstrument ? (
        <div
          onClick={() => onViewDetails(product)}
          className="relative w-full h-48 rounded-2xl overflow-hidden bg-[#FAFBFD] border border-[#E6ECF5] cursor-pointer flex items-center justify-center p-3"
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#E6ECF5]/60 animate-pulse rounded-2xl" />
          )}
          <img
            src={product.image.includes('?') ? product.image : `${product.image}?v=20260808_v3`}
            alt={`${product.name} ${catNo ? 'Cat No ' + catNo : ''} by ${manufacturerName}`}
            loading="lazy"
            width={300}
            height={300}
            onLoad={() => setImageLoaded(true)}
            className={`max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[#23324D] border border-[#E6ECF5] text-[10px] font-mono font-bold shadow-2xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#7CC9A5]" />
              {manufacturerName}
            </span>
          </div>

          {/* Hover Quick View Overlay */}
          <div className="absolute inset-0 bg-[#23324D]/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-white/95 text-[#23324D] text-xs font-bold shadow-md flex items-center gap-1.5 font-display">
              <Eye className="w-3.5 h-3.5 text-[#6EA8FE]" /> Quick View
            </span>
          </div>
        </div>
      ) : null}

      {/* Details Area */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between">
          {!isInstrument && catNo ? (
            <span className="text-[10px] uppercase font-mono font-bold text-[#6EA8FE] tracking-wider">
              Cat No. {catNo}
            </span>
          ) : (
            <span className="text-[10px] uppercase font-mono font-bold text-[#6EA8FE] tracking-wider">
              {product.category || 'Laboratory Instrument'}
            </span>
          )}
          <span className="text-[10px] font-mono text-[#7CC9A5] font-bold flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3" /> {isInstrument ? 'ISO/CE Certified' : 'Genuine'}
          </span>
        </div>

        <h3
          onClick={() => onViewDetails(product)}
          className="text-base font-bold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors cursor-pointer line-clamp-1"
        >
          {product.name}
        </h3>

        <p className="text-xs text-[#5F708A] line-clamp-2 font-light leading-relaxed">
          {product.description}
        </p>

        {/* Variants count badge */}
        {product.variants && product.variants.length > 1 && (
          <div className="pt-1">
            <span className="px-2.5 py-1 rounded-md bg-[#DCEEFF] text-[#23324D] text-[10px] font-mono font-bold inline-block">
              {product.variants.length} Available Sizes & Cat Nos
            </span>
          </div>
        )}

        {/* Specifications Box for Instruments */}
        {isInstrument && (
          <div className="p-3 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] space-y-1.5 text-xs font-sans">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#9AA7BC] font-medium">Manufacturer:</span>
              <span className="font-bold text-[#23324D] flex items-center gap-1">
                <Award className="w-3 h-3 text-[#6EA8FE]" />
                Reputed Manufacturers
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#9AA7BC] font-medium">Supplier:</span>
              <span className="font-bold text-[#6EA8FE]">Biobusiness Development Agency</span>
            </div>
          </div>
        )}

        {/* Supplier Footer Badge for Non-Instruments */}
        {!isInstrument && (
          <div className="pt-2 flex items-center gap-1 text-[11px] font-mono text-[#9AA7BC]">
            <span>{product.brand?.toLowerCase() === 'biobrand' || !product.authorizedDistributor ? 'Direct from' : 'Supplied by'}</span>
            <strong className="text-[#23324D] font-bold">Biobusiness Development Agency</strong>
          </div>
        )}
      </div>

      {/* Buttons Strip */}
      <div className="pt-2 flex items-center gap-2 border-t border-[#E6ECF5]">
        <button
          onClick={() => addItem(product)}
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
              <Plus className="w-4 h-4" /> Add to Quote
            </>
          )}
        </button>

        <button
          onClick={() => onViewDetails(product)}
          className="p-3 rounded-xl bg-[#F4F8FC] hover:bg-[#E6ECF5] border border-[#E6ECF5] text-[#23324D] transition-all cursor-pointer shadow-2xs"
          title="View Details"
        >
          <Eye className="w-4 h-4 text-[#6EA8FE]" />
        </button>
      </div>
    </motion.div>
  );
};
