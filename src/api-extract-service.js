const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const router = express.Router();

// Base images directory
const BASE_IMAGES_DIR = path.join(__dirname, 'public', 'images', 'projects');

/**
 * Validate if image buffer is valid (not corrupted)
 */
function isValidImage(buffer, contentType) {
  if (!buffer || buffer.length < 100) return false; // Too small to be valid
  
  // Check file signatures (magic numbers)
  const signatures = {
    jpg: [0xFF, 0xD8, 0xFF],
    png: [0x89, 0x50, 0x4E, 0x47],
    gif: [0x47, 0x49, 0x46],
    webp: [0x52, 0x49, 0x46, 0x46]
  };

  // Check JPEG
  if (contentType?.includes('jpeg') || contentType?.includes('jpg')) {
    return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  }
  
  // Check PNG
  if (contentType?.includes('png')) {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  }
  
  // Check GIF
  if (contentType?.includes('gif')) {
    return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
  }
  
  // Check WebP
  if (contentType?.includes('webp')) {
    return buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
  }

  // If content-type not specified, try to detect from signature
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) return true; // JPEG
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return true; // PNG
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return true; // GIF
  if (buffer[0] === 0x52 && buffer[1] === 0x49) return true; // WebP

  return false;
}

/**
 * Download and save image from URL
 */
async function downloadImage(url, projectId, category, index) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      }),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const buffer = Buffer.from(response.data);
    const contentType = response.headers['content-type'];

    // Validate image before saving
    if (!isValidImage(buffer, contentType)) {
      console.log(`[Download] Skipping corrupted/invalid image: ${url}`);
      return null;
    }

    // Get file extension from content-type or URL
    let ext = '.jpg';
    if (contentType) {
      if (contentType.includes('png')) ext = '.png';
      else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = '.jpg';
      else if (contentType.includes('webp')) ext = '.webp';
      else if (contentType.includes('gif')) ext = '.gif';
    } else {
      const urlExt = path.extname(new URL(url).pathname).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(urlExt)) {
        ext = urlExt;
      }
    }

    // Create project-specific directory
    const projectDir = path.join(BASE_IMAGES_DIR, projectId);
    await fs.mkdir(projectDir, { recursive: true });

    // Create category subdirectory
    const categoryDir = path.join(projectDir, category);
    await fs.mkdir(categoryDir, { recursive: true });

    // Create filename: index_hash.ext
    const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 8);
    const filename = `${index}_${hash}${ext}`;
    const filepath = path.join(categoryDir, filename);

    // Save image
    await fs.writeFile(filepath, buffer);
    
    // Return relative path for use in JSON (accessible from public folder)
    const relativePath = `/images/projects/${projectId}/${category}/${filename}`;
    console.log(`[Download] ✓ Saved: ${relativePath}`);
    return relativePath;
  } catch (error) {
    console.error(`[Download] Failed to download image: ${url}`, error.message);
    return null;
  }
}

/**
 * Download multiple images in parallel (with limit)
 */
async function downloadImages(urls, projectId, category) {
  const results = [];
  const batchSize = 3; // Download 3 images at a time to avoid overwhelming the server
  
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const downloads = batch.map((url, idx) => 
      downloadImage(url, projectId, category, i + idx)
    );
    const batchResults = await Promise.all(downloads);
    results.push(...batchResults);
  }
  
  return results.filter(path => path !== null);
}

/**
 * Extract project content from official website
 * POST /api/projects/extract
 * Body: { url: string, projectId: string }
 */
