import { InvoiceData } from '../types/invoiceTypes';

const STORAGE_KEY = 'biobusiness_saved_invoices_v1';

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
 * Get all saved invoices from localStorage
 */
export function getSavedInvoices(): SavedInvoiceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading saved invoices from localStorage:', err);
    return [];
  }
}

/**
 * Save an invoice record to localStorage
 */
export function saveInvoiceToStorage(data: InvoiceData, synced: boolean = true): SavedInvoiceRecord[] {
  try {
    const existing = getSavedInvoices();
    
    // Calculate total amount
    const subtotal = data.items.reduce(
      (sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 0),
      0
    );
    const taxRate = data.taxRate || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = Math.round(subtotal + taxAmount);

    const record: SavedInvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: data.invoiceNumber || 'BDA/001',
      customerName: data.customer.title || 'Customer',
      institution: data.customer.institution || data.customer.title || 'Customer',
      date: data.invoiceDate || new Date().toISOString().split('T')[0],
      totalAmount,
      savedAt: new Date().toISOString(),
      data,
      syncedToGoogleSheets: synced
    };

    // Filter out previous version of same invoice number if exists
    const updated = [record, ...existing.filter((item) => item.invoiceNumber !== data.invoiceNumber)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving invoice to localStorage:', err);
    return getSavedInvoices();
  }
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

/**
 * Calculate next sequential invoice number from saved localStorage bills
 */
export function getNextLocalInvoiceNumber(prefix: string = 'BDA/'): string {
  const invoices = getSavedInvoices();
  let maxSeq = 0;
  for (const inv of invoices) {
    const seq = extractInvoiceSequence(inv.invoiceNumber);
    if (seq > maxSeq) {
      maxSeq = seq;
    }
  }
  return formatInvoiceNumber(maxSeq + 1, prefix);
}

/**
 * Delete a saved invoice from localStorage
 */
export function deleteSavedInvoice(invoiceNumber: string): SavedInvoiceRecord[] {
  try {
    const existing = getSavedInvoices();
    const updated = existing.filter((item) => item.invoiceNumber !== invoiceNumber);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting invoice from localStorage:', err);
    return getSavedInvoices();
  }
}
