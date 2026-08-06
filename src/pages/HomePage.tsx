import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/hero/HeroSection';
import { TrustedByMarquee } from '../components/sections/TrustedByMarquee';
import { ProductBentoGrid } from '../components/sections/ProductBentoGrid';
import { WhyChooseUs } from '../components/sections/WhyChooseUs';
import { CtaSection } from '../components/sections/CtaSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-0">
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
