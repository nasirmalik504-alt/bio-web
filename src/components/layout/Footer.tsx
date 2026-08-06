import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Mail, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAFBFD] text-[#5F708A] border-t border-[#E6ECF5] pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white border border-[#E6ECF5] mb-16 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#EAF7F2] text-[#7CC9A5] border border-[#7CC9A5]/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#23324D] uppercase tracking-wider font-display">Government Supplier</div>
              <div className="text-[11px] text-[#5F708A]">GeM Compliant Vendor</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#DCEEFF] text-[#6EA8FE] border border-[#6EA8FE]/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#23324D] uppercase tracking-wider font-display">ISO Certified</div>
              <div className="text-[11px] text-[#5F708A]">Quality Management</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#EEE8FF] text-[#6EA8FE] border border-[#6EA8FE]/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#23324D] uppercase tracking-wider font-display">Rate Contracts</div>
              <div className="text-[11px] text-[#5F708A]">ICAR, CSIR & IITs</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#FFF0E8] text-[#F28B82] border border-[#F28B82]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#23324D] uppercase tracking-wider font-display">29+ Years</div>
              <div className="text-[11px] text-[#5F708A]">Scientific Excellence</div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E6ECF5]">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F28B82] to-[#6EA8FE] p-0.5 shadow-2xs">
                <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center font-extrabold text-[#F28B82] text-lg">
                  B
                </div>
              </div>
              <span className="text-xl font-bold font-display leading-none">
                <span className="text-[#F28B82]">BIO</span>
                <span className="text-[#6EA8FE]">BUSINESS</span>
              </span>
            </div>

            <p className="text-sm text-[#5F708A] leading-relaxed pr-4 font-light">
              Biobusiness Development Agency is a premier scientific partner and supplier of high-precision laboratory plasticware, borosilicate glassware, liquid handling systems, safety gear, and analytical instruments for government research, healthcare, and educational laboratories across South Asia.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white text-[#23324D] text-xs font-mono font-bold border border-[#E6ECF5]">
                GSTIN: Verified
              </span>
              <span className="px-3 py-1 rounded-full bg-white text-[#5F708A] text-xs font-mono border border-[#E6ECF5]">
                MSME Registered
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#23324D] uppercase tracking-wider font-display">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#5F708A]">
              <li>
                <Link to="/" className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1.5 font-light">
                  <span>›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1.5 font-light">
                  <span>›</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1.5 font-light">
                  <span>›</span> Products Catalogue
                </Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1.5 font-light">
                  <span>›</span> Authorized Brands
                </Link>
              </li>
              <li>
                <Link to="/biobrand" className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1.5 font-light">
                  <span>›</span> BioBrand Line
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1.5 font-light">
                  <span>›</span> Contact Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#23324D] uppercase tracking-wider font-display">
              Authorized Brands
            </h4>
            <ul className="space-y-2.5 text-sm text-[#5F708A]">
              <li>
                <Link to="/brands#microlit" className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1.5 font-light">
                  <span>›</span> Microlit Liquid Handling
                </Link>
              </li>
              <li>
                <Link to="/brands#axiva" className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1.5 font-light">
                  <span>›</span> Axiva Sichem Filtration
                </Link>
              </li>
              <li>
                <Link to="/brands#qualikems" className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1.5 font-light">
                  <span>›</span> Qualikems Life Sciences
                </Link>
              </li>
              <li>
                <Link to="/brands#labogens" className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1.5 font-light">
                  <span>›</span> Labogens Biotechnology
                </Link>
              </li>
              <li>
                <Link to="/brands#orochemie" className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1.5 font-light">
                  <span>›</span> Orochemie Laboratory Pvt Ltd
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#23324D] uppercase tracking-wider font-display">
              Corporate Office
            </h4>
            <div className="space-y-3 text-xs text-[#5F708A] font-light">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#6EA8FE] shrink-0 mt-0.5" />
                <span>A-126, Fateh Nagar, New Delhi, Delhi, 110018</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#6EA8FE] shrink-0" />
                <a href="mailto:sales@biobusiness.in" className="hover:text-[#6EA8FE] transition-colors font-mono">
                  sales@biobusiness.in
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5F708A] gap-4 font-light">
          <div>
            © {new Date().getFullYear()} Biobusiness Development Agency. All rights reserved.
          </div>
          <div className="flex gap-6 font-mono text-[11px]">
            <Link to="/brands" className="hover:text-[#6EA8FE]">Authorized Brands</Link>
            <Link to="/biobrand" className="hover:text-[#6EA8FE]">BioBrand</Link>
            <Link to="/contact" className="hover:text-[#6EA8FE]">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
