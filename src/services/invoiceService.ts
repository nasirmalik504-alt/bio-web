/**
 * Invoice Service — Google Sheets is the ONLY database.
 *
 * IMPORTANT: Google Apps Script Web Apps return a 302 redirect when called
 * with GET. Browsers follow the redirect fine, but CORS can block reading
 * the final body in some environments. We therefore:
 *   1. Always try GET first (works in most browsers).
 *   2. Immediately fall back to POST if GET fails or returns no data.
 *   3. Never throw — always return a safe empty result on network failure.
 *
 * No localStorage. No sessionStorage. No browser cache as data.
 */

import { InvoiceData, SaveInvoiceResponse } from '../types/invoiceTypes';

// ─────────────────────────────────────────────────────────────
// Google Apps Script endpoint
// ─────────────────────────────────────────────────────────────
const SCRIPT_URL: string =
  ((import.meta as any).env?.VITE_APPS_SCRIPT_URL as string) ||
  'https://script.google.com/macros/s/AKfycbwyfJ1k63-lVjkJiPVjJW_HVgh-DJ6PDyZujQv4TeMjfwloLHM8-4u3G9bV3_5oCImS/exec';

// ─────────────────────────────────────────────────────────────
// Types
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
// Internal: safely read response text → JSON
// Returns null on any error (never throws)
// ─────────────────────────────────────────────────────────────
async function readJson(res: Response): Promise<any> {
  try {
    const text = await res.text();
    if (!text?.trim()) return null;
    // Apps Script sometimes prepends ")]}'\n" — strip if present
    const clean = text.replace(/^\)\]\}'\n/, '').trim();
    if (!clean.startsWith('{') && !clean.startsWith('[')) return null;
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Internal: call Apps Script via POST (most reliable method)
// POST avoids the redirect issue entirely.
// ─────────────────────────────────────────────────────────────
async function post(body: object): Promise<any> {
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });
  return readJson(res);
}

// ─────────────────────────────────────────────────────────────
// Internal: call Apps Script via GET with cache-busting
// ─────────────────────────────────────────────────────────────
async function get(action: string, params: Record<string, string> = {}): Promise<any> {
  const qs = new URLSearchParams({ action, _t: String(Date.now()), ...params });
  const res = await fetch(`${SCRIPT_URL}?${qs}`, {
    method: 'GET',
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
  });
  return readJson(res);
}

// ─────────────────────────────────────────────────────────────
// Internal: try GET first, fallback to POST if GET returns nothing
// ─────────────────────────────────────────────────────────────
async function call(action: string, postBody: object = {}): Promise<any> {
  try {
    const getResult = await get(action);
    if (getResult?.success !== undefined) return getResult;
  } catch { /* ignore, fall through to POST */ }

  try {
    return await post({ action, ...postBody });
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// GET_INVOICES
// Returns all invoice records from Google Sheets.
// Throws only if both GET and POST fail completely.
// ─────────────────────────────────────────────────────────────
export async function getInvoices(): Promise<InvoiceRecord[]> {
  const json = await call('get_invoices');

  if (json?.success && Array.isArray(json.invoices)) {
    return json.invoices as InvoiceRecord[];
  }

  if (json?.success === false && json?.error) {
    throw new Error(json.error);
  }

  throw new Error('Could not load invoices from Google Sheets. Check your Apps Script deployment.');
}

// ─────────────────────────────────────────────────────────────
// GET_NEXT_INVOICE_NUMBER
// Returns next BDA/NNN from server (LockService protected).
// ─────────────────────────────────────────────────────────────
export async function getNextInvoiceNumber(): Promise<string> {
  const json = await call('get_next_invoice_number');

  if (json?.success && json.nextInvoiceNumber) {
    return json.nextInvoiceNumber as string;
  }

  throw new Error(json?.error || 'Could not fetch next invoice number from Google Sheets.');
}

// ─────────────────────────────────────────────────────────────
// SAVE_INVOICE
// Writes invoice to Google Sheets. Returns confirmed number.
// ─────────────────────────────────────────────────────────────
export async function saveInvoice(
  data: InvoiceData,
  amountInWords: string,
): Promise<SaveInvoiceResponse> {
  const payload = {
    action: 'save_invoice',
    formType: 'invoice',
    institution: data.customer.institution || data.customer.title || 'Customer',
    email: data.customer.email || 'sales@biobusiness.in',
    phone: data.customer.phone || '9899571171',
    ...data,
    amountInWords,
  };

  let json: any = null;

  try {
    json = await post(payload);
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error — could not reach Google Apps Script.' };
  }

  if (json?.success) {
    return {
      success: true,
      invoiceNumber: json.invoiceNumber || data.invoiceNumber,
      message: json.message || `Invoice ${json.invoiceNumber || data.invoiceNumber} saved to Google Sheets.`,
    };
  }

  return {
    success: false,
    error: json?.error || 'Google Apps Script returned an error. Invoice may not have saved.',
  };
}

// ─────────────────────────────────────────────────────────────
// DELETE_INVOICE
// Removes invoice rows from Google Sheets.
// ─────────────────────────────────────────────────────────────
export async function deleteInvoice(
  invoiceNumber: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const json = await post({ action: 'delete_invoice', invoiceNumber });
    return json ?? { success: false, error: 'No response from server.' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error.' };
  }
}
