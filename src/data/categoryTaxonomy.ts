export interface SubcategoryItem {
  id: string;
  label: string;
}

export interface CategoryItem {
  id: string;
  label: string;
  icon: string;
  description: string;
  subcategories: SubcategoryItem[];
}

export const CATEGORY_TAXONOMY: CategoryItem[] = [
  {
    id: 'liquid-handling',
    label: 'Liquid Handling',
    icon: '🧪',
    description: 'Precision micropipettes, electronic liquid handling, dispensers, and digital titrators.',
    subcategories: [
      { id: 'all-liquid', label: 'All Liquid Handling' },
      { id: 'micropipettes', label: 'Micropipettes' },
      { id: 'electronic-pipettes', label: 'Electronic Pipettes' },
      { id: 'bottle-top-dispensers', label: 'Bottle Top Dispensers' },
      { id: 'electronic-burettes', label: 'Electronic Burettes' },
      { id: 'vacuum-aspirators', label: 'Vacuum Aspirators' },
      { id: 'peristaltic-pumps', label: 'Peristaltic Pumps' },
      { id: 'accessories', label: 'Accessories & Racks' },
    ],
  },
  {
    id: 'filtration',
    label: 'Filtration',
    icon: '🔬',
    description: 'Syringe filters, membrane discs, filter papers, vacuum holders, and bioprocess vent units.',
    subcategories: [
      { id: 'all-filtration', label: 'All Filtration' },
      { id: 'syringe-filters', label: 'Syringe Filters' },
      { id: 'sterile-syringe-filters', label: 'Sterile Syringe Filters' },
      { id: 'membrane-filters', label: 'Membrane Filters' },
      { id: 'bottle-top-filters', label: 'Bottle Top Filters' },
      { id: 'filter-papers', label: 'Filter Papers' },
      { id: 'glass-fibre-filters', label: 'Glass Fibre Filters' },
      { id: 'filter-holders', label: 'Filter Holders & Manifolds' },
      { id: 'vacuum-filtration', label: 'Vacuum Filtration Pumps' },
      { id: 'air-vent-filters', label: 'Air Vent Filters' },
      { id: 'accessories', label: 'Accessories' },
    ],
  },
  {
    id: 'glassware',
    label: 'Laboratory Glassware',
    icon: '🥛',
    description: 'ISO-certified borosilicate 3.3 beakers, flasks, cylinders, burettes, and volumetric glassware.',
    subcategories: [
      { id: 'all-glassware', label: 'All Glassware' },
      { id: 'beakers', label: 'Beakers' },
      { id: 'flasks', label: 'Flasks (Erlenmeyer & Volumetric)' },
      { id: 'measuring-cylinders', label: 'Measuring Cylinders' },
      { id: 'volumetric-glassware', label: 'Volumetric Pipettes & Pipets' },
      { id: 'burettes', label: 'Glass Burettes' },
      { id: 'funnels', label: 'Separatory & Filter Funnels' },
      { id: 'test-tubes', label: 'Test Tubes & Culture Tubes' },
      { id: 'watch-glasses', label: 'Watch Glasses' },
      { id: 'desiccators', label: 'Vacuum Desiccators' },
      { id: 'accessories', label: 'Glassware Accessories' },
    ],
  },
  {
    id: 'plasticware',
    label: 'Laboratory Plasticware',
    icon: '🧫',
    description: 'Virgin polypropylene tips, centrifuge tubes, cryo vials, petri dishes, and PCR consumables.',
    subcategories: [
      { id: 'all-plasticware', label: 'All Plasticware' },
      { id: 'storage-bottles', label: 'Reagent & Storage Bottles' },
      { id: 'flasks-beakers', label: 'Flasks & Beakers' },
      { id: 'measuring-cylinders', label: 'Measuring Cylinders & Jugs' },
      { id: 'centrifuge-tubes', label: 'Centrifuge Tubes & Microtubes' },
      { id: 'pcr-consumables', label: 'PCR Consumables & Plates' },
      { id: 'cryo-vials', label: 'Cryogenic Storage' },
      { id: 'petri-dishes', label: 'Petri Dishes & Cell Culture' },
      { id: 'safety-products', label: 'Safety & Biohazard' },
      { id: 'accessories', label: 'Racks, Stands & Accessories' },
    ],
  },
  {
    id: 'chemicals',
    label: 'Chemicals & Reagents',
    icon: '⚗️',
    description: 'High-purity AR/LR grade chemicals, HPLC solvents, culture media, and molecular reagents.',
    subcategories: [
      { id: 'all-chemicals', label: 'All Chemicals & Reagents' },
      { id: 'laboratory-chemicals', label: 'Laboratory Chemicals' },
      { id: 'analytical-reagents', label: 'Analytical Reagents (AR/ACS)' },
      { id: 'culture-media', label: 'Dehydrated Culture Media' },
      { id: 'buffers', label: 'Biological Buffers & Solutions' },
      { id: 'solvents', label: 'HPLC & Spectroscopy Solvents' },
      { id: 'indicators', label: 'pH & Titration Indicators' },
      { id: 'standards', label: 'Analytical Standards' },
      { id: 'biological-reagents', label: 'Enzymes & Molecular Reagents' },
    ],
  },
  {
    id: 'instruments',
    label: 'Analytical Instruments',
    icon: '📊',
    description: 'Precision analytical balances, pH meters, centrifuges, spectrophotometers, and stirrers.',
    subcategories: [
      { id: 'all-instruments', label: 'All Analytical Instruments' },
      { id: 'balances', label: 'Analytical & Precision Balances' },
      { id: 'ph-meters', label: 'Benchtop & Portable pH Meters' },
      { id: 'conductivity-meters', label: 'Conductivity Meters' },
      { id: 'spectrophotometers', label: 'UV-Vis Spectrophotometers' },
      { id: 'hot-plates', label: 'Hot Plates & Heating Mantles' },
      { id: 'magnetic-stirrers', label: 'Magnetic Stirrers' },
      { id: 'centrifuges', label: 'Benchtop Microcentrifuges' },
      { id: 'incubators', label: 'BOD Incubators & Shakers' },
      { id: 'microscopes', label: 'Binocular & Trinocular Microscopes' },
    ],
  },
  {
    id: 'safety',
    label: 'Safety & Laboratory Essentials',
    icon: '🥽',
    description: 'Nitrile & latex gloves, 3-ply & N95 respirator masks, face shields, autoclavable lab coats, spill kits, and safety cabinets.',
    subcategories: [
      { id: 'all-safety', label: 'All Safety & Essentials' },
      { id: 'gloves', label: 'Nitrile, Latex & Cryo Gloves' },
      { id: 'face-masks', label: '3-Ply & N95 Respirator Masks' },
      { id: 'face-shields', label: 'Polycarbonate Face Shields' },
      { id: 'lab-coats', label: 'Autoclavable Lab Coats & Apparel' },
      { id: 'safety-goggles', label: 'UV & Splash Safety Goggles' },
      { id: 'spill-kits', label: 'Chemical & Acid Spill Kits' },
      { id: 'storage-cabinets', label: 'Flammable Storage Cabinets' },
      { id: 'waste-containers', label: 'Biohazard Waste Containers' },
      { id: 'cleaning-supplies', label: 'Disinfectants & Lab Cleaners' },
    ],
  },
];
