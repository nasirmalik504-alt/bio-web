import { InvoiceData } from '../types/invoiceTypes';

export interface SavedInvoiceRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  institution: string;
  date: string;
  totalAmount: number;
  savedAt: string;
  data: InvoiceData;
  syncedToGoogleSheets: boolean;
}

/**
 * Extract numerical sequence from invoice string (e.g. "BDA/050" => 50, "BDA/001" => 1)
 */
export function extractInvoiceSequence(invNo: string): number {
  if (!invNo) return 0;
  const match = invNo.match(/(\d+)\s*$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
}

/**
 * Format invoice number with 3-digit zero padding (e.g. 1 => "BDA/001", 50 => "BDA/050")
 */
export function formatInvoiceNumber(seq: number, prefix: string = 'BDA/'): string {
  const padded = seq < 1000 ? String(seq).padStart(3, '0') : String(seq);
  return `${prefix}${padded}`;
}
