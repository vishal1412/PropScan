const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Vercel serverless function for project extraction
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { websiteUrl, projectId } = req.body;

    if (!websiteUrl) {
      return res.status(400).json({ error: 'Website URL is required' });
    }

    console.log(`[Extract] Starting extraction for ${projectId || 'project'} from ${websiteUrl}`);

    // Create axios instance with SSL bypass
    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    // Fetch the webpage
    const response = await axios.get(websiteUrl, {
      httpsAgent: agent,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract data (simplified version - you can expand this)
    const extractedData = {
      overview: '',
      amenities: [],
      floorPlans: [],
      projectImages: [],
      galleryImages: {
        exterior: [],
        interior: [],
        amenities: [],
        location: [],
        construction: []
      },
      constructionUpdates: [],
      documents: []
    };

    // Extract overview from common selectors
    const overviewSelectors = [
      '.overview', '.description', '.about', 
      '[class*="overview"]', '[class*="description"]',
      'p:contains("overview")', 'div:contains("about")'
    ];

    for (const selector of overviewSelectors) {
      const text = $(selector).first().text().trim();
      if (text && text.length > 100) {
        extractedData.overview = text.substring(0, 1000);
        break;
      }
    }

    // Extract images
    const imageSelectors = [
      'img[src*="gallery"]', 'img[src*="project"]', 'img[src*="image"]',
      '.gallery img', '.slider img', '.carousel img',
      'img[alt*="project"]', 'img[alt*="gallery"]'
    ];

    const imageUrls = new Set();
    imageSelectors.forEach(selector => {
      $(selector).each((i, elem) => {
        let src = $(elem).attr('src') || $(elem).attr('data-src');
        if (src) {
          // Convert relative URLs to absolute
          if (src.startsWith('/')) {
            const urlObj = new URL(websiteUrl);
            src = `${urlObj.protocol}//${urlObj.host}${src}`;
          } else if (src.startsWith('//')) {
            src = `https:${src}`;
          } else if (!src.startsWith('http')) {
            const baseUrl = websiteUrl.substring(0, websiteUrl.lastIndexOf('/') + 1);
            src = baseUrl + src;
          }
          
          // Filter out small/icon images
          if (!src.includes('icon') && !src.includes('logo') && !src.includes('sprite')) {
            imageUrls.add(src);
          }
        }
      });
    });

    extractedData.projectImages = Array.from(imageUrls).slice(0, 20);

    // Extract amenities
    const amenitySelectors = [
      '.amenities li', '.amenity', '[class*="amenity"]',
      '.features li', '.facility'
    ];

    amenitySelectors.forEach(selector => {
      $(selector).each((i, elem) => {
        const text = $(elem).text().trim();
        if (text && text.length < 100) {
          extractedData.amenities.push({
            name: text,
            icon: '',
            category: 'General'
          });
        }
      });
    });

    // Remove duplicates
    extractedData.amenities = extractedData.amenities
      .filter((amenity, index, self) => 
        index === self.findIndex(a => a.name === amenity.name)
      )
      .slice(0, 20);

    console.log('[Extract] Extraction completed:', {
      overview: !!extractedData.overview,
      amenities: extractedData.amenities.length,
      projectImages: extractedData.projectImages.length
    });

    res.json({ data: extractedData });

  } catch (error) {
    console.error('[Extract] Error:', error.message);
    res.status(500).json({ 
      error: 'Extraction failed', 
      message: error.message,
      details: 'Please check if the website URL is accessible and try again.'
    });
  }
};
