const fs = require('fs').promises;
const path = require('path');

// Vercel serverless function for leads CRUD
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), 'src', 'public', 'data', 'leads.json');

  try {
    // GET - Read all leads
    if (req.method === 'GET') {
      const data = await fs.readFile(filePath, 'utf8');
      const leads = JSON.parse(data);
      return res.json(leads);
    }

    // POST - Add new lead
    if (req.method === 'POST') {
      const newLead = req.body;
      const data = await fs.readFile(filePath, 'utf8');
      const leads = JSON.parse(data);
      
      leads.push(newLead);
      
      await fs.writeFile(filePath, JSON.stringify(leads, null, 2));
      return res.json({ success: true, lead: newLead });
    }

    // DELETE - Remove lead
    if (req.method === 'DELETE') {
      const { id } = req.query;
      const data = await fs.readFile(filePath, 'utf8');
      let leads = JSON.parse(data);
      
      leads = leads.filter(l => l.id !== id);
      
      await fs.writeFile(filePath, JSON.stringify(leads, null, 2));
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Leads API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
