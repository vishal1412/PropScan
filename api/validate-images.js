const https = require('https');
const http = require('http');

// Vercel serverless function for image validation
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrls } = req.body;

    if (!Array.isArray(imageUrls)) {
      return res.status(400).json({ error: 'imageUrls must be an array' });
    }

    const results = await Promise.all(
      imageUrls.map(url => validateImageUrl(url))
    );

    res.json({ results });

  } catch (error) {
    console.error('Validate images error:', error);
    res.status(500).json({ error: error.message });
  }
};

function validateImageUrl(url) {
  return new Promise((resolve) => {
    try {
      const protocol = url.startsWith('https') ? https : http;
      
      const options = {
        method: 'HEAD',
        timeout: 5000,
        rejectUnauthorized: false
      };

      const req = protocol.request(url, options, (res) => {
        resolve({
          url,
          valid: res.statusCode === 200,
          contentType: res.headers['content-type'],
          size: res.headers['content-length']
        });
      });

      req.on('error', () => {
        resolve({ url, valid: false, error: 'Request failed' });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ url, valid: false, error: 'Timeout' });
      });

      req.end();
    } catch (error) {
      resolve({ url, valid: false, error: error.message });
    }
  });
}
