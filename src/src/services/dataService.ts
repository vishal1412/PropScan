// Single source of truth for all admin data operations
// Admin writes and frontend reads from JSON files via API

// Detect if we're on GitHub Pages or localhost
const isGitHubPages = window.location.hostname.includes('github.io');

// Backend server URL configuration
// For GitHub Pages: Set VITE_API_URL environment variable to your deployed backend URL
// For localhost: Uses local Express server
const API_BASE_URL = isGitHubPages 
  ? 'https://propscan1-backend.vercel.app/api'
  : 'http://localhost:3001/api';
const BASE_PATH = isGitHubPages ? '/PropScan' : '';

// Warning: GitHub Pages does not support backend servers
// Features requiring API (extraction, image uploads) need a separate backend deployment
console.log('[DataService] API Base URL:', API_BASE_URL);
console.log('[DataService] GitHub Pages Mode:', isGitHubPages);

interface Project {
  id: string;
  name: string;
  location: string;
  latitude?: number; // Latitude for Google Maps
  longitude?: number; // Longitude for Google Maps
  price: string;
  pricePerSqft?: string; // Per square foot price
  possession: string;
  builder: string;
  size: string;
  configuration?: string; // e.g., "4-5 BHK", "3-4 BHK"
  developer?: string; // Developer name (alias for builder)
  delivery?: string; // Delivery date (formatted version of possession)
  paymentPlan: string;
  description: string;
  highlights: string;
  amenities?: string[]; // Array of amenities
  rera?: string; // RERA number/certification
  images: string[];
  status: 'active' | 'inactive';
  projectStatus?: 'New Launch' | 'Under Construction' | 'Ready to Move'; // Project phase
  verifiedStatus?: 'Verified' | 'In Progress'; // Verification by PropScan Team
  landArea?: string; // e.g., "25 Acres"
  numberOfTowers?: number; // Number of towers in project
  numberOfFloors?: number; // e.g., G+45
  brochurePath?: string; // Path to project brochure file
  highlighted?: boolean; // Highlight this project with special frame
  createdAt: string;
  
  // Enhanced content fields for web extraction
  officialWebsite?: string; // Official project website URL
  overview?: string; // Detailed project overview (can be extracted)
  detailedAmenities?: DetailedAmenity[]; // Amenities with categories and descriptions
  floorPlans?: FloorPlan[]; // Floor plan images and details
  constructionUpdates?: ConstructionUpdate[]; // Construction progress updates
  locationDetails?: LocationDetails; // Detailed location info
  developerInfo?: DeveloperInfo; // Detailed developer information
  documents?: ProjectDocument[]; // Additional documents (brochures, PDFs)
  gallery?: ProjectGallery; // Organized image gallery
}

interface DetailedAmenity {
  id: string;
  name: string;
  category?: string; // e.g., "Sports", "Leisure", "Security"
  description?: string;
  icon?: string;
  image?: string;
}

interface FloorPlan {
  id: string;
  title: string; // e.g., "3 BHK - Type A"
  image: string;
  size?: string; // e.g., "1850 sq ft"
  bedrooms?: string;
  bathrooms?: string;
  description?: string;
  pdfUrl?: string;
}

interface ConstructionUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  images?: string[];
  progress?: number; // Percentage
}

interface LocationDetails {
  address?: string;
  microLocation?: string;
  description?: string;
  connectivity?: string[]; // e.g., ["5 mins to NH-48", "10 mins to IGI Airport"]
  nearbyLandmarks?: string[];
}

interface DeveloperInfo {
  name: string;
  about?: string;
  experience?: string;
  completedProjects?: number;
  ongoingProjects?: number;
  logo?: string;
  website?: string;
}

interface ProjectDocument {
  id: string;
  title: string;
  type: 'brochure' | 'floorplan' | 'other';
  url: string;
  size?: string;
}

interface ProjectGallery {
  exterior?: string[];
  interior?: string[];
  amenities?: string[];
  location?: string[];
  construction?: string[];
  floorplan?: string[];
  [category: string]: string[] | undefined;
}

interface PropertiesData {
  gurgaon: Project[];
  noida: Project[];
  dubai: Project[];
}

interface Testimonial {
  id: string;
  name: string;
  city: string;
  message: string;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  budget?: string;
  purpose?: string;
  message?: string;
  timestamp: string;
  source?: string; // Track lead source (e.g., 'resale-property-listing', 'contact-form')
}

interface ResaleProperty {
  id: string;
  // Seller Information
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerType: 'Owner' | 'Investor'; // Property held by owner or investor
  
