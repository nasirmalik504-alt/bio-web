import { InvoiceData } from '../types/invoiceTypes';
import { getTodayDDMMYYYY } from '../utils/dateFormatter';

export interface CompanyInvoiceConfig {
  companyName: string;
  companyAddressLine1: string;
  companyAddressLine2: string;
  companyGstin: string;
  signatoryHeading: string;
  contactNumber: string;
  bankDetails: {
    bankName: string;
    branch: string;
    beneficiary: string;
    accountNumber: string;
    ifsc: string;
    micr: string;
    swift: string;
  };
  defaultPaymentTerms: string;
  defaultJurisdiction: string;
  defaultPaymentNote: string;
  defaultTaxType: 'IGST' | 'CGST_SGST' | 'NONE';
  defaultTaxRate: number;
  invoicePrefix: string;
}

export const DEFAULT_COMPANY_CONFIG: CompanyInvoiceConfig = {
  companyName: 'Biobusiness Development Agency',
  companyAddressLine1: 'A-126 Ground Floor, Fateh Nagar, Jail Road',
  companyAddressLine2: 'New Delhi - 110018, India',
  companyGstin: '07ARMPN8877F1Z2',
  signatoryHeading: 'For Biobusiness Development Agency',
  contactNumber: '9899571171',
  bankDetails: {
    bankName: 'HDFC BANK LTD.',
    branch: 'VIKASPURI, NEW DELHI - 110018',
    beneficiary: 'BIOBUSINESS DEVELOPMENT AGENCY',
    accountNumber: '50200028491823',
    ifsc: 'HDFC0000451',
    micr: '110240066',
    swift: 'HDFCINBBXXX'
  },
  defaultPaymentTerms: 'Payment, within 20 days from the date of submission of the invoice, through bankers cheque or demand draft or RTGS is acceptable to us',
  defaultJurisdiction: 'All disputes are subject to jurisdiction Delhi only',
  defaultPaymentNote: 'If the Invoice not paid within the due date, an interest @18% PA will be charged from the date of invoice',
  defaultTaxType: 'IGST',
  defaultTaxRate: 18,
  invoicePrefix: 'BDA/'
};

export const INITIAL_SAMPLE_INVOICE: InvoiceData = {
  invoiceNumber: 'BDA/001',
  invoiceDate: getTodayDDMMYYYY(),
  orderNumber: '',
  orderDate: getTodayDDMMYYYY(),

  customer: {
    title: '',
    addressLine1: '',
    addressLine2: '',
    cityStatePin: '',
    state: '',
    gstin: '',
    contactPerson: '',
    email: '',
    phone: ''
  },

  isShipToSameAsBillTo: true,
  shippingAddress: {
    title: '',
    addressLine1: '',
    addressLine2: '',
    cityStatePin: '',
    state: '',
    gstin: '',
    phone: ''
  },

  items: [
    {
      id: 'item-1',
      code: '',
      description: '',
      hsnCode: '84212900',
      unitPrice: 0,
      quantity: 1,
      totalPrice: 0
    }
  ],

  taxType: 'IGST',
  taxRate: 18,

  paymentTerms: DEFAULT_COMPANY_CONFIG.defaultPaymentTerms,
  bankDetails: { ...DEFAULT_COMPANY_CONFIG.bankDetails },
  jurisdiction: DEFAULT_COMPANY_CONFIG.defaultJurisdiction,
  paymentNote: DEFAULT_COMPANY_CONFIG.defaultPaymentNote,
  companyName: DEFAULT_COMPANY_CONFIG.signatoryHeading,
  contactNumber: DEFAULT_COMPANY_CONFIG.contactNumber
};
