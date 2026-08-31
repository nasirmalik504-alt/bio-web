/**
 * invoiceStorage.ts
 * Re-exports the InvoiceRecord type and simple helpers.
 * NO localStorage. NO sessionStorage. NO browser persistence.
 * All persistent data lives in Google Sheets.
 */

export type { InvoiceRecord } from '../services/invoiceService';
