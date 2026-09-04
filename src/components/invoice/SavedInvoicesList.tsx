import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getInvoices, deleteInvoice, InvoiceRecord } from '../../services/invoiceService';
import { exportInvoicesToCSV } from '../../utils/excelExport';
import { InvoiceData } from '../../types/invoiceTypes';
import { formatDateToDDMMYYYY } from '../../utils/dateFormatter';
import { ExactInvoicePreview } from './ExactInvoicePreview';
import {
  FileText, Search, Trash2, Eye, CheckCircle2,
  RefreshCw, FileSpreadsheet, Cloud, CloudOff, X, Printer
} from 'lucide-react';

interface Props {
  onLoadInvoice: (data: InvoiceData) => void;
  onOpenInvoiceMaker: () => void;
}

export const SavedInvoicesList: React.FC<Props> = ({ onLoadInvoice, onOpenInvoiceMaker }) => {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [previewInvoice, setPreviewInvoice] = useState<InvoiceData | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // ── Fetch all invoices from Google Sheets ──────────────────
  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const records = await getInvoices();
      setInvoices(records);
      setSynced(true);
    } catch (err: any) {
      setSynced(false);
      setError(err?.message || 'Unable to load invoices from Google Sheets.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount; auto-refresh every 15 seconds for cross-device sync
  useEffect(() => {
    loadInvoices();
    const timer = setInterval(loadInvoices, 15000);
    return () => clearInterval(timer);
  }, [loadInvoices]);

  // ── Delete Invoice (Requires Confirmation) ──────────────────
  const handleDelete = async (invoiceNumber: string) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete invoice ${invoiceNumber} from Google Sheets? This action cannot be undone.`)) {
      return;
    }
    setLoading(true);
    try {
      await deleteInvoice(invoiceNumber);
      await loadInvoices();
    } catch (err: any) {
      alert(err.message || 'Failed to delete invoice.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E6ECF5] shadow-2xs">
      
      {/* Strict 1-Page A4 Portrait Print Styles for the Preview Modal */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
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
          .modal-overlay {
            background: none !important;
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .modal-content {
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            display: block !important;
            width: 100% !important;
            height: 100% !important;
          }
          #invoice-document, .invoice-document {
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
            margin: 0 !important;
            padding: 12mm 24mm !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 no-print">
        <div>
          <h2 className="text-xl font-bold text-[#23324D] flex items-center gap-2">
            <span>📜</span> History & Saved Bills
          </h2>
          <div className="flex items-center gap-2 mt-1">
            {synced ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7CC9A5] bg-[#EAF7F2] px-2 py-0.5 rounded-md">
                <Cloud className="w-3 h-3" /> Live Synced with Google Sheets
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                <CloudOff className="w-3 h-3" /> Disconnected
              </span>
            )}
            <p className="text-xs text-[#5F708A]">
              • {invoices.length} invoices found
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F708A]" />
            <input
              type="text"
              placeholder="Search by Bill No. or Customer..."
              className="pl-9 pr-4 py-2 border border-[#E6ECF5] rounded-xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#6EA8FE]/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={loadInvoices}
            disabled={loading}
            className="p-2 border border-[#E6ECF5] text-[#5F708A] hover:bg-[#F4F8FC] hover:text-[#23324D] rounded-xl transition-all disabled:opacity-50"
            title="Refresh from Google Sheets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => exportInvoicesToCSV(invoices)}
            disabled={invoices.length === 0}
            className="px-3.5 py-2 bg-[#EAF7F2] hover:bg-[#D6F2E7] text-[#1B6D4A] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm no-print">
          {error}
        </div>
      )}

      {/* Modern Data Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E6ECF5] no-print">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#FAFBFD] text-[#5F708A] text-xs uppercase font-bold border-b border-[#E6ECF5]">
            <tr>
              <th className="p-4 w-32">Invoice No.</th>
              <th className="p-4 w-32">Date</th>
              <th className="p-4">Customer Name / Institution</th>
              <th className="p-4 text-right w-32">Total Value</th>
              <th className="p-4 text-center w-32">Sync Status</th>
              <th className="p-4 text-right w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6ECF5]">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F4F8FC] transition-colors group">
                  <td className="p-4 font-bold text-[#23324D] font-mono">
                    {rec.invoiceNumber}
                  </td>
                  <td className="p-4 text-[#5F708A]">
                    {formatDateToDDMMYYYY(rec.date)}
                  </td>
                  <td className="p-4 text-[#23324D] font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#EAF2FF] text-[#6EA8FE] flex items-center justify-center font-bold text-xs shrink-0">
                        {rec.customerName.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate max-w-[200px] sm:max-w-xs">{rec.customerName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold text-[#23324D] font-mono">
                    ₹{Number(rec.totalAmount).toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EAF7F2] text-[#1B6D4A] text-[10px] font-bold font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Sheets
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => setPreviewInvoice(rec.data)}
                      className="px-2.5 py-1 bg-[#6EA8FE] hover:bg-[#5896EE] text-white text-[11px] font-bold rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer"
                      title="Preview Invoice"
                    >
                      <Eye className="w-3 h-3" /> View / Print
                    </button>
                    <button
                      onClick={() => handleDelete(rec.invoiceNumber)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Permanently Delete from Sheets"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#5F708A]">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="font-semibold">No invoices found</p>
                  <p className="text-xs mt-1">Try adjusting your search or generate a new invoice.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 modal-overlay">
          <div className="bg-[#F4F8FC] w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col modal-content relative">
            <div className="flex justify-between items-center p-4 bg-white border-b border-[#E6ECF5] rounded-t-2xl no-print shrink-0">
              <h3 className="font-bold text-[#23324D] text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#6EA8FE]" />
                Preview: {previewInvoice.invoiceNumber}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[#6EA8FE] hover:bg-[#5896EE] text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" /> Print / PDF
                </button>
                <button
                  onClick={() => setPreviewInvoice(null)}
                  className="p-2 hover:bg-gray-100 text-gray-500 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto w-full flex justify-center print:flex print:flex-col print:justify-center print:min-h-[100vh] print:overflow-visible print:p-0">
              <div className="w-[210mm] shrink-0 bg-white shadow-2xl print:shadow-none print:w-full print:bg-transparent">
                <ExactInvoicePreview ref={previewRef} data={previewInvoice} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
