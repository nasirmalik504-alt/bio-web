import { Product, TimelineEvent, TeamMember, Institution } from '../types';

// Liquid Handling Datasets
import micropipettes from './products/micropipettes.json';
import electronicPipettes from './products/electronic-pipettes.json';
import bottleTopDispensers from './products/bottle-top-dispensers.json';
import electronicBurettes from './products/electronic-burettes.json';
import aspirators from './products/aspirators.json';
import peristalticPumps from './products/peristaltic-pumps.json';
import liquidAccessories from './products/accessories.json';
import liquidHandlingProducts from './products/liquid-handling.json';

// Filtration Datasets
import syringeFilters from './products/filtration/syringe-filters.json';
import sterileSyringeFilters from './products/filtration/sterile-syringe-filters.json';
import doubleLayeredFilters from './products/filtration/double-layered-filters.json';
import multiLayeredFilters from './products/filtration/multi-layered-filters.json';
import membraneFilters from './products/filtration/membrane-filters.json';
import glassFibreFilters from './products/filtration/glass-fibre-filters.json';
import filterPapers from './products/filtration/filter-papers.json';
import filterHolders from './products/filtration/filter-holders.json';
import vacuumPumps from './products/filtration/vacuum-pumps.json';
import airVentFilters from './products/filtration/air-vent-filters.json';
import bottleTopFilters from './products/filtration/bottle-top-filters.json';
import membraneDiscs from './products/filtration/membrane-discs.json';
import filtrationAccessories from './products/filtration/accessories.json';

// White-Label BioBrand Plasticware Dataset (32 Core Products)
import plasticwareProducts from './products/plasticware.json';

// Laboratory Glassware Dataset (18 Main BioBrand Catalogue Items)
import glasswareProducts from './products/glassware.json';

// Safety & PPE Dataset (16 Exact BioBrand Safety Products)
import safetyProductsJson from './products/plasticware/safety-products.json';

// Analytical Instruments Dataset (112 Reputed Manufacturer Instrument Products)
import instrumentProducts from './products/instruments.json';

export const LIQUID_HANDLING_PRODUCTS_DATA: Product[] = [
  ...(micropipettes as unknown as Product[]),
  ...(electronicPipettes as unknown as Product[]),
  ...(bottleTopDispensers as unknown as Product[]),
  ...(electronicBurettes as unknown as Product[]),
  ...(aspirators as unknown as Product[]),
  ...(peristalticPumps as unknown as Product[]),
  ...(liquidAccessories as unknown as Product[]),
  ...(liquidHandlingProducts as unknown as Product[]),
];

export const FILTRATION_PRODUCTS_DATA: Product[] = [
  ...(syringeFilters as unknown as Product[]),
  ...(sterileSyringeFilters as unknown as Product[]),
  ...(doubleLayeredFilters as unknown as Product[]),
  ...(multiLayeredFilters as unknown as Product[]),
  ...(membraneFilters as unknown as Product[]),
  ...(glassFibreFilters as unknown as Product[]),
  ...(filterPapers as unknown as Product[]),
  ...(filterHolders as unknown as Product[]),
  ...(vacuumPumps as unknown as Product[]),
  ...(airVentFilters as unknown as Product[]),
  ...(bottleTopFilters as unknown as Product[]),
  ...(membraneDiscs as unknown as Product[]),
  ...(filtrationAccessories as unknown as Product[]),
];

export const PLASTICWARE_PRODUCTS_DATA: Product[] = [
  ...(plasticwareProducts as unknown as Product[]),
];

export const GLASSWARE_PRODUCTS_DATA: Product[] = [
  ...(glasswareProducts as unknown as Product[]),
];

export const SAFETY_PRODUCTS_DATA: Product[] = [
  ...(safetyProductsJson as unknown as Product[]),
];

export const INSTRUMENTS_PRODUCTS_DATA: Product[] = [
  ...(instrumentProducts as unknown as Product[]),
];

export const PRODUCTS_DATA: Product[] = [
  ...LIQUID_HANDLING_PRODUCTS_DATA,
  ...FILTRATION_PRODUCTS_DATA,
  ...PLASTICWARE_PRODUCTS_DATA,
  ...GLASSWARE_PRODUCTS_DATA,
  ...SAFETY_PRODUCTS_DATA,
  ...INSTRUMENTS_PRODUCTS_DATA,
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '1996',
    title: 'Founding of Biobusiness',
    description: 'Established in New Delhi with a mission to deliver high-precision laboratory supplies to government research institutions.',
    icon: '🏛️',
    badge: 'Foundation',
    stats: '500+ Active Labs Supplied'
  },
  {
    year: '2004',
    title: 'CSIR & ICAR Rate Contracts',
    description: 'Secured first nationwide annual rate contracts for borosilicate glassware and plasticware with premier ICAR & CSIR institutes.',
    icon: '📜',
    badge: 'Institutional Growth',
    stats: '25+ Premier Research Institutes'
  },
  {
    year: '2015',
    title: 'ISO 9001:2015 Quality Certification',
    description: 'Achieved formal ISO quality management system accreditation for scientific supply chain excellence.',
    icon: '🛡️',
    badge: 'ISO Accreditation',
    stats: '100% Traceability Achieved'
  },
  {
    year: '2019',
    title: 'GeM Portal Authorization',
    description: 'Integrated as an authorized OEM reseller on the Government e-Marketplace (GeM) for automated bidding.',
    icon: '⚡',
    badge: 'Digital Integration',
    stats: '₹50Cr+ Tender Fulfillment'
  },
  {
    year: '2026',
    title: 'Enterprise Catalogue Expansion',
    description: 'Launched 5,000+ SKU interactive digital scientific platform powered by AI search and instant rate contract generation.',
    icon: '🚀',
    badge: '29-Year Milestone',
    stats: 'Serving 500+ Labs Nationwide'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Harbhajan Singh',
    role: 'Founder & Chairman',
    experience: '30+ Years Experience',
    bio: 'Pioneered government laboratory procurement in North India, establishing long-standing partnerships with ICAR, CSIR, and premier universities.',
    image: '/images/team/harbhajan-singh.webp'
  },
  {
    name: 'Mohammad Nasir',
    role: 'Chief Executive Officer (CEO)',
    experience: '15+ Years Experience',
    bio: 'Specializes in GeM tender compliance, institutional BOQ preparation, and high-precision analytical equipment consultation.',
    image: '/images/team/mohammad-nasir.webp'
  }
];

export const INSTITUTIONS: Institution[] = [
  { name: 'ICAR', fullName: 'Indian Council of Agricultural Research', category: 'ICAR', logoText: 'ICAR' },
  { name: 'CSIR', fullName: 'Council of Scientific & Industrial Research', category: 'CSIR', logoText: 'CSIR' },
  { name: 'IIT', fullName: 'Indian Institutes of Technology', category: 'IIT', logoText: 'IIT' },
  { name: 'ICMR', fullName: 'Indian Council of Medical Research', category: 'ICMR', logoText: 'ICMR' },
  { name: 'DST', fullName: 'Department of Science & Technology', category: 'DST', logoText: 'DST' },
  { name: 'DBT', fullName: 'Department of Biotechnology', category: 'DBT', logoText: 'DBT' }
];
