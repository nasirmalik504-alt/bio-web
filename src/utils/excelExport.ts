import { SavedInvoiceRecord } from './invoiceStorage';

/**
 * Export saved invoices as CSV with exact GST Tax Register Header:
 * Invoice Date | Invoice Number | Customer Name | GST Number | HSN Code | POS | Taxable Value | Rate | IGST | CGST | SGST | Invoice Value
 */
export function exportInvoicesToCSV(invoices: SavedInvoiceRecord[]) {
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
    
    // Subtotal / Taxable Value
    const subtotal = items.reduce(
      (sum, item) => sum + (Number(item.unitPrice || 0) * Number(item.quantity || 0)),
      0
    );
    const taxRate = Number(data.taxRate || 0);
    const taxType = data.taxType || 'IGST';

    let igst = 0;
    let cgst = 0;
    let sgst = 0;

    if (taxType === 'IGST') {
      igst = (subtotal * taxRate) / 100;
    } else if (taxType === 'CGST_SGST') {
      cgst = (subtotal * (taxRate / 2)) / 100;
      sgst = (subtotal * (taxRate / 2)) / 100;
    }

    const exactTotal = subtotal + igst + cgst + sgst;
    const invoiceValue = Math.round(exactTotal);

    // HSN Codes (joined)
    const hsnCodes = Array.from(new Set(items.map((i) => i.hsnCode).filter(Boolean))).join(', ');

    const customerName = (data.customer.title || data.customer.institution || 'Customer').trim();
    const gstNumber = data.customer.gstin || 'N/A';
    const pos = data.customer.state || 'Delhi';

    return [
      `"${data.invoiceDate || ''}"`,
      `"${data.invoiceNumber || ''}"`,
      `"${customerName.replace(/"/g, '""')}"`,
      `"${gstNumber}"`,
      `"${hsnCodes}"`,
      `"${pos}"`,
      subtotal.toFixed(2),
      `"${taxRate}%"`,
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
