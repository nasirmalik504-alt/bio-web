import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, CheckCircle } from 'lucide-react';

interface ProductBentoGridProps {
  onSelectCategory: (category: string) => void;
}

export const ProductBentoGrid: React.FC<ProductBentoGridProps> = ({ onSelectCategory }) => {
  const bentoCards = [
    {
      id: 'plasticware',
      title: 'Laboratory Plasticware',
      subtitle: 'Autoclavable micro-tubes, Petri dishes, Tips & Centrifuge tubes',
      badge: '500+ Items',
      image: 'assets/micro-tubes.jpg',
      span: 'lg:col-span-2 lg:row-span-2',
      bgCategoryColor: 'bg-[#EAF7F2]',
      highlights: ['DNase/RNase Free', 'High Centrifugation RCF 20,000x g', 'Ultra-hydrophobic Tips']
    },
    {
      id: 'glassware',
      title: 'Class A Lab Glassware',
      subtitle: 'Borosilicate 3.3 volumetric flasks, beakers & NABL cylinders',
      badge: 'NABL Certified',
      image: 'assets/measuring-cylinder.jpg',
      span: 'lg:col-span-1 lg:row-span-1',
      bgCategoryColor: 'bg-[#DCEEFF]',
      highlights: ['Class A Volumetric', 'GL45 Reagent Bottles']
    },
    {
      id: 'liquid-handling',
      title: 'Liquid Handling Systems',
      subtitle: 'Autoclavable micropipettes, electronic fillers & dispensers',
      badge: 'ISO 8655',
      image: 'assets/micropipette.jpg',
      span: 'lg:col-span-1 lg:row-span-1',
      bgCategoryColor: 'bg-[#EDF8FF]',
      highlights: ['Single & Multichannel', '0.1µl to 100ml']
    },
    {
      id: 'safety',
      title: 'Safety & Cryo Protection',
      subtitle: 'Liquid nitrogen gloves (-196°C), Nitrile gloves & N95 masks',
      badge: 'Cryo Grade',
      image: 'assets/cryo-gloves.jpg',
      span: 'lg:col-span-1 lg:row-span-2',
      bgCategoryColor: 'bg-[#FFF8D9]',
      highlights: ['EN 511 Cryo Rated', 'AQL 1.5 Nitrile', 'Cleanroom Compliant']
    },
    {
      id: 'instruments',
      title: 'Precision Instruments',
      subtitle: '0.1mg balances, hot plates, magnetic stirrers & COD digesters',
      badge: 'High Precision',
      image: 'assets/weighing-balance.png',
      span: 'lg:col-span-2 lg:row-span-1',
      bgCategoryColor: 'bg-[#EEE8FF]',
      highlights: ['Internal Calibration', 'Digital Control', 'GLP/GMP Output']
    },
    {
      id: 'chemicals',
      title: 'Chemicals & Culture Media',
      subtitle: 'HPLC grade solvents, enzymes, reagents & microbiology media',
      badge: 'Purity > 99.9%',
      image: 'assets/lab-chemicals.jpg',
      span: 'lg:col-span-1 lg:row-span-1',
      bgCategoryColor: 'bg-[#FFF0E8]',
      highlights: ['AR/HPLC Grade', 'COA Provided']
    }
  ];

  return (
    <section id="products" className="py-24 bg-[#F4F8FC] relative overflow-hidden border-b border-[#E6ECF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#CDD8E7] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              Scientific Product Portfolio
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#23324D] tracking-tight font-display">
            COMPREHENSIVE <span className="text-[#6EA8FE]">LABORATORY ESSENTIALS</span>
          </h2>
          
          <p className="text-[#5F708A] text-base font-light leading-relaxed">
            Meticulously engineered plasticware, borosilicate glassware, liquid handling, safety protection, and analytical equipment meeting ISO & NABL specifications.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[280px]">
          {bentoCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              onClick={() => onSelectCategory(card.id)}
              className={`group relative rounded-3xl overflow-hidden border border-[#E6ECF5] hover:border-[#CDD8E7] p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${card.span} ${card.bgCategoryColor}`}
            >
              {/* Background Photography with Parallax Zoom */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-25 group-hover:opacity-35 mix-blend-multiply"
                style={{ backgroundImage: `url('${card.image}')` }}
              />

              {/* Top Badge & Direct Inspect Icon */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E6ECF5] text-[#23324D] text-xs font-mono font-bold shadow-2xs">
                  {card.badge}
                </span>

                <div className="w-10 h-10 rounded-full bg-white border border-[#E6ECF5] text-[#23324D] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#6EA8FE] group-hover:text-white transition-all shadow-2xs">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F708A] line-clamp-2 font-light">
                  {card.subtitle}
                </p>

                {/* Feature Highlights Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {card.highlights.map((h, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-md bg-white/90 text-[#23324D] border border-[#E6ECF5] font-medium flex items-center gap-1 shadow-2xs">
                      <CheckCircle className="w-3 h-3 text-[#7CC9A5]" /> {h}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white border border-[#D7E3F2] hover:border-[#6EA8FE] text-[#23324D] font-bold text-sm hover:text-[#6EA8FE] transition-all cursor-pointer shadow-xs group"
          >
            <span>Explore Full 5,000+ Item Catalogue</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-[#6EA8FE]" />
          </button>
        </div>

      </div>
    </section>
  );
};
