import React, { useState, useEffect } from 'react';
import { getSavedInvoices, deleteSavedInvoice, SavedInvoiceRecord } from '../../utils/invoiceStorage';
import { exportInvoicesToCSV } from '../../utils/excelExport';
import { InvoiceData } from '../../types/invoiceTypes';
import { FileText, Search, Trash2, Printer, Edit3, Calendar, Building2, CheckCircle2, RefreshCw, FileSpreadsheet, Download } from 'lucide-react';

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

  useEffect(() => {
    setInvoices(getSavedInvoices());
  }, []);

  const handleDelete = (invNo: string) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invNo} from saved history?`)) {
      const updated = deleteSavedInvoice(invNo);
      setInvoices(updated);
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
          <h3 className="text-lg font-bold text-[#23324D] flex items-center gap-2">
            <span>💾</span> Saved Bills & Invoice History
          </h3>
          <p className="text-xs text-[#5F708A] mt-0.5">
            View, recall, edit, and export generated tax bills saved in your agency database.
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
            onClick={() => setInvoices(getSavedInvoices())}
            className="p-2 text-[#5F708A] hover:bg-[#F4F8FC] rounded-xl border border-[#E6ECF5] transition-colors"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="p-12 text-center bg-[#FAFBFD] rounded-xl border border-dashed border-[#E6ECF5] space-y-3">
          <FileText className="w-10 h-10 text-[#6EA8FE] mx-auto opacity-70" />
          <div className="text-sm font-bold text-[#23324D]">No Saved Bills Found</div>
          <p className="text-xs text-[#5F708A] max-w-md mx-auto">
            Bills generated using the Tax Invoice Maker are automatically saved here so you can recall, edit, and re-print them at any time.
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
                <th className="p-3 text-center">Status</th>
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
                    {rec.date}
                  </td>
                  <td className="p-3 text-right font-mono font-bold">
                    ₹{rec.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF7F2] text-[#1B6D4A] text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Saved
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button
                      onClick={() => {
                        onLoadInvoice(rec.data);
                        onOpenInvoiceMaker();
                      }}
                      className="px-2.5 py-1 bg-[#6EA8FE] hover:bg-[#5896EE] text-white text-[11px] font-bold rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer"
                      title="Load & Print Invoice"
                    >
                      <Edit3 className="w-3 h-3" /> Load / Print
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
