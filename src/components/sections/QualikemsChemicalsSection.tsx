import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FlaskConical, 
  CheckCircle2, 
  FileText, 
  Search, 
  ShieldCheck, 
  Truck, 
  Award, 
  Send,
  Sparkles,
  Plus,
  Check
} from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';
import { Product } from '../../types';

interface ChemicalItem {
  code: string;
  cas: string;
  name: string;
  grade: string;
  purity: string;
  category: string;
  packSizes: string[];
  description: string;
}

const QUALIKEMS_CHEMICAL_CATEGORIES = [
  { id: 'all', label: 'All Qualikems Chemicals' },
  { id: 'ar-acids', label: 'AR Acids & Bases' },
  { id: 'hplc-solvents', label: 'HPLC & Spectroscopy Solvents' },
  { id: 'lr-organics', label: 'LR Grade Syntheses Chemicals' },
  { id: 'stains-dyes', label: 'Stains, Dyes & Indicators' },
  { id: 'buffers-salts', label: 'Buffers & Molecular Salts' },
  { id: 'culture-media', label: 'Dehydrated Culture Media' },
];

const QUALIKEMS_FEATURED_CHEMICALS: ChemicalItem[] = [
  // AR Acids & Bases
  {
    code: 'Q-1048',
    cas: '7664-93-9',
    name: 'Sulfuric Acid AR Grade',
    grade: 'Analytical Reagent (AR / ACS)',
    purity: '98.0%',
    category: 'ar-acids',
    packSizes: ['500 mL', '2.5 L', '5 L', '25 L'],
    description: 'Ultra-pure sulfuric acid for precision analytical titrations, digestion, and synthesis.'
  },
  {
    code: 'Q-1022',
    cas: '7647-01-0',
    name: 'Hydrochloric Acid AR Grade',
    grade: 'Analytical Reagent (AR / ACS)',
    purity: '37.0%',
    category: 'ar-acids',
    packSizes: ['500 mL', '2.5 L', '5 L'],
    description: 'High-purity concentrated HCl for trace element analysis and laboratory standardization.'
  },
  {
    code: 'Q-1035',
    cas: '7697-37-2',
    name: 'Nitric Acid AR Grade',
    grade: 'Analytical Reagent (AR)',
    purity: '69.0%',
    category: 'ar-acids',
    packSizes: ['500 mL', '2.5 L'],
    description: 'Low-heavy-metal nitric acid ideal for AAS, ICP-MS sample digestion, and chemical testing.'
  },
  {
    code: 'Q-1070',
    cas: '1310-73-2',
    name: 'Sodium Hydroxide Pellets AR',
    grade: 'Analytical Reagent (AR)',
    purity: '98.5%',
    category: 'ar-acids',
    packSizes: ['500 g', '1 kg', '5 kg', '50 kg'],
    description: 'Deliquescent high-purity NaOH pellets for analytical titrants and pH adjustment.'
  },

  // HPLC Solvents
  {
    code: 'Q-2010',
    cas: '75-05-8',
    name: 'Acetonitrile HPLC Grade',
    grade: 'HPLC / Gradient / Spectroscopy',
    purity: '99.9%',
    category: 'hplc-solvents',
    packSizes: ['1 L', '2.5 L', '4 L'],
    description: 'Ultra-low UV absorption acetonitrile engineered for high-performance liquid chromatography.'
  },
  {
    code: 'Q-2025',
    cas: '67-56-1',
    name: 'Methanol HPLC Grade',
    grade: 'HPLC / Spectroscopy',
    purity: '99.9%',
    category: 'hplc-solvents',
    packSizes: ['1 L', '2.5 L', '4 L'],
    description: 'Filtered through 0.2µm filter with minimal baseline drift for analytical HPLC methods.'
  },
  {
    code: 'Q-2040',
    cas: '7732-18-5',
    name: 'Water HPLC Grade',
    grade: 'HPLC / LC-MS Grade',
    purity: 'Resistivity > 18.2 MΩ·cm',
    category: 'hplc-solvents',
    packSizes: ['1 L', '2.5 L', '5 L'],
    description: 'Pyrogen-free, low organic carbon HPLC grade water for mobile phase preparation.'
  },
  {
    code: 'Q-2055',
    cas: '67-63-0',
    name: 'Isopropanol (IPA) HPLC Grade',
    grade: 'HPLC / UV Spectroscopy',
    purity: '99.8%',
    category: 'hplc-solvents',
    packSizes: ['1 L', '2.5 L'],
    description: 'High purity 2-propanol optimized for chromatography and delicate optics cleaning.'
  },

  // LR Organics
  {
    code: 'Q-3015',
    cas: '67-64-1',
    name: 'Acetone LR Grade',
    grade: 'Laboratory Reagent (LR)',
    purity: '99.0%',
    category: 'lr-organics',
    packSizes: ['500 mL', '2.5 L', '5 L', '25 L'],
    description: 'Standard laboratory solvent for extractions, washing glassware, and chemical reactions.'
  },
  {
    code: 'Q-3030',
    cas: '64-17-5',
    name: 'Ethanol Absolute 99.9% LR',
    grade: 'Laboratory Reagent / Absolute',
    purity: '99.9%',
    category: 'lr-organics',
    packSizes: ['500 mL', '2.5 L', '5 L'],
    description: 'Anhydrous pure ethanol for histology, molecular biology, and chemical syntheses.'
  },
  {
    code: 'Q-3045',
    cas: '141-78-6',
    name: 'Ethyl Acetate LR Grade',
    grade: 'Laboratory Reagent (LR)',
    purity: '99.5%',
    category: 'lr-organics',
    packSizes: ['500 mL', '2.5 L', '25 L'],
    description: 'Versatile organic extraction solvent with low non-volatile residue.'
  },
  {
    code: 'Q-3060',
    cas: '108-88-3',
    name: 'Toluene LR Grade',
    grade: 'Laboratory Reagent (LR)',
    purity: '99.0%',
    category: 'lr-organics',
    packSizes: ['500 mL', '2.5 L', '25 L'],
    description: 'Aromatic hydrocarbon solvent for synthesis, gravimetric testing, and extraction.'
  },

  // Stains & Dyes
  {
    code: 'Q-4010',
    cas: '548-62-9',
    name: 'Crystal Violet Stain Powder',
    grade: 'Microscopy / Histology Grade',
    purity: '90.0% dye content',
    category: 'stains-dyes',
    packSizes: ['25 g', '100 g', '500 g'],
    description: 'Primary stain used in Gram staining procedures for bacterial classification.'
  },
  {
    code: 'Q-4025',
    cas: '61-73-4',
    name: 'Methylene Blue Powder',
    grade: 'Microscopy / Certified Stain',
    purity: '85.0% dye content',
    category: 'stains-dyes',
    packSizes: ['25 g', '100 g'],
    description: 'Biological stain for cell nuclei and redox indicator applications.'
  },
  {
    code: 'Q-4040',
    cas: '77-09-8',
    name: 'Phenolphthalein Indicator',
    grade: 'pH Indicator Grade',
    purity: 'ACS Grade',
    category: 'stains-dyes',
    packSizes: ['25 g', '100 g', '500 g'],
    description: 'Classic acid-base titration indicator transitioning colorless to pink (pH 8.2 - 10.0).'
  },
  {
    code: 'Q-4055',
    cas: '17372-87-1',
    name: 'Eosin Y (Water Soluble)',
    grade: 'Histology / Cytology Grade',
    purity: 'Certified Stain',
    category: 'stains-dyes',
    packSizes: ['25 g', '100 g'],
    description: 'Counterstain paired with hematoxylin in H&E staining of tissue sections.'
  },

  // Buffers & Salts
  {
    code: 'Q-5015',
    cas: '77-86-1',
    name: 'Tris Base (Molecular Biology Grade)',
    grade: 'Molecular Biology Grade',
    purity: '99.9%',
    category: 'buffers-salts',
    packSizes: ['100 g', '500 g', '1 kg'],
    description: 'DNase/RNase free buffer base for electrophoresis, TAE/TBE buffer preparation.'
  },
  {
    code: 'Q-5030',
    cas: '6381-92-6',
    name: 'EDTA Disodium Salt Dihydrate',
    grade: 'AR / Molecular Grade',
    purity: '99.0%',
    category: 'buffers-salts',
    packSizes: ['100 g', '500 g', '1 kg'],
    description: 'Chelating agent for metal ion sequestration and enzymatic inhibition buffers.'
  },
  {
    code: 'Q-5045',
    cas: '7647-14-5',
    name: 'Sodium Chloride AR Grade',
    grade: 'Analytical Reagent (AR)',
    purity: '99.5%',
    category: 'buffers-salts',
    packSizes: ['500 g', '1 kg', '5 kg'],
    description: 'Ultra-pure NaCl salt for cell culture buffer formulations and standard solutions.'
  },

  // Culture Media
  {
    code: 'Q-6010',
    cas: 'N/A',
    name: 'Nutrient Agar Dehydrated Media',
    grade: 'Microbiology Grade',
    purity: 'Standard Formula',
    category: 'culture-media',
    packSizes: ['100 g', '500 g', '5 kg'],
    description: 'General purpose culture medium for cultivating non-fastidious microorganisms.'
  },
  {
    code: 'Q-6025',
    cas: 'N/A',
    name: 'LB Broth (Luria-Bertani)',
    grade: 'Molecular Microbiology',
    purity: 'Standard Formula',
    category: 'culture-media',
    packSizes: ['250 g', '500 g', '1 kg'],
    description: 'Nutrient-rich medium optimized for E. coli growth and recombinant protein expression.'
  },
  {
    code: 'Q-6040',
    cas: 'N/A',
    name: 'Potato Dextrose Agar (PDA)',
    grade: 'Microbiology Grade',
    purity: 'Standard Formula',
    category: 'culture-media',
    packSizes: ['100 g', '500 g'],
    description: 'Recommended medium for isolation and enumeration of yeasts and molds.'
  }
];

