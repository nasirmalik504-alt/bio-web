/**
 * SavedInvoicesList.tsx
 *
 * Saved Bills & Invoice History
 * ─────────────────────────────
 * Fetches invoices directly from Google Sheets (via invoiceService).
 * NO localStorage. NO local fallback. NO stale cache.
 *
 * Data flow:
 *   mount / Refresh → getInvoices() → Google Apps Script → Google Sheets → render
 *   Load / Edit     → opens invoice editor with server data
 *   Delete          → deleteInvoice() → Google Sheets → re-fetch → re-render
 */

import React, { useState, useEffect, useCallback } from 'react';
import { getInvoices, deleteInvoice, InvoiceRecord } from '../../services/invoiceService';
import { exportInvoicesToCSV } from '../../utils/excelExport';
import { InvoiceData } from '../../types/invoiceTypes';
import { formatDateToDDMMYYYY } from '../../utils/dateFormatter';
import {
  FileText, Search, Trash2, Edit3, CheckCircle2,
  RefreshCw, FileSpreadsheet, Cloud, CloudOff
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

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async (invNo: string) => {
    if (!window.confirm(`Delete invoice ${invNo} from Google Sheets?`)) return;
    // Optimistic UI update
    setInvoices(prev => prev.filter(r => r.invoiceNumber !== invNo));
    const result = await deleteInvoice(invNo);
    if (!result.success) {
      setError(`Delete failed: ${result.error}`);
    }
    // Refresh to reflect true server state
    loadInvoices();
  };

  // ── Filter ────────────────────────────────────────────────
  const filtered = invoices.filter(rec => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      rec.invoiceNumber.toLowerCase().includes(q) ||
      rec.institution.toLowerCase().includes(q) ||
      rec.customerName.toLowerCase().includes(q) ||
      rec.date.includes(q)
    );
  });

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E6ECF5] shadow-2xs space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6ECF5] pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-[#23324D]">💾 Saved Bills & Invoice History</h3>

            {loading ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF2FF] text-[#6EA8FE] text-[11px] font-bold border border-[#6EA8FE]/30 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" /> Fetching from Google Sheets...
              </span>
            ) : synced ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF7F2] text-[#1B6D4A] text-[11px] font-bold border border-[#A8E6CE]">
                <Cloud className="w-3.5 h-3.5" /> Google Sheets Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF5F5] text-red-600 text-[11px] font-bold border border-red-200">
                <CloudOff className="w-3.5 h-3.5" /> Disconnected
              </span>
            )}
          </div>
          <p className="text-xs text-[#5F708A] mt-1">
            All bills are stored in Google Sheets — same on every phone, laptop, and device.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {invoices.length > 0 && (
            <button
              onClick={() => exportInvoicesToCSV(filtered)}
              className="px-3 py-1.5 bg-[#EAF7F2] hover:bg-[#D6F2E7] text-[#1B6D4A] text-xs font-bold rounded-xl border border-[#A8E6CE] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export CSV
            </button>
          )}

          <div className="relative">
            <Search className="w-4 h-4 text-[#5F708A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search invoice / institution..."
              className="pl-9 pr-3 py-1.5 text-xs border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none w-56"
            />
          </div>

          <button
            onClick={loadInvoices}
            disabled={loading}
            title="Refresh from Google Sheets"
            className="p-2 text-[#5F708A] hover:bg-[#F4F8FC] rounded-xl border border-[#E6ECF5] transition-colors cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#6EA8FE]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center justify-between gap-3">
          <span>⚠️ {error}</span>
          <button onClick={loadInvoices} className="underline font-bold hover:text-red-900 cursor-pointer whitespace-nowrap">
            Retry
          </button>
        </div>
      )}

      {/* Table or empty state */}
      {loading && invoices.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#5F708A] animate-pulse">
          <RefreshCw className="w-8 h-8 text-[#6EA8FE] mx-auto mb-3 animate-spin" />
          Loading invoices from Google Sheets...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#FAFBFD] rounded-xl border border-dashed border-[#E6ECF5] space-y-3">
          <FileText className="w-10 h-10 text-[#6EA8FE] mx-auto opacity-70" />
          <div className="text-sm font-bold text-[#23324D]">
            {searchTerm ? 'No matching invoices found.' : 'No invoices in Google Sheets yet.'}
          </div>
          <p className="text-xs text-[#5F708A] max-w-sm mx-auto">
            {searchTerm
              ? 'Try a different search term.'
              : 'Create an invoice and save it — it will appear here on every device instantly.'}
          </p>
          {!searchTerm && (
            <button
              onClick={onOpenInvoiceMaker}
              className="px-4 py-2 bg-[#6EA8FE] hover:bg-[#5896EE] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Create New Invoice
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6ECF5] bg-[#F4F8FC] text-xs font-bold text-[#23324D]">
                <th className="p-3">Invoice No.</th>
                <th className="p-3">Institution / Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Amount (₹)</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5] text-xs text-[#23324D]">
              {filtered.map(rec => (
                <tr key={rec.id} className="hover:bg-[#F9FAFC] transition-colors">
                  <td className="p-3 font-mono font-bold text-[#6EA8FE]">{rec.invoiceNumber}</td>
                  <td className="p-3">
                    <div className="font-semibold">{rec.institution || rec.customerName}</div>
                    {rec.institution && rec.customerName && rec.institution !== rec.customerName && (
                      <div className="text-[11px] text-[#5F708A]">{rec.customerName}</div>
                    )}
                  </td>
                  <td className="p-3 font-mono text-[#5F708A]">{formatDateToDDMMYYYY(rec.date)}</td>
                  <td className="p-3 text-right font-mono font-bold">
                    ₹{rec.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF7F2] text-[#1B6D4A] text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Saved in Sheets
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button
                      onClick={() => { onLoadInvoice(rec.data); onOpenInvoiceMaker(); }}
                      className="px-2.5 py-1 bg-[#6EA8FE] hover:bg-[#5896EE] text-white text-[11px] font-bold rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer"
                      title="Load & Edit Invoice"
                    >
                      <Edit3 className="w-3 h-3" /> Load / Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rec.invoiceNumber)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Invoice"
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
