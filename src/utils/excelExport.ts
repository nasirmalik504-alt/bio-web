import { InvoiceRecord } from '../services/invoiceService';
import { formatDateToDDMMYYYY } from './dateFormatter';

/**
 * Export saved invoices as CSV with exact GST Tax Register Header:
 * Invoice Date | Invoice Number | Customer Name | GST Number | HSN Code | POS | Taxable Value | Rate | IGST | CGST | SGST | Invoice Value
 */
export function exportInvoicesToCSV(invoices: InvoiceRecord[]) {
  const headers = [
    'Invoice Date',
    'Invoice Number',
    'Customer Name',
    'GST Number',
    'HSN Code',
    'POS',
    'Taxable Value',
    'Rate',
    'IGST',
    'CGST',
    'SGST',
    'Invoice Value'
  ];

  const rows = invoices.map((rec) => {
    const data = rec.data;
    const items = data.items || [];
    const taxType = data.taxType || 'IGST';
    
    let subtotal = 0;
    let totalTax = 0;
    const ratesSet = new Set<number>();

    items.forEach((item: { unitPrice?: number; quantity?: number; gstRate?: number; hsnCode?: string }) => {
      const price = Number(item.unitPrice || 0);
      const qty = Number(item.quantity || 0);
      const itemTaxable = price * qty;
      const r = item.gstRate !== undefined ? Number(item.gstRate) : Number(data.taxRate || 0);
      subtotal += itemTaxable;
      ratesSet.add(r);
      totalTax += (itemTaxable * r) / 100;
    });

    let igst = 0;
    let cgst = 0;
    let sgst = 0;

    if (taxType === 'IGST') {
      igst = totalTax;
    } else if (taxType === 'CGST_SGST') {
      cgst = totalTax / 2;
      sgst = totalTax / 2;
    }

    const exactTotal = subtotal + totalTax;
    const invoiceValue = Math.round(exactTotal);

    // HSN Codes & Rates
    const hsnCodes = Array.from(new Set(items.map((i: { hsnCode?: string }) => i.hsnCode).filter(Boolean))).join(', ');
    const rateStr = Array.from(ratesSet).map((r) => `${r}%`).join(', ') || `${data.taxRate || 18}%`;

    const customerName = (data.customer.title || data.customer.institution || 'Customer').trim();
    const gstNumber = data.customer.gstin || 'N/A';
    const pos = data.customer.state || 'Delhi';

    return [
      `"${formatDateToDDMMYYYY(data.invoiceDate)}"`,
      `"${data.invoiceNumber || ''}"`,
      `"${customerName.replace(/"/g, '""')}"`,
      `"${gstNumber}"`,
      `"${hsnCodes}"`,
      `"${pos}"`,
      subtotal.toFixed(2),
      `"${rateStr}"`,
      igst.toFixed(2),
      cgst.toFixed(2),
      sgst.toFixed(2),
      invoiceValue.toFixed(2)
    ].join('\t'); // Tab-separated for direct copy/paste into Excel / Google Sheets
  });

  const csvContent = [headers.join('\t'), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `GST_Tax_Register_${new Date().toISOString().split('T')[0]}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
