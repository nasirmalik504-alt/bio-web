import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { InvoiceMakerPage } from './InvoiceMakerPage';
import { SavedInvoicesList } from '../components/invoice/SavedInvoicesList';
import { CompanyBankSetupForm } from '../components/invoice/CompanyBankSetupForm';
import { DEFAULT_COMPANY_CONFIG } from '../config/invoiceConfig';
import { PRODUCTS_DATA } from '../data/productsData';
import { InvoiceData } from '../types/invoiceTypes';
import { isSessionAuthenticated, setSessionAuthenticated } from '../utils/authStorage';
import { DashboardLockModal } from '../components/auth/DashboardLockModal';
import {
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  Building2,
  TrendingUp,
  CreditCard,
  Settings,
  Users,
  ShieldCheck,
  ArrowUpRight,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  History,
  LogOut,
  Lock
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isSessionAuthenticated());

  // Determine active tab from URL query params or path
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || (location.pathname.includes('invoice-maker') ? 'invoice-maker' : 'overview');

  const [activeTab, setActiveTab] = useState<'overview' | 'invoice-maker' | 'saved-invoices' | 'quotes' | 'settings'>(
    (initialTab as any) || 'overview'
  );
  const [loadedInvoiceForMaker, setLoadedInvoiceForMaker] = useState<InvoiceData | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('tab');
    if (q && ['overview', 'invoice-maker', 'saved-invoices', 'quotes', 'settings'].includes(q)) {
      setActiveTab(q as any);
    }
  }, [location.search]);

  const handleTabChange = (tab: 'overview' | 'invoice-maker' | 'saved-invoices' | 'quotes' | 'settings') => {
    setActiveTab(tab);
    navigate(`/dashboard?tab=${tab}`);
  };

  const handleLogout = () => {
    setSessionAuthenticated(false);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <DashboardLockModal onUnlock={() => setIsAuthenticated(true)} />;
  }

  // Sample analytics stats
  const totalProducts = PRODUCTS_DATA.length;
  const categoriesCount = new Set(PRODUCTS_DATA.map((p) => p.category)).size;

  return (
    <div className="min-h-screen bg-[#F4F8FC] pt-0 pb-16">
      
      {/* Hide dashboard navbar/sidebar when printing invoice */}
      <style font-media="print">{`
        @media print {
          .no-print, header, footer, .dashboard-sidebar, .dashboard-header {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Dashboard Sub-Header / Control Bar */}
      <div className="no-print bg-[#23324D] text-white border-b border-[#1A263B] py-4 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#6EA8FE]/20 rounded-xl border border-[#6EA8FE]/30 text-[#6EA8FE]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white font-display">
                  Biobusiness Admin Portal
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-[#6EA8FE]/20 text-[#6EA8FE] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#6EA8FE]/30">
                  Internal System
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Government Supplier Operations • Tax Invoice Management • Quotation Dispatch
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setLoadedInvoiceForMaker(null); handleTabChange('invoice-maker'); }}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'invoice-maker'
                  ? 'bg-[#6EA8FE] text-white shadow-xs'
                  : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
            >
              <Plus className="w-4 h-4" /> Create New Tax Invoice
            </button>
            <button
              onClick={() => handleTabChange('overview')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-[#23324D]'
                  : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              title="Return to Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Public Website
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-[#FCECEF]/20 hover:bg-[#FCECEF]/30 text-[#F8B4BF] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer border border-[#F8B4BF]/30"
              title="Lock Admin Portal & Require Password"
            >
              <LogOut className="w-3.5 h-3.5" /> Lock Portal
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Navigation Tabs Bar */}
        <div className="no-print flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#E6ECF5] shadow-2xs mb-6 overflow-x-auto">
          <button
            onClick={() => handleTabChange('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#23324D] text-white shadow-xs'
                : 'text-[#5F708A] hover:bg-[#F4F8FC] hover:text-[#23324D]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Operations Overview
          </button>

          <button
            onClick={() => handleTabChange('invoice-maker')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'invoice-maker'
                ? 'bg-[#23324D] text-white shadow-xs'
                : 'text-[#5F708A] hover:bg-[#F4F8FC] hover:text-[#23324D]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#6EA8FE]" /> Tax Invoice Maker
          </button>

          <button
            onClick={() => handleTabChange('saved-invoices')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'saved-invoices'
                ? 'bg-[#23324D] text-white shadow-xs'
                : 'text-[#5F708A] hover:bg-[#F4F8FC] hover:text-[#23324D]'
            }`}
          >
            <History className="w-4 h-4 text-[#7CC9A5]" /> Saved Bills & History
          </button>

          <button
            onClick={() => handleTabChange('quotes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'quotes'
                ? 'bg-[#23324D] text-white shadow-xs'
                : 'text-[#5F708A] hover:bg-[#F4F8FC] hover:text-[#23324D]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Quote Requests & Log
          </button>

          <button
            onClick={() => handleTabChange('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#23324D] text-white shadow-xs'
                : 'text-[#5F708A] hover:bg-[#F4F8FC] hover:text-[#23324D]'
            }`}
          >
            <Settings className="w-4 h-4" /> Company & Bank Setup
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E6ECF5] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#5F708A] font-semibold">
                  <span>Total Catalogue Items</span>
                  <div className="p-2 bg-[#EAF2FF] text-[#6EA8FE] rounded-xl">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#23324D] font-mono">{totalProducts}</div>
                <div className="text-[11px] text-[#5F708A] flex items-center gap-1">
                  <span className="text-[#7CC9A5] font-bold">Active</span> across {categoriesCount} categories
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E6ECF5] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#5F708A] font-semibold">
                  <span>Target Google Sheet</span>
                  <div className="p-2 bg-[#EAF7F2] text-[#7CC9A5] rounded-xl">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-bold text-[#23324D] truncate">Invoices & Items</div>
                <div className="text-[11px] text-[#5F708A]">Live Apps Script Sync Enabled</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E6ECF5] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#5F708A] font-semibold">
                  <span>Default Tax Rate</span>
                  <div className="p-2 bg-[#FFF8D9] text-[#E5A93C] rounded-xl">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#23324D] font-mono">IGST 18%</div>
                <div className="text-[11px] text-[#5F708A]">Configurable to CGST / SGST</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E6ECF5] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#5F708A] font-semibold">
                  <span>Invoice Numbering</span>
                  <div className="p-2 bg-[#EEE8FF] text-[#6EA8FE] rounded-xl">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#23324D] font-mono">BDA / Auto</div>
                <div className="text-[11px] text-[#5F708A]">Sequential Lock Service</div>
              </div>
            </div>

            {/* Middle Quick Launch Banner */}
            <div className="bg-gradient-to-r from-[#23324D] to-[#1A263B] text-white p-8 rounded-2xl border border-[#1A263B] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6EA8FE]/20 text-[#6EA8FE] text-xs font-bold border border-[#6EA8FE]/30">
                  <FileText className="w-3.5 h-3.5" /> Official Billing Engine
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                  Tax Invoice / Bill Maker Module
                </h2>
                <p className="text-sm text-gray-300 font-light leading-relaxed">
                  Generate, preview, calculate, print A4 tax invoices, and automatically sync structured records directly to your connected Google Sheet database.
                </p>
              </div>

              <button
                onClick={() => handleTabChange('invoice-maker')}
                className="px-6 py-3 bg-[#6EA8FE] hover:bg-[#5896EE] text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer text-sm"
              >
                Launch Invoice Maker <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Institution Quick Header Examples */}
              <div className="bg-white p-6 rounded-2xl border border-[#E6ECF5] shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-[#23324D] border-b border-[#E6ECF5] pb-2 flex items-center gap-2">
                  <span>🏛️</span> Active Rate Contract Partners
                </h3>
                <div className="space-y-3 text-xs text-[#5F708A]">
                  <div className="p-3 rounded-xl bg-[#F4F8FC] border border-[#E6ECF5] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#23324D]">CPRI Shimla (ICAR)</div>
                      <div className="text-[11px] text-[#5F708A]">Central Potato Research Institute, Bemloe</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#EAF7F2] text-[#1B6D4A] font-bold font-mono text-[10px]">
                      Active Buyer
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4F8FC] border border-[#E6ECF5] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#23324D]">CSIR - IGIB New Delhi</div>
                      <div className="text-[11px] text-[#5F708A]">Institute of Genomics & Integrative Biology</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#EAF7F2] text-[#1B6D4A] font-bold font-mono text-[10px]">
                      Active Buyer
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4F8FC] border border-[#E6ECF5] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#23324D]">IARI Pusa (ICAR)</div>
                      <div className="text-[11px] text-[#5F708A]">Indian Agricultural Research Institute</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#EAF7F2] text-[#1B6D4A] font-bold font-mono text-[10px]">
                      Active Buyer
                    </span>
                  </div>
                </div>
              </div>

              {/* Default Company Bank Specs */}
              <div className="bg-white p-6 rounded-2xl border border-[#E6ECF5] shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-[#23324D] border-b border-[#E6ECF5] pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>🏦</span> Configured Bank Account
                  </span>
                  <button
                    onClick={() => handleTabChange('settings')}
                    className="text-xs text-[#6EA8FE] hover:underline font-normal cursor-pointer"
                  >
                    Edit Configuration
                  </button>
                </h3>
                <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] space-y-2 text-xs font-mono text-[#23324D]">
                  <div className="flex justify-between border-b border-[#E6ECF5] pb-1.5">
                    <span className="text-[#5F708A] font-sans">Beneficiary:</span>
                    <span className="font-bold">{DEFAULT_COMPANY_CONFIG.bankDetails.beneficiary}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E6ECF5] pb-1.5">
                    <span className="text-[#5F708A] font-sans">Bank:</span>
                    <span className="font-bold">{DEFAULT_COMPANY_CONFIG.bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E6ECF5] pb-1.5">
                    <span className="text-[#5F708A] font-sans">Account No.:</span>
                    <span className="font-bold">{DEFAULT_COMPANY_CONFIG.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E6ECF5] pb-1.5">
                    <span className="text-[#5F708A] font-sans">IFSC:</span>
                    <span className="font-bold">{DEFAULT_COMPANY_CONFIG.bankDetails.ifsc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5F708A] font-sans">Branch:</span>
                    <span className="font-bold text-[11px]">{DEFAULT_COMPANY_CONFIG.bankDetails.branch}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: TAX INVOICE MAKER MODULE */}
        {activeTab === 'invoice-maker' && (
          <div className="space-y-4">
            <InvoiceMakerPage initialInvoiceData={loadedInvoiceForMaker} />
          </div>
        )}

        {/* TAB 3: SAVED INVOICES & BILL HISTORY */}
        {activeTab === 'saved-invoices' && (
          <SavedInvoicesList
            onLoadInvoice={(loadedData) => {
              setLoadedInvoiceForMaker(loadedData);
              handleTabChange('invoice-maker');
            }}
            onOpenInvoiceMaker={() => {
              setLoadedInvoiceForMaker(null);
              handleTabChange('invoice-maker');
            }}
          />
        )}

        {/* TAB 3: QUOTE REQUESTS LOG */}
        {activeTab === 'quotes' && (
          <div className="bg-white p-6 rounded-2xl border border-[#E6ECF5] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6ECF5] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#23324D] flex items-center gap-2">
                  <span>📜</span> Quotes & Customer Enquiries
                </h3>
                <p className="text-xs text-[#5F708A] mt-0.5">
                  Submissions logged from website forms to Google Sheets target tabs: <code>Quote Requests</code> & <code>Contact Messages</code>.
                </p>
              </div>

              <a
                href="https://script.google.com"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-[#F4F8FC] hover:bg-[#EAF2FF] text-[#23324D] text-xs font-bold rounded-xl border border-[#E6ECF5] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Open Google Sheets <ExternalLink className="w-3.5 h-3.5 text-[#6EA8FE]" />
              </a>
            </div>

            <div className="p-8 text-center bg-[#FAFBFD] rounded-xl border border-dashed border-[#E6ECF5] space-y-3">
              <FileSpreadsheet className="w-10 h-10 text-[#6EA8FE] mx-auto opacity-80" />
              <div className="text-sm font-bold text-[#23324D]">
                Connected to Google Apps Script Web App Backend
              </div>
              <p className="text-xs text-[#5F708A] max-w-lg mx-auto leading-relaxed">
                All institutional quotes and tax invoices generated through this portal are saved atomically to your active Google Spreadsheet workbook.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: COMPANY & BANK CONFIGURATION */}
        {activeTab === 'settings' && (
          <CompanyBankSetupForm />
        )}

      </div>
    </div>
  );
};
