import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { DataService, ResaleProperty } from '../services/dataService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Home, Upload, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function ListPropertyForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<ResaleProperty>>({
    sellerType: 'Owner',
    propertyType: 'Apartment',
    priceNegotiable: false,
    possession: 'Ready to Move',
    furnished: 'Semi-Furnished',
    images: [],
    keyHighlights: [],
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ResaleProperty, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.sellerName?.trim()) newErrors.sellerName = 'Name is required';
    if (!formData.sellerPhone?.trim()) newErrors.sellerPhone = 'Phone is required';
    if (!formData.sellerEmail?.trim()) newErrors.sellerEmail = 'Email is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    if (!formData.locality?.trim()) newErrors.locality = 'Locality is required';
    if (!formData.area?.trim()) newErrors.area = 'Area is required';
    if (!formData.price?.trim()) newErrors.price = 'Price is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';

    // Email validation
    if (formData.sellerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.sellerEmail)) {
      newErrors.sellerEmail = 'Invalid email format';
    }

    // Phone validation (10 digits)
    if (formData.sellerPhone && !/^\d{10}$/.test(formData.sellerPhone.replace(/\s/g, ''))) {
      newErrors.sellerPhone = 'Phone must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const success = await DataService.submitResaleProperty(formData as Omit<ResaleProperty, 'id' | 'submittedAt' | 'approvalStatus' | 'listingStatus'>);
      
      if (success) {
        setShowSuccess(true);
      } else {
        alert('Failed to submit property. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate({ to: '/resale-properties' });
  };

  const handleImageUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const urls = e.target.value.split('\n').filter(url => url.trim());
    handleInputChange('images', urls);
  };

  const addHighlight = () => {
    const highlights = formData.keyHighlights || [];
    handleInputChange('keyHighlights', [...highlights, '']);
  };

  const updateHighlight = (index: number, value: string) => {
    const highlights = [...(formData.keyHighlights || [])];
    highlights[index] = value;
    handleInputChange('keyHighlights', highlights);
  };

  const removeHighlight = (index: number) => {
    const highlights = [...(formData.keyHighlights || [])];
    highlights.splice(index, 1);
    handleInputChange('keyHighlights', highlights);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/resale-properties">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">List Your Property</h1>
              <p className="text-gray-600">Fill in the details below to list your property</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Before you begin:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All fields marked with * are required</li>
                <li>Your listing will be reviewed and approved within 24 hours</li>
                <li>You'll be notified via email once approved</li>
                <li>Listing is 100% free with no hidden charges</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Seller Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sellerType">I am a *</Label>
                  <select
                    id="sellerType"
                    value={formData.sellerType}
                    onChange={(e) => handleInputChange('sellerType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Investor">Investor</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="sellerName">Full Name *</Label>
                  <Input
                    id="sellerName"
                    value={formData.sellerName || ''}
                    onChange={(e) => handleInputChange('sellerName', e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.sellerName ? 'border-red-500' : ''}
                  />
                  {errors.sellerName && <p className="text-red-500 text-sm mt-1">{errors.sellerName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sellerPhone">Phone Number *</Label>
                  <Input
                    id="sellerPhone"
                    value={formData.sellerPhone || ''}
                    onChange={(e) => handleInputChange('sellerPhone', e.target.value)}
                    placeholder="10-digit mobile number"
                    className={errors.sellerPhone ? 'border-red-500' : ''}
                  />
                  {errors.sellerPhone && <p className="text-red-500 text-sm mt-1">{errors.sellerPhone}</p>}
                </div>

                <div>
                  <Label htmlFor="sellerEmail">Email Address *</Label>
                  <Input
                    id="sellerEmail"
                    type="email"
                    value={formData.sellerEmail || ''}
                    onChange={(e) => handleInputChange('sellerEmail', e.target.value)}
                    placeholder="your@email.com"
                    className={errors.sellerEmail ? 'border-red-500' : ''}
                  />
                  {errors.sellerEmail && <p className="text-red-500 text-sm mt-1">{errors.sellerEmail}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <select
                    id="propertyType"
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Office Space">Office Space</option>
                    <option value="Retail Shop">Retail Shop</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="bhk">BHK Configuration</Label>
                  <select
                    id="bhk"
                    value={formData.bhk || ''}
                    onChange={(e) => handleInputChange('bhk', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                  >
                    <option value="">Select BHK</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                    <option value="5+ BHK">5+ BHK</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area">Carpet Area *</Label>
                  <Input
                    id="area"
                    value={formData.area || ''}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    placeholder="e.g., 1850 sq ft"
                    className={errors.area ? 'border-red-500' : ''}
                  />
                  {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                </div>

                <div>
                  <Label htmlFor="ageOfProperty">Age of Property</Label>
                  <select
                    id="ageOfProperty"
                    value={formData.ageOfProperty || ''}
                    onChange={(e) => handleInputChange('ageOfProperty', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                  >
                    <option value="">Select Age</option>
                    <option value="New">New (Under Construction)</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms || ''}
                    onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                    placeholder="Number"
                  />
                </div>

                <div>
                  <Label htmlFor="balconies">Balconies</Label>
                  <Input
                    id="balconies"
                    type="number"
                    value={formData.balconies || ''}
                    onChange={(e) => handleInputChange('balconies', parseInt(e.target.value))}
                    placeholder="Number"
                  />
                </div>

                <div>
                  <Label htmlFor="parking">Parking</Label>
                  <Input
                    id="parking"
                    type="number"
                    value={formData.parking || ''}
                    onChange={(e) => handleInputChange('parking', parseInt(e.target.value))}
                    placeholder="Number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="floorNumber">Floor Number</Label>
                  <Input
                    id="floorNumber"
                    value={formData.floorNumber || ''}
                    onChange={(e) => handleInputChange('floorNumber', e.target.value)}
                    placeholder="e.g., 10th Floor, Ground Floor"
                  />
                </div>

                <div>
                  <Label htmlFor="totalFloors">Total Floors in Building</Label>
                  <Input
                    id="totalFloors"
                    value={formData.totalFloors || ''}
                    onChange={(e) => handleInputChange('totalFloors', e.target.value)}
                    placeholder="e.g., 15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="possession">Possession Status *</Label>
                  <select
                    id="possession"
                    value={formData.possession}
                    onChange={(e) => handleInputChange('possession', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="furnished">Furnishing *</Label>
                  <select
                    id="furnished"
                    value={formData.furnished}
                    onChange={(e) => handleInputChange('furnished', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="facing">Facing Direction</Label>
                  <select
                    id="facing"
                    value={formData.facing || ''}
                    onChange={(e) => handleInputChange('facing', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                  >
                    <option value="">Select Direction</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North-East">North-East</option>
                    <option value="North-West">North-West</option>
                    <option value="South-East">South-East</option>
                    <option value="South-West">South-West</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <select
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-2 mt-1 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select City</option>
                    <option value="Gurgaon">Gurgaon</option>
                    <option value="Noida">Noida</option>
                    <option value="Greater Noida">Greater Noida</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Faridabad">Faridabad</option>
                    <option value="Ghaziabad">Ghaziabad</option>
                  </select>
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="locality">Locality / Sector *</Label>
                  <Input
                    id="locality"
                    value={formData.locality || ''}
                    onChange={(e) => handleInputChange('locality', e.target.value)}
                    placeholder="e.g., Sector 50, DLF Phase 3"
                    className={errors.locality ? 'border-red-500' : ''}
                  />
                  {errors.locality && <p className="text-red-500 text-sm mt-1">{errors.locality}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="projectName">Project / Society Name</Label>
                <Input
                  id="projectName"
                  value={formData.projectName || ''}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="e.g., DLF Magnolias, Supertech Supernova"
                />
              </div>

              <div>
                <Label htmlFor="address">Full Address (Optional)</Label>
                <Textarea
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address (will be shown to interested buyers only)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Expected Price *</Label>
                  <Input
                    id="price"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., 1.5 Cr, 85 Lac"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  <p className="text-xs text-gray-500 mt-1">Enter price in Lakhs or Crores (e.g., "1.5 Cr", "85 Lac")</p>
                </div>

                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="priceNegotiable"
                    checked={formData.priceNegotiable}
                    onChange={(e) => handleInputChange('priceNegotiable', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Label htmlFor="priceNegotiable" className="ml-2 cursor-pointer">
                    Price is negotiable
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description & Highlights */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Property Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your property in detail - location advantages, nearby amenities, unique features, etc."
                  rows={6}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Key Highlights</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                    + Add Highlight
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.keyHighlights && formData.keyHighlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                        placeholder="e.g., Prime location, Park view"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeHighlight(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                {(!formData.keyHighlights || formData.keyHighlights.length === 0) && (
                  <p className="text-xs text-gray-500 mt-1">Add key highlights to make your listing stand out</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="images">Image URLs (one per line)</Label>
                <Textarea
                  id="images"
                  value={(formData.images || []).join('\n')}
                  onChange={handleImageUrlsChange}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add image URLs (one per line). Use high-quality images for better visibility.
                </p>
                {formData.images && formData.images.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    {formData.images.length} image(s) added
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="bg-gradient-to-r from-blue-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Important:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Double-check all information before submitting</li>
                    <li>Your listing will be reviewed within 24 hours</li>
                    <li>You'll receive an email notification once approved</li>
                    <li>You can edit or remove your listing anytime from your dashboard</li>
                  </ul>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Submit Property for Review
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>

        {/* Success Dialog */}
        <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <AlertDialogTitle className="text-center text-2xl">
                Property Submitted Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center space-y-2">
                <p>Thank you for listing your property with PropScan.</p>
                <p>Your listing is now under review and will be approved within 24 hours.</p>
                <p className="font-semibold text-blue-600">
                  We'll notify you via email once your property is live.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={handleSuccessClose} className="w-full bg-blue-600 hover:bg-blue-700">
                Browse Other Properties
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
