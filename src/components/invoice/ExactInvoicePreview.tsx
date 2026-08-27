import React, { forwardRef } from 'react';
import { InvoiceData } from '../../types/invoiceTypes';
import { numberToIndianWords } from '../../utils/numberToWords';

interface ExactInvoicePreviewProps {
  data: InvoiceData;
}

export const ExactInvoicePreview = forwardRef<HTMLDivElement, ExactInvoicePreviewProps>(({ data }, ref) => {
  const {
    invoiceNumber,
    invoiceDate,
    orderNumber,
    orderDate,
    customer,
    isShipToSameAsBillTo = true,
    shippingAddress,
    items,
    taxType,
    taxRate,
    paymentTerms,
    bankDetails,
    jurisdiction,
    paymentNote,
    companyName,
    contactNumber
  } = data;

  const shipTo = shippingAddress || {
    title: customer.title,
    addressLine1: customer.addressLine1,
    addressLine2: customer.addressLine2,
    cityStatePin: customer.cityStatePin,
    state: customer.state,
    gstin: customer.gstin,
    phone: customer.phone
  };

  // Calculate financial totals safely with 2 decimal precision
  const subtotal = items.reduce((sum, item) => sum + (Number(item.unitPrice || 0) * Number(item.quantity || 0)), 0);
  
  let taxAmount = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;

  if (taxType === 'IGST') {
    taxAmount = (subtotal * taxRate) / 100;
  } else if (taxType === 'CGST_SGST') {
    cgstAmount = (subtotal * (taxRate / 2)) / 100;
    sgstAmount = (subtotal * (taxRate / 2)) / 100;
    taxAmount = cgstAmount + sgstAmount;
  }

  const rawTotal = subtotal + taxAmount;
  const finalAmount = Math.round(rawTotal);
  const roundOff = Math.round((finalAmount - rawTotal) * 100) / 100;

  const amountInWords = numberToIndianWords(finalAmount);

  // Format currency helper
  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div
      ref={ref}
      id="invoice-document"
      className="invoice-document bg-white text-black p-6 print:p-2 max-w-[210mm] mx-auto shadow-lg print:shadow-none print:m-0 print:w-full print:max-w-none text-[11px] print:text-[10px] leading-tight font-sans select-text border border-black print:border-none space-y-2 print:space-y-1.5"
      style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
    >
      {/* 1. Header: Logo (Left) + Company Details (Right) */}
      <div className="flex justify-between items-start border-b border-black pb-2 mb-1.5 invoice-section">
        <div className="w-1/3">
          <img
            src="/images/logo.png"
            alt="Biobusiness Development Agency"
            className="h-12 print:h-10 w-auto object-contain"
          />
        </div>

        <div className="text-right text-[10px] print:text-[9.5px] leading-tight space-y-0.5 w-2/3">
          <div className="font-black text-xs print:text-[11px] uppercase tracking-tight">BIOBUSINESS DEVELOPMENT AGENCY</div>
          <div>G-16, Jail Road, Hari Nagar</div>
          <div>New Delhi - 110064, India</div>
          <div><strong>GSTIN/UIN:</strong> 07AAKFB8362H1ZB</div>
          <div><strong>State Name:</strong> Delhi, <strong>Code:</strong> 07</div>
          <div><strong>Contact No.:</strong> 9899571171</div>
          <div><strong>Email:</strong> sales@biobusiness.in | <strong>Website:</strong> www.biobusiness.in</div>
        </div>
      </div>

      {/* Customer Billed-To / Ship-To Address Block */}
      {isShipToSameAsBillTo ? (
        <div className="text-left font-normal border-b border-black pb-1.5 invoice-section">
          <div className="text-[9px] print:text-[8.5px] font-bold text-gray-500 uppercase tracking-wider">BILLED TO:</div>
          {customer.title && <div className="font-bold text-[12px] print:text-[11px]">{customer.title}</div>}
          {customer.addressLine1 && <div>{customer.addressLine1}</div>}
          {customer.addressLine2 && <div>{customer.addressLine2}</div>}
          {customer.cityStatePin && <div>{customer.cityStatePin}</div>}
          {customer.state && <div>{customer.state}</div>}
          {customer.gstin && <div className="font-semibold">GSTIN: {customer.gstin}</div>}
          {customer.phone && <div>Contact No.: {customer.phone}</div>}
        </div>
      ) : (
        <div className="border-b border-black pb-1.5 invoice-section grid grid-cols-2 gap-4 text-left font-normal">
          {/* BILLED TO (Left Column) */}
          <div className="border-r border-black/30 pr-3">
            <div className="text-[9px] print:text-[8.5px] font-bold text-gray-500 uppercase tracking-wider">BILLED TO:</div>
            {customer.title && <div className="font-bold text-[12px] print:text-[11px]">{customer.title}</div>}
            {customer.addressLine1 && <div>{customer.addressLine1}</div>}
            {customer.addressLine2 && <div>{customer.addressLine2}</div>}
            {customer.cityStatePin && <div>{customer.cityStatePin}</div>}
            {customer.state && <div>{customer.state}</div>}
            {customer.gstin && <div className="font-semibold">GSTIN: {customer.gstin}</div>}
            {customer.phone && <div>Contact No.: {customer.phone}</div>}
          </div>

          {/* SHIP TO (Right Column) */}
          <div className="pl-1">
            <div className="text-[9px] print:text-[8.5px] font-bold text-gray-500 uppercase tracking-wider">SHIP TO:</div>
            {(shipTo.title || customer.title) && <div className="font-bold text-[12px] print:text-[11px]">{shipTo.title || customer.title}</div>}
            {shipTo.addressLine1 && <div>{shipTo.addressLine1}</div>}
            {shipTo.addressLine2 && <div>{shipTo.addressLine2}</div>}
            {shipTo.cityStatePin && <div>{shipTo.cityStatePin}</div>}
            {shipTo.state && <div>{shipTo.state}</div>}
            {shipTo.gstin && <div className="font-semibold">GSTIN: {shipTo.gstin}</div>}
            {shipTo.phone && <div>Contact No.: {shipTo.phone}</div>}
          </div>
        </div>
      )}

      {/* 2. Invoice Title + Original for Recipient */}
      <div className="relative text-center py-1 border-b border-black invoice-section">
        <h1 className="text-base print:text-sm font-black tracking-wider uppercase inline-block">
          TAX INVOICE
        </h1>
        <span className="absolute right-0 bottom-1 text-[9px] print:text-[8.5px] italic font-semibold text-gray-700">
          (ORIGINAL FOR RECIPIENT)
        </span>
      </div>

      {/* 3. Invoice Information Table (2-Row Table) */}
      <div className="invoice-section">
        <table className="w-full border-collapse border border-black text-left">
          <tbody>
            <tr className="border-b border-black">
              <td className="border-r border-black p-1 font-bold w-1/4 bg-gray-50 print:bg-transparent">
                Invoice No.
              </td>
              <td className="border-r border-black p-1 w-1/4 font-mono font-bold">
                {invoiceNumber || ''}
              </td>
              <td className="border-r border-black p-1 font-bold w-1/4 bg-gray-50 print:bg-transparent">
                Date
              </td>
              <td className="p-1 w-1/4 font-mono">
                {invoiceDate || ''}
              </td>
            </tr>
            <tr>
              <td className="border-r border-black p-1 font-bold w-1/4 bg-gray-50 print:bg-transparent">
                Order No.
              </td>
              <td className="border-r border-black p-1 w-1/4 font-mono">
                {orderNumber || ''}
              </td>
              <td className="border-r border-black p-1 font-bold w-1/4 bg-gray-50 print:bg-transparent">
                Date
              </td>
              <td className="p-1 w-1/4 font-mono">
                {orderDate || ''}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. Product Table (Exact 6 Columns) */}
      <div className="invoice-section">
        <table className="w-full border-collapse border border-black text-left">
          <thead>
            <tr className="border-b border-black bg-gray-100 print:bg-transparent font-bold text-[10px] print:text-[9px]">
              <th className="border-r border-black p-1 text-center w-[12%]">Code</th>
              <th className="border-r border-black p-1 text-left w-[42%]">Description Of Articles</th>
              <th className="border-r border-black p-1 text-center w-[14%]">HSN Code</th>
              <th className="border-r border-black p-1 text-right w-[12%]">Unit Price (₹)</th>
              <th className="border-r border-black p-1 text-center w-[8%]">Quantity</th>
              <th className="p-1 text-right w-[12%]">Total Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id || idx} className="border-b border-black align-top">
                <td className="border-r border-black p-1 text-center font-mono font-semibold">
                  {item.code || '-'}
                </td>
                <td className="border-r border-black p-1 whitespace-pre-line leading-tight">
                  <div className="font-semibold">{item.description}</div>
                </td>
                <td className="border-r border-black p-1 text-center font-mono font-semibold text-[10px] print:text-[9px]">
                  {item.hsnCode || '-'}
                </td>
                <td className="border-r border-black p-1 text-right font-mono">
                  {formatCurrency(Number(item.unitPrice || 0))}
                </td>
                <td className="border-r border-black p-1 text-center font-mono font-semibold">
                  {item.quantity}
                </td>
                <td className="p-1 text-right font-mono font-bold">
                  {formatCurrency(Number(item.unitPrice || 0) * Number(item.quantity || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Financial Totals Section */}
      <div className="flex justify-end invoice-section">
        <div className="w-1/2 min-w-[260px]">
          <table className="w-full border-collapse border border-black text-left">
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">Subtotal</td>
                <td className="p-1 text-right font-mono font-semibold">₹{formatCurrency(subtotal)}</td>
              </tr>

              {taxType === 'IGST' && taxRate > 0 && (
                <tr className="border-b border-black">
                  <td className="border-r border-black p-1 font-bold">IGST {taxRate}%</td>
                  <td className="p-1 text-right font-mono font-semibold">₹{formatCurrency(taxAmount)}</td>
                </tr>
              )}

              {taxType === 'CGST_SGST' && taxRate > 0 && (
                <>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 font-bold">CGST {taxRate / 2}%</td>
                    <td className="p-1 text-right font-mono font-semibold">₹{formatCurrency(cgstAmount)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 font-bold">SGST {taxRate / 2}%</td>
                    <td className="p-1 text-right font-mono font-semibold">₹{formatCurrency(sgstAmount)}</td>
                  </tr>
                </>
              )}

              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">Total</td>
                <td className="p-1 text-right font-mono font-semibold">₹{formatCurrency(rawTotal)}</td>
              </tr>

              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">Round Off</td>
                <td className="p-1 text-right font-mono">
                  {roundOff >= 0 ? `+₹${formatCurrency(roundOff)}` : `-₹${formatCurrency(Math.abs(roundOff))}`}
                </td>
              </tr>

              <tr className="bg-gray-100 print:bg-transparent font-black border-t border-black">
                <td className="border-r border-black p-1 font-bold text-[12px] print:text-[11px]">Amount Claimed:</td>
                <td className="p-1 text-right font-mono text-[13px] print:text-[12px]">₹{formatCurrency(finalAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Amount in Words Row */}
      <div className="border border-black p-1 font-bold bg-gray-50 print:bg-transparent invoice-section">
        <span className="font-bold">Amount in Words:</span>{' '}
        <span className="italic font-semibold ml-1">{amountInWords}</span>
      </div>

      {/* 7. TERMS FOR PAYMENT */}
      <div className="border border-black invoice-section">
        <div className="bg-gray-200 print:bg-transparent p-1 font-black border-b border-black text-center uppercase tracking-wide text-[10px] print:text-[9px]">
          TERMS FOR PAYMENT
        </div>
        <div className="p-1 border-b border-black flex items-start">
          <span className="font-bold w-16 shrink-0">Payment</span>
          <span className="border-l border-black pl-2">{paymentTerms}</span>
        </div>
        <div className="p-1 flex items-start leading-tight">
          <span className="font-bold w-16 shrink-0">Bank</span>
          <div className="border-l border-black pl-2 font-mono text-[10px] print:text-[9px] leading-tight space-y-0.5 w-full">
            <div><strong>Name of the Bank:</strong> {bankDetails.bankName} | <strong>Branch:</strong> {bankDetails.branch}</div>
            <div><strong>Beneficiary:</strong> {bankDetails.beneficiary}</div>
            <div><strong>Current Account No.:</strong> {bankDetails.accountNumber} | <strong>IFSC:</strong> {bankDetails.ifsc}</div>
            <div><strong>MICR:</strong> {bankDetails.micr} | <strong>SWIFT:</strong> {bankDetails.swift}</div>
          </div>
        </div>
      </div>

      {/* 8. Jurisdiction */}
      <div className="border border-black p-1 flex items-center invoice-section">
        <div className="font-bold w-20 shrink-0">Jurisdiction</div>
        <div className="border-l border-black pl-2">{jurisdiction}</div>
      </div>

      {/* 9. Payment Note */}
      <div className="border border-black p-1 text-[10px] print:text-[9px] flex items-center invoice-section">
        <span className="font-bold w-20 shrink-0">Note:</span>
        <span className="border-l border-black pl-2">{paymentNote}</span>
      </div>

      {/* 10. Authorized Signatory Block */}
      <div className="flex justify-between items-end pt-2 mt-2 invoice-section">
        <div>
          <div className="text-[9px] text-gray-500">System Generated Tax Invoice</div>
          <div className="text-[9px] text-gray-500">Biobusiness Development Agency</div>
        </div>

        <div className="text-right">
          <div className="font-bold text-[12px] print:text-[11px] mb-4 print:mb-3">Authorised Signatory</div>
          <div className="font-bold">{companyName || 'For Biobusiness Development Agency'}</div>
          <div className="text-[10px] print:text-[9px] font-semibold">Contact Number: {contactNumber || '9899571171'}</div>
        </div>
      </div>
    </div>
  );
});

ExactInvoicePreview.displayName = 'ExactInvoicePreview';
