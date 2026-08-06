import React from 'react';
import { INSTITUTIONS } from '../../data/productsData';

export const TrustedByMarquee: React.FC = () => {
  const marqueeItems = [...INSTITUTIONS, ...INSTITUTIONS];

  return (
    <section className="py-10 bg-[#FAFBFD] border-y border-[#E6ECF5] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <p className="text-xs uppercase font-mono tracking-[0.2em] text-[#9AA7BC] font-bold flex items-center justify-center gap-2">
          <span className="w-8 h-[1px] bg-[#6EA8FE]/40" />
          Trusted Procurement Partner For India's Leading Government Institutions
          <span className="w-8 h-[1px] bg-[#6EA8FE]/40" />
        </p>
      </div>

      {/* Fade Gradients at edges */}
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#FAFBFD] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#FAFBFD] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div className="flex gap-6 animate-marquee whitespace-nowrap py-2" style={{ animation: 'marquee 35s linear infinite' }}>
        {marqueeItems.map((inst, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white border border-[#E6ECF5] hover:border-[#CDD8E7] shadow-2xs hover:shadow-xs transition-all shrink-0 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#DCEEFF] text-[#23324D] font-extrabold flex items-center justify-center font-display text-sm group-hover:scale-105 transition-all">
              {inst.logoText}
            </div>
            <div>
              <div className="text-sm font-bold text-[#23324D] group-hover:text-[#6EA8FE] transition-colors font-display">
                {inst.name}
              </div>
              <div className="text-[11px] text-[#5F708A] font-light">
                {inst.fullName}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};
