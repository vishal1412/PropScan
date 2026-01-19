const { getAboutUs, updateAboutUs } = require('./mongodb-helper');

// Vercel serverless function for about us
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Read about us
    if (req.method === 'GET') {
      const aboutUs = await getAboutUs();
      return res.json(aboutUs);
    }

    // PUT - Update about us
    if (req.method === 'PUT') {
      const data = req.body;
      await updateAboutUs(data);
      return res.json({ success: true, data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('About Us API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