  // Property Details
  propertyType: 'Apartment' | 'Villa' | 'Plot' | 'Commercial' | 'Office Space' | 'Retail Shop' | 'Other';
  bhk?: string; // e.g., "3 BHK", "4 BHK" (for residential)
  area: string; // e.g., "1850 sq ft"
  city: string;
  locality: string; // Specific area/sector
  address?: string; // Optional full address
  projectName?: string; // If part of a project (e.g., "DLF Phase 3")
  
  // Pricing
  price: string; // Asking price
  priceNegotiable: boolean;
  
  // Property Status
  possession: 'Ready to Move' | 'Under Construction';
  furnished: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  ageOfProperty?: string; // e.g., "1-3 years", "3-5 years", "New"
  floorNumber?: string; // e.g., "10th Floor", "Ground Floor"
  totalFloors?: string; // Total floors in building
  
  // Property Features
  facing?: string; // e.g., "North", "East", "West", "South"
  parking?: number; // Number of parking spots
  balconies?: number;
  bathrooms?: number;
  
  // Images
  images: string[]; // Property images uploaded by seller
  
  // Description
  description: string;
  keyHighlights?: string[]; // e.g., ["Prime location", "Park view", "Vastu compliant"]
  
  // Metadata
  submittedAt: string;
  updatedAt?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  listingStatus: 'active' | 'sold' | 'on-hold';
  adminNotes?: string; // Internal notes for admin
  rejectionReason?: string; // If rejected, reason why
}

export class DataService {
  // Helper method to handle API calls
  private static async apiCall<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // PROPERTIES
  static async loadProperties(): Promise<PropertiesData> {
    try {
      if (isGitHubPages) {
        return await this.apiCall<PropertiesData>(`${BASE_PATH}/data/properties.json`);
      }
      return await this.apiCall<PropertiesData>(`${API_BASE_URL}/properties`);
    } catch (error) {
      console.error('Error loading properties:', error);
      return { gurgaon: [], noida: [], dubai: [] };
    }
  }

  static async getPropertiesByCity(city: string): Promise<Project[]> {
    try {
      if (isGitHubPages) {
        const allProperties = await this.apiCall<PropertiesData>(`${BASE_PATH}/data/properties.json`);
        return allProperties[city.toLowerCase() as keyof PropertiesData] || [];
      }
      return await this.apiCall<Project[]>(`${API_BASE_URL}/properties/${city.toLowerCase()}`);
    } catch (error) {
      console.error('Error loading properties for city:', error);
      return [];
    }
  }

