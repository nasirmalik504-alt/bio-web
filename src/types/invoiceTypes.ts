export interface CustomerHeader {
  title: string;          // e.g. "Assistant Administrative Officer (AAO)"
  institution?: string;   // Optional institution for backward compatibility
  addressLine1: string;   // e.g. "Bemloe"
  addressLine2?: string;  // e.g. ""
  cityStatePin: string;   // e.g. "SHIMLA-171001"
  state: string;          // e.g. "Himachal Pradesh"
  gstin?: string;         // Customer GSTIN if applicable
  contactPerson?: string; // Optional contact name
  email?: string;         // Optional email
  phone?: string;         // Customer contact number
}

export interface ShippingAddress {
  title: string;
  addressLine1: string;
  addressLine2?: string;
  cityStatePin: string;
  state: string;
  gstin?: string;
  phone?: string;
}

export interface InvoiceItem {
  id: string;
  code: string;            // Product Code / SKU (e.g., "AX-SF-PES-0.2")
  description: string;     // Multiline article description & specs
  hsnCode: string;         // HSN Code (e.g. "84212900")
  unitPrice: number;       // Price per unit (₹)
  quantity: number;        // Quantity
  totalPrice: number;      // Calculated unitPrice * quantity
  gstRate?: number;        // Item GST rate % (e.g. 18, 12, 5, 28, 0). Defaults to invoice taxRate if missing
  unitPriceInclGst?: string | number; // Optional draft string for typing inclusive price
}

export interface BankDetails {
  bankName: string;
  branch: string;
  beneficiary: string;
  accountNumber: string;
  ifsc: string;
  micr: string;
  swift: string;
}

export type TaxType = 'IGST' | 'CGST_SGST' | 'NONE';

export interface InvoiceData {
  invoiceId?: string;       // Unique immutable ID e.g. "INV-2026-000172"
  invoiceNumber: string;    // e.g. "BDA/172"
  invoiceDate: string;      // YYYY-MM-DD or DD/MM/YYYY
  orderNumber: string;      // e.g. "CPRI/2026/04"
  orderDate: string;        // YYYY-MM-DD or DD/MM/YYYY

  customer: CustomerHeader;
  isShipToSameAsBillTo?: boolean;
  shippingAddress?: ShippingAddress;

  items: InvoiceItem[];

  taxType: TaxType;
  taxRate: number;          // e.g. 18 for 18% IGST or 9 for 9% CGST + 9% SGST
  
  // Terms & Disclaimers
  paymentTerms: string;     // Default: "Payment, within 20 days from the date of submission of the invoice, through bankers cheque or demand draft or RTGS is acceptable to us"
  bankDetails: BankDetails;
  jurisdiction: string;     // Default: "All disputes are subject to jurisdiction Delhi only"
  paymentNote: string;      // Default: "If the Invoice not paid within the due date, an interest @18% PA will be charged from the date of invoice"
  companyName: string;      // Default: "For Biobusiness Development Agency"
  contactNumber: string;    // Default: "9899571171"
}

export interface SaveInvoiceResponse {
  success: boolean;
  invoiceId?: string;
  invoiceNumber?: string;
  message?: string;
  error?: string;
  invoice?: any;
}
