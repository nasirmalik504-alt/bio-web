/// <reference types="vite/client" />
import { InvoiceData, SaveInvoiceResponse } from '../types/invoiceTypes';
import { getNextLocalInvoiceNumber, extractInvoiceSequence, formatInvoiceNumber } from '../utils/invoiceStorage';

const APPS_SCRIPT_URL = (import.meta as any).env?.VITE_APPS_SCRIPT_URL || '';

/**
 * Save Invoice Data to Google Sheets via Google Apps Script Web App
 */
export async function saveInvoiceToGoogleSheets(data: InvoiceData, amountInWords: string): Promise<SaveInvoiceResponse> {
  if (!APPS_SCRIPT_URL) {
    return {
      success: false,
      error: 'Google Apps Script endpoint is not configured in .env (VITE_APPS_SCRIPT_URL).'
    };
  }

  const payload = {
    action: 'save_invoice',
    formType: 'invoice',
    institution: data.customer.institution || data.customer.title,
    email: data.customer.email || 'sales@biobusiness.in',
    phone: data.customer.phone || '9899571171',
    ...data,
    amountInWords
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script CORS compatible format
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    // If remote Apps Script is on previous Code.gs version and returns "Invalid form submission type",
    // fallback to quote submission endpoint so invoice data reaches Google Sheets "Quote Requests" tab!
    if (result && !result.success && result.error === 'Invalid form submission type') {
      const fallbackPayload = {
        action: 'quote',
        formType: 'quote',
        institution: `[INVOICE ${data.invoiceNumber || 'BDA'}] ${data.customer.institution || data.customer.title}`,
        email: data.customer.email || 'sales@biobusiness.in',
        phone: data.customer.phone || '9899571171',
        gstin: data.customer.gstin || 'N/A',
        notes: `TAX INVOICE RECORD ${data.invoiceNumber}\nAmount: ₹${amountInWords}\nOrder: ${data.orderNumber || 'N/A'}`,
        items: data.items.map((i) => ({
          product: { name: `${i.code ? `[${i.code}] ` : ''}${i.description}`, sku: i.code || 'N/A' },
          quantity: i.quantity,
          unitPrice: i.unitPrice
        }))
      };

      const fallbackRes = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(fallbackPayload)
      });
      const fallbackResult = await fallbackRes.json();
      if (fallbackResult && fallbackResult.success) {
        return {
          success: true,
          invoiceNumber: data.invoiceNumber,
          message: `Invoice ${data.invoiceNumber} saved to Google Sheets!`
        };
      }
    }

    return result;
  } catch (err: any) {
    console.error('Error saving invoice to Google Sheets:', err);
    return {
      success: false,
      error: err?.message || 'Failed to submit invoice to Google Sheets backend.'
    };
  }
}

/**
 * Fetch next sequential invoice number starting from BDA/001 (or max existing invoice + 1)
 */
export async function fetchNextInvoiceNumber(): Promise<string> {
  const localNext = getNextLocalInvoiceNumber('BDA/');
  const localSeq = extractInvoiceSequence(localNext);

  if (!APPS_SCRIPT_URL) return localNext;

  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=get_next_invoice_number`, {
      method: 'GET',
    });
    const result = await response.json();
    if (result && result.success && result.nextInvoiceNumber) {
      let remoteSeq = extractInvoiceSequence(result.nextInvoiceNumber);
      
      // If remote Apps Script is still running previous Code.gs version that hardcoded default 172,
      // ignore legacy 172 fallback unless local sequence has reached 172 or higher.
      if (remoteSeq === 172 && localSeq < 172) {
        remoteSeq = 0;
      }

      const finalSeq = Math.max(remoteSeq, localSeq);
      return formatInvoiceNumber(finalSeq, 'BDA/');
    }
  } catch (err) {
    console.warn('Could not fetch next invoice number from Apps Script, falling back to local:', err);
  }
  return localNext;
}
