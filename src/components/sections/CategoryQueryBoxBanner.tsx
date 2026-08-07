import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Send } from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';
import { Product } from '../../types';

interface CategoryQueryBoxBannerProps {
  selectedCategory: string;
}

export const CategoryQueryBoxBanner: React.FC<CategoryQueryBoxBannerProps> = ({ selectedCategory }) => {
  const { addItemAndOpenDrawer } = useQuoteStore();

  const [customInquiryText, setCustomInquiryText] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const categoryConfig = useMemo(() => {
    switch (selectedCategory) {
      case 'liquid-handling':
        return {
          title: 'Looking for a Specific Microlit Liquid Handling Item or Accessories?',
          subtext:
            'We supply the ENTIRE Microlit product portfolio. If you need a specific Cat No, volume range, multichannel pipette, or bottle-top dispenser accessory, submit your code below!',
          placeholder: 'e.g. Microlit Cat No RBO-1000, Electronic Pipette E-MC-8-300, Dispenser Adaptor...',
          categoryName: 'Liquid Handling',
          supplier: 'Biobusiness Development Agency',
          brand: 'Microlit',
        };
      case 'filtration':
        return {
          title: 'Looking for a Specific Membrane Filter, Syringe Filter, or Filtration Assembly?',
          subtext:
            'We supply the ENTIRE Filtration portfolio. If you need a specific pore size (0.22µm / 0.45µm), membrane material (NY, PTFE, PVDF, PES), diameter (13mm / 25mm / 47mm), or glass filter holder, submit your code below!',
          placeholder: 'e.g. RAMBO Code SF-NY-25-0.22, PTFE Membrane 47mm, Glass Filter Holder...',
          categoryName: 'Filtration Products',
          supplier: 'Biobusiness Scientific',
          brand: 'RAMBO Filtration',
        };
      case 'glassware':
        return {
          title: 'Looking for a Specific BioBrand Glassware or Custom Borosilicate Item?',
          subtext:
            'We supply the ENTIRE BioBrand Glassware portfolio. If you need a specific catalog number, custom joint size (14/23, 24/29, 29/32), specialized flask, or custom volume, submit your exact code below!',
          placeholder: 'e.g. BioBrand Code GW-2040, Borosilicate Kjeldahl Flask 500ml, 29/32 Joint...',
          categoryName: 'Laboratory Glassware',
          supplier: 'Biobusiness Scientific',
          brand: 'BioBrand',
        };
      case 'plasticware':
        return {
          title: 'Looking for a Specific BioBrand Plasticware or Bulk Polymer Item?',
          subtext:
            'We supply the ENTIRE BioBrand Plasticware portfolio. If you need a specific catalog number, custom tip size, specialized cryo container, or custom mold volume, submit your exact code below!',
          placeholder: 'e.g. BioBrand Code PW-1080, Cryo Storage Box 100-well, Autoclavable...',
          categoryName: 'Laboratory Plasticware',
          supplier: 'Biobusiness Scientific',
          brand: 'BioBrand',
        };
      case 'chemicals':
        return {
          title: 'Looking for a Specific Qualikems Chemical or Bulk Drums?',
          subtext:
            'We supply the ENTIRE Qualikems product portfolio. If you need a specific CAS number, custom volume (25L / 200L barrels), or custom purity grade, submit your code below!',
          placeholder: 'e.g. Qualikems Code Q-8040, Sodium Azide 99% AR, 25 L Drum...',
          categoryName: 'Chemicals & Reagents',
          supplier: 'Biobusiness Development Agency',
          brand: 'Qualikems Fine Chemicals',
        };
      case 'instruments':
        return {
          title: 'Looking for a Specific Analytical Instrument or Sensor Probe?',
          subtext:
            'We supply the ENTIRE Laboratory Instruments portfolio. If you need a specific spectrophotometer model, digital pH meter electrode, centrifuge rotor, or analytical balance, submit your code below!',
          placeholder: 'e.g. UV-Vis Spectrophotometer Model UV-1800, Digital pH Electrode...',
          categoryName: 'Analytical Instruments',
          supplier: 'Biobusiness Scientific',
          brand: 'BioBrand',
        };
      case 'safety':
        return {
          title: 'Looking for a Specific Safety Item or Bulk PPE Equipment?',
          subtext:
            'We supply the ENTIRE BioBrand & OEM Safety portfolio. If you need a specific nitrile glove thickness, respirator rating, chemical splash suit, or cleanroom garment grade, submit your code below!',
          placeholder: 'e.g. BioBrand Safety Code SF-4020, Heavy-Duty Nitrile Gloves XL, EN 374 Certified...',
          categoryName: 'Safety Products & PPE',
          supplier: 'Biobusiness Scientific',
          brand: 'BioBrand',
        };
      default:
        return {
          title: 'Looking for Any Specific Scientific Product, Instrument, or Chemical Code?',
          subtext:
            'We supply the ENTIRE scientific portfolio across Liquid Handling, Filtration, Glassware, Plasticware, Chemicals, Instruments, and Safety. Submit your item code or description below!',
          placeholder: 'e.g. Microlit Pipette RBO-1000, Qualikems Code Q-8040, Borosilicate Flask 500ml...',
          categoryName: 'Scientific Products',
          supplier: 'Biobusiness Scientific',
          brand: 'Biobusiness',
        };
    }
  }, [selectedCategory]);

  const handleCustomInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInquiryText.trim()) return;

    const queryText = customInquiryText.trim();
    const customProd: Product = {
      id: `custom-query-${selectedCategory}-${Date.now()}`,
      name: `${categoryConfig.categoryName} Special Request: ${queryText}`,
      model: 'Special Product Query',
      category: categoryConfig.categoryName,
      subcategory: 'Custom Special Inquiry',
      sku: 'SPECIAL-QUERY-ITEM',
      internalSKU: 'SPECIAL-QUERY-ITEM',
      manufacturerCatNo: 'SPECIAL-QUERY',
      brand: categoryConfig.brand,
      manufacturer: categoryConfig.brand,
      supplier: categoryConfig.supplier,
      description: `Specific inquiry request for ${categoryConfig.categoryName}: ${queryText}`,
      features: [
        'Direct Portfolio Item Request',
        'Custom Specification / Dimensions / Volume Inquiry',
        'Institutional Rates & Fast Fulfillment',
      ],
      applications: ['Scientific Research & Laboratory Supply'],
      image: '/images/products/glassware/beaker-low-form.webp',
      gallery: ['/images/products/glassware/beaker-low-form.webp'],
      slug: `product/special-query-${Date.now()}`,
      variants: [{ manufacturerCatNo: 'SPECIAL-QUERY', capacity: 'As Requested', pack: 'As Specified' }],
    };

    addItemAndOpenDrawer(customProd, 1);

    setInquirySubmitted(true);
    setCustomInquiryText('');
    setTimeout(() => setInquirySubmitted(false), 4000);
  };

  return (
    <motion.div
      key={selectedCategory}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 border border-emerald-200/90 shadow-2xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#23324D] font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{categoryConfig.title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#5F708A] mt-1 font-light max-w-3xl leading-relaxed">
            {categoryConfig.subtext}
          </p>
        </div>
      </div>

      <form onSubmit={handleCustomInquirySubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customInquiryText}
            onChange={(e) => setCustomInquiryText(e.target.value)}
            placeholder={categoryConfig.placeholder}
            className="flex-1 px-4 py-3.5 rounded-2xl bg-white border border-emerald-300 text-[#23324D] placeholder-[#9AA7BC] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Add Special Inquiry to Basket</span>
          </button>
        </div>

        {inquirySubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Inquiry added to your quote basket!</span>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};