router.post('/extract', async (req, res) => {
  try {
    const { url, projectId } = req.body;

    if (!url || !projectId) {
      return res.status(400).json({ error: 'URL and projectId are required' });
    }

    console.log(`[Extract] Starting extraction for ${projectId} from ${url}`);

    // Fetch the website HTML
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000,
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      })
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const baseUrl = url;

    console.log('[Extract] Extracting content and downloading images...');

    // Extract content with image URLs
    const extractedData = {
      officialWebsite: url,
      overview: extractOverview($),
      detailedAmenities: extractAmenities($),
      floorPlans: await extractFloorPlans($, projectId, baseUrl),
      gallery: await extractGallery($, projectId, baseUrl),
      locationDetails: extractLocationDetails($),
      developerInfo: extractDeveloperInfo($),
      documents: extractDocuments($, url),
      constructionUpdates: extractConstructionUpdates($)
    };

    // Extract and download project images
    console.log('[Extract] Downloading project images...');
    const imageUrls = extractProjectImages($, baseUrl);
    extractedData.images = await downloadImages(imageUrls, projectId, 'project');

    // Download floor plan images
    if (extractedData.floorPlans && extractedData.floorPlans.length > 0) {
      console.log('[Extract] Downloading floor plan images...');
      for (let i = 0; i < extractedData.floorPlans.length; i++) {
        const plan = extractedData.floorPlans[i];
        if (plan.image) {
          const localPath = await downloadImage(plan.image, projectId, 'floorplan', i);
          if (localPath) plan.image = localPath;
        }
      }
    }

    // Download gallery images
    if (extractedData.gallery) {
      console.log('[Extract] Downloading gallery images...');
      for (const [category, urls] of Object.entries(extractedData.gallery)) {
        if (Array.isArray(urls) && urls.length > 0) {
          extractedData.gallery[category] = await downloadImages(urls, projectId, category);
        }
      }
    }

    // Download construction update images
    if (extractedData.constructionUpdates && extractedData.constructionUpdates.length > 0) {
      console.log('[Extract] Downloading construction update images...');
      for (let i = 0; i < extractedData.constructionUpdates.length; i++) {
        const update = extractedData.constructionUpdates[i];
        if (update.images && update.images.length > 0) {
          update.images = await downloadImages(update.images, projectId, `update${i}`);
        }
      }
    }

    console.log('[Extract] Extraction completed successfully');
    console.log('[Extract] Found:', {
      overview: !!extractedData.overview,
      amenities: extractedData.detailedAmenities?.length || 0,
      floorPlans: extractedData.floorPlans?.length || 0,
      projectImages: extractedData.images?.length || 0,
      galleryImages: Object.values(extractedData.gallery || {}).flat().length,
      documents: extractedData.documents?.length || 0,
      constructionUpdates: extractedData.constructionUpdates?.length || 0
    });

    res.json({
      success: true,
      data: extractedData
    });

  } catch (error) {
    console.error('[Extract] Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to extract content from website',
      details: error.message
    });
  }
});

// Helper Functions

/**
 * Extract project images (main gallery, hero images, etc.)
 */
function extractProjectImages($, baseUrl) {
  const images = new Set();
  
  // Try various selectors for project images
  const selectors = [
    '.gallery img, .project-gallery img, .image-gallery img',
    '.slider img, .carousel img, .swiper-slide img',
    '.hero img, .banner img, .header-image img',
    '[class*="gallery"] img, [class*="slider"] img',
    '[id*="gallery"] img, [id*="slider"] img',
    'img[src*="project"], img[src*="gallery"]'
  ];

  selectors.forEach(selector => {
    $(selector).each((i, elem) => {
      let src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-lazy');
      if (src) {
        src = resolveUrl(src, baseUrl);
        // Filter out small images (likely icons/logos)
        const width = $(elem).attr('width');
        const height = $(elem).attr('height');
        if (!width || !height || (parseInt(width) > 200 && parseInt(height) > 200)) {
          images.add(src);
        }
      }
    });
  });

  // Limit to reasonable number
  return Array.from(images).slice(0, 20);
}

function extractOverview($) {
  // Try multiple selectors for overview/description
  const selectors = [
    '.project-overview',
    '.overview',
    '.description',
    '.about-project',
    '[class*="overview"]',
    '[class*="description"]',
    'section.about',
    '.project-details p'
  ];

  for (const selector of selectors) {
    const text = $(selector).first().text().trim();
    if (text && text.length > 50) {
      return text;
    }
  }

  return null;
}

function extractAmenities($) {
  const amenities = [];
  const selectors = [
    '.amenities ul li',
    '.amenity-list li',
    '[class*="amenity"] li',
    '.features li'
  ];

  selectors.forEach(selector => {
    $(selector).each((i, elem) => {
      const text = $(elem).text().trim();
      if (text) {
        amenities.push({
          id: crypto.randomBytes(8).toString('hex'),
          name: text,
          category: categorizeAmenity(text)
        });
      }
    });
  });

  return amenities.slice(0, 50); // Limit to 50 amenities
}

function categorizeAmenity(name) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.match(/pool|swim|spa|gym|fitness|yoga/)) return 'Fitness & Wellness';
  if (lowerName.match(/park|garden|landscape|green/)) return 'Outdoor';
  if (lowerName.match(/club|lounge|party|banquet/)) return 'Leisure';
  if (lowerName.match(/security|cctv|guard/)) return 'Security';
  if (lowerName.match(/play|kids|children/)) return 'Kids';
  if (lowerName.match(/sport|court|cricket|tennis|badminton/)) return 'Sports';
  
  return 'General';
}

