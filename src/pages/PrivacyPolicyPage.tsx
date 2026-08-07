import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { generateBreadcrumbSchema } from '../lib/seo';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-[#FAFBFD] relative overflow-hidden min-h-screen text-[#5F708A]">
      <SEO
        title="Privacy Policy | Biobusiness Development Agency"
        description="Privacy Policy and Data Protection standards of Biobusiness Development Agency regarding institutional inquiries, rate contracts, and quote requests."
        canonicalPath="/privacy-policy"
      />
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy-policy' },
        ])}
        id="privacy-breadcrumb-schema"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6ECF5] shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-[#6EA8FE]" />
            <span className="text-xs font-mono font-bold text-[#6EA8FE] uppercase tracking-widest">
              Data Protection & Privacy Standards
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#23324D] tracking-tight font-display">
            PRIVACY <span className="text-[#6EA8FE]">POLICY</span>
          </h1>

          <p className="text-[#5F708A] text-sm sm:text-base font-light leading-relaxed">
            Effective Date: January 1, 2026 • Biobusiness Development Agency is committed to maintaining 100% confidentiality, security, and integrity for all institutional clients and researchers across India.
          </p>
        </div>

        {/* Policy Sections Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E6ECF5] shadow-2xs space-y-10">
          
          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-lg font-bold text-[#23324D] font-display">
              <div className="p-2.5 rounded-xl bg-[#DCEEFF] text-[#6EA8FE]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2>1. Information We Collect</h2>
            </div>
            <p className="text-sm text-[#5F708A] leading-relaxed font-light pl-11">
              When you submit a quote request, BOQ inquiry, or rate contract request through Biobusiness Development Agency, we collect institutional information necessary for processing your order, including:
            </p>
            <ul className="list-disc pl-16 text-sm text-[#5F708A] font-light space-y-1.5">
              <li>Full Name and Professional Title / Designation</li>
              <li>Research Institute, University, or Department (e.g., ICAR, CSIR, IIT, ICMR)</li>
              <li>Official Institutional Email Address & Phone Number</li>
              <li>GSTIN and Shipping / Billing Address for Tender & BOQ Documentation</li>
              <li>Specific Product Catalog Numbers, Custom Inquiries, and Quantities Requested</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-6 border-t border-[#E6ECF5]">
            <div className="flex items-center gap-3 text-lg font-bold text-[#23324D] font-display">
              <div className="p-2.5 rounded-xl bg-[#EAF7F2] text-[#7CC9A5]">
                <FileText className="w-5 h-5" />
              </div>
              <h2>2. How We Use Your Information</h2>
            </div>
            <p className="text-sm text-[#5F708A] leading-relaxed font-light pl-11">
              The information collected is strictly utilized to fulfill scientific supply requirements and maintain compliance with Indian government procurement norms:
            </p>
            <ul className="list-disc pl-16 text-sm text-[#5F708A] font-light space-y-1.5">
              <li>Generating formal proforma invoices, official quotes, and rate contract estimates</li>
              <li>Processing GeM (Government e-Marketplace) bids and institutional tender documentation</li>
              <li>Dispatching batch-specific Certificates of Analysis (CoA) and Material Safety Data Sheets (MSDS)</li>
              <li>Providing technical assistance regarding product specifications and warranty claims</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-6 border-t border-[#E6ECF5]">
            <div className="flex items-center gap-3 text-lg font-bold text-[#23324D] font-display">
              <div className="p-2.5 rounded-xl bg-[#FFF0E8] text-[#F28B82]">
                <Lock className="w-5 h-5" />
              </div>
              <h2>3. Data Confidentiality & Non-Disclosure</h2>
            </div>
            <p className="text-sm text-[#5F708A] leading-relaxed font-light pl-11">
              Biobusiness Development Agency enforces strict data privacy protocols. We <strong>NEVER sell, rent, or trade</strong> your personal or institutional data to third-party marketing companies. All data submitted is stored on secure SSL-encrypted servers certified under ISO 9001:2015 standards.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pt-6 border-t border-[#E6ECF5]">
            <div className="flex items-center gap-3 text-lg font-bold text-[#23324D] font-display">
              <div className="p-2.5 rounded-xl bg-[#EEE8FF] text-[#6EA8FE]">
                <Eye className="w-5 h-5" />
              </div>
              <h2>4. Cookies & Web Analytics</h2>
            </div>
            <p className="text-sm text-[#5F708A] leading-relaxed font-light pl-11">
              Our website uses essential session cookies to remember items in your Quote Basket and analyze aggregated site traffic via Google Analytics. Cookies do not store confidential personal credentials and can be managed via your browser settings.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 pt-6 border-t border-[#E6ECF5]">
            <div className="flex items-center gap-3 text-lg font-bold text-[#23324D] font-display">
              <div className="p-2.5 rounded-xl bg-[#EAF7F2] text-[#7CC9A5]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2>5. Contact Us for Privacy Concerns</h2>
            </div>
            <p className="text-sm text-[#5F708A] leading-relaxed font-light pl-11">
              If you have any questions or data inquiries regarding our Privacy Policy, please contact our administrative desk:
            </p>
            <div className="ml-11 p-4 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] text-xs font-mono space-y-1 text-[#23324D]">
              <p><strong>Biobusiness Development Agency</strong></p>
              <p>Email: info@biobusiness.in</p>
              <p>Phone: +91-11-23456789</p>
              <p>New Delhi, India</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
