import React, { useState, useRef, useEffect } from 'react';
import { InvoiceData } from '../types/invoiceTypes';
import { INITIAL_SAMPLE_INVOICE } from '../config/invoiceConfig';
import { InvoiceForm } from '../components/invoice/InvoiceForm';
import { ExactInvoicePreview } from '../components/invoice/ExactInvoicePreview';
import { saveInvoiceToGoogleSheets, fetchNextInvoiceNumber } from '../services/invoiceService';
import { numberToIndianWords } from '../utils/numberToWords';
import { saveInvoiceToStorage } from '../utils/invoiceStorage';
import { getStoredCompanyConfig } from '../utils/companyConfigStorage';
import { SavedInvoicesList } from '../components/invoice/SavedInvoicesList';
import { Printer, Download, Save, RefreshCw, FileText, CheckCircle2, AlertCircle, Eye, Edit3, History, X } from 'lucide-react';

export const InvoiceMakerPage: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(INITIAL_SAMPLE_INVOICE);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingNextNum, setIsFetchingNextNum] = useState(false);
  const [activeTab, setActiveTab] = useState<'split' | 'form' | 'preview'>('split');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-fetch next invoice number and load central company config on mount
  useEffect(() => {
    handleFetchNextInvoiceNumber();

    const config = getStoredCompanyConfig();
    setInvoiceData((prev) => ({
      ...prev,
      bankDetails: { ...config.bankDetails },
      paymentTerms: config.defaultPaymentTerms,
      jurisdiction: config.defaultJurisdiction,
      paymentNote: config.defaultPaymentNote,
      companyName: config.signatoryHeading,
      contactNumber: config.contactNumber
    }));
  }, []);

  const handleFetchNextInvoiceNumber = async () => {
    setIsFetchingNextNum(true);
    try {
      const nextNum = await fetchNextInvoiceNumber();
      if (nextNum) {
        setInvoiceData((prev) => ({ ...prev, invoiceNumber: nextNum }));
        setNotification({
          type: 'success',
          message: `Fetched next sequential invoice number: ${nextNum}`
        });
      }
    } catch (err) {
      console.warn('Could not fetch next invoice number:', err);
    } finally {
      setIsFetchingNextNum(false);
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!invoiceData.customer.title.trim()) {
      newErrors.title = 'Customer Title / Designation / Name is required.';
    }
    if (!invoiceData.customer.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address Line 1 is required.';
    }
    if (!invoiceData.customer.cityStatePin.trim()) {
      newErrors.cityStatePin = 'City and PIN code are required.';
    }
    if (!invoiceData.customer.state.trim()) {
      newErrors.state = 'State is required.';
    }
    if (!invoiceData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice Number is required.';
    }
    if (!invoiceData.invoiceDate.trim()) {
      newErrors.invoiceDate = 'Invoice Date is required.';
    }
    if (!invoiceData.items || invoiceData.items.length === 0) {
      newErrors.items = 'At least one item is required in the invoice.';
    } else {
      invoiceData.items.forEach((item, idx) => {
        if (!item.description.trim()) {
          newErrors.items = `Item #${idx + 1} requires a description.`;
        } else if (Number(item.quantity) <= 0) {
          newErrors.items = `Item #${idx + 1} quantity must be greater than 0.`;
        } else if (Number(item.unitPrice) < 0) {
          newErrors.items = `Item #${idx + 1} unit price cannot be negative.`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Invoice to Google Sheets & Local History
  const handleSaveToGoogleSheets = async () => {
    setNotification(null);
    if (!validateForm()) {
      setNotification({
        type: 'error',
        message: 'Please resolve the highlighted validation errors before saving.'
      });
      return;
    }

    setIsSaving(true);

    const subtotal = invoiceData.items.reduce(
      (sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 0),
      0
    );
    const taxRate = invoiceData.taxRate || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const finalAmount = Math.round(subtotal + taxAmount);
    const amountInWords = numberToIndianWords(finalAmount);

    const result = await saveInvoiceToGoogleSheets(invoiceData, amountInWords);

    // Save to local storage bill history
    const targetData = { ...invoiceData };
    if (result.invoiceNumber) {
      targetData.invoiceNumber = result.invoiceNumber;
    }
    saveInvoiceToStorage(targetData, result.success);

    setIsSaving(false);

    if (result.success) {
      setNotification({
        type: 'success',
        message: result.message || `Invoice ${result.invoiceNumber || invoiceData.invoiceNumber} saved successfully to Google Sheets & Saved Bills History!`
      });
      if (result.invoiceNumber) {
        const newInvNo = result.invoiceNumber;
        setInvoiceData((prev) => ({ ...prev, invoiceNumber: newInvNo }));
      }
    } else {
      setNotification({
        type: 'error',
        message: result.error || 'Failed to save invoice to Google Sheets (Saved locally in history).'
      });
    }
  };

  // Trigger Print Isolated to Invoice Document
  const handlePrint = () => {
    window.print();
  };

  // Reset form to default initial sample
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all fields to sample defaults?')) {
      setInvoiceData(INITIAL_SAMPLE_INVOICE);
      setErrors({});
      setNotification(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Strict 1-Page A4 Portrait Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, footer, nav, button, .no-print, .print-hide, .dashboard-sidebar, .dashboard-header {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          #invoice-document, .invoice-document {
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .invoice-section, table, tr {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Page Title & Action Bar (Hidden on Print) */}
        <div className="no-print bg-white p-6 rounded-2xl border border-[#E6ECF5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📄</span>
              <h1 className="text-2xl font-black text-[#23324D] tracking-tight">
                Tax Invoice / Bill Maker
              </h1>
            </div>
            <p className="text-xs text-[#5F708A] mt-1">
              Generate & print official traditional Indian tax invoices for Biobusiness Development Agency.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            
            {/* Saved Bills History Button */}
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="px-3.5 py-2.5 bg-[#EAF7F2] hover:bg-[#D6F2E7] text-[#1B6D4A] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-[#A8E6CE]"
            >
              <History className="w-4 h-4" /> Saved Bills History
            </button>

            {/* Save to Google Sheets */}
            <button
              type="button"
              onClick={handleSaveToGoogleSheets}
              disabled={isSaving}
              className="flex-1 md:flex-none px-4 py-2.5 bg-[#23324D] hover:bg-[#1A263B] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#6EA8FE]" />
              ) : (
                <Save className="w-4 h-4 text-[#6EA8FE]" />
              )}
              {isSaving ? 'Saving...' : 'Save Invoice'}
            </button>

            {/* Print Invoice */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 md:flex-none px-4 py-2.5 bg-[#6EA8FE] hover:bg-[#5896EE] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / PDF
            </button>

            {/* Download PDF (Triggers Print to PDF) */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2.5 bg-[#F4F8FC] hover:bg-[#EAF2FF] text-[#23324D] border border-[#E6ECF5] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download PDF"
            >
              <Download className="w-4 h-4 text-[#6EA8FE]" /> Download PDF
            </button>

            {/* Reset Form */}
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2.5 bg-[#FCECEF] hover:bg-[#FADCE2] text-[#D9383A] text-xs font-bold rounded-xl transition-all cursor-pointer"
              title="Reset Form"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {notification && (
          <div
            className={`no-print p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
              notification.type === 'success'
                ? 'bg-[#EAF7F2] border-[#A8E6CE] text-[#1B6D4A]'
                : 'bg-[#FCECEF] border-[#F8B4BF] text-[#C42828]'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#1B6D4A]" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#C42828]" />
            )}
            <span className="flex-1">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-bold hover:underline cursor-pointer ml-auto"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Mode Toggle Controls (Visible on smaller screens / mobile) */}
        <div className="no-print flex lg:hidden items-center justify-center gap-2 bg-[#F4F8FC] p-1.5 rounded-xl border border-[#E6ECF5] max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'form' ? 'bg-white text-[#23324D] shadow-2xs' : 'text-[#5F708A]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'preview' ? 'bg-white text-[#23324D] shadow-2xs' : 'text-[#5F708A]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Live Invoice
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'split' ? 'bg-white text-[#23324D] shadow-2xs' : 'text-[#5F708A]'
            }`}
          >
            Split
          </button>
        </div>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls */}
          <div
            className={`no-print lg:col-span-6 xl:col-span-5 ${
              activeTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <InvoiceForm
              data={invoiceData}
              onChange={setInvoiceData}
              onFetchNextInvoiceNumber={handleFetchNextInvoiceNumber}
              isFetchingNextNum={isFetchingNextNum}
              errors={errors}
            />
          </div>

          {/* Right Column: Live Exact Invoice Preview */}
          <div
            className={`lg:col-span-6 xl:col-span-7 sticky top-24 ${
              activeTab === 'form' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="no-print bg-[#23324D] text-white p-3 rounded-t-2xl flex items-center justify-between text-xs font-bold px-4">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6EA8FE]" /> Realtime A4 Tax Invoice Preview
              </span>
              <span className="text-[11px] font-normal text-gray-300">Exact Visual Layout</span>
            </div>
            <div className="bg-[#E6ECF5] p-4 lg:p-8 rounded-b-2xl overflow-x-auto shadow-inner border-x border-b border-[#D0D9E6]">
              <ExactInvoicePreview ref={previewRef} data={invoiceData} />
            </div>
          </div>
        </div>

        {/* Saved Bills History Modal */}
        {showHistoryModal && (
          <div className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto relative p-6 space-y-4">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-xl transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <SavedInvoicesList
                onLoadInvoice={(loadedData) => {
                  setInvoiceData(loadedData);
                  setShowHistoryModal(false);
                  setNotification({
                    type: 'success',
                    message: `Loaded invoice ${loadedData.invoiceNumber} into the editor & preview.`
                  });
                }}
                onOpenInvoiceMaker={() => setShowHistoryModal(false)}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
