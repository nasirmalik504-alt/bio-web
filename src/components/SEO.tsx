import React, { useEffect } from 'react';
import { SITE_CONFIG, buildPageTitle, buildCanonicalUrl } from '../lib/seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = SITE_CONFIG.defaultDescription,
  keywords = SITE_CONFIG.defaultKeywords,
  canonicalPath = '',
  ogImage = SITE_CONFIG.defaultOgImage,
  ogType = 'website',
  noindex = false,
}) => {
  const fullTitle = buildPageTitle(title);
  const canonicalUrl = buildCanonicalUrl(canonicalPath);

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const updateMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update canonical link
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Meta Description & Meta Keywords
    updateMetaTag('meta[name="description"]', 'name', 'description', description);
    updateMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '));

    // Robots
    updateMetaTag(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
    );

    // Canonical Link
    updateLinkTag('canonical', canonicalUrl);

    // Open Graph Tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_CONFIG.name);

    // Twitter Card Tags
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
    updateMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', SITE_CONFIG.twitterHandle);
  }, [fullTitle, description, keywords, canonicalUrl, ogImage, ogType, noindex]);

  return null;
};
