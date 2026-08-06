import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Microscope,
  GraduationCap,
  Stethoscope,
  FlaskConical,
  Dna,
  Binary,
  Layers,
  ArrowRight,
  Sparkles,
  FileCheck,
  PackageCheck,
  BadgeCheck,
} from 'lucide-react';
import { OfficialDistributionTrustBadge } from '../components/sections/OfficialDistributionTrustBadge';

export const BrandsPage: React.FC = () => {
  const navigate = useNavigate();

  const brandPartners = [
    {
      id: 'microlit',
      name: 'Microlit',
      tagline: 'Precision Liquid Handling Solutions',
      description:
        'Authorized supplier of high-accuracy micropipettes, bottle-top dispensers, electronic pipettes, burettes, peristaltic pumps, aspirators and laboratory accessories.',
      logoIcon: <FlaskConical className="w-8 h-8 text-[#6EA8FE]" />,
      accentColor: 'from-[#DCEEFF] to-[#F4F8FC]',
      borderColor: 'border-[#6EA8FE]/30',
      badgeBg: 'bg-[#DCEEFF] text-[#23324D]',
      products: [
        'Micropipettes (Fixed & Variable)',
        'Bottle Top Dispensers',
        'Electronic Pipettes & Controllers',
        'Vacuum Aspirators & Titrators',
        'Racks, Stands & Accessories',
      ],
    },
    {
      id: 'axiva-sichem',
      name: 'Axiva Sichem',
      tagline: 'Laboratory Filtration & Glassware',
      description:
        'Premium membrane filters, filtration assemblies, chromatography products, laboratory glassware and analytical accessories for research and industrial labs.',
      logoIcon: <Layers className="w-8 h-8 text-[#7CC9A5]" />,
      accentColor: 'from-[#EAF7F2] to-[#F4F8FC]',
      borderColor: 'border-[#7CC9A5]/30',
      badgeBg: 'bg-[#EAF7F2] text-[#23324D]',
      products: [
        'Membrane & Syringe Filters',
        'Filtration Assemblies & Manifolds',
        'Chromatography Consumables',
        'Borosilicate Laboratory Glassware',
        'Analytical Sample Preparation',
      ],
    },
    {
      id: 'qualikems',
      name: 'Qualikems Life Sciences',
      tagline: 'Laboratory Chemicals & Reagents',
      description:
        'Analytical reagents, laboratory chemicals, culture media, solvents and research-grade consumables engineered for high-throughput testing.',
      logoIcon: <Microscope className="w-8 h-8 text-[#F28B82]" />,
      accentColor: 'from-[#FCECEF] to-[#F4F8FC]',
      borderColor: 'border-[#F28B82]/30',
      badgeBg: 'bg-[#FCECEF] text-[#23324D]',
      products: [
        'Analytical Reagents & Indicators',
        'HPLC & Spectroscopy Solvents',
        'Dehydrated Culture Media',
        'High-Purity Inorganic Salts',
        'Research Grade Chemicals',
      ],
    },
    {
      id: 'labogens',
      name: 'Labogens',
      tagline: 'Life Science Research Products',
      description:
        'Biotechnology reagents, molecular biology products, laboratory consumables and scientific research solutions tailored for universities and medical centers.',
      logoIcon: <Dna className="w-8 h-8 text-[#6EA8FE]" />,
      accentColor: 'from-[#EEE8FF] to-[#F4F8FC]',
      borderColor: 'border-[#6EA8FE]/30',
      badgeBg: 'bg-[#EEE8FF] text-[#23324D]',
      products: [
        'Biotechnology Reagents & Enzymes',
        'Molecular Biology Buffers',
        'Electrophoresis Standards',
        'Cell Culture Additives',
        'General Life Science Consumables',
      ],
    },
    {
      id: 'orochemie',
      name: 'Orochemie Laboratory Pvt Ltd',
      tagline: 'Disinfection & Hygiene Solutions',
      description:
        'High-performance surface disinfectants, instrument cleaners, hygiene systems, and infection control products for clinical, scientific, and industrial environments.',
      logoIcon: <ShieldCheck className="w-8 h-8 text-[#7CC9A5]" />,
      accentColor: 'from-[#FFF8D9] to-[#F4F8FC]',
      borderColor: 'border-[#7CC9A5]/30',
      badgeBg: 'bg-[#FFF8D9] text-[#23324D]',
      products: [
        'Surface Disinfectants & Sanitizers',
        'Instrument Cleaning & Disinfection',
        'Hand & Skin Hygiene Systems',
        'Infection Prevention Solutions',
        'Laboratory Hygiene Consumables',
      ],
    },
  ];

  const whyPartnerCards = [
    {
      title: 'Genuine Products',
      desc: '100% authentic inventory sourced directly from primary manufacturer production facilities.',
      icon: <BadgeCheck className="w-6 h-6 text-[#7CC9A5]" />,
    },
    {
      title: 'Manufacturer Warranty',
      desc: 'Complete factory backing, original warranty terms, and technical calibration support on all instruments.',
      icon: <ShieldCheck className="w-6 h-6 text-[#6EA8FE]" />,
    },
    {
      title: 'Batch Traceability',
      desc: 'Full Certificate of Analysis (COA) and batch test reporting provided with every shipment.',
      icon: <FileCheck className="w-6 h-6 text-[#F28B82]" />,
    },
    {
      title: 'Government Procurement Ready',
      desc: 'Pre-verified specifications fully compliant with GeM portal, ICAR, CSIR, and IIT procurement norms.',
      icon: <PackageCheck className="w-6 h-6 text-[#6EA8FE]" />,
    },
  ];

  const industries = [
    { name: 'Research Laboratories', icon: <Microscope className="w-6 h-6 text-[#6EA8FE]" /> },
    { name: 'Government Institutes', icon: <Building2 className="w-6 h-6 text-[#7CC9A5]" /> },
    { name: 'Medical Colleges', icon: <Stethoscope className="w-6 h-6 text-[#F28B82]" /> },
    { name: 'Universities', icon: <GraduationCap className="w-6 h-6 text-[#6EA8FE]" /> },
    { name: 'Pharmaceutical Industry', icon: <FlaskConical className="w-6 h-6 text-[#7CC9A5]" /> },
    { name: 'Biotechnology Companies', icon: <Dna className="w-6 h-6 text-[#F28B82]" /> },
    { name: 'Quality Control Laboratories', icon: <FileCheck className="w-6 h-6 text-[#6EA8FE]" /> },
    { name: 'Testing Laboratories', icon: <CheckCircle2 className="w-6 h-6 text-[#7CC9A5]" /> },
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
            <Award className="w-4 h-4 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              Authorized Distribution Portfolio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#23324D] tracking-tight font-display leading-tight"
          >
            TRUSTED <span className="text-[#6EA8FE]">DISTRIBUTION PARTNERS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl font-medium text-[#23324D] max-w-3xl mx-auto font-display"
          >
            Supplying laboratory products from globally recognized scientific manufacturers through authorized distribution and reliable procurement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-3xl bg-white border border-[#E6ECF5] shadow-2xs text-left max-w-3xl mx-auto"
          >
            <p className="text-[#5F708A] text-sm sm:text-base leading-relaxed font-light">
              Biobusiness partners with leading laboratory manufacturers to deliver certified scientific equipment, liquid handling systems, laboratory chemicals, consumables, and analytical solutions to research institutions, universities, healthcare laboratories, pharmaceutical companies, and government organizations.
            </p>
          </motion.div>
        </div>

        {/* Brand Cards Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#23324D] font-display">
              OUR AUTHORIZED MANUFACTURERS
            </h2>
            <p className="text-sm text-[#5F708A] font-light">
              Direct access to genuine brand inventory with full factory warranty and batch certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandPartners.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-6 rounded-3xl bg-white border border-[#E6ECF5] hover:border-[#CDD8E7] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  
                  {/* Brand Header & Logo Icon */}
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${brand.accentColor} border ${brand.borderColor} group-hover:scale-105 transition-transform`}>
                      {brand.logoIcon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${brand.badgeBg}`}>
                      Authorized Supplier
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors">
                      {brand.name}
                    </h3>
                    <div className="text-xs font-bold text-[#6EA8FE] font-mono mt-0.5">
                      {brand.tagline}
                    </div>
                  </div>

                  <p className="text-xs text-[#5F708A] leading-relaxed font-light">
                    {brand.description}
                  </p>

                  {/* Supplied Products Bullet List */}
                  <div className="space-y-2 pt-2 border-t border-[#E6ECF5]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#23324D] font-display">
                      PRODUCTS SUPPLIED
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#5F708A]">
                      {brand.products.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7CC9A5] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Card Action */}
                <button
                  onClick={() => navigate('/products')}
                  className="w-full py-3 rounded-xl bg-[#FAFBFD] hover:bg-[#F4F8FC] border border-[#E6ECF5] text-[#23324D] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:border-[#CDD8E7]"
                >
                  <span>Explore {brand.name} Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6EA8FE]" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why We Partner With Leading Brands */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E6ECF5] shadow-2xs space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF7F2] text-[#23324D] text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#7CC9A5]" /> Trust Assurance
            </div>
            <h2 className="text-3xl font-extrabold text-[#23324D] font-display">
              WHY WE PARTNER WITH LEADING BRANDS
            </h2>
            <p className="text-sm text-[#5F708A] font-light">
              Every manufacturer in our portfolio is selected based on stringent quality controls, international certifications, and institutional reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyPartnerCards.map((card, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] space-y-3">
                <div className="p-2.5 rounded-xl bg-white border border-[#E6ECF5] w-fit shadow-2xs">
                  {card.icon}
                </div>
                <h4 className="text-base font-bold text-[#23324D] font-display">
                  ✔ {card.title}
                </h4>
                <p className="text-xs text-[#5F708A] font-light leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Industries We Serve */}
        <div className="space-y-8 text-center">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#23324D] font-display">
              INDUSTRIES WE SERVE
            </h2>
            <p className="text-sm text-[#5F708A] font-light">
              Providing specialized laboratory procurement across premier research and educational sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {industries.map((ind, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#E6ECF5] hover:border-[#CDD8E7] transition-all flex flex-col items-center justify-center text-center space-y-3 group shadow-2xs"
              >
                <div className="p-3 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] group-hover:scale-110 transition-transform">
                  {ind.icon}
                </div>
                <span className="text-xs font-bold text-[#23324D] font-display">
                  {ind.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Distribution Trust Badge Section */}
        <OfficialDistributionTrustBadge />

        {/* CTA Section */}
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-[#23324D] to-[#1A263B] text-white shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6EA8FE]/10 rounded-full blur-3xl" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono text-[#6EA8FE] font-bold">
            <Award className="w-4 h-4" /> Official Brand Procurement
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display max-w-3xl mx-auto">
            Need Products From Our Distribution Partners?
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Request an official institutional quotation or speak directly with our dedicated technical procurement specialists.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 rounded-xl bg-[#6EA8FE] hover:bg-[#5B95F5] text-white font-extrabold text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              Request Institutional Quotation
            </button>
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
            >
              Browse Complete Product Database
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
