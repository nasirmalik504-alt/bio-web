import React from 'react';
import { GovernmentProcurement } from '../components/sections/GovernmentProcurement';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProcurementPageProps {
  onOpenQuoteDrawer: () => void;
}

export const ProcurementPage: React.FC<ProcurementPageProps> = ({ onOpenQuoteDrawer }) => {
  return (
    <div className="pt-28 pb-20 bg-[#FAFBFD] min-h-screen relative overflow-hidden space-y-16 text-[#5F708A]">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6ECF5] shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#6EA8FE]" />
          <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
            Government e-Marketplace & Rate Contracts
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#23324D] tracking-tight font-display">
          GOVERNMENT PROCUREMENT & <span className="text-[#6EA8FE]">GeM PORTAL</span>
        </h1>

        <p className="text-[#5F708A] text-base font-light leading-relaxed">
          Biobusiness Development Agency provides standardized rate contracts, custom BOQ preparation, and GeM portal bid fulfillment for ICAR, CSIR, ICMR, DST, DBT, DAE, and top IITs.
        </p>
      </div>

      <GovernmentProcurement onRequestQuote={onOpenQuoteDrawer} />

      {/* Compliance & Certifications Breakdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E6ECF5] shadow-xs space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              TENDER COMPLIANCE CHECKLIST
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23324D] font-display">
              FULL REGULATORY & OPERATIONAL COMPLIANCE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#EAF7F2] border border-[#CDD8E7] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#7CC9A5] flex items-center justify-center font-bold font-mono shadow-2xs">
                01
              </div>
              <h3 className="text-lg font-bold text-[#23324D] font-display">GeM OEM & Reseller Credentials</h3>
              <p className="text-xs text-[#5F708A] leading-relaxed font-light">
                Authorized product listings with verified brand codes and immediate catalogue availability on the GeM portal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#DCEEFF] border border-[#CDD8E7] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#6EA8FE] flex items-center justify-center font-bold font-mono shadow-2xs">
                02
              </div>
              <h3 className="text-lg font-bold text-[#23324D] font-display">NABL Calibration Certificates</h3>
              <p className="text-xs text-[#5F708A] leading-relaxed font-light">
                Class A volumetric glassware and precision balances supplied with valid NABL batch calibration reports.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#EEE8FF] border border-[#CDD8E7] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#6EA8FE] flex items-center justify-center font-bold font-mono shadow-2xs">
                03
              </div>
              <h3 className="text-lg font-bold text-[#23324D] font-display">GSTIN & MSME Audit Compliance</h3>
              <p className="text-xs text-[#5F708A] leading-relaxed font-light">
                Clean audit trail, transparent billing, and dedicated after-sales service warranty terms for government audits.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
