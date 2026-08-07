import React from 'react';
import { motion } from 'framer-motion';
import { DnaCanvas } from './DnaCanvas';
import { ArrowRight, ShieldCheck, Award, FileText, Activity, Microscope } from 'lucide-react';

interface HeroSectionProps {
  onExploreProducts: () => void;
  onTalkToExperts: () => void;
  onOpenProcurement: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProducts,
  onTalkToExperts,
  onOpenProcurement
}) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-[#FAFBFD]">
      
      {/* 3D DNA Canvas Background */}
      <DnaCanvas />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            


            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#23324D] tracking-tight leading-[1.1] font-display">
                EMPOWERING <span className="text-[#6EA8FE]">SCIENCE</span>
                <br />
                DELIVERING <span className="text-[#23324D]">PRECISION</span>
              </h1>
              <p className="text-base sm:text-lg text-[#5F708A] max-w-2xl font-sans leading-relaxed font-light">
                Biobusiness Development Agency is a premier scientific partner delivering certified laboratory plasticware, borosilicate glassware, liquid handling systems, and analytical instruments to India's top research institutions.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={onExploreProducts}
                className="px-7 py-4 rounded-xl bg-[#6EA8FE] hover:bg-[#5B95F5] text-white font-bold text-sm sm:text-base shadow-2xs hover:shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-3 cursor-pointer group"
              >
                <span>Explore 5,000+ Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenProcurement}
                className="px-6 py-4 rounded-xl bg-white text-[#23324D] hover:bg-[#F4F8FC] font-bold text-sm sm:text-base border border-[#CDD8E7] flex items-center gap-2.5 transition-all cursor-pointer shadow-2xs"
              >
                <FileText className="w-5 h-5 text-[#6EA8FE]" />
                <span>GeM & Rate Contracts</span>
              </button>
            </motion.div>

            {/* Institutional Certification Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 border-t border-[#E6ECF5] flex flex-wrap items-center gap-6 text-xs text-[#5F708A]"
            >
              <span className="font-mono text-[#23324D] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#6EA8FE]" /> Trusted By:
              </span>
              <div className="flex flex-wrap items-center gap-2.5 font-bold text-[#23324D]">
                {[
                  { name: 'ICAR', bg: 'bg-[#EAF7F2]' },
                  { name: 'CSIR', bg: 'bg-[#DCEEFF]' },
                  { name: 'ICMR', bg: 'bg-[#EEE8FF]' },
                  { name: 'DST', bg: 'bg-[#FFF0E8]' },
                  { name: 'DBT', bg: 'bg-[#FCECEF]' },
                  { name: 'DAE', bg: 'bg-[#FFF8D9]' },
                  { name: 'IITs', bg: 'bg-[#E8F4FF]' }
                ].map((inst, idx) => (
                  <span key={idx} className={`px-3 py-1 rounded-md border border-[#E6ECF5] text-[#23324D] text-xs font-mono font-bold shadow-2xs ${inst.bg}`}>
                    {inst.name}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right Column: White Research Bench Cards with Efficient Pastel Accents */}
          <div className="lg:col-span-5 relative">
            <div className="relative space-y-4">
              
              {/* Card 1: 5,000+ Lab Products */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-6 rounded-2xl bg-white border border-[#E6ECF5] hover:border-[#CDD8E7] shadow-2xs hover:shadow-xs relative overflow-hidden group cursor-pointer transition-all"
                onClick={onExploreProducts}
              >
                <div className="absolute right-4 top-4 p-3.5 rounded-xl bg-[#E8F4FF] text-[#23324D] group-hover:scale-105 transition-transform">
                  <Microscope className="w-6 h-6 text-[#6EA8FE]" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#23324D] font-display flex items-baseline gap-1.5">
                  <span>5,000</span>
                  <span className="text-[#6EA8FE] text-2xl">+</span>
                </div>
                <div className="text-sm font-bold text-[#23324D] mt-1 font-display">Certified Laboratory Products</div>
                <div className="text-xs text-[#5F708A] mt-1 font-light">Plasticware, Glassware, Micropipettes & Instruments</div>
              </motion.div>

              {/* Card 2: 29+ Years */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="p-6 rounded-2xl bg-white border border-[#E6ECF5] hover:border-[#CDD8E7] shadow-2xs hover:shadow-xs relative overflow-hidden group transition-all"
              >
                <div className="absolute right-4 top-4 p-3.5 rounded-xl bg-[#EEE8FF] text-[#23324D] group-hover:scale-105 transition-transform">
                  <Activity className="w-6 h-6 text-[#6EA8FE]" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#23324D] font-display flex items-baseline gap-1.5">
                  <span>29</span>
                  <span className="text-[#6EA8FE] text-2xl">+ Years</span>
                </div>
                <div className="text-sm font-bold text-[#23324D] mt-1 font-display">Collective Scientific Leadership</div>
                <div className="text-xs text-[#5F708A] mt-1 font-light">Established in 1996 • 30+ Years Industry Experience</div>
              </motion.div>

              {/* Card 3: 100+ Government Labs */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="p-6 rounded-2xl bg-white border border-[#E6ECF5] hover:border-[#CDD8E7] shadow-2xs hover:shadow-xs relative overflow-hidden group transition-all"
              >
                <div className="absolute right-4 top-4 p-3.5 rounded-xl bg-[#EAF7F2] text-[#23324D] group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-[#7CC9A5]" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#23324D] font-display flex items-baseline gap-1.5">
                  <span>100</span>
                  <span className="text-[#7CC9A5] text-2xl">+ Govt Labs</span>
                </div>
                <div className="text-sm font-bold text-[#23324D] mt-1 font-display">Trusted Government Partner</div>
                <div className="text-xs text-[#5F708A] mt-1 font-light">ICAR, CSIR, IIT, Medical Colleges & Environmental Boards</div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
