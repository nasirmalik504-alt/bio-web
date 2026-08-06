import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      icon: <Award className="w-6 h-6 text-[#7CC9A5]" />,
    },
    {
      title: 'Reliable Supply',
      desc: 'Consistent inventory stockpiling for seamless institutional procurement and zero research downtime.',
      icon: <PackageCheck className="w-6 h-6 text-[#6EA8FE]" />,
    },
    {
      title: 'Competitive Pricing',
      desc: 'Optimized pricing models specifically tailored for educational and government purchasing budgets.',
      icon: <DollarSign className="w-6 h-6 text-[#F28B82]" />,
    },
    {
      title: 'Institutional Packaging',
      desc: 'Products packaged specifically for university laboratories, medical centers, and bulk tenders.',
      icon: <Package className="w-6 h-6 text-[#6EA8FE]" />,
    },
    {
      title: 'Technical Support',
      desc: 'Dedicated specialist guidance for product selection, specifications compliance, and custom BOQs.',
      icon: <HeartHandshake className="w-6 h-6 text-[#7CC9A5]" />,
    },
    {
      title: 'Nationwide Delivery',
      desc: 'Rapid and secure logistics network serving research laboratories and universities throughout India.',
      icon: <Truck className="w-6 h-6 text-[#F28B82]" />,
    },
  ];

  const procurementSectors = [
    { name: 'Government Institutions', icon: <Building2 className="w-5 h-5 text-[#6EA8FE]" /> },
    { name: 'Universities', icon: <GraduationCap className="w-5 h-5 text-[#7CC9A5]" /> },
    { name: 'Medical Colleges', icon: <Stethoscope className="w-5 h-5 text-[#F28B82]" /> },
    { name: 'Research Centers', icon: <Microscope className="w-5 h-5 text-[#6EA8FE]" /> },
    { name: 'Industrial Laboratories', icon: <FlaskConical className="w-5 h-5 text-[#7CC9A5]" /> },
    { name: 'Private Laboratories', icon: <PackageCheck className="w-5 h-5 text-[#F28B82]" /> },
    { name: 'Bulk Institutional Orders', icon: <Package className="w-5 h-5 text-[#6EA8FE]" /> },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#FAFBFD] min-h-screen text-[#5F708A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E6ECF5] shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              In-House Scientific Brand Identity
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#23324D] tracking-tight font-display"
          >
            BioBrand<span className="text-[#6EA8FE]"></span>
          </motion.h1>

          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl font-bold text-[#6EA8FE] font-display"
          >
            Scientific Products Curated by Biobusiness Development Agency
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg text-[#5F708A] max-w-3xl mx-auto font-light leading-relaxed"
          >
            Reliable laboratory essentials developed under the BioBrand identity for educational institutions, research laboratories and industrial testing facilities.
          </motion.p>
        </div>

        {/* About BioBrand */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E6ECF5] shadow-2xs space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCEEFF] text-[#6EA8FE] flex items-center justify-center font-bold text-xl">
              B
            </div>
            <h2 className="text-2xl font-extrabold text-[#23324D] font-display">
              ABOUT BIOBRAND
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-[#5F708A] font-light leading-relaxed">
            <p>
              BioBrand is Biobusiness's own scientific product line created to provide dependable laboratory essentials with consistent quality, competitive pricing and reliable availability.
            </p>
            <p>
              Our mission is to make trusted laboratory products accessible for educational institutions, research organizations, healthcare laboratories and government departments across India.
            </p>
          </div>
        </div>

        {/* Product Categories (Clean 6-Card Grid) */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#23324D] font-display">
              PRODUCT CATEGORIES
            </h2>
            <p className="text-sm text-[#5F708A] font-light">
              Comprehensive laboratory supplies curated under the BioBrand quality umbrella.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => navigate('/products')}
                className="p-6 rounded-3xl bg-white border border-[#E6ECF5] hover:border-[#CDD8E7] shadow-2xs hover:shadow-xs transition-all flex items-start gap-4 cursor-pointer group"
              >
                <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] group-hover:scale-110 transition-transform shrink-0">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-[#5F708A] font-light leading-relaxed mt-1">
                    {cat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose BioBrand */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#23324D] font-display">
              WHY CHOOSE BIOBRAND
            </h2>
            <p className="text-sm text-[#5F708A] font-light">
              Built on six core pillars of institutional trust, quality assurance, and nationwide logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseCards.map((card, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-[#E6ECF5] shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] w-fit shadow-2xs">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#23324D] font-display">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#5F708A] font-light leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Procurement Support */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E6ECF5] shadow-2xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCEEFF] text-[#23324D] text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6EA8FE]" /> Institutional Procurement
            </div>
            <h2 className="text-3xl font-extrabold text-[#23324D] font-display">
              PROCUREMENT SUPPORT
            </h2>
            <p className="text-sm text-[#5F708A] font-light">
              BioBrand products are pre-structured for seamless purchasing across key sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {procurementSectors.map((sector, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] flex items-center gap-3"
              >
                <div className="p-2 rounded-xl bg-white border border-[#E6ECF5] shrink-0">
                  {sector.icon}
                </div>
                <span className="text-xs font-bold text-[#23324D] font-display">
                  {sector.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Commitment Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#EAF7F2] border border-[#7CC9A5]/30 space-y-4 text-center max-w-4xl mx-auto">
          <div className="p-3 rounded-full bg-white text-[#7CC9A5] border border-[#7CC9A5]/30 w-fit mx-auto shadow-2xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#23324D] font-display">
            OUR QUALITY COMMITMENT
          </h3>
          <p className="text-sm sm:text-base text-[#23324D] font-light leading-relaxed max-w-2xl mx-auto">
            Every BioBrand product is selected with emphasis on quality, compliance and reliability to support research, education and scientific innovation.
          </p>
        </div>

        {/* CTA Section */}
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-[#23324D] to-[#1A263B] text-white shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7CC9A5]/10 rounded-full blur-3xl" />

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display max-w-3xl mx-auto">
            Looking for BioBrand Laboratory Products?
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Browse our complete catalogue or request a formal institutional quotation today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-4 rounded-xl bg-[#6EA8FE] hover:bg-[#5B95F5] text-white font-extrabold text-xs shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Browse BioBrand Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
            >
              Request Institutional Quotation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
