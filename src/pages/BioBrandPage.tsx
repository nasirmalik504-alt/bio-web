import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { generateBreadcrumbSchema } from '../lib/seo';
import {
  Sparkles,
  ShieldCheck,
  Award,
  CheckCircle2,
  Building2,
  GraduationCap,
  Stethoscope,
  Microscope,
  FlaskConical,
  Layers,
  Package,
  Truck,
  HeartHandshake,
  DollarSign,
  PackageCheck,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const BioBrandPage: React.FC = () => {
  const navigate = useNavigate();

  // Curated 6 core categories (Chemicals, Reagents, and Culture Media removed per request)
  const productCategories = [
    { name: 'Laboratory Glassware', desc: 'High-purity borosilicate beakers, flasks, and volumetric glass', icon: <FlaskConical className="w-6 h-6 text-[#6EA8FE]" /> },
    { name: 'Laboratory Plasticware', desc: 'Autoclavable tubes, tips, bottles, and storage containers', icon: <Layers className="w-6 h-6 text-[#7CC9A5]" /> },
    { name: 'Liquid Handling', desc: 'Precision micropipettes, dispensers, and liquid aspirators', icon: <Microscope className="w-6 h-6 text-[#F28B82]" /> },
    { name: 'Scientific Instruments', desc: 'Burettes, stirrers, centrifuges, and benchtop equipment', icon: <Sparkles className="w-6 h-6 text-[#6EA8FE]" /> },
    { name: 'Safety Equipment', desc: 'Nitrile & latex gloves, 3-ply & N95 masks, face shields, lab coats, and safety containment', icon: <ShieldAlert className="w-6 h-6 text-[#7CC9A5]" /> },
    { name: 'General Consumables', desc: 'Filters, indicators, membranes, and routine lab disposables', icon: <Package className="w-6 h-6 text-[#F28B82]" /> },
  ];

  const whyChooseCards = [
    {
      title: 'Quality Assured',
      desc: 'Every product undergoes strict quality verification and batch inspection before institutional delivery.',
      icon: <ShieldCheck className="w-6 h-6 text-[#7CC9A5]" />,
    },
    {
      title: 'Reliable Supply Chain',
      desc: 'Consistent stock availability with fast dispatch to government, university, and industrial research labs.',
      icon: <Truck className="w-6 h-6 text-[#6EA8FE]" />,
    },
    {
      title: 'Competitive Pricing',
      desc: 'Direct factory pricing without intermediary markups, optimized for bulk procurement and rate contracts.',
      icon: <DollarSign className="w-6 h-6 text-[#F28B82]" />,
    },
    {
      title: 'Customer-Centric Support',
      desc: 'Dedicated technical team assisting with product selection, COA requests, and customized specifications.',
      icon: <HeartHandshake className="w-6 h-6 text-[#6EA8FE]" />,
    },
  ];

  const trustedSectors = [
    { name: 'Government Research Institutes', icon: <Building2 className="w-5 h-5 text-[#6EA8FE]" /> },
    { name: 'Universities & Colleges', icon: <GraduationCap className="w-5 h-5 text-[#7CC9A5]" /> },
    { name: 'Pharma & Diagnostic Labs', icon: <Stethoscope className="w-5 h-5 text-[#F28B82]" /> },
    { name: 'Industrial R&D Laboratories', icon: <Microscope className="w-5 h-5 text-[#6EA8FE]" /> },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#FAFBFD] relative overflow-hidden min-h-screen text-[#5F708A]">
      <SEO
        title="BioBrand Scientific | Certified In-House Laboratory Consumables"
        description="Discover BioBrand Scientific - Biobusiness proprietary brand of Class A borosilicate glassware, USP Class VI plasticware, safety PPE, and lab consumables."
        canonicalPath="/biobrand"
      />
      <StructuredData
        data={generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'BioBrand', url: '/biobrand' }])}
        id="biobrand-breadcrumb-schema"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6ECF5] shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              Biobusiness In-House Brand
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#23324D] tracking-tight font-display">
            BIOBRAND <span className="text-[#6EA8FE]">SCIENTIFIC</span>
          </h1>

          <p className="text-[#5F708A] text-base sm:text-lg font-light leading-relaxed">
            BioBrand is Biobusiness Development Agency’s premier in-house brand, committed to providing reliable, certified, and cost-effective scientific solutions tailored for research, diagnostics, and industry.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <span className="px-4 py-2 rounded-xl bg-white border border-[#E6ECF5] text-[#23324D] text-xs font-mono font-bold shadow-2xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#7CC9A5]" /> ISO 9001:2015 Quality Standard
            </span>
            <span className="px-4 py-2 rounded-xl bg-white border border-[#E6ECF5] text-[#23324D] text-xs font-mono font-bold shadow-2xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#7CC9A5]" /> Certified Borosilicate 3.3 & Medical Polymer
            </span>
          </div>
        </div>

        {/* Brand Mission Statement Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#23324D] via-[#2D3F5E] to-[#1E2B42] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-[#6EA8FE]">
              <Sparkles className="w-3.5 h-3.5" /> Our Commitment to Science
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
              COMMITTED TO QUALITY, RELIABILITY & VALUE
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              At BioBrand, we understand that accuracy and consistency are non-negotiable in scientific research. By combining rigorous quality control, modern manufacturing standards, and direct institutional supply, we empower laboratories across India with world-class supplies at unmatched value.
            </p>
          </div>
        </div>

        {/* Product Categories Grid */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-[#23324D] font-display">
              BIOBRAND PRODUCT CATEGORIES
            </h2>
            <p className="text-[#5F708A] text-sm max-w-xl mx-auto font-light">
              Explore our core product ranges manufactured to ISO & international laboratory standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => navigate('/products')}
                className="p-6 rounded-3xl bg-white border border-[#E6ECF5] hover:border-[#6EA8FE] shadow-2xs hover:shadow-md transition-all space-y-4 cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] inline-block shadow-2xs group-hover:bg-[#DCEEFF] transition-colors">
                    {cat.icon}
                  </div>

                  <h3 className="text-xl font-bold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-[#5F708A] leading-relaxed font-light">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#6EA8FE] font-bold">
                  <span>View Products</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose BioBrand Grid */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-[#23324D] font-display">
              WHY CHOOSE BIOBRAND?
            </h2>
            <p className="text-[#5F708A] text-sm max-w-xl mx-auto font-light">
              Built on 29+ years of scientific distribution experience and deep institutional understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseCards.map((card, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-[#E6ECF5] space-y-3 shadow-2xs hover:border-[#6EA8FE] transition-colors"
              >
                <div className="p-3 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] inline-block shadow-2xs">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-[#23324D] font-display">
                  {card.title}
                </h3>
                <p className="text-xs text-[#5F708A] font-light leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted Sectors Footer Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E6ECF5] shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-[#23324D] font-display">
              TRUSTED BY LEADING INSTITUTIONS ACROSS INDIA
            </h3>
            <p className="text-xs text-[#5F708A] font-light">
              Supplying premier research institutes, healthcare facilities, and educational bodies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustedSectors.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] flex items-center gap-3"
              >
                <div className="p-2 rounded-xl bg-white border border-[#E6ECF5] shadow-2xs">
                  {sec.icon}
                </div>
                <span className="text-xs font-bold text-[#23324D] font-mono">
                  {sec.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Box */}
        <div className="text-center bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-8 sm:p-12 rounded-3xl border border-emerald-200 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23324D] font-display">
            NEED A CUSTOM BIOBRAND BULK QUOTE OR RATE CONTRACT?
          </h2>
          <p className="text-xs sm:text-sm text-[#5F708A] max-w-2xl mx-auto font-light">
            Our team assists ICAR, CSIR, ICMR, IITs, and private research bodies with customized product bundles, annual rate contract pricing, and instant GeM portal quotes.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            >
              Explore BioBrand Products
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