async function extractFloorPlans($, projectId, baseUrl) {
  const floorPlans = [];
  const selectors = [
    '.floor-plan img',
    '.floorplan img',
    '[class*="floor"] img',
    '[class*="plan"] img'
  ];

  selectors.forEach(selector => {
    $(selector).each((i, elem) => {
      let src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-lazy');
      if (src && src.match(/floor|plan/i)) {
        floorPlans.push({
          id: crypto.randomBytes(8).toString('hex'),
          title: $(elem).attr('alt') || `Floor Plan ${floorPlans.length + 1}`,
          image: resolveUrl(src, baseUrl),
          description: $(elem).closest('div').find('p').text().trim() || null
        });
      }
    });
  });

  return floorPlans;
}

async function extractGallery($, projectId, baseUrl) {
  const gallery = {
    exterior: [],
    interior: [],
    amenities: [],
    location: [],
    construction: []
  };

  // Extract all images
  $('img').each((i, elem) => {
    let src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-lazy');
    const alt = ($(elem).attr('alt') || '').toLowerCase();
    const parent = $(elem).closest('section, div').attr('class') || '';

    if (!src || src.startsWith('data:') || src.includes('logo') || src.includes('icon')) {
      return;
    }

    const url = resolveUrl(src, baseUrl);

    // Categorize based on context
    if (alt.match(/exterior|building|tower|elevation/) || parent.match(/exterior/i)) {
      gallery.exterior.push(url);
    } else if (alt.match(/interior|room|living|bedroom|kitchen/) || parent.match(/interior/i)) {
      gallery.interior.push(url);
    } else if (alt.match(/amenity|pool|gym|club/) || parent.match(/amenity/i)) {
      gallery.amenities.push(url);
    } else if (alt.match(/location|map|site/) || parent.match(/location/i)) {
      gallery.location.push(url);
    } else if (alt.match(/construction|progress/) || parent.match(/construction/i)) {
      gallery.construction.push(url);
    } else {
      // Default to exterior if unclear
      gallery.exterior.push(url);
    }
  });

  // Limit each category
  Object.keys(gallery).forEach(key => {
    gallery[key] = [...new Set(gallery[key])].slice(0, 20);
  });

  return gallery;
}

function extractLocationDetails($) {
  return {
    address: $('[class*="address"]').first().text().trim() || null,
    microLocation: $('[class*="location"]').first().text().trim() || null,
    description: $('[class*="location"] p').first().text().trim() || null,
    connectivity: extractList($, '[class*="connectivity"] li, [class*="nearby"] li'),
    nearbyLandmarks: extractList($, '[class*="landmark"] li')
  };
}

function extractDeveloperInfo($) {
  return {
    name: $('.developer-name, [class*="developer"] h3').first().text().trim() || null,
    about: $('.developer-about, [class*="developer"] p').first().text().trim() || null,
    experience: $('[class*="experience"]').first().text().trim() || null
  };
}

function extractDocuments($, baseUrl) {
  const documents = [];
  
  $('a[href*=".pdf"]').each((i, elem) => {
    const href = $(elem).attr('href');
    const text = $(elem).text().trim();
    
    if (href) {
      documents.push({
        id: crypto.randomBytes(8).toString('hex'),
        title: text || 'Document',
        type: text.toLowerCase().includes('brochure') ? 'brochure' : 
              text.toLowerCase().includes('floor') ? 'floorplan' : 'other',
        url: resolveUrl(href, baseUrl)
      });
    }
  });

  return documents;
}

function extractConstructionUpdates($) {
  const updates = [];
  
  $('.construction-update, [class*="progress"] [class*="update"]').each((i, elem) => {
    const title = $(elem).find('h3, h4, .title').text().trim();
    const date = $(elem).find('.date, [class*="date"]').text().trim();
    const description = $(elem).find('p').text().trim();
    
    if (title || description) {
      updates.push({
        id: crypto.randomBytes(8).toString('hex'),
        date: date || new Date().toISOString(),
        title: title || 'Construction Update',
        description: description,
        images: []
      });
    }
  });

  return updates;
}

function extractList($, selector) {
  const items = [];
  $(selector).each((i, elem) => {
    const text = $(elem).text().trim();
    if (text) items.push(text);
  });
  return items.length > 0 ? items : null;
}

function resolveUrl(url, base) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  
  try {
    const baseUrl = new URL(base || 'https://example.com');
    return new URL(url, baseUrl.href).href;
  } catch {
    return url;
  }
}

module.exports = router;
