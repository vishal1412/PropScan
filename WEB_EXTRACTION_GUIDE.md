# Web Content Extraction Feature - Usage Guide

## Overview
The PropScan platform now supports **automatic extraction of project content** from official project websites. This allows you to quickly populate project details by importing data from the developer's website.

## How It Works

### 1. **In Admin Panel - Add/Edit Project**

#### Step 1: Enter Official Website URL
In the project form, find the **"Official Website"** field and enter the project's official website URL:
```
Example: https://www.gangarealty.com/nandaka/
```

#### Step 2: Click Import Button
Once you've entered a valid URL, a new button will appear:
**"🔄 Import Details from Official Website"**

Click this button to start the extraction process.

#### Step 3: Review Extracted Content
- The system will fetch and analyze the website
- Extracted content will be merged into your form fields
- **Existing content is preserved** - only empty fields are filled
- Review all extracted data before saving

#### Step 4: Edit and Save
- Edit any extracted content as needed
- Add missing information manually
- Click **Save Project** to store everything in JSON

---

## What Gets Extracted?

### 🖼️ **Images & Gallery**
- Project exterior photos
- Interior photos
- Amenity images
- Site plans
- Floor plans
- Construction progress photos

### 📋 **Project Information**
- Overview/Description
- Project highlights
- Detailed amenities list (with categories)
- Location description
- Connectivity details

### 📄 **Documents**
- Brochure PDFs
- Floor plan PDFs
- Other downloadable documents

### 🏗️ **Progress Updates**
- Construction updates
- Progress percentage
- Update dates and descriptions

### 🏢 **Developer Info**
- Company name
- About the developer
- Experience details

---

## Important Rules

### ✅ **Smart Merging**
- Extracted data **never overwrites** existing content
- Only empty fields are filled with extracted data
- You have full control over all content

### 💾 **Storage**
- All data is saved in **JSON files**
- No localStorage dependency
- Works offline after extraction

### ✏️ **Full Editing**
After extraction, you can:
- ✅ Edit any text content
- ✅ Add or remove images
- ✅ Reorder sections
- ✅ Delete unwanted content
- ✅ Upload your own files
- ✅ Manually add missing fields

### 🚫 **One-Time Process**
- Extraction happens **once** when you click the button
- Not automatic - you control when it happens
- No runtime dependency on external website
- Re-click to refresh if needed

---

## Example Workflow

### Scenario: Adding "Ganga Nandaka" Project

1. **Go to Admin Panel** → Gurgaon Projects → Add New

2. **Fill Basic Info:**
   - Name: Ganga Nandaka
   - Location: Sector 84, Gurugram
   - Price: ₹4.42 Cr onwards
   - Latitude: 28.4018
   - Longitude: 76.9812

3. **Enter Official Website:**
   ```
   https://www.gangarealty.com/nandaka/
   ```

4. **Click "Import Details"**
   - System extracts: amenities, floor plans, images, description
   - Toast notification: "Extracting content from website..."
   - Success: "Content extracted successfully! Review and save."

5. **Review Extracted Data:**
   - Check amenities list
   - View floor plan images
   - Review project overview
   - Verify all details

6. **Edit as Needed:**
   - Add missing amenities
   - Replace low-quality images
   - Add construction updates
   - Enhance descriptions

7. **Save Project**
   - All data saved to `properties.json`
   - Immediately visible on website

---

## Data Structure (Technical)

### Enhanced Project Object
```json
{
  "id": "ganga-nandaka",
  "name": "Ganga Nandaka",
  "officialWebsite": "https://www.gangarealty.com/nandaka/",
  
  "overview": "Detailed project description...",
  
  "detailedAmenities": [
    {
      "id": "...",
      "name": "Swimming Pool",
      "category": "Fitness & Wellness",
      "description": "Olympic-sized pool"
    }
  ],
  
  "floorPlans": [
    {
      "id": "...",
      "title": "3 BHK - Type A",
      "image": "https://...",
      "size": "1850 sq ft",
      "description": "Spacious 3 bedroom apartment"
    }
  ],
  
  "constructionUpdates": [
    {
      "id": "...",
      "date": "2026-01-15",
      "title": "Foundation Work Completed",
      "description": "All foundation work finished...",
      "progress": 25,
      "images": ["https://..."]
    }
  ],
  
  "gallery": {
    "exterior": ["https://...", "https://..."],
    "interior": ["https://...", "https://..."],
    "amenities": ["https://...", "https://..."]
  },
  
  "documents": [
    {
      "id": "...",
      "title": "Project Brochure",
      "type": "brochure",
      "url": "https://.../brochure.pdf"
    }
  ]
}
```

---

## Display on Project Details Page

### New Sections Added:

#### **Floor Plans Section**
- Shows if `floorPlans` array has data
- Grid layout with images and details
- Click to view larger

#### **Construction Progress Section**  
- Shows if `constructionUpdates` array has data
- Timeline view with dates
- Progress percentage indicators
- Update images in gallery

#### **Enhanced Navigation**
- Dynamic nav items based on available content
- Sections auto-hide if no data

---

## Backend API

### Extraction Endpoint
```
POST http://localhost:3001/api/projects/extract
```

**Request:**
```json
{
  "url": "https://www.gangarealty.com/nandaka/",
  "projectId": "ganga-nandaka"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": "...",
    "detailedAmenities": [...],
    "floorPlans": [...],
    "gallery": {...},
    "documents": [...]
  }
}
```

---

## Troubleshooting

### "Extraction Failed"
**Possible Causes:**
- Invalid URL
- Website blocked by CORS
- Website requires JavaScript
- Slow website response

**Solutions:**
- Check URL format (must start with https://)
- Try different URL from same website
- Manual entry as fallback
- Contact support if persistent

### "No Content Found"
**Possible Causes:**
- Website structure not recognized
- Content loaded via JavaScript
- Non-standard HTML structure

**Solutions:**
- Review website structure
- Try direct page URLs (not homepage)
- Manually add content via admin panel

### Images Not Loading
**Possible Causes:**
- Hotlink protection
- Relative URLs
- Invalid image URLs

**Solutions:**
- Download and re-upload images manually
- Use direct image URLs
- Check image permissions

---

## Best Practices

### ✅ Do:
- Always review extracted content before saving
- Test with a small project first
- Keep official website URLs updated
- Add manual content for missing fields
- Re-extract if website updates significantly

### ❌ Don't:
- Rely 100% on extraction - always review
- Extract from non-official websites
- Skip manual editing
- Use extraction for critical launch data without verification

---

## Future Enhancements

Planned features:
- Image download and local storage
- PDF parsing for floor plans
- Intelligent content categorization
- Multi-page extraction
- Scheduled re-extraction
- Extraction history tracking

---

## Support

For issues or questions:
1. Check Admin Panel console logs
2. Verify API server is running (localhost:3001)
3. Test extraction with known working URLs
4. Review extracted data structure
5. Contact technical support

---

**Last Updated:** January 19, 2026  
**Version:** 1.0.0
