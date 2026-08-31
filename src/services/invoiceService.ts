import { InvoiceData, SaveInvoiceResponse } from '../types/invoiceTypes';
import {
  getNextLocalInvoiceNumber,
  extractInvoiceSequence,
  formatInvoiceNumber,
  getSavedInvoices,
  deleteSavedInvoice,
  syncLocalInvoicesWithRemote,
  SavedInvoiceRecord
} from '../utils/invoiceStorage';

const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwyfJ1k63-lVjkJiPVjJW_HVgh-DJ6PDyZujQv4TeMjfwloLHM8-4u3G9bV3_5oCImS/exec';

const APPS_SCRIPT_URL =
  ((import.meta as any).env && (import.meta as any).env.VITE_APPS_SCRIPT_URL) ||
  DEFAULT_APPS_SCRIPT_URL;

/**
 * Safely parse HTTP response text to JSON without throwing "Unexpected end of JSON input"
 */
async function safeJsonParseResponse(response: Response): Promise<any> {
  try {
    const text = await response.text();
    if (!text || !text.trim()) return null;
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

/**
 * Save Invoice Data to Google Sheets via Google Apps Script Web App
 */
export async function saveInvoiceToGoogleSheets(data: InvoiceData, amountInWords: string): Promise<SaveInvoiceResponse> {
  const payload = {
    action: 'save_invoice',
    formType: 'invoice',
    institution: data.customer.institution || data.customer.title || 'Customer',
    email: data.customer.email || 'sales@biobusiness.in',
    phone: data.customer.phone || '9899571171',
    ...data,
    amountInWords
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    const result = await safeJsonParseResponse(response);

    if (result && result.success) {
      return {
        success: true,
        invoiceId: result.invoiceId || result.invoice?.id,
        invoiceNumber: result.invoiceNumber || data.invoiceNumber,
        message: result.message || `Invoice ${data.invoiceNumber} saved successfully to Google Sheets.`,
        invoice: result.invoice
      };
    }

    if (result && !result.success && result.error) {
      return {
        success: false,
        error: result.error
      };
    }

    if (response.ok || response.status === 302 || response.status === 200) {
      return {
        success: true,
        invoiceNumber: data.invoiceNumber,
        message: `Invoice ${data.invoiceNumber} saved successfully to Google Sheets!`
      };
    }

    return {
      success: false,
      error: `Unable to save to Google Sheets (HTTP ${response.status}).`
    };
  } catch (err: any) {
    console.error('Google Sheets backend save error:', err);
    return {
      success: false,
      error: err?.message || 'Unable to connect to Google Sheets backend.'
    };
  }
}

/**
 * Fetch all saved invoices from Google Sheets database for cross-device access
 */
export async function fetchInvoicesFromGoogleSheets(): Promise<SavedInvoiceRecord[]> {
  if (!APPS_SCRIPT_URL) {
    return getSavedInvoices();
  }

  try {
    // 1. Attempt GET request with cache-busting timestamp
    let response = await fetch(`${APPS_SCRIPT_URL}?action=get_invoices&_t=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    let result = await safeJsonParseResponse(response);

    // 2. If GET doesn't return invoices, attempt POST fallback
    if (!result || !result.success || !Array.isArray(result.invoices)) {
      response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'get_invoices' })
      });
      result = await safeJsonParseResponse(response);
    }

    if (result && result.success && Array.isArray(result.invoices)) {
      // Sync local storage cache with Google Sheets records
      syncLocalInvoicesWithRemote(result.invoices);
      return result.invoices;
    }
  } catch (err) {
    console.warn('Could not fetch invoices from Google Sheets, returning local cache:', err);
  }

  return getSavedInvoices();
}

/**
 * Fetch a single invoice record directly from Google Sheets backend by ID or number
 */
export async function fetchSingleInvoiceFromGoogleSheets(invoiceIdOrNumber: string): Promise<SavedInvoiceRecord | null> {
  if (!APPS_SCRIPT_URL || !invoiceIdOrNumber) return null;

  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=get_invoice&invoiceId=${encodeURIComponent(invoiceIdOrNumber)}&_t=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    const result = await safeJsonParseResponse(response);
    if (result && result.success && (result.record || result.invoice)) {
      return result.record || {
        id: `inv-${invoiceIdOrNumber.replace(/[^a-zA-Z0-9]/g, '-')}`,
        invoiceNumber: invoiceIdOrNumber,
        customerName: result.invoice?.customer?.title || 'Customer',
        institution: result.invoice?.customer?.institution || 'Customer',
        date: result.invoice?.invoiceDate || '',
        totalAmount: 0,
        savedAt: new Date().toISOString(),
        data: result.invoice,
        syncedToGoogleSheets: true
      };
    }
  } catch (err) {
    console.warn('Could not fetch single invoice from Apps Script:', err);
  }
  return null;
}

/**
 * Delete invoice record from Google Sheets database
 */
export async function deleteInvoiceFromGoogleSheets(invoiceNumber: string): Promise<{ success: boolean; message?: string; error?: string }> {
  deleteSavedInvoice(invoiceNumber);

  if (!APPS_SCRIPT_URL) {
    return { success: true, message: 'Deleted locally.' };
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'delete_invoice',
        invoiceNumber
      })
    });
    const result = await safeJsonParseResponse(response);
    return result || { success: true, message: `Invoice ${invoiceNumber} deleted from Google Sheets!` };
  } catch (err: any) {
    console.error('Error deleting invoice from Google Sheets:', err);
    return { success: false, error: err?.message || 'Failed to delete from Google Sheets.' };
  }
}

/**
 * Fetch next sequential invoice number starting from BDA/001 (or max existing invoice + 1)
 */
export async function fetchNextInvoiceNumber(): Promise<string> {
  const localNext = getNextLocalInvoiceNumber('BDA/');

  if (!APPS_SCRIPT_URL) return localNext;

  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=get_next_invoice_number&_t=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    const result = await safeJsonParseResponse(response);
    if (result && result.success && result.nextInvoiceNumber) {
      return result.nextInvoiceNumber;
    }
  } catch (err) {
    console.warn('Could not fetch next invoice number from Apps Script, falling back to local:', err);
  }
  return localNext;
}
