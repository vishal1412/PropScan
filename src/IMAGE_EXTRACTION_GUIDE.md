# Image Extraction & Download Guide

## Overview
The extraction service now **automatically downloads and saves images** from project websites to your local `public/images/extracted` folder. This means:

- ✅ Images are stored locally (no external dependencies)
- ✅ Faster page loads (no external requests)
- ✅ Works offline after extraction
- ✅ No broken image links

## What Gets Downloaded

### 1. **Project Images** (Main Gallery)
- Hero/banner images
- Project exterior shots
- Gallery images
- Slider images
- Saved as: `projectId_project_0.jpg`, `projectId_project_1.jpg`, etc.
- Limit: 20 images

### 2. **Floor Plans**
- Floor plan diagrams
- Layout images
- Configuration images
- Saved as: `projectId_floorplan_0.png`, `projectId_floorplan_1.png`, etc.

### 3. **Gallery by Category**
Images are automatically categorized and saved:
- **Exterior**: Building facades, towers, elevations
  - Saved as: `projectId_exterior_0.jpg`
- **Interior**: Rooms, living spaces, kitchens
  - Saved as: `projectId_interior_0.jpg`
- **Amenities**: Pool, gym, clubhouse
  - Saved as: `projectId_amenities_0.jpg`
- **Location**: Maps, site plans
  - Saved as: `projectId_location_0.jpg`
- **Construction**: Progress photos
  - Saved as: `projectId_construction_0.jpg`

### 4. **Construction Update Images**
- Progress photos from updates
- Saved as: `projectId_update0_0.jpg`, `projectId_update1_0.jpg`, etc.

## How It Works

### Step 1: Extract Content
1. Go to **http://localhost:5173/PropScan/admin**
2. Select a city (e.g., Gurgaon)
3. Add or edit a project
4. Enter the **Official Website URL** (e.g., `https://www.gangarealty.com/nandaka/`)
5. Click **"Import Details"**

### Step 2: Automatic Download
The system will:
1. ✅ Extract image URLs from the website
2. ✅ Download each image (with SSL verification disabled)
3. ✅ Save with organized filenames
4. ✅ Convert paths to local references
5. ✅ Show progress in console

**Console Output:**
```
[Extract] Downloading project images...
[Extract] Downloading floor plan images...
[Extract] Downloading gallery images...
[Extract] Downloading construction update images...
[Extract] Found:
  - overview: true
  - amenities: 15
  - floorPlans: 3
  - projectImages: 8
  - galleryImages: 12
  - documents: 2
```

### Step 3: Review & Save
1. Check the form fields - all data is loaded
2. Verify images in browser console
3. Edit any fields if needed
4. Click **"Add Project"** or **"Update Project"**
5. Images are now referenced in `properties.json` as `/images/extracted/...`

## File Structure

```
src/
└── public/
    └── images/
        └── extracted/
            ├── nandaka_project_0_a1b2c3d4.jpg
            ├── nandaka_project_1_e5f6g7h8.jpg
            ├── nandaka_floorplan_0_i9j0k1l2.png
            ├── nandaka_exterior_0_m3n4o5p6.jpg
            ├── nandaka_interior_0_q7r8s9t0.jpg
            └── ...
```

## Image Naming Convention

Format: `{projectId}_{category}_{index}_{hash}{extension}`

- **projectId**: Sanitized project name
- **category**: project, floorplan, exterior, interior, amenities, location, construction, update0, update1, etc.
- **index**: Sequential number (0, 1, 2...)
- **hash**: 8-character MD5 hash of URL (prevents duplicates)
- **extension**: .jpg, .png, .webp, etc.

## Features

### ✅ Smart Filtering
- Skips small images (likely icons/logos)
- Filters out placeholders
- Ignores data URIs
- Only downloads images > 200x200px (when dimensions available)

### ✅ Batch Processing
- Downloads 3 images at a time (prevents overwhelming servers)
- Handles timeouts gracefully
- Retries failed downloads

### ✅ URL Resolution
- Handles relative URLs (`/images/photo.jpg`)
- Handles protocol-relative URLs (`//cdn.example.com/photo.jpg`)
- Handles absolute URLs (`https://example.com/photo.jpg`)

### ✅ SSL Certificate Bypass
- Works with self-signed certificates
- Works with expired certificates
- No certificate verification issues

### ✅ Multiple Image Formats
- JPG/JPEG
- PNG
- WebP
- GIF
- Auto-detects from Content-Type header

## Troubleshooting

### Images Not Downloading?
**Check API Server Console:**
```
[Download] Failed to download image: https://...
```

**Common Issues:**
1. **Network timeout**: Image server is slow (increase timeout in code)
2. **403 Forbidden**: Website blocks scrapers (User-Agent is set to bypass)
3. **Invalid URL**: Check URL format in source website

### Images Broken After Save?
**Check paths in properties.json:**
```json
{
  "images": [
    "/images/extracted/project_0.jpg",  // ✅ Correct
    "https://external.com/image.jpg"     // ❌ Should be local
  ]
}
```

### Permission Issues?
Make sure `src/public/images/extracted` directory exists and is writable:
```powershell
New-Item -Path "src\public\images\extracted" -ItemType Directory -Force
```

## Best Practices

### ✅ Do:
- Use high-quality official project websites
- Test with one project first
- Review extracted data before saving
- Check image quality in browser after extraction

### ❌ Don't:
- Extract from protected/paywalled sites
- Download copyrighted images without permission
- Extract more than 20-30 images per project
- Run multiple extractions simultaneously

## Performance

- **Average extraction time**: 30-60 seconds
- **Image download speed**: ~3 images/second
- **Storage**: ~100-500 KB per image
- **Total per project**: 5-50 MB

## Security Notes

- SSL certificate verification is disabled for extraction
- This is a **development tool only**
- Images are saved to local public folder (accessible to all)
- Use official project websites only
- Respect copyright and usage rights

## Example Usage

```javascript
// In Admin Panel - after clicking "Import Details"

// Console output:
[Extract] Starting extraction for nandaka from https://www.gangarealty.com/nandaka/
[Extract] Downloading project images...
[Download] Downloaded: /images/extracted/nandaka_project_0_a1b2c3d4.jpg
[Download] Downloaded: /images/extracted/nandaka_project_1_e5f6g7h8.jpg
[Extract] Downloading floor plan images...
[Download] Downloaded: /images/extracted/nandaka_floorplan_0_i9j0k1l2.png
[Extract] Found:
  projectImages: 8
  floorPlans: 3
  galleryImages: 12
```

## Viewing Downloaded Images

1. **In Browser**: Visit `http://localhost:5173/PropScan/images/extracted/`
2. **In File System**: Navigate to `src/public/images/extracted/`
3. **In Properties JSON**: Check the `images` array in `src/public/data/properties.json`

## Next Steps

After extraction:
1. ✅ Review all extracted data in form
2. ✅ Edit/enhance descriptions
3. ✅ Add missing information
4. ✅ Save the project
5. ✅ View live project page to verify images load
6. ✅ Build and deploy to GitHub Pages

All images will be included in your build and deployed automatically!
