const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DATA_DIR = path.join(__dirname, 'public', 'data');

// Middleware
app.use(cors());
app.use(express.json());

// Import extraction service
const extractionRouter = require('./api-extract-service');
app.use('/api/projects', extractionRouter);

// Helper function to read JSON file
async function readJsonFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

// Helper function to write JSON file
async function writeJsonFile(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// ========== TESTIMONIALS ==========
app.get('/api/testimonials', async (req, res) => {
  try {
    const data = await readJsonFile('testimonials.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read testimonials' });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await readJsonFile('testimonials.json');
    const newTestimonial = {
      ...req.body,
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    testimonials.push(newTestimonial);
    await writeJsonFile('testimonials.json', testimonials);
    res.json(newTestimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add testimonial' });
  }
});

app.put('/api/testimonials/:id', async (req, res) => {
  try {
    const testimonials = await readJsonFile('testimonials.json');
    const index = testimonials.findIndex(t => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    testimonials[index] = { ...testimonials[index], ...req.body };
    await writeJsonFile('testimonials.json', testimonials);
    res.json(testimonials[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    const testimonials = await readJsonFile('testimonials.json');
    const filtered = testimonials.filter(t => t.id !== req.params.id);
    await writeJsonFile('testimonials.json', filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// ========== LEADS ==========
app.get('/api/leads', async (req, res) => {
  try {
    const data = await readJsonFile('leads.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read leads' });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const leads = await readJsonFile('leads.json');
    const newLead = {
      ...req.body,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    leads.push(newLead);
    await writeJsonFile('leads.json', leads);
    res.json(newLead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add lead' });
  }
});

app.delete('/api/leads/:id', async (req, res) => {
  try {
    const leads = await readJsonFile('leads.json');
    const filtered = leads.filter(l => l.id !== req.params.id);
    await writeJsonFile('leads.json', filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// ========== PROPERTIES ==========
app.get('/api/properties', async (req, res) => {
  try {
    const data = await readJsonFile('properties.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read properties' });
  }
});

app.get('/api/properties/:city', async (req, res) => {
  try {
    const data = await readJsonFile('properties.json');
    const city = req.params.city.toLowerCase();
    res.json(data[city] || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read properties' });
  }
});

app.post('/api/properties/:city', async (req, res) => {
  try {
    console.log(`📝 POST /api/properties/${req.params.city}`, JSON.stringify(req.body, null, 2));
    const properties = await readJsonFile('properties.json');
    const city = req.params.city.toLowerCase();
    if (!properties[city]) {
      properties[city] = [];
    }
    const newProperty = {
      ...req.body,
      id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: req.body.status || 'active',
    };
    properties[city].push(newProperty);
    await writeJsonFile('properties.json', properties);
    console.log(`✅ Property added to ${city}:`, newProperty.id);
    res.json(newProperty);
  } catch (error) {
    console.error('❌ Error adding property:', error);
    res.status(500).json({ error: 'Failed to add property' });
  }
});

app.put('/api/properties/:city/:id', async (req, res) => {
  try {
    console.log(`📝 PUT /api/properties/${req.params.city}/${req.params.id}`);
    const properties = await readJsonFile('properties.json');
    const city = req.params.city.toLowerCase();
    if (!properties[city]) {
      return res.status(404).json({ error: 'City not found' });
    }
    const index = properties[city].findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }
    properties[city][index] = { ...properties[city][index], ...req.body };
    await writeJsonFile('properties.json', properties);
    console.log(`✅ Property updated in ${city}:`, req.params.id);
    res.json(properties[city][index]);
  } catch (error) {
    console.error('❌ Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

app.delete('/api/properties/:city/:id', async (req, res) => {
  try {
    const properties = await readJsonFile('properties.json');
    const city = req.params.city.toLowerCase();
    if (!properties[city]) {
      return res.status(404).json({ error: 'City not found' });
    }
    properties[city] = properties[city].filter(p => p.id !== req.params.id);
    await writeJsonFile('properties.json', properties);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// ========== CITIES ==========
app.get('/api/cities', async (req, res) => {
  try {
    const data = await readJsonFile('cities.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read cities' });
  }
});

// ========== HERO SECTION ==========
app.get('/api/hero-section', async (req, res) => {
  try {
    const data = await readJsonFile('heroSection.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read hero section' });
  }
});

app.put('/api/hero-section', async (req, res) => {
  try {
    await writeJsonFile('heroSection.json', req.body);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hero section' });
  }
});

// ========== ABOUT US ==========
app.get('/api/about-us', async (req, res) => {
  try {
    const data = await readJsonFile('aboutUs.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read about us' });
  }
});

app.put('/api/about-us', async (req, res) => {
  try {
    await writeJsonFile('aboutUs.json', req.body);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update about us' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
});
