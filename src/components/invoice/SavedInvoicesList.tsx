import React, { useState, useEffect } from 'react';
import { SavedInvoiceRecord } from '../../utils/invoiceStorage';
import { fetchInvoicesFromGoogleSheets, deleteInvoiceFromGoogleSheets, fetchSingleInvoiceFromGoogleSheets } from '../../services/invoiceService';
import { exportInvoicesToCSV } from '../../utils/excelExport';
import { InvoiceData } from '../../types/invoiceTypes';
import { formatDateToDDMMYYYY } from '../../utils/dateFormatter';
import { FileText, Search, Trash2, Edit3, CheckCircle2, RefreshCw, FileSpreadsheet, Cloud, CloudOff } from 'lucide-react';

interface SavedInvoicesListProps {
  onLoadInvoice: (data: InvoiceData) => void;
  onOpenInvoiceMaker: () => void;
}

export const SavedInvoicesList: React.FC<SavedInvoicesListProps> = ({
  onLoadInvoice,
  onOpenInvoiceMaker
}) => {
  const [invoices, setInvoices] = useState<SavedInvoiceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadInvoices = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const remoteInvoices = await fetchInvoicesFromGoogleSheets();
      setInvoices(remoteInvoices);
      setIsSynced(true);
    } catch (err: any) {
      console.error('Could not fetch invoices from Google Sheets backend:', err);
      setIsSynced(false);
      setErrorMessage('Unable to load invoices from Google Sheets.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();

    // Auto-sync live invoices from Google Sheets every 10 seconds for real-time cross-device sync
    const interval = setInterval(() => {
      fetchInvoicesFromGoogleSheets().then((remoteInvoices) => {
        if (Array.isArray(remoteInvoices) && remoteInvoices.length > 0) {
          setInvoices(remoteInvoices);
          setIsSynced(true);
        }
      }).catch(() => {});
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (invNo: string) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invNo} from Google Sheets & saved history?`)) {
      setInvoices((prev) => prev.filter((item) => item.invoiceNumber !== invNo));
      await deleteInvoiceFromGoogleSheets(invNo);
      loadInvoices();
    }
  };

  const filteredInvoices = invoices.filter((item) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.invoiceNumber.toLowerCase().includes(q) ||
      item.institution.toLowerCase().includes(q) ||
      item.customerName.toLowerCase().includes(q) ||
      item.date.includes(q)
    );
  });

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E6ECF5] shadow-2xs space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6ECF5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#23324D]">
              💾 Saved Bills & Invoice History
            </h3>
            {isLoading ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF2FF] text-[#6EA8FE] text-[11px] font-bold border border-[#6EA8FE]/30 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" /> Fetching from Google Sheets...
              </span>
            ) : isSynced ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF7F2] text-[#1B6D4A] text-[11px] font-bold border border-[#A8E6CE]">
                <Cloud className="w-3.5 h-3.5 text-[#1B6D4A]" /> Google Sheets Live (Phone & Laptop)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF5F5] text-red-600 text-[11px] font-bold border border-red-200">
                <CloudOff className="w-3.5 h-3.5 text-red-600" /> Unable to connect to Google Sheets
              </span>
            )}
          </div>
          <p className="text-xs text-[#5F708A] mt-1">
            View, recall, edit, and export tax bills stored centrally in your Google Sheets database. Changes appear instantly on all devices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {invoices.length > 0 && (
            <button
              onClick={() => exportInvoicesToCSV(filteredInvoices)}
              className="px-3 py-1.5 bg-[#EAF7F2] hover:bg-[#D6F2E7] text-[#1B6D4A] text-xs font-bold rounded-xl border border-[#A8E6CE] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Export 12-Column GST Tax Register to Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#1B6D4A]" /> Export Excel / GST Register
            </button>
          )}

          <div className="relative">
            <Search className="w-4 h-4 text-[#5F708A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Invoice No, Institution..."
              className="pl-9 pr-3 py-1.5 text-xs border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none w-64"
            />
          </div>

          <button
            onClick={loadInvoices}
            disabled={isLoading}
            className="p-2 text-[#5F708A] hover:bg-[#F4F8FC] rounded-xl border border-[#E6ECF5] transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh List from Google Sheets"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#6EA8FE]' : ''}`} />
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button onClick={loadInvoices} className="underline font-bold hover:text-red-800 cursor-pointer">Retry Fetch</button>
        </div>
      )}

      {filteredInvoices.length === 0 ? (
        <div className="p-12 text-center bg-[#FAFBFD] rounded-xl border border-dashed border-[#E6ECF5] space-y-3">
          <FileText className="w-10 h-10 text-[#6EA8FE] mx-auto opacity-70" />
          <div className="text-sm font-bold text-[#23324D]">No Saved Bills Found</div>
          <p className="text-xs text-[#5F708A] max-w-md mx-auto">
            Bills generated using the Tax Invoice Maker are automatically saved to Google Sheets so you can recall, edit, and re-print them from any Phone or Laptop.
          </p>
          <button
            onClick={onOpenInvoiceMaker}
            className="px-4 py-2 bg-[#6EA8FE] hover:bg-[#5896EE] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileText className="w-4 h-4" /> Create New Bill
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6ECF5] bg-[#F4F8FC] text-xs font-bold text-[#23324D]">
                <th className="p-3">Invoice No.</th>
                <th className="p-3">Institution / Customer</th>
                <th className="p-3">Invoice Date</th>
                <th className="p-3 text-right">Amount (₹)</th>
                <th className="p-3 text-center">Sync Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5] text-xs text-[#23324D]">
              {filteredInvoices.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F9FAFC] transition-colors">
                  <td className="p-3 font-mono font-bold text-[#6EA8FE]">
                    {rec.invoiceNumber}
                  </td>
                  <td className="p-3">
                    <div className="font-bold">{rec.institution || rec.customerName}</div>
                    <div className="text-[11px] text-[#5F708A]">{rec.customerName}</div>
                  </td>
                  <td className="p-3 font-mono text-[#5F708A]">
                    {formatDateToDDMMYYYY(rec.date)}
                  </td>
                  <td className="p-3 text-right font-mono font-bold">
                    ₹{rec.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF7F2] text-[#1B6D4A] text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-[#1B6D4A]" /> Google Sheets Live
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button
                      onClick={async () => {
                        const liveRecord = await fetchSingleInvoiceFromGoogleSheets(rec.invoiceNumber);
                        onLoadInvoice(liveRecord ? liveRecord.data : rec.data);
                        onOpenInvoiceMaker();
                      }}
                      className="px-2.5 py-1 bg-[#6EA8FE] hover:bg-[#5896EE] text-white text-[11px] font-bold rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer"
                      title="Load & Print Invoice"
                    >
                      <Edit3 className="w-3 h-3" /> Load / Edit / Print
                    </button>
                    <button
                      onClick={() => handleDelete(rec.invoiceNumber)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
