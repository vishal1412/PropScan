const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const router = express.Router();

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
      timeout: 15000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract content
    const extractedData = {
      officialWebsite: url,
      overview: extractOverview($),
      detailedAmenities: extractAmenities($),
      floorPlans: await extractFloorPlans($, projectId),
      gallery: await extractGallery($, projectId),
      locationDetails: extractLocationDetails($),
      developerInfo: extractDeveloperInfo($),
      documents: extractDocuments($, url),
      constructionUpdates: extractConstructionUpdates($)
    };

    console.log('[Extract] Extraction completed successfully');
    console.log('[Extract] Found:', {
      overview: !!extractedData.overview,
      amenities: extractedData.detailedAmenities?.length || 0,
      floorPlans: extractedData.floorPlans?.length || 0,
      galleryImages: Object.values(extractedData.gallery || {}).flat().length,
      documents: extractedData.documents?.length || 0
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

async function extractFloorPlans($, projectId) {
  const floorPlans = [];
  const selectors = [
    '.floor-plan img',
    '.floorplan img',
    '[class*="floor"] img',
    '[class*="plan"] img'
  ];

  selectors.forEach(selector => {
    $(selector).each((i, elem) => {
      const src = $(elem).attr('src') || $(elem).attr('data-src');
      if (src && src.match(/floor|plan/i)) {
        floorPlans.push({
          id: crypto.randomBytes(8).toString('hex'),
          title: $(elem).attr('alt') || `Floor Plan ${floorPlans.length + 1}`,
          image: resolveUrl(src, $('base').attr('href') || ''),
          description: $(elem).closest('div').find('p').text().trim() || null
        });
      }
    });
  });

  return floorPlans;
}

async function extractGallery($, projectId) {
  const gallery = {
    exterior: [],
    interior: [],
    amenities: [],
    location: [],
    construction: []
  };

  // Extract all images
  $('img').each((i, elem) => {
    const src = $(elem).attr('src') || $(elem).attr('data-src');
    const alt = ($(elem).attr('alt') || '').toLowerCase();
    const parent = $(elem).closest('section, div').attr('class') || '';

    if (!src || src.startsWith('data:') || src.includes('logo') || src.includes('icon')) {
      return;
    }

    const url = resolveUrl(src, $('base').attr('href') || '');

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
