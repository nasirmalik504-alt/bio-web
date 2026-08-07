import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { generateBreadcrumbSchema } from '../lib/seo';
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
        'Electronic Burettes & Titrators',
        'Peristaltic Pumps & Aspirators',
      ],
      linkCategory: 'liquid-handling',
      trustPoints: ['ISO 8655 Calibration', '2-Year Warranty', 'NABL Traceable'],
    },
    {
      id: 'qualikems',
      name: 'Qualikems Fine Chemicals',
      tagline: 'High-Purity Laboratory Reagents & Solvents',
      description:
        'Authorized distributor of AR/LR grade chemicals, HPLC grade solvents, biological stains, buffers, indicator solutions, and dehydrated culture media.',
      logoIcon: <Dna className="w-8 h-8 text-emerald-600" />,
      accentColor: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      products: [
        'AR/ACS Grade Acids & Bases',
        'HPLC & Gradient Grade Solvents',
        'Biological Stains & Indicators',
        'Dehydrated Culture Media & Buffers',
      ],
      linkCategory: 'chemicals',
      trustPoints: ['100% CoA Provided', 'ACS Grade Purity', 'Batch Traceability'],
    },
    {
      id: 'rambo',
      name: 'RAMBO Filtration',
      tagline: 'Membrane Discs, Syringe Filters & Holders',
      description:
        'Authorized supplier of precision membrane filter discs (NY, PTFE, PVDF, PES, MCE), syringe filters, filter paper circles, and glass filtration assemblies.',
      logoIcon: <Binary className="w-8 h-8 text-cyan-600" />,
      accentColor: 'from-cyan-50 to-blue-50',
      borderColor: 'border-cyan-200',
      badgeBg: 'bg-cyan-100 text-cyan-800',
      products: [
        'Sterile & Non-Sterile Syringe Filters',
        'Membrane Discs (0.22µm & 0.45µm)',
        'Quantitative & Qualitative Filter Papers',
        'Glass Filter Holders & Vacuum Pumps',
      ],
      linkCategory: 'filtration',
      trustPoints: ['Low Extractable Membranes', 'HPLC Certified', 'ISO 9001 Factory'],
    },
    {
      id: 'biobrand',
      name: 'BioBrand Scientific',
      tagline: 'In-House White-Label Laboratory Consumables',
      description:
        'Biobusiness proprietary brand delivering certified borosilicate 3.3 glassware, virgin polypropylene plasticware, safety PPE, and laboratory essentials.',
      logoIcon: <Layers className="w-8 h-8 text-[#F28B82]" />,
      accentColor: 'from-[#FFF0E8] to-[#FFF8F6]',
      borderColor: 'border-[#F28B82]/30',
      badgeBg: 'bg-[#FFF0E8] text-[#23324D]',
      products: [
        'Class A Borosilicate Glassware',
        'Autoclavable PP Plasticware & Cryo Vials',
        'CE Certified Nitrile & Latex Gloves',
        'Lab Coats, Masks & Spill Kits',
      ],
      linkCategory: 'plasticware',
      trustPoints: ['USP Class VI Polymer', 'Class A Volumetric', 'Direct Factory Price'],
    },
  ];

  const marketSegments = [
    {
      title: 'Agricultural Research (ICAR)',
      icon: <GraduationCap className="w-6 h-6 text-[#6EA8FE]" />,
      desc: 'Annual rate contracts for soil, plant tissue, and agronomy research labs across India.',
    },
    {
      title: 'Industrial Research (CSIR)',
      icon: <Building2 className="w-6 h-6 text-[#7CC9A5]" />,
      desc: 'High-purity reagents, borosilicate glassware, and micropipette systems for CSIR institutes.',
    },
    {
      title: 'Medical & Clinical (ICMR)',
      icon: <Stethoscope className="w-6 h-6 text-[#F28B82]" />,
      desc: 'Sterile filtration, viral transport media, cryo storage, and PPE for pathology & pathology labs.',
    },
    {
      title: 'Academic & IITs',
      icon: <Microscope className="w-6 h-6 text-[#6EA8FE]" />,
      desc: 'Comprehensive supply of analytical instruments, glassware, and consumables for university labs.',
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#FAFBFD] relative overflow-hidden min-h-screen text-[#5F708A]">
      <SEO
        title="Authorized Brands & Strategic Partnerships | Biobusiness Development Agency"
        description="Explore authorized brand partnerships including Microlit liquid handling, Qualikems fine chemicals, RAMBO filtration, and BioBrand laboratory consumables."
        canonicalPath="/brands"
      />
      <StructuredData
        data={generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Authorized Brands', url: '/brands' }])}
        id="brands-breadcrumb-schema"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6ECF5] shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              Authorized Distribution & Strategic Partners
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#23324D] tracking-tight font-display">
            OUR AUTHORIZED <span className="text-[#6EA8FE]">BRAND PORTFOLIO</span>
          </h1>

          <p className="text-[#5F708A] text-base sm:text-lg font-light leading-relaxed">
            Biobusiness Development Agency is proud to be an authorized distributor and strategic partner for premier global and national scientific manufacturers.
          </p>
        </div>

        {/* Global Distribution Trust Banner */}
        <OfficialDistributionTrustBadge />

        {/* Brand Showcase Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23324D] font-display">
              STRATEGIC BRAND PARTNERS
            </h2>
            <p className="text-xs sm:text-sm text-[#5F708A] max-w-xl mx-auto font-light">
              Direct factory authorization, genuine quality guarantees, and official batch documentation for all product lines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {brandPartners.map((brand) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`p-8 rounded-3xl bg-white border ${brand.borderColor} shadow-2xs hover:shadow-md transition-all space-y-6 flex flex-col justify-between group`}
              >
                <div className="space-y-4">
                  {/* Brand Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] shadow-2xs">
                        {brand.logoIcon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-extrabold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors">
                          {brand.name}
                        </h3>
                        <p className="text-xs font-mono text-[#6EA8FE] font-bold">
                          {brand.tagline}
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${brand.badgeBg}`}>
                      Authorized
                    </span>
                  </div>

                  <p className="text-sm text-[#5F708A] leading-relaxed font-light">
                    {brand.description}
                  </p>

                  {/* Products Handled */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-mono font-bold text-[#23324D] uppercase tracking-wider block">
                      Key Product Lines Handled:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {brand.products.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-[#5F708A] font-light bg-[#FAFBFD] p-2.5 rounded-xl border border-[#E6ECF5]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7CC9A5] shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trust Points */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {brand.trustPoints.map((tp, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#FAFBFD] border border-[#E6ECF5] text-[#23324D] text-[11px] font-mono font-semibold"
                      >
                        ✓ {tp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explore Brand Button */}
                <button
                  onClick={() => navigate(`/products?category=${brand.linkCategory}`)}
                  className="w-full py-3.5 rounded-2xl bg-[#FAFBFD] hover:bg-[#6EA8FE] text-[#23324D] hover:text-white border border-[#E6ECF5] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2 group-hover:border-[#6EA8FE]"
                >
                  <span>Explore {brand.name} Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Institutional Market Coverage */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E6ECF5] shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 text-[#6EA8FE] font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Market Segments Served
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23324D] font-display">
              TRUSTED ACROSS GOVERNMENT & RESEARCH SECTORS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketSegments.map((seg, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] space-y-3 hover:border-[#6EA8FE] transition-colors"
              >
                <div className="p-3 rounded-xl bg-white border border-[#E6ECF5] inline-block shadow-2xs">
                  {seg.icon}
                </div>
                <h3 className="text-base font-bold text-[#23324D] font-display">
                  {seg.title}
                </h3>
                <p className="text-xs text-[#5F708A] font-light leading-relaxed">
                  {seg.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
