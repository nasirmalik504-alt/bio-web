/**
 * Invoice Service — Google Sheets is the ONLY database.
 * All invoice reads and writes go through this file → Google Apps Script → Google Sheets.
 * No localStorage. No sessionStorage. No browser cache as data store.
 */

import { InvoiceData, SaveInvoiceResponse } from '../types/invoiceTypes';

// ─────────────────────────────────────────────────────────────
// Google Apps Script endpoint (single source of truth backend)
// ─────────────────────────────────────────────────────────────
const SCRIPT_URL =
  ((import.meta as any).env?.VITE_APPS_SCRIPT_URL as string) ||
  'https://script.google.com/macros/s/AKfycbwyfJ1k63-lVjkJiPVjJW_HVgh-DJ6PDyZujQv4TeMjfwloLHM8-4u3G9bV3_5oCImS/exec';

// ─────────────────────────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────────────────────────
export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  institution: string;
  date: string;
  totalAmount: number;
  savedAt: string;
  data: InvoiceData;
  syncedToGoogleSheets: true;
}

// ─────────────────────────────────────────────────────────────
// Internal helper — safely parse a fetch Response as JSON
// ─────────────────────────────────────────────────────────────
async function parseJson(res: Response): Promise<any> {
  try {
    const text = await res.text();
    if (!text?.trim()) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// GET_INVOICES — fetch all invoices from Google Sheets
// Called by: Saved Bills page on mount, after save, on refresh
// ─────────────────────────────────────────────────────────────
export async function getInvoices(): Promise<InvoiceRecord[]> {
  const url = `${SCRIPT_URL}?action=get_invoices&_t=${Date.now()}`;

  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
  });

  const json = await parseJson(res);

  if (json?.success && Array.isArray(json.invoices)) {
    return json.invoices as InvoiceRecord[];
  }

  throw new Error(json?.error || 'Could not load invoices from Google Sheets.');
}

// ─────────────────────────────────────────────────────────────
// GET_NEXT_INVOICE_NUMBER — fetch next BDA/NNN from server
// Called by: Invoice form on mount (when creating new invoice)
// Server uses LockService so concurrent calls are safe
// ─────────────────────────────────────────────────────────────
export async function getNextInvoiceNumber(): Promise<string> {
  const url = `${SCRIPT_URL}?action=get_next_invoice_number&_t=${Date.now()}`;

  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
  });

  const json = await parseJson(res);

  if (json?.success && json.nextInvoiceNumber) {
    return json.nextInvoiceNumber as string;
  }

  throw new Error(json?.error || 'Could not fetch next invoice number from Google Sheets.');
}

// ─────────────────────────────────────────────────────────────
// SAVE_INVOICE — write invoice to Google Sheets
// Returns confirmed invoice number assigned by server
// ─────────────────────────────────────────────────────────────
export async function saveInvoice(
  data: InvoiceData,
  amountInWords: string
): Promise<SaveInvoiceResponse> {
  const payload = {
    action: 'save_invoice',
    formType: 'invoice',
    institution: data.customer.institution || data.customer.title || 'Customer',
    email: data.customer.email || 'sales@biobusiness.in',
    phone: data.customer.phone || '9899571171',
    ...data,
    amountInWords
  };

  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });

  const json = await parseJson(res);

  if (json?.success) {
    return {
      success: true,
      invoiceNumber: json.invoiceNumber || data.invoiceNumber,
      message: json.message || `Invoice saved to Google Sheets.`
    };
  }

  return {
    success: false,
    error: json?.error || `Unable to save to Google Sheets (HTTP ${res.status}).`
  };
}

// ─────────────────────────────────────────────────────────────
// DELETE_INVOICE — remove invoice row(s) from Google Sheets
// ─────────────────────────────────────────────────────────────
export async function deleteInvoice(
  invoiceNumber: string
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'delete_invoice', invoiceNumber })
  });

  const json = await parseJson(res);
  return json ?? { success: false, error: 'No response from server.' };
}
