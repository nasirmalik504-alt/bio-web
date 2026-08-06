import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Award, CheckCircle2 } from 'lucide-react';

export interface BrandPartner {
  id: string;
  name: string;
  category: string;
  logo: string;
  website: string;
  country: string;
  description: string;
}

export const BRAND_PARTNERS: BrandPartner[] = [
  {
    id: 'microlit',
    name: 'Microlit',
    category: 'Liquid Handling Systems',
    logo: '🧪',
    website: 'https://www.microlit.com',
    country: 'India',
    description: 'Precision micropipettes, electronic pipettes, digital bottle top dispensers, and electronic burettes.',
  },
  {
    id: 'axiva-sichem',
    name: 'Axiva Sichem',
    category: 'Filtration & Laboratory Media',
    logo: '🔬',
    website: 'https://www.axiva.com',
    country: 'India',
    description: 'Syringe filters, membrane discs, glass microfibre filter papers, SS manifolds, and vacuum pumps.',
  },
  {
    id: 'qualikems',
    name: 'Qualikems Fine Chem',
    category: 'Fine Chemicals & Reagents',
    logo: '⚗️',
    website: 'https://www.qualikems.com',
    country: 'India',
    description: 'AR/LR laboratory chemicals, HPLC solvents, analytical indicators, and biological buffers.',
  },
  {
    id: 'labogens',
    name: 'Labogens Biotechnology',
    category: 'Diagnostic & Life Science Reagents',
    logo: '🧫',
    website: 'http://www.labogens.com',
    country: 'India',
    description: 'Dehydrated culture media, molecular biology reagents, and diagnostic stain solutions.',
  },
  {
    id: 'orochemie',
    name: 'Orochemie Laboratory Pvt Ltd',
    category: 'Disinfection & Hygiene Systems',
    logo: '🛡️',
    website: 'https://www.orochemie.de',
    country: 'Germany',
    description: 'EN/ISO certified hospital-grade surface disinfectants, instrument cleaners, and hand hygiene.',
  },
];

export const OfficialDistributionTrustBadge: React.FC = () => {
  return (
    <section className="py-16 bg-white border-y border-[#E6ECF5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF7F2] border border-[#7CC9A5]/30">
            <ShieldCheck className="w-4 h-4 text-[#7CC9A5]" />
            <span className="text-xs font-mono font-bold text-[#23324D] uppercase tracking-wider">
              OFFICIAL AUTHORIZED DISTRIBUTION PARTNER
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#23324D] font-display tracking-tight">
            DIRECT MANUFACTURER AUTHORIZATION & GUARANTEE
          </h2>

          <p className="text-[#5F708A] text-sm font-light leading-relaxed">
            Biobusiness Development Agency is an authorized supplier for premier laboratory equipment manufacturers. We provide 100% original manufacturer catalogue numbers, factory calibration certificates, and full warranty support.
          </p>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRAND_PARTNERS.map((brand) => (
            <div
              key={brand.id}
              className="p-6 rounded-3xl bg-[#FAFBFD] border border-[#E6ECF5] hover:border-[#CDD8E7] hover:bg-white transition-all group flex flex-col justify-between space-y-5 shadow-2xs hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E6ECF5] flex items-center justify-center text-2xl shadow-2xs">
                    {brand.logo}
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#EAF7F2] border border-[#7CC9A5]/30 text-[#23324D] text-[11px] font-mono font-bold">
                    Made in {brand.country}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#23324D] font-display group-hover:text-[#6EA8FE] transition-colors">
                    {brand.name}
                  </h3>
                  <div className="text-xs font-mono text-[#6EA8FE] font-bold mt-0.5">
                    {brand.category}
                  </div>
                </div>

                <p className="text-xs text-[#5F708A] font-light leading-relaxed">
                  {brand.description}
                </p>

                {/* Trust Points */}
                <div className="space-y-1.5 pt-2 border-t border-[#E6ECF5] text-[11px] text-[#23324D] font-medium font-mono">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7CC9A5]" />
                    <span>Genuine Manufacturer Product</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7CC9A5]" />
                    <span>Original Catalogue Numbers Preserved</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7CC9A5]" />
                    <span>Supplied by Biobusiness Development Agency</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/brands/${brand.id}`}
                className="pt-3 flex items-center justify-between text-xs font-bold text-[#6EA8FE] hover:text-[#5B95F5] group/link cursor-pointer border-t border-[#E6ECF5]"
              >
                <span>Learn About {brand.name}</span>
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