  static async addProperty(city: string, project: Omit<Project, 'id' | 'createdAt'>): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot add properties on GitHub Pages - read-only mode');
      return false;
    }
    try {
      await this.apiCall(`${API_BASE_URL}/properties/${city.toLowerCase()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      console.log('✅ Property added to JSON file');
      return true;
    } catch (error) {
      console.error('❌ Error adding property:', error);
      return false;
    }
  }

  static async updateProperty(city: string, projectId: string, updates: Partial<Project>): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot update properties on GitHub Pages - read-only mode');
      return false;
    }
    try {
      await this.apiCall(`${API_BASE_URL}/properties/${city.toLowerCase()}/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      console.log('✅ Property updated in JSON file');
      return true;
    } catch (error) {
      console.error('❌ Error updating property:', error);
      return false;
    }
  }

  static async deleteProperty(city: string, projectId: string): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot delete properties on GitHub Pages - read-only mode');
      return false;
    }
    try {
      await this.apiCall(`${API_BASE_URL}/properties/${city.toLowerCase()}/${projectId}`, {
        method: 'DELETE',
      });
      console.log('✅ Property deleted from JSON file');
      return true;
    } catch (error) {
      console.error('❌ Error deleting property:', error);
      return false;
    }
  }

  // TESTIMONIALS
  static async loadTestimonials(): Promise<Testimonial[]> {
    try {
      if (isGitHubPages) {
        return await this.apiCall<Testimonial[]>(`${BASE_PATH}/data/testimonials.json`);
      }
      return await this.apiCall<Testimonial[]>(`${API_BASE_URL}/testimonials`);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      return [];
    }
  }

  static async addTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot add testimonials on GitHub Pages - read-only mode');
      return false;
    }
    try {
      await this.apiCall(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonial),
      });
      console.log('✅ Testimonial added to JSON file');
      return true;
    } catch (error) {
      console.error('❌ Error adding testimonial:', error);
      return false;
    }
  }

  static async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot update testimonials on GitHub Pages - read-only mode');
      return false;
    }
    try {
      await this.apiCall(`${API_BASE_URL}/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      console.log('✅ Testimonial updated in JSON file');
      return true;
    } catch (error) {
      console.error('❌ Error updating testimonial:', error);
      return false;
    }
  }

  static async deleteTestimonial(id: string): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot delete testimonials on GitHub Pages - read-only mode');
      return false;
    }
    try {
      await this.apiCall(`${API_BASE_URL}/testimonials/${id}`, {
        method: 'DELETE',
      });
      console.log('✅ Testimonial deleted from JSON file');
      return true;
    } catch (error) {
      console.error('❌ Error deleting testimonial:', error);
      return false;
    }
  }

  // LEADS
  static async loadLeads(): Promise<Lead[]> {
    try {
      if (isGitHubPages) {
        return await this.apiCall<Lead[]>(`${BASE_PATH}/data/leads.json`);
      }
      return await this.apiCall<Lead[]>(`${API_BASE_URL}/leads`);
    } catch (error) {
      console.error('Error loading leads:', error);
      return [];
    }
  }

  static async addLead(lead: Omit<Lead, 'id' | 'timestamp'>): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot add leads on GitHub Pages - read-only mode');
      return false;
    }
    try {
      await this.apiCall(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      console.log('✅ Lead added to JSON file');
      return true;
    } catch (error) {
      console.error('❌ Error adding lead:', error);
      return false;
    }
  }

  static async deleteLead(id: string): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot delete leads on GitHub Pages - read-only mode');
      return false;
    }
    try {
      await this.apiCall(`${API_BASE_URL}/leads/${id}`, {
        method: 'DELETE',
      });
      console.log('✅ Lead deleted from JSON file');
      return true;
    } catch (error) {
      console.error('❌ Error deleting lead:', error);
      return false;
    }
  }

  // CITIES
  static async loadCities(): Promise<Array<{ id: string; name: string; slug: string }>> {
    try {
      if (isGitHubPages) {
        return await this.apiCall(`${BASE_PATH}/data/cities.json`);
      }
      return await this.apiCall(`${API_BASE_URL}/cities`);
    } catch (error) {
      console.error('Error loading cities:', error);
      return [];
    }
  }

  // HERO SECTION
  static async getHeroSection(): Promise<{ headline: string; subheadline: string }> {
    try {
      if (isGitHubPages) {
        return await this.apiCall(`${BASE_PATH}/data/heroSection.json`);
      }
      return await this.apiCall(`${API_BASE_URL}/hero-section`);
    } catch (error) {
      console.error('Error loading hero section:', error);
      return {
        headline: 'Your Trusted Property Intelligence Partner',
        subheadline: 'Compare, Discover, and Invest in Gurgaon, Noida & Dubai with Confidence',
      };
    }
  }

  static async updateHeroSection(data: { headline: string; subheadline: string }): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot update hero section on GitHub Pages - read-only mode');
      return false;
    }
    try {
      await this.apiCall(`${API_BASE_URL}/hero-section`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      console.log('✅ Hero section updated in JSON file');
      return true;
    } catch (error) {
      console.error('❌ Error updating hero section:', error);
      return false;
    }
  }

  // ABOUT US
  static async getAboutUs(): Promise<{ content: string }> {
    try {
      if (isGitHubPages) {
        return await this.apiCall(`${BASE_PATH}/data/aboutUs.json`);
      }
      return await this.apiCall(`${API_BASE_URL}/about-us`);
    } catch (error) {
      console.error('Error loading about us:', error);
      return {
        content: 'PropScan Intelligence is committed to providing transparent, data-driven real estate advisory services.',
      };
    }
  }

  static async updateAboutUs(data: { content: string }): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot update about us on GitHub Pages - read-only mode');
      return false;
    }
    try {
      await this.apiCall(`${API_BASE_URL}/about-us`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      console.log('✅ About us updated in JSON file');
      return true;
    } catch (error) {
      console.error('❌ Error updating about us:', error);
      return false;
    }
  }

  // Clear localStorage (cleanup old data)
  static clearLocalStorage(): void {
    const keysToRemove = ['properties_data', 'testimonials_data', 'leads_data'];
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('✅ localStorage cleared - now using JSON files');
  }

  // Extract project content from official website
  static async extractProjectContent(url: string, projectId: string): Promise<any> {
    const EXTRACT_URL = `${API_BASE_URL}/projects/extract`;
    
    try {
      console.log(`[Extract] Starting extraction for ${projectId} from ${url}`);
      
      const response = await fetch(EXTRACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, projectId })
      });

      if (!response.ok) {
        let errorMessage = 'Extraction failed';
        try {
          const error = await response.json();
          errorMessage = error.details || error.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('[Extract] Extraction successful:', result.data);
      return result.data;
    } catch (error: any) {
      console.error('[Extract] Error:', error);
      
      // Check if it's a network error
      if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        throw new Error(`Cannot connect to extraction service at ${API_BASE_URL}. Please verify the backend server is running.`);
      }
      
      throw new Error(error.message || 'Failed to extract content from website');
    }
  }

  // Get available images for a project from file system
  static async getProjectImages(projectName: string): Promise<ProjectGallery> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot scan images on GitHub Pages - read-only mode');
      return {};
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(projectName)}/images`);
      if (!response.ok) {
        throw new Error(`Failed to load images: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading project images:', error);
      return {};
    }
  }

  // Validate image URLs (both local and external)
  static async validateImages(imageUrls: string[]): Promise<any> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot validate images on GitHub Pages - read-only mode');
      return { results: [], summary: { total: 0, valid: 0, invalid: 0, local: 0, external: 0 } };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/validate-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: imageUrls }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to validate images: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error validating images:', error);
      return { results: [], summary: { total: 0, valid: 0, invalid: 0, local: 0, external: 0 } };
    }
  }

  // Debug info for admin panel
  static getDebugInfo() {
    return {
      dataSource: isGitHubPages ? 'Static JSON Files (GitHub Pages)' : 'JSON Files via API (http://localhost:3001)',
      storageType: isGitHubPages ? 'Read-Only' : 'File System',
      apiEndpoint: isGitHubPages ? 'Direct JSON access' : API_BASE_URL,
      note: isGitHubPages 
        ? 'Data is loaded from /data/*.json files (read-only on GitHub Pages)' 
        : 'Data is stored in /public/data/*.json files',
    };
  }

  // ========== RESALE PROPERTIES ==========
  
  // Load all resale properties (optionally filter by status)
  static async loadResaleProperties(status?: 'pending' | 'approved' | 'rejected'): Promise<ResaleProperty[]> {
    try {
      if (isGitHubPages) {
        const allProperties = await this.apiCall<ResaleProperty[]>(`${BASE_PATH}/data/resale-properties.json`);
        if (status) {
          return allProperties.filter(p => p.approvalStatus === status);
        }
        return allProperties;
      }
      
      const url = status 
        ? `${API_BASE_URL}/resale-properties?status=${status}`
        : `${API_BASE_URL}/resale-properties`;
      return await this.apiCall<ResaleProperty[]>(url);
    } catch (error) {
      console.error('Error loading resale properties:', error);
      return [];
    }
  }

  // Submit a new resale property listing (customer-facing)
  static async submitResaleProperty(property: Omit<ResaleProperty, 'id' | 'submittedAt' | 'approvalStatus' | 'listingStatus'>): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot submit property on GitHub Pages - read-only mode');
      return false;
    }
    
    try {
      await this.apiCall(`${API_BASE_URL}/resale-properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
      console.log('✅ Resale property submitted for approval');
      return true;
    } catch (error) {
      console.error('❌ Error submitting resale property:', error);
      return false;
    }
  }

  // Update resale property (admin)
  static async updateResaleProperty(id: string, updates: Partial<ResaleProperty>): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot update property on GitHub Pages - read-only mode');
      return false;
    }
    
    try {
      await this.apiCall(`${API_BASE_URL}/resale-properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      console.log('✅ Resale property updated');
      return true;
    } catch (error) {
      console.error('❌ Error updating resale property:', error);
      return false;
    }
  }

  // Delete resale property (admin)
  static async deleteResaleProperty(id: string): Promise<boolean> {
    if (isGitHubPages) {
      console.warn('⚠️ Cannot delete property on GitHub Pages - read-only mode');
      return false;
    }
    
    try {
      await this.apiCall(`${API_BASE_URL}/resale-properties/${id}`, {
        method: 'DELETE',
      });
      console.log('✅ Resale property deleted');
      return true;
    } catch (error) {
      console.error('❌ Error deleting resale property:', error);
      return false;
    }
  }
}

export type { Project, PropertiesData, Testimonial, Lead, ProjectGallery, ResaleProperty };

