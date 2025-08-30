// CDN utility for optimizing content delivery
const CDN_BASE_URL = process.env.CDN_BASE_URL || '';

const optimizeImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl || !CDN_BASE_URL) return imageUrl;
  
  const { width, height, quality = 80, format = 'webp' } = options;
  
  let optimizedUrl = `${CDN_BASE_URL}/${imageUrl}`;
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  params.append('f', format);
  
  return `${optimizedUrl}?${params.toString()}`;
};

const getCacheHeaders = (type = 'static') => {
  const cacheSettings = {
    static: {
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
      'Expires': new Date(Date.now() + 31536000000).toUTCString()
    },
    dynamic: {
      'Cache-Control': 'public, max-age=3600', // 1 hour
      'Expires': new Date(Date.now() + 3600000).toUTCString()
    },
    api: {
      'Cache-Control': 'public, max-age=300', // 5 minutes
      'Expires': new Date(Date.now() + 300000).toUTCString()
    }
  };
  
  return cacheSettings[type] || cacheSettings.dynamic;
};

const compressResponse = (req, res, next) => {
  // Enable compression for text-based responses
  res.set('Vary', 'Accept-Encoding');
  next();
};

module.exports = {
  optimizeImageUrl,
  getCacheHeaders,
  compressResponse
};