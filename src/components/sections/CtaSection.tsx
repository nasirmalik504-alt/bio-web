import React from 'react';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';

interface CtaSectionProps {
  onContactClick: () => void;
  onExploreProducts: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onContactClick, onExploreProducts }) => {
  return (
    <section className="py-20 bg-[#FAFBFD] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="p-10 sm:p-16 rounded-3xl bg-white border border-[#CDD8E7] shadow-sm relative overflow-hidden text-center space-y-8">
          
          {/* Subtle Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6EA8FE] via-[#8DBBFF] to-[#F28B82]" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCEEFF] text-[#23324D] text-xs font-mono font-bold uppercase tracking-widest mx-auto shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#6EA8FE]" /> Ready to Equip Your Laboratory?
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#23324D] tracking-tight font-display max-w-4xl mx-auto leading-tight">
            EQUIP YOUR INSTITUTION WITH TRUSTED <span className="text-[#6EA8FE]">SCIENTIFIC SUPPLIES</span>
          </h2>

          <p className="text-[#5F708A] text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Connect with our team of technical specialists to discuss rate contracts, custom product quotations, or GeM tender requirements.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onContactClick}
              className="px-8 py-4 rounded-xl bg-[#6EA8FE] hover:bg-[#5B95F5] text-white font-extrabold text-base shadow-2xs hover:shadow-xs hover:scale-[1.01] transition-all flex items-center gap-3 cursor-pointer"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Us Now</span>
            </button>

            <button
              onClick={onExploreProducts}
              className="px-8 py-4 rounded-xl bg-[#F4F8FC] hover:bg-[#E6ECF5] text-[#23324D] font-bold text-base border border-[#CDD8E7] flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <span>Explore Certified Products</span>
              <ArrowRight className="w-5 h-5 text-[#6EA8FE]" />
            </button>
          </div>

          <div className="pt-6 border-t border-[#E6ECF5] flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-[#5F708A] font-bold">
            <span className="flex items-center gap-1">⚡ Same-Day Quote Response</span>
            <span className="flex items-center gap-1">🛡️ 100% Guaranteed Genuine Brands</span>
            <span className="flex items-center gap-1">📜 GeM Tender Compliant</span>
          </div>

        </div>

      </div>
    </section>
  );
};
