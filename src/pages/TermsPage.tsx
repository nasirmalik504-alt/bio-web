import React from 'react';
import { Scale, FileCheck, ShieldAlert, Truck, Award, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { generateBreadcrumbSchema } from '../lib/seo';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-[#FAFBFD] relative overflow-hidden min-h-screen text-[#5F708A]">
      <SEO
        title="Terms & Conditions | Biobusiness Development Agency"
        description="Official Terms and Conditions for scientific procurement, rate contracts, tender fulfillment, and delivery by Biobusiness Development Agency."
        canonicalPath="/terms-and-conditions"
      />
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Terms & Conditions', url: '/terms-and-conditions' },
        ])}
        id="terms-breadcrumb-schema"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6ECF5] shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              Institutional Terms of Supply
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#23324D] tracking-tight font-display">
            TERMS & <span className="text-[#6EA8FE]">CONDITIONS</span>
          </h1>

          <p className="text-[#5F708A] text-sm sm:text-base font-light leading-relaxed">
            Effective Date: January 1, 2026 • Terms governing scientific supply contracts, proforma invoices, GeM bidding, and product delivery by Biobusiness Development Agency.
          </p>
        </div>

        {/* Policy Sections Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E6ECF5] shadow-2xs space-y-10">
          
          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-lg font-bold text-[#23324D] font-display">
              <div className="p-2.5 rounded-xl bg-[#DCEEFF] text-[#6EA8FE]">
                <FileCheck className="w-5 h-5" />
              </div>
              <h2>1. Scope of Supply & Order Acceptance</h2>
            </div>
            <p className="text-sm text-[#5F708A] leading-relaxed font-light pl-11">
              Biobusiness Development Agency provides scientific laboratory supplies, including borosilicate glassware, plasticware, liquid handling instruments, safety equipment, fine chemicals, and laboratory instruments. All orders and rate contract agreements are subject to formal confirmation via Proforma Invoice or Purchase Order (PO) issuing.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-6 border-t border-[#E6ECF5]">
            <div className="flex items-center gap-3 text-lg font-bold text-[#23324D] font-display">
              <div className="p-2.5 rounded-xl bg-[#EAF7F2] text-[#7CC9A5]">
                <Award className="w-5 h-5" />
              </div>
              <h2>2. Quotation Validity & Pricing</h2>
            </div>
            <p className="text-sm text-[#5F708A] leading-relaxed font-light pl-11">
              Official quotations generated through the online Quote Basket or issued via sales desk are valid for 30 to 90 days as indicated on the quotation document. Institutional discount structures and bulk BOQ rates apply to verified ICAR, CSIR, ICMR, IIT, and government research bodies.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-6 border-t border-[#E6ECF5]">
            <div className="flex items-center gap-3 text-lg font-bold text-[#23324D] font-display">
              <div className="p-2.5 rounded-xl bg-[#FFF0E8] text-[#F28B82]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h2>3. Quality & Certification Standards</h2>
            </div>
            <p className="text-sm text-[#5F708A] leading-relaxed font-light pl-11">
              All supplied products comply with specified manufacturing standards:
            </p>
            <ul className="list-disc pl-16 text-sm text-[#5F708A] font-light space-y-1.5">
              <li>Glassware: ISO 3583 / NABL certified Class A Borosilicate 3.3 glass</li>
              <li>Plasticware: USP Class VI medical-grade autoclavable polypropylene</li>
              <li>Chemicals: 100% factory-sealed containers with batch CoA and MSDS</li>
              <li>Instruments: Reputed ISO/CE certified international and domestic manufacturers</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pt-6 border-t border-[#E6ECF5]">
            <div className="flex items-center gap-3 text-lg font-bold text-[#23324D] font-display">
              <div className="p-2.5 rounded-xl bg-[#EEE8FF] text-[#6EA8FE]">
                <Truck className="w-5 h-5" />
              </div>
              <h2>4. Delivery, Transit & Inspection</h2>
            </div>
            <p className="text-sm text-[#5F708A] leading-relaxed font-light pl-11">
              Shipments are packed in compliance with hazardous material and cold-chain protocols where applicable. Consignees are requested to inspect packages upon arrival. Any transit damages or discrepancies must be reported within 7 business days for replacement processing.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 pt-6 border-t border-[#E6ECF5]">
            <div className="flex items-center gap-3 text-lg font-bold text-[#23324D] font-display">
              <div className="p-2.5 rounded-xl bg-[#EAF7F2] text-[#7CC9A5]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2>5. Jurisdiction & Legal Framework</h2>
            </div>
            <p className="text-sm text-[#5F708A] leading-relaxed font-light pl-11">
              All transactions, tenders, and supply agreements entered into with Biobusiness Development Agency shall be governed by the laws of India, with exclusive legal jurisdiction resting in the courts of <strong>New Delhi, India</strong>.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
