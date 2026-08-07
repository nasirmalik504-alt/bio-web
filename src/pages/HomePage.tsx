import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/hero/HeroSection';
import { TrustedByMarquee } from '../components/sections/TrustedByMarquee';
import { ProductBentoGrid } from '../components/sections/ProductBentoGrid';
import { WhyChooseUs } from '../components/sections/WhyChooseUs';
import { CtaSection } from '../components/sections/CtaSection';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { generateOrganizationSchema, generateWebSiteSchema } from '../lib/seo';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-0">
      <SEO
        title="Biobusiness Development Agency | Premier Scientific & Lab Supplies"
        description="India's leading supplier of high-precision laboratory plasticware, borosilicate glassware, fine chemicals, laboratory instruments, and liquid handling systems for ICAR, CSIR, IITs, ICMR, and government research institutes."
        canonicalPath="/"
      />
      <StructuredData
        data={[generateOrganizationSchema(), generateWebSiteSchema()]}
        id="homepage-structured-data"
      />

      <HeroSection
        onExploreProducts={() => navigate('/products')}
        onTalkToExperts={() => navigate('/contact')}
        onOpenProcurement={() => navigate('/procurement')}
      />

      <TrustedByMarquee />

      <ProductBentoGrid
        onSelectCategory={(category) => navigate(`/products?category=${category}`)}
      />

      <WhyChooseUs />

      <CtaSection
        onContactClick={() => navigate('/contact')}
        onExploreProducts={() => navigate('/products')}
      />
    </div>
  );
};
