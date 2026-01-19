const fs = require('fs').promises;
const path = require('path');

// Vercel serverless function for resale properties CRUD
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), 'src', 'public', 'data', 'resale-properties.json');

  try {
    // GET - Read resale properties (with optional status filter)
    if (req.method === 'GET') {
      const { status } = req.query;
      const data = await fs.readFile(filePath, 'utf8');
      let properties = JSON.parse(data);
      
      if (status) {
        properties = properties.filter(p => p.approvalStatus === status);
      }
      
      return res.json(properties);
    }

    // POST - Add new resale property
    if (req.method === 'POST') {
      const newProperty = req.body;
      const data = await fs.readFile(filePath, 'utf8');
      const properties = JSON.parse(data);
      
      // Add default fields
      newProperty.id = `resale-${Date.now()}`;
      newProperty.submittedAt = new Date().toISOString();
      newProperty.approvalStatus = 'pending';
      newProperty.listingStatus = 'active';
      
      properties.push(newProperty);
      
      await fs.writeFile(filePath, JSON.stringify(properties, null, 2));
      return res.json({ success: true, property: newProperty });
    }

    // PUT - Update resale property
    if (req.method === 'PUT') {
      const { id, updates } = req.body;
      const data = await fs.readFile(filePath, 'utf8');
      let properties = JSON.parse(data);
      
      const index = properties.findIndex(p => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      properties[index] = { 
        ...properties[index], 
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await fs.writeFile(filePath, JSON.stringify(properties, null, 2));
      return res.json({ success: true, property: properties[index] });
    }

    // DELETE - Remove resale property
    if (req.method === 'DELETE') {
      const { id } = req.query;
      const data = await fs.readFile(filePath, 'utf8');
      let properties = JSON.parse(data);
      
      properties = properties.filter(p => p.id !== id);
      
      await fs.writeFile(filePath, JSON.stringify(properties, null, 2));
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Resale Properties API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
