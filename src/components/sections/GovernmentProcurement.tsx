import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileCheck, Download, CheckCircle2 } from 'lucide-react';

interface GovernmentProcurementProps {
  onRequestQuote: () => void;
}

export const GovernmentProcurement: React.FC<GovernmentProcurementProps> = ({ onRequestQuote }) => {
  const steps = [
    { num: '01', title: 'GeM Bidding & Tender Direct', desc: 'Direct participation in GeM bids, L1 tenders, and customized BOQ matching.', bg: 'bg-[#DCEEFF]' },
    { num: '02', title: 'Annual Rate Contracts', desc: 'Pre-negotiated standardized pricing for ICAR, CSIR, ICMR, DST & IIT labs.', bg: 'bg-[#EAF7F2]' },
    { num: '03', title: 'NABL & ISO Compliance', desc: 'All glassware and instruments carry valid NABL calibration and ISO batch certificates.', bg: 'bg-[#EEE8FF]' },
    { num: '04', title: 'Priority Dispatch & Delivery', desc: 'Nationwide logistics network ensuring safe, damage-free delivery to institutional stores.', bg: 'bg-[#FFF0E8]' }
  ];

  return (
    <section id="procurement" className="py-24 bg-[#FAFBFD] relative overflow-hidden border-t border-[#E6ECF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6ECF5] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              Government Procurement & Compliance
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#23324D] tracking-tight font-display">
            SIMPLIFIED <span className="text-[#6EA8FE]">GeM & TENDER SUPPLIES</span>
          </h2>

          <p className="text-[#5F708A] text-base font-light leading-relaxed">
            Fully registered on the Government e-Marketplace (GeM) with decades of experience handling tender specifications, rate contracts, and institutional billing.
          </p>
        </div>

        {/* 4 Steps Procurement Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className={`p-6 rounded-3xl border border-[#E6ECF5] relative space-y-3 group hover:shadow-md transition-all ${step.bg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold font-mono text-[#23324D]/40 group-hover:text-[#6EA8FE] transition-colors">
                  {step.num}
                </span>
                <CheckCircle2 className="w-5 h-5 text-[#6EA8FE]" />
              </div>
              <h3 className="text-lg font-bold text-[#23324D] font-display">
                {step.title}
              </h3>
              <p className="text-xs text-[#5F708A] leading-relaxed font-light">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Action Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#CDD8E7] shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#DCEEFF] text-[#23324D] text-xs font-mono font-bold">
                  PROCUREMENT SUPPORT
                </span>
                <span className="text-[#5F708A] text-xs font-mono">
                  Custom BOQ & Tender Compliance
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#23324D] font-display">
                Need Specific GeM Custom Bid Creation or BOQ Matching?
              </h3>

              <p className="text-[#5F708A] text-sm leading-relaxed max-w-2xl font-light">
                Our scientific procurement experts will assist your laboratory department in preparing technical specifications, part numbers, and compliance documentation for GeM publishing.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={onRequestQuote}
                className="w-full py-4 rounded-xl bg-[#6EA8FE] hover:bg-[#5B95F5] text-white font-bold text-sm shadow-xs hover:shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-5 h-5" />
                <span>Submit Institutional RFP / BOQ</span>
              </button>

              <a
                href="#products"
                className="w-full py-3 rounded-xl bg-[#F4F8FC] hover:bg-[#E6ECF5] text-[#23324D] font-bold text-xs border border-[#CDD8E7] text-center flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-[#6EA8FE]" />
                <span>Download Product Specifications</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
