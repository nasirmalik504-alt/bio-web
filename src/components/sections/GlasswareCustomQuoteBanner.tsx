import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Send } from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';
import { Product } from '../../types';

export const GlasswareCustomQuoteBanner: React.FC = () => {
  const { addItemAndOpenDrawer } = useQuoteStore();

  const [customInquiryText, setCustomInquiryText] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleCustomInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInquiryText.trim()) return;

    const queryText = customInquiryText.trim();
    const customProd: Product = {
      id: `glassware-custom-query-${Date.now()}`,
      name: `Glassware Special Request: ${queryText}`,
      model: 'Custom Glassware Inquiry',
      category: 'Laboratory Glassware',
      subcategory: 'Custom Glassware Query',
      sku: 'GLASSWARE-CUSTOM-QUERY',
      internalSKU: 'GLASSWARE-CUSTOM-QUERY',
      manufacturerCatNo: 'GW-SPECIAL-QUERY',
      brand: 'BioBrand',
      manufacturer: 'BioBrand',
      supplier: 'Biobusiness Scientific',
      description: `Specific laboratory glassware query request: ${queryText}`,
      features: [
        'BioBrand Laboratory Glassware Specific Item Request',
        'Borosilicate 3.3 Custom Dimensions / Joint Fitting',
        'Institutional BOQ & Bulk Pricing Inquiry',
      ],
      applications: ['Laboratory Research Glassware'],
      material: 'Borosilicate Glass 3.3',
      autoclavable: true,
      image: '/images/products/glassware/beaker-low-form.webp',
      gallery: ['/images/products/glassware/beaker-low-form.webp'],
      slug: `product/glassware-custom-query-${Date.now()}`,
      variants: [{ manufacturerCatNo: 'GW-SPECIAL-QUERY', capacity: 'As Requested', pack: 'As Specified' }],
    };

    addItemAndOpenDrawer(customProd, 1);

    setInquirySubmitted(true);
    setCustomInquiryText('');
    setTimeout(() => setInquirySubmitted(false), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 border border-emerald-200 shadow-2xs space-y-4 my-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#23324D] font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Looking for a Specific BioBrand Glassware or Custom Borosilicate Item?</span>
          </h3>
          <p className="text-xs text-[#5F708A] mt-1 font-light max-w-3xl leading-relaxed">
            We supply the <strong>ENTIRE BioBrand Glassware portfolio</strong>. If you need a specific catalog number, custom joint size (14/23, 24/29, 29/32), specialized flask, or custom volume, submit your exact code below and our quote engine will process it immediately!
          </p>
        </div>
      </div>

      <form onSubmit={handleCustomInquirySubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customInquiryText}
            onChange={(e) => setCustomInquiryText(e.target.value)}
            placeholder="e.g. BioBrand Code GW-2040, Borosilicate Kjeldahl Flask 500ml, 29/32 Joint..."
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
            <span>Glassware inquiry added to your quote basket!</span>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};
