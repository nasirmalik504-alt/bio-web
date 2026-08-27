import { CompanyInvoiceConfig, DEFAULT_COMPANY_CONFIG } from '../config/invoiceConfig';

const COMPANY_CONFIG_KEY = 'biobusiness_company_config_v2';

/**
 * Get configured company & bank settings from localStorage or fallback to default
 */
export function getStoredCompanyConfig(): CompanyInvoiceConfig {
  try {
    const raw = localStorage.getItem(COMPANY_CONFIG_KEY);
    if (!raw) return DEFAULT_COMPANY_CONFIG;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading stored company config:', err);
    return DEFAULT_COMPANY_CONFIG;
  }
}

/**
 * Save updated company & bank settings to localStorage
 */
export function saveStoredCompanyConfig(config: CompanyInvoiceConfig): CompanyInvoiceConfig {
  try {
    localStorage.setItem(COMPANY_CONFIG_KEY, JSON.stringify(config));
    return config;
  } catch (err) {
    console.error('Error saving company config:', err);
    return config;
  }
}