export const QualikemsChemicalsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customInquiryText, setCustomInquiryText] = useState('');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const { addItemAndOpenDrawer } = useQuoteStore();

  const filteredChemicals = useMemo(() => {
    return QUALIKEMS_FEATURED_CHEMICALS.filter((chem) => {
      const matchCat = selectedCategory === 'all' || chem.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || (
        chem.name.toLowerCase().includes(q) ||
        chem.code.toLowerCase().includes(q) ||
        chem.cas.toLowerCase().includes(q) ||
        chem.grade.toLowerCase().includes(q)
      );
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleAddChemicalToQuote = (chem: ChemicalItem, pack: string) => {
    const prod: Product = {
      id: `qualikems-${chem.code}-${pack.replace(/\s+/g, '')}`,
      name: `Qualikems ${chem.name} (${pack})`,
      category: 'Chemicals & Reagents',
      subcategory: 'Qualikems Fine Chemicals',
      sku: chem.code,
      internalSKU: chem.code,
      manufacturerCatNo: chem.code,
      brand: 'Qualikems Fine Chemicals',
      manufacturer: 'Qualikems Fine Chemicals',
      supplier: 'Biobusiness Development Agency',
      description: chem.description,
      features: [`Grade: ${chem.grade}`, `Assay/Purity: ${chem.purity}`, `CAS: ${chem.cas}`, `Pack Size: ${pack}`],
      applications: ['Laboratory Analysis', 'Synthesis', 'Testing'],
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
      gallery: ['https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600'],
      slug: `product/qualikems-${chem.code}`,
      variants: [{ manufacturerCatNo: chem.code, capacity: pack, pack: pack }]
    };

    addItemAndOpenDrawer(prod, 1);

    setAddedItems((prev) => ({ ...prev, [`${chem.code}-${pack}`]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [`${chem.code}-${pack}`]: false }));
    }, 2500);
  };

  const handleCustomInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInquiryText.trim()) return;

    const customProd: Product = {
      id: `qualikems-custom-${Date.now()}`,
      name: `Qualikems Request: ${customInquiryText.trim()}`,
      model: 'Qualikems Special Request',
      category: 'Chemicals & Reagents',
      subcategory: 'Qualikems Special Request',
      sku: 'QUALIKEMS-SPECIAL',
      internalSKU: 'QUALIKEMS-SPECIAL',
      manufacturerCatNo: 'QUALIKEMS-BULK',
      brand: 'Qualikems Fine Chemicals',
      manufacturer: 'Qualikems Fine Chemicals',
      supplier: 'Biobusiness Development Agency',
      description: `Custom Qualikems chemical inquiry request: ${customInquiryText.trim()}`,
      features: ['Qualikems Portfolio Special Request', 'Bulk Barrel / Custom Purity Inquiry'],
      applications: ['Chemical Supply Request'],
      image: '/images/products/glassware/glassware-placeholder.webp',
      gallery: ['/images/products/glassware/glassware-placeholder.webp'],
      slug: `product/qualikems-custom-${Date.now()}`,
      variants: [{ manufacturerCatNo: 'QUALIKEMS-BULK', capacity: 'As Requested', pack: 'As Requested' }]
    };

    addItemAndOpenDrawer(customProd, 1);

    setInquirySubmitted(true);
    setCustomInquiryText('');
    setTimeout(() => setInquirySubmitted(false), 4000);
  };

  return (
    <div className="space-y-12 py-4 text-[#5F708A]">
      
      {/* Hero Banner: Authorized Supply of Qualikems Chemicals */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#047857] text-white p-8 sm:p-12 shadow-xl border border-emerald-500/20">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          
          {/* Partnership Trust Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 backdrop-blur-md">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-widest">
              OFFICIAL SUPPLIER & AUTHORIZED DISTRIBUTOR
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white leading-tight">
            WE SUPPLY <span className="text-emerald-400">ALL CHEMICALS</span> MANUFACTURED BY QUALIKEMS
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed max-w-3xl">
            Access the complete catalog of <strong>Qualikems Fine Chemicals</strong> — including Analytical Reagents (AR/ACS Grade), HPLC & Spectroscopy Solvents, Laboratory Organics (LR Grade), Biological Stains, Buffers, and Dehydrated Culture Media with 100% Certificate of Analysis (CoA) & instant quote fulfillment.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-700/60">
            <div className="space-y-1">
              <span className="text-2xl font-black text-white font-mono">5,000+</span>
              <p className="text-xs text-slate-400 font-medium">Chemical Products</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">100%</span>
              <p className="text-xs text-slate-400 font-medium">Batch CoA & MSDS</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-black text-white font-mono">AR / LR</span>
              <p className="text-xs text-slate-400 font-medium">High-Purity Grades</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">24 - 48h</span>
              <p className="text-xs text-slate-400 font-medium">Express Shipping</p>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Search & Filter Controls */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6ECF5] shadow-2xs space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#23324D] font-display flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              <span>Qualikems Chemical Search & Representative List</span>
            </h3>
            <p className="text-xs text-[#5F708A] mt-1 font-light">
              Search by chemical name, CAS number, code (e.g. Q-1048), or select a category below.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA7BC]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chemical name, CAS #..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] text-[#23324D] placeholder-[#9AA7BC] text-xs focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {QUALIKEMS_CHEMICAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-[#FAFBFD] text-[#5F708A] hover:bg-[#F4F8FC] border border-[#E6ECF5]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Featured Chemicals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChemicals.map((chem) => (
          <motion.div
            key={chem.code}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#E6ECF5] p-6 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              
              {/* Header Badges */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  {chem.code}
                </span>
                <span className="text-[#9AA7BC] font-semibold">
                  CAS: {chem.cas}
                </span>
              </div>

              {/* Chemical Name */}
              <h4 className="text-base font-bold text-[#23324D] group-hover:text-emerald-600 transition-colors">
                {chem.name}
              </h4>

              <p className="text-xs text-[#5F708A] font-light line-clamp-2 leading-relaxed">
                {chem.description}
              </p>

              {/* Grade & Purity Specs */}
              <div className="p-3 rounded-xl bg-[#FAFBFD] border border-[#E6ECF5] space-y-1.5 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-[#9AA7BC]">Grade:</span>
                  <span className="font-semibold text-[#23324D]">{chem.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AA7BC]">Purity / Assay:</span>
                  <span className="font-semibold text-emerald-600">{chem.purity}</span>
                </div>
              </div>

              {/* Pack Sizes Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-[#9AA7BC] uppercase font-bold">
                  Available Pack Sizes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {chem.packSizes.map((pack) => {
                    const itemKey = `${chem.code}-${pack}`;
                    const isAdded = addedItems[itemKey];
                    return (
                      <button
                        key={pack}
                        onClick={() => handleAddChemicalToQuote(chem, pack)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1 border ${
                          isAdded
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-[#23324D] border-[#E6ECF5] hover:border-emerald-500 hover:bg-emerald-50'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 text-emerald-600" />
                            <span>{pack}</span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Quick Action Footer */}
            <div className="pt-3 border-t border-[#E6ECF5] flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Qualikems Certified
              </span>
              <button
                onClick={() => handleAddChemicalToQuote(chem, chem.packSizes[0])}
                className="text-emerald-600 hover:text-emerald-800 font-bold underline cursor-pointer"
              >
                + Add to Basket
              </button>
            </div>

          </motion.div>
        ))}
      </div>

      {/* Custom Qualikems Chemical Inquiry Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 border border-emerald-200 shadow-2xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#23324D] font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Looking for a Specific Qualikems Chemical or Bulk Drums?</span>
            </h3>
            <p className="text-xs text-[#5F708A] mt-1 font-light max-w-2xl">
              We supply the <strong>ENTIRE Qualikems product portfolio</strong>. If you need a specific CAS number, custom volume (25L / 200L barrels), or custom purity grade, submit your code below and our quote engine will process it immediately!
            </p>
          </div>
        </div>

        <form onSubmit={handleCustomInquirySubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customInquiryText}
              onChange={(e) => setCustomInquiryText(e.target.value)}
              placeholder="e.g. Qualikems Code Q-8040, Sodium Azide 99% AR, 25 L Drum..."
              className="flex-1 px-4 py-3.5 rounded-2xl bg-white border border-emerald-300 text-[#23324D] placeholder-[#9AA7BC] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Add Special Inquiry to Basket</span>
            </button>
          </div>

          {inquirySubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Qualikems inquiry added to your quote basket!</span>
            </motion.div>
          )}
        </form>

      </div>

      {/* Why Choose Us for Qualikems Supply */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        
        <div className="p-6 rounded-2xl bg-white border border-[#E6ECF5] space-y-2">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          <h4 className="text-sm font-bold text-[#23324D]">Direct Qualikems Supply</h4>
          <p className="text-xs text-[#5F708A] font-light leading-relaxed">
            100% genuine factory-sealed containers directly from Qualikems manufacturing plants.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E6ECF5] space-y-2">
          <FileText className="w-8 h-8 text-emerald-600" />
          <h4 className="text-sm font-bold text-[#23324D]">CoA & MSDS Guaranteed</h4>
          <p className="text-xs text-[#5F708A] font-light leading-relaxed">
            Every shipment includes batch-specific Certificates of Analysis and safety sheets.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E6ECF5] space-y-2">
          <Truck className="w-8 h-8 text-emerald-600" />
          <h4 className="text-sm font-bold text-[#23324D]">Hazard & Cold Logistics</h4>
          <p className="text-xs text-[#5F708A] font-light leading-relaxed">
            Compliant chemical packaging with certified temperature-controlled and hazardous transport.
          </p>
        </div>

      </div>

    </div>
  );
};
