export const updateMetaTags = (data: {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  url?: string;
  image?: string;
}) => {
  // Update title
  if (data.title) {
    document.title = `${data.title} | DevNote`;
  }

  // Update or create meta tags
  const updateMetaTag = (name: string, content: string, property?: boolean) => {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  if (data.description) {
    updateMetaTag('description', data.description);
    updateMetaTag('og:description', data.description, true);
  }

  if (data.keywords) {
    updateMetaTag('keywords', data.keywords);
  }

  if (data.author) {
    updateMetaTag('author', data.author);
  }

  if (data.url) {
    updateMetaTag('og:url', data.url, true);
    
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', data.url);
  }

  if (data.image) {
    updateMetaTag('og:image', data.image, true);
    updateMetaTag('twitter:image', data.image);
  }

  if (data.title) {
    updateMetaTag('og:title', data.title, true);
    updateMetaTag('twitter:title', data.title);
  }

  // Set default Open Graph and Twitter Card tags
  updateMetaTag('og:type', 'article', true);
  updateMetaTag('og:site_name', 'DevNote', true);
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:site', '@devnote');
};

export const generateStructuredData = (data: {
  type: 'Article' | 'WebSite' | 'Organization';
  title?: string;
  description?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  url?: string;
  image?: string;
}) => {
  let structuredData: any = {
    '@context': 'https://schema.org'
  };

  switch (data.type) {
    case 'Article':
      structuredData = {
        ...structuredData,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Person',
          name: data.author
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
        url: data.url,
        image: data.image,
        publisher: {
          '@type': 'Organization',
          name: 'DevNote',
          logo: {
            '@type': 'ImageObject',
            url: '/logo.png'
          }
        }
      };
      break;
    
    case 'WebSite':
      structuredData = {
        ...structuredData,
        '@type': 'WebSite',
        name: 'DevNote',
        description: 'A platform for developers to share knowledge and insights',
        url: data.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${data.url}/blogs?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };
      break;
  }

  // Update or create structured data script
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(structuredData);
};

export const trackPageView = (path: string) => {
  // Track page view for analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
    });
  }
};