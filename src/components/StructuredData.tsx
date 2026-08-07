import React, { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, any> | Record<string, any>[];
  id?: string;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data, id = 'structured-data-jsonld' }) => {
  useEffect(() => {
    let scriptTag = document.getElementById(id) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = id;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(data, null, 2);

    return () => {
      // Clean up script on unmount
      const tag = document.getElementById(id);
      if (tag) tag.remove();
    };
  }, [data, id]);

  return null;
};
