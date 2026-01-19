const fs = require('fs').promises;
const path = require('path');

// Vercel serverless function for properties CRUD
module.exports = async (req, res) => {
  // Enable CORS - must be set for all responses including errors
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract city and projectId from query parameters
  const { city, id } = req.query;
  const filePath = path.join(process.cwd(), 'src', 'public', 'data', 'properties.json');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const properties = JSON.parse(data);

    // GET - Read properties (all or by city)
    if (req.method === 'GET') {
      if (city) {
        return res.json(properties[city.toLowerCase()] || []);
      }
      return res.json(properties);
    }

    // POST - Add new property
    if (req.method === 'POST') {
      if (!city) {
        return res.status(400).json({ error: 'City parameter required' });
      }
      
      const newProperty = req.body;
      const cityKey = city.toLowerCase();
      
      if (!properties[cityKey]) {
        properties[cityKey] = [];
      }
      
      properties[cityKey].push(newProperty);
      
      await fs.writeFile(filePath, JSON.stringify(properties, null, 2));
      return res.json({ success: true, property: newProperty });
    }

    // PUT - Update property
    if (req.method === 'PUT') {
      if (!city || !id) {
        return res.status(400).json({ error: 'City and id parameters required' });
      }
      
      const updates = req.body;
      const cityKey = city.toLowerCase();
      
      if (!properties[cityKey]) {
        return res.status(404).json({ error: 'City not found' });
      }
      
      const index = properties[cityKey].findIndex(p => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      properties[cityKey][index] = { ...properties[cityKey][index], ...updates };
      
      await fs.writeFile(filePath, JSON.stringify(properties, null, 2));
      return res.json({ success: true, property: properties[cityKey][index] });
    }

    // DELETE - Remove property
    if (req.method === 'DELETE') {
      if (!city || !id) {
        return res.status(400).json({ error: 'City and id parameters required' });
      }
      
      const cityKey = city.toLowerCase();
      
      if (!properties[cityKey]) {
        return res.status(404).json({ error: 'City not found' });
      }
      
      properties[cityKey] = properties[cityKey].filter(p => p.id !== id);
      
      await fs.writeFile(filePath, JSON.stringify(properties, null, 2));
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Properties API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
