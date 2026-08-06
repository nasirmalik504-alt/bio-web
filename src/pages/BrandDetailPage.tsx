import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BRAND_PARTNERS } from '../components/sections/OfficialDistributionTrustBadge';
import { PRODUCTS_DATA } from '../data/productsData';
import { ProductCardItem } from '../components/products/ProductCardItem';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { Product } from '../types';
import { ShieldCheck, CheckCircle2, ExternalLink, ArrowLeft, Award, Sparkles } from 'lucide-react';

export const BrandDetailPage: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const brandInfo = useMemo(() => {
    return BRAND_PARTNERS.find((b) => b.id === brandId) || {
      id: brandId || 'brand',
      name: (brandId || '').replace(/-/g, ' ').toUpperCase(),
      category: 'Scientific Equipment & Consumables',
      logo: '🧪',
      website: '#',
      country: 'Global',
      description: 'Authorized laboratory equipment and consumables supplied by Biobusiness Scientific.',
    };
  }, [brandId]);

  const brandProducts = useMemo(() => {
    const matchName = brandInfo.name.toLowerCase();
    return PRODUCTS_DATA.filter((p) => {
      const m = (p.manufacturer || '').toLowerCase();
      const b = (p.brand || '').toLowerCase();
      return m.includes(matchName) || matchName.includes(m) || b.includes(matchName);
    });
  }, [brandInfo]);

  return (
    <div className="pt-28 pb-20 bg-[#FAFBFD] min-h-screen relative overflow-hidden text-[#5F708A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Back Link */}
        <div>
          <Link
            to="/brands"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#6EA8FE] hover:text-[#5B95F5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Authorized Brands
          </Link>
        </div>

        {/* Brand Header Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E6ECF5] shadow-xs relative overflow-hidden space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] flex items-center justify-center text-3xl shadow-2xs">
                {brandInfo.logo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#EAF7F2] border border-[#7CC9A5]/30 text-[#23324D] text-[10px] font-mono font-bold">
                    Made in {brandInfo.country}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#6EA8FE]">
                    OFFICIAL AUTHORIZED PARTNER
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#23324D] font-display tracking-tight mt-1">
                  {brandInfo.name}
                </h1>
              </div>
            </div>

            {brandInfo.website !== '#' && (
              <a
                href={brandInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-[#FAFBFD] border border-[#E6ECF5] hover:border-[#6EA8FE] text-xs font-bold text-[#23324D] flex items-center gap-2 shadow-2xs transition-all"
              >
                Official Manufacturer Site <ExternalLink className="w-4 h-4 text-[#6EA8FE]" />
              </a>
            )}
          </div>

          <p className="text-base text-[#5F708A] font-light leading-relaxed max-w-3xl">
            {brandInfo.description} Biobusiness Development Agency is an authorized supplier for {brandInfo.name}, delivering 100% genuine factory products, original manufacturer catalogue numbers, and complete technical support.
          </p>

          {/* Authenticity Guarantee Strip */}
          <div className="pt-4 border-t border-[#E6ECF5] grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-[#23324D]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7CC9A5]" />
              <span>Genuine Manufacturer Product</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7CC9A5]" />
              <span>Original Catalogue Numbers Preserved</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7CC9A5]" />
              <span>Supplied by Biobusiness Development Agency</span>
            </div>
          </div>
        </div>

        {/* Brand Products Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#23324D] font-display">
              {brandInfo.name} Product Catalogue ({brandProducts.length} Items)
            </h2>
          </div>

          {brandProducts.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#E6ECF5] rounded-3xl space-y-3">
              <Award className="w-10 h-10 text-[#9AA7BC] mx-auto" />
              <h3 className="text-lg font-bold text-[#23324D]">Product Catalogue Integration Pending</h3>
              <p className="text-xs text-[#5F708A]">
                Full product catalogue for {brandInfo.name} is available on request. Contact Biobusiness Scientific for direct quotes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brandProducts.map((product) => (
                <ProductCardItem
                  key={product.id}
                  product={product}
                  onViewDetails={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          allProducts={PRODUCTS_DATA}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}
    </div>
  );
};
