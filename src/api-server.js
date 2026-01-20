require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const https = require('https');
const http = require('http');
const mongoHelper = require('./mongodb-helper');

const app = express();
const PORT = process.env.PORT || 3001; // Support deployment platforms
const DATA_DIR = path.join(__dirname, 'public', 'data');

// Track MongoDB availability
let isMongoAvailable = false;

// Test MongoDB connection at startup
(async () => {
  try {
    console.log('🔌 Testing MongoDB connection...');
    await mongoHelper.connectToDatabase();
    isMongoAvailable = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    isMongoAvailable = false;
    console.log('⚠️  MongoDB not available, using JSON files fallback');
    console.log('   Error:', error.message);
  }
})();

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
app.get('/api/health', async (req, res) => {
  try {
    // Test MongoDB connection
    await mongoHelper.connectToDatabase();
    res.json({ 
      status: 'ok', 
      message: 'PropScan API Server is running',
      database: 'MongoDB connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'PropScan API Server is running but database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
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
    if (!isMongoAvailable) {
      const fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'testimonials.json'), 'utf-8'));
      return res.json(fallbackData);
    }
    
    const data = await mongoHelper.getTestimonials();
    res.json(data);
  } catch (error) {
    console.error('MongoDB error, falling back to JSON file:', error.message);
    try {
      const fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'testimonials.json'), 'utf-8'));
      res.json(fallbackData);
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
      res.status(500).json({ error: 'Failed to read testimonials' });
    }
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const newTestimonial = {
      ...req.body,
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    const result = await mongoHelper.addTestimonial(newTestimonial);
    res.json(result);
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({ error: 'Failed to add testimonial' });
  }
});

app.put('/api/testimonials/:id', async (req, res) => {
  try {
    await mongoHelper.updateTestimonial(req.params.id, req.body);
    res.json({ ...req.body, id: req.params.id });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    await mongoHelper.deleteTestimonial(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// ========== LEADS ==========
app.get('/api/leads', async (req, res) => {
  try {
    if (!isMongoAvailable) {
      const fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'leads.json'), 'utf-8'));
      return res.json(fallbackData);
    }
    
    const data = await mongoHelper.getLeads();
    res.json(data);
  } catch (error) {
    console.error('MongoDB error, falling back to JSON file:', error.message);
    try {
      const fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'leads.json'), 'utf-8'));
      res.json(fallbackData);
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
      res.status(500).json({ error: 'Failed to read leads' });
    }
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const newLead = {
      ...req.body,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    const result = await mongoHelper.addLead(newLead);
    res.json(result);
  } catch (error) {
    console.error('Error adding lead:', error);
    res.status(500).json({ error: 'Failed to add lead' });
  }
});

app.delete('/api/leads/:id', async (req, res) => {
  try {
    await mongoHelper.deleteLead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// ========== PROPERTIES ==========
app.get('/api/properties', async (req, res) => {
  try {
    // Skip MongoDB if not available to avoid timeout
    if (!isMongoAvailable) {
      const fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'properties.json'), 'utf-8'));
      
      // If city query parameter is provided, return only that city's properties
      const { city } = req.query;
      if (city && fallbackData[city.toLowerCase()]) {
        return res.json(fallbackData[city.toLowerCase()]);
      }
      
      return res.json(fallbackData);
    }
    
    const data = await mongoHelper.getProperties();
    
    // If city query parameter is provided, return only that city's properties
    const { city } = req.query;
    if (city && data[city.toLowerCase()]) {
      return res.json(data[city.toLowerCase()]);
    }
    
    res.json(data);
  } catch (error) {
    console.error('MongoDB error, falling back to JSON file:', error.message);
    try {
      const fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'properties.json'), 'utf-8'));
      
      // If city query parameter is provided, return only that city's properties
      const { city } = req.query;
      if (city && fallbackData[city.toLowerCase()]) {
        return res.json(fallbackData[city.toLowerCase()]);
      }
      
      res.json(fallbackData);
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
      res.status(500).json({ error: 'Failed to read properties' });
    }
  }
});

app.get('/api/properties/:city', async (req, res) => {
  try {
    const data = await mongoHelper.getProperties();
    const city = req.params.city.toLowerCase();
    res.json(data[city] || []);
  } catch (error) {
    console.error('Error reading properties:', error);
    res.status(500).json({ error: 'Failed to read properties' });
  }
});

