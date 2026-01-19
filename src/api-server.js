const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3001; // Support deployment platforms
const DATA_DIR = path.join(__dirname, 'public', 'data');

// Enhanced CORS configuration for GitHub Pages and localhost
const corsOptions = {
  origin: [
    'http://localhost:5173',           // Local Vite dev server
    'http://localhost:3000',           // Alternative local port
    'https://vishal1412.github.io',   // GitHub Pages
    'https://vishal1412.github.io/PropScan' // With base path
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'PropScan API Server is running',
    timestamp: new Date().toISOString()
  });
});

console.log('🚀 PropScan API Server Starting...');
console.log('📍 Port:', PORT);
console.log('📁 Data Directory:', DATA_DIR);
console.log('🌐 CORS Origins:', corsOptions.origin);

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

// ========== PROJECT IMAGES ==========
// Get all available images for a project from the file system
app.get('/api/projects/:projectName/images', async (req, res) => {
  try {
    const projectName = decodeURIComponent(req.params.projectName);
    const imagesDir = path.join(__dirname, 'public', 'images', 'projects', projectName);
    
    console.log(`📸 Scanning images for project: ${projectName}`);
    console.log(`📂 Looking in: ${imagesDir}`);
    
    // Check if directory exists
    try {
      await fs.access(imagesDir);
    } catch (error) {
      console.log(`⚠️ No images directory found for ${projectName}`);
      return res.json({});
    }
    
    const gallery = {};
    const categories = ['exterior', 'interior', 'amenities', 'location', 'floorplan', 'construction'];
    
    for (const category of categories) {
      const categoryPath = path.join(imagesDir, category);
      try {
        await fs.access(categoryPath);
        const files = await fs.readdir(categoryPath);
        const imageFiles = files.filter(file => 
          /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );
        
        if (imageFiles.length > 0) {
          gallery[category] = imageFiles.map(file => 
            `/images/projects/${projectName}/${category}/${file}`
          );
          console.log(`  ✓ ${category}: ${imageFiles.length} images`);
        }
      } catch (error) {
        // Category doesn't exist, skip it
        console.log(`  ○ ${category}: not found`);
      }
    }
    
    console.log(`✅ Found ${Object.keys(gallery).length} categories with images`);
    res.json(gallery);
  } catch (error) {
    console.error('❌ Error scanning project images:', error);
    res.status(500).json({ error: 'Failed to scan project images' });
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

// ========== IMAGE VALIDATION ==========
// Validate image URLs (both local and external)
app.post('/api/validate-images', async (req, res) => {
  try {
    const { images } = req.body;
    if (!Array.isArray(images)) {
      return res.status(400).json({ error: 'Images must be an array' });
    }

    const results = await Promise.all(images.map(async (imageUrl) => {
      try {
        // Check if it's a local path
        if (imageUrl.startsWith('/images/') || imageUrl.startsWith('./') || imageUrl.startsWith('../')) {
          const imagePath = path.join(__dirname, 'public', imageUrl.replace(/^\//, ''));
          try {
            await fs.access(imagePath);
            return { url: imageUrl, valid: true, type: 'local' };
          } catch {
            return { url: imageUrl, valid: false, type: 'local', error: 'File not found' };
          }
        }
        
        // Check if it's an external URL
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          return new Promise((resolve) => {
            const protocol = imageUrl.startsWith('https://') ? https : http;
            const timeout = setTimeout(() => {
              resolve({ url: imageUrl, valid: false, type: 'external', error: 'Timeout' });
            }, 5000);

            protocol.get(imageUrl, { method: 'HEAD' }, (response) => {
              clearTimeout(timeout);
              const valid = response.statusCode >= 200 && response.statusCode < 400;
              resolve({ 
                url: imageUrl, 
                valid, 
                type: 'external',
                statusCode: response.statusCode,
                error: valid ? null : `HTTP ${response.statusCode}`
              });
            }).on('error', (error) => {
              clearTimeout(timeout);
              resolve({ url: imageUrl, valid: false, type: 'external', error: error.message });
            });
          });
        }

        return { url: imageUrl, valid: false, type: 'unknown', error: 'Invalid URL format' };
      } catch (error) {
        return { url: imageUrl, valid: false, error: error.message };
      }
    }));

    const summary = {
      total: results.length,
      valid: results.filter(r => r.valid).length,
      invalid: results.filter(r => !r.valid).length,
      local: results.filter(r => r.type === 'local').length,
      external: results.filter(r => r.type === 'external').length
    };

    res.json({ results, summary });
  } catch (error) {
    console.error('❌ Error validating images:', error);
    res.status(500).json({ error: 'Failed to validate images' });
  }
});

// ========== RESALE PROPERTIES ==========
app.get('/api/resale-properties', async (req, res) => {
  try {
    const data = await readJsonFile('resale-properties.json');
    // Filter based on approval status if query param provided
    const { status } = req.query;
    if (status) {
      const filtered = data.filter(p => p.approvalStatus === status);
      return res.json(filtered);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read resale properties' });
  }
});

app.post('/api/resale-properties', async (req, res) => {
  try {
    const properties = await readJsonFile('resale-properties.json');
    const newProperty = {
      ...req.body,
      id: `resale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString(),
      approvalStatus: 'pending', // pending, approved, rejected
      listingStatus: 'active', // active, sold, on-hold
    };
    properties.push(newProperty);
    await writeJsonFile('resale-properties.json', properties);
    console.log('✅ Resale property submitted:', newProperty.id);
    res.json(newProperty);
  } catch (error) {
    console.error('❌ Error adding resale property:', error);
    res.status(500).json({ error: 'Failed to add resale property' });
  }
});

app.put('/api/resale-properties/:id', async (req, res) => {
  try {
    const properties = await readJsonFile('resale-properties.json');
    const index = properties.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Resale property not found' });
    }
    properties[index] = { ...properties[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeJsonFile('resale-properties.json', properties);
    console.log('✅ Resale property updated:', req.params.id);
    res.json(properties[index]);
  } catch (error) {
    console.error('❌ Error updating resale property:', error);
    res.status(500).json({ error: 'Failed to update resale property' });
  }
});

app.delete('/api/resale-properties/:id', async (req, res) => {
  try {
    const properties = await readJsonFile('resale-properties.json');
    const filtered = properties.filter(p => p.id !== req.params.id);
    await writeJsonFile('resale-properties.json', filtered);
    console.log('✅ Resale property deleted:', req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error deleting resale property:', error);
    res.status(500).json({ error: 'Failed to delete resale property' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
});
