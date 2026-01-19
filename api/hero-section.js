const { getHeroSection, updateHeroSection } = require('./mongodb-helper');

// Vercel serverless function for hero section
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Read hero section
    if (req.method === 'GET') {
      const heroSection = await getHeroSection();
      return res.json(heroSection);
    }

    // PUT - Update hero section
    if (req.method === 'PUT') {
      const data = req.body;
      await updateHeroSection(data);
      return res.json({ success: true, data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Hero Section API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