app.post('/api/properties/:city', async (req, res) => {
  try {
    console.log(`📝 POST /api/properties/${req.params.city}`, JSON.stringify(req.body, null, 2));
    const properties = await mongoHelper.getProperties();
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
    await mongoHelper.updateProperties(properties);
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
    const properties = await mongoHelper.getProperties();
    const city = req.params.city.toLowerCase();
    if (!properties[city]) {
      return res.status(404).json({ error: 'City not found' });
    }
    const index = properties[city].findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }
    properties[city][index] = { ...properties[city][index], ...req.body };
    await mongoHelper.updateProperties(properties);
    console.log(`✅ Property updated in ${city}:`, req.params.id);
    res.json(properties[city][index]);
  } catch (error) {
    console.error('❌ Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

app.delete('/api/properties/:city/:id', async (req, res) => {
  try {
    const properties = await mongoHelper.getProperties();
    const city = req.params.city.toLowerCase();
    if (!properties[city]) {
      return res.status(404).json({ error: 'City not found' });
    }
    properties[city] = properties[city].filter(p => p.id !== req.params.id);
    await mongoHelper.updateProperties(properties);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
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
    if (!isMongoAvailable) {
      const fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'cities.json'), 'utf-8'));
      return res.json(fallbackData);
    }
    
    const data = await mongoHelper.getCities();
    res.json(data);
  } catch (error) {
    console.error('MongoDB error, falling back to JSON file:', error.message);
    try {
      const fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'cities.json'), 'utf-8'));
      res.json(fallbackData);
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
      res.status(500).json({ error: 'Failed to read cities' });
    }
  }
});

// ========== HERO SECTION ==========
app.get('/api/hero-section', async (req, res) => {
  try {
    if (!isMongoAvailable) {
      const fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'heroSection.json'), 'utf-8'));
      return res.json(fallbackData);
    }
    
    const data = await mongoHelper.getHeroSection();
    res.json(data);
  } catch (error) {
    console.error('MongoDB error, falling back to JSON file:', error.message);
    try {
      const fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'heroSection.json'), 'utf-8'));
      res.json(fallbackData);
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
      res.status(500).json({ error: 'Failed to read hero section' });
    }
  }
});

app.put('/api/hero-section', async (req, res) => {
  try {
    await mongoHelper.updateHeroSection(req.body);
    res.json(req.body);
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({ error: 'Failed to update hero section' });
  }
});

// ========== ABOUT US ==========
app.get('/api/about-us', async (req, res) => {
  try {
    if (!isMongoAvailable) {
      const fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'aboutUs.json'), 'utf-8'));
      return res.json(fallbackData);
    }
    
    const data = await mongoHelper.getAboutUs();
    res.json(data);
  } catch (error) {
    console.error('MongoDB error, falling back to JSON file:', error.message);
    try {
      const fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'aboutUs.json'), 'utf-8'));
      res.json(fallbackData);
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
      res.status(500).json({ error: 'Failed to read about us' });
    }
  }
});

app.put('/api/about-us', async (req, res) => {
  try {
    await mongoHelper.updateAboutUs(req.body);
    res.json(req.body);
  } catch (error) {
    console.error('Error updating about us:', error);
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
    if (!isMongoAvailable) {
      let fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'resale-properties.json'), 'utf-8'));
      if (req.query.status) {
        fallbackData = fallbackData.filter(p => p.approvalStatus === req.query.status);
      }
      return res.json(fallbackData);
    }
    
    const { status } = req.query;
    const data = await mongoHelper.getResaleProperties(status || null);
    res.json(data);
  } catch (error) {
    console.error('MongoDB error, falling back to JSON file:', error.message);
    try {
      let fallbackData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'resale-properties.json'), 'utf-8'));
      if (req.query.status) {
        fallbackData = fallbackData.filter(p => p.approvalStatus === req.query.status);
      }
      res.json(fallbackData);
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
      res.status(500).json({ error: 'Failed to read resale properties' });
    }
  }
});

app.post('/api/resale-properties', async (req, res) => {
  try {
    const newProperty = {
      ...req.body,
      id: `resale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString(),
      approvalStatus: 'pending', // pending, approved, rejected
      listingStatus: 'active', // active, sold, on-hold
    };
    const result = await mongoHelper.addResaleProperty(newProperty);
    console.log('✅ Resale property submitted:', newProperty.id);
    res.json(result);
  } catch (error) {
    console.error('❌ Error adding resale property:', error);
    res.status(500).json({ error: 'Failed to add resale property' });
  }
});

app.put('/api/resale-properties/:id', async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    await mongoHelper.updateResaleProperty(req.params.id, updates);
    console.log('✅ Resale property updated:', req.params.id);
    res.json({ ...updates, id: req.params.id });
  } catch (error) {
    console.error('❌ Error updating resale property:', error);
    res.status(500).json({ error: 'Failed to update resale property' });
  }
});

app.delete('/api/resale-properties/:id', async (req, res) => {
  try {
    await mongoHelper.deleteResaleProperty(req.params.id);
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

// Handle uncaught promise rejections (like MongoDB connection failures)
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Promise Rejection:', reason);
  // Don't crash the server on MongoDB connection failures
});

process.on('uncaughtException', (error) => {
  console.error('⚠️ Uncaught Exception:', error);
  // Don't crash the server
});
