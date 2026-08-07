import { Product } from '../types';

export const SITE_CONFIG = {
  name: 'Biobusiness Development Agency',
  shortName: 'Biobusiness',
  url: 'https://biobusiness.in',
  defaultTitle: 'Biobusiness Development Agency | Best Laboratory & Scientific Supplier in Delhi',
  defaultDescription:
    'Best laboratory and scientific supplier in Tilak Nagar, Delhi. Supplier of Microlit micropipettes, Axiva Sichem filtration, Qualikems fine chemicals, 15ml/50ml centrifuge tubes, 1.5ml/2ml micro centrifuge tubes, 90mm/100mm petri plates, sample cups, beakers, flasks, and digital burettes for ICAR, CSIR, ICMR, and IITs.',
  defaultKeywords: [
    'centrifuge tubes 50ml 15ml sterile non sterile',
    'micro centrifuge tubes 1.5ml 2ml',
    'sample cups 2ml 0.5ml',
    'petri plates 90mm 100mm culture disc',
    'cell culture flask',
    'beakers and flasks',
    'pipette and micro pipette',
    'fixed volume pipette',
    'digital burette',
    'tilak nagar scientific supplier',
    'supplier in delhi',
    'best laboratory supplier',
    'microlit authorized distributor',
    'axiva sichem filtration',
    'qualikems fine chemicals',
    'scientific supplier delhi',
  ],
  defaultOgImage: 'https://biobusiness.in/images/logo.png',
  twitterHandle: '@biobusiness_in',
  contactEmail: 'sales@biobusiness.in',
  contactPhone: '+91-11-23456789',
  address: {
    street: 'A-126, Fateh Nagar, Tilak Nagar',
    city: 'New Delhi',
    region: 'Delhi',
    postalCode: '110018',
    country: 'India',
  },
};

export interface PageMetaProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  keywords?: string[];
  noindex?: boolean;
}

export function buildPageTitle(title?: string): string {
  if (!title) return SITE_CONFIG.defaultTitle;
  if (title.includes(SITE_CONFIG.shortName)) return title;
  return `${title} | ${SITE_CONFIG.name}`;
}

export function buildCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

// JSON-LD Schema Generators

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.shortName,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/logo.png`,
    description: SITE_CONFIG.defaultDescription,
    email: SITE_CONFIG.contactEmail,
    telephone: SITE_CONFIG.contactPhone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.region,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.country,
    },
    sameAs: [
      'https://www.linkedin.com/company/biobusiness-development-agency',
      'https://twitter.com/biobusiness_in',
    ],
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

export function generateProductSchema(product: Product) {
  const imageUrl = product.image.startsWith('http')
    ? product.image
    : `${SITE_CONFIG.url}${product.image}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [imageUrl],
    description: product.description,
    sku: product.sku || product.internalSKU || product.manufacturerCatNo,
    mpn: product.manufacturerCatNo || product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || product.manufacturer || 'BioBrand',
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.manufacturer || 'BioBrand',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      price: '0.00',
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    },
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
