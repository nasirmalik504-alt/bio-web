// Analytics & Search Console Integration Helper
// Supports GA4, GTM, Google Search Console, and Microsoft Clarity via environment variables

const metaEnv = (import.meta as any).env || {};

export const ANALYTICS_CONFIG = {
  gaId: metaEnv.VITE_GA_MEASUREMENT_ID || '',
  gtmId: metaEnv.VITE_GTM_ID || '',
  gscVerification: metaEnv.VITE_GSC_VERIFICATION || '',
  clarityId: metaEnv.VITE_CLARITY_ID || '',
};

export function initAnalytics() {
  if (typeof window === 'undefined') return;

  // Google Analytics 4 Injection
  if (ANALYTICS_CONFIG.gaId && !document.getElementById('ga4-script')) {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.gaId}`;
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${ANALYTICS_CONFIG.gaId}');
    `;
    document.head.appendChild(inlineScript);
  }

  // Google Tag Manager Injection
  if (ANALYTICS_CONFIG.gtmId && !document.getElementById('gtm-script')) {
    const gtmScript = document.createElement('script');
    gtmScript.id = 'gtm-script';
    gtmScript.textContent = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${ANALYTICS_CONFIG.gtmId}');
    `;
    document.head.appendChild(gtmScript);
  }

  // Google Search Console Verification Meta Tag
  if (ANALYTICS_CONFIG.gscVerification) {
    let meta = document.querySelector('meta[name="google-site-verification"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'google-site-verification');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', ANALYTICS_CONFIG.gscVerification);
  }
}
