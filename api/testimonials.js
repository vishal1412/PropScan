const fs = require('fs').promises;
const path = require('path');

// Vercel serverless function for testimonials CRUD
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), 'src', 'public', 'data', 'testimonials.json');

  try {
    // GET - Read all testimonials
    if (req.method === 'GET') {
      const data = await fs.readFile(filePath, 'utf8');
      const testimonials = JSON.parse(data);
      return res.json(testimonials);
    }

    // POST - Add new testimonial
    if (req.method === 'POST') {
      const newTestimonial = req.body;
      const data = await fs.readFile(filePath, 'utf8');
      const testimonials = JSON.parse(data);
      
      testimonials.push(newTestimonial);
      
      await fs.writeFile(filePath, JSON.stringify(testimonials, null, 2));
      return res.json({ success: true, testimonial: newTestimonial });
    }

    // PUT - Update testimonial
    if (req.method === 'PUT') {
      const { id, updates } = req.body;
      const data = await fs.readFile(filePath, 'utf8');
      let testimonials = JSON.parse(data);
      
      const index = testimonials.findIndex(t => t.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      
      testimonials[index] = { ...testimonials[index], ...updates };
      
      await fs.writeFile(filePath, JSON.stringify(testimonials, null, 2));
      return res.json({ success: true, testimonial: testimonials[index] });
    }

    // DELETE - Remove testimonial
    if (req.method === 'DELETE') {
      const { id } = req.query;
      const data = await fs.readFile(filePath, 'utf8');
      let testimonials = JSON.parse(data);
      
      testimonials = testimonials.filter(t => t.id !== id);
      
      await fs.writeFile(filePath, JSON.stringify(testimonials, null, 2));
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Testimonials API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
