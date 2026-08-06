export interface ProductVariant {
  manufacturerCatNo: string;
  diameter?: string;
  micron?: string;
  volume?: string;
  capacity?: string;
  pack?: string;
  branches?: string;
  length?: string;
  model?: string;
  flowRate?: string;
  internalPricing?: {
    unitPrice: number;
    currency: string;
  };
}

export interface Product {
  id: string;
  sku: string;                     // Biobusiness Internal SKU ("BB-LH-0002")
  internalSKU: string;             // Biobusiness Internal SKU ("BB-LH-0002")
  manufacturerCatNo: string;       // Exact Manufacturer Catalogue No ("RAM-F-2")
  manufacturerModel?: string;      // Exact Manufacturer Model Name ("RAMBO Series Fixed Volume")
  manufacturer: string;            // e.g. "Microlit" / "Axiva Sichem"
  brand: string;                   // e.g. "Microlit" / "Axiva"
  supplier: string;                // "Biobusiness Scientific"
  authorizedDistributor?: boolean; // true
  countryOfOrigin?: string;        // e.g. "India" / "Germany"
  manufacturerWebsite?: string;    // e.g. "https://www.microlit.com"
  manufacturerLogo?: string;       // e.g. "/images/brands/microlit.svg"
  name: string;
  model?: string;
  category: string;
  subcategory: string;
  series?: string;
  description: string;
  features: string[];
  applications: string[];
  volume?: string;
  capacity?: string;
  type?: string;
  material?: string;
  sterile?: boolean;
  autoclavable?: boolean;
  electronic?: boolean;
  manual?: boolean;
  image: string;
  gallery: string[];
  documents?: { title: string; url: string }[];
  specifications?: Record<string, string>;
  technicalSpecifications?: Record<string, string>;
  variants?: ProductVariant[];
  internalPricing?: { unitPrice: number; currency: string };
  catNo?: string;
  micron?: string;
  diameter?: string;
  tags?: string[];
  searchTerms?: string[];
  relatedProducts?: string[];
  slug: string;
  badge?: string;
  gemApproved?: boolean;
  pageNumber?: number;
}

export interface QuoteItem {
  product: Product;
  quantity: number;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  stats?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  experience: string;
  bio: string;
  image: string;
}

export interface Institution {
  name: string;
  fullName?: string;
  category: string;
  logoText: string;
}
