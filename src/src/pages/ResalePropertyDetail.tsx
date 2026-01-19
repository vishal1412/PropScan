import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { DataService, ResaleProperty, Lead } from '../services/dataService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Car,
  Home,
  IndianRupee,
  Calendar,
  Compass,
  Phone,
  Mail,
  User,
  ArrowLeft,
  CheckCircle2,
  Square,
  Sofa,
} from 'lucide-react';

export default function ResalePropertyDetail() {
  const { id } = useParams({ from: '/resale-property/$id' });
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<ResaleProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: `I'm interested in this property: `,
  });
  const [submittingLead, setSubmittingLead] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const allProperties = await DataService.loadResaleProperties('approved');
      const foundProperty = allProperties.find(p => p.id === id);
      if (foundProperty && foundProperty.listingStatus === 'active') {
        setProperty(foundProperty);
        // Set message with property details
        setLeadFormData(prev => ({
          ...prev,
          message: `I'm interested in the ${foundProperty.bhk || foundProperty.propertyType} property in ${foundProperty.locality}, ${foundProperty.city}. Please share more details.`,
        }));
      } else {
        // Property not found or not active
        navigate({ to: '/resale-properties' });
      }
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    setShowContactForm(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLead(true);

    try {
      const lead: Omit<Lead, 'id' | 'timestamp'> = {
        name: leadFormData.name,
        phone: leadFormData.phone,
        email: leadFormData.email,
        city: property?.city || '',
        message: leadFormData.message,
        source: `resale-property-${id}`, // Track lead source
        purpose: 'Resale Property Inquiry',
      };

      const success = await DataService.addLead(lead);
      if (success) {
        setShowContactForm(false);
        setShowSuccess(true);
      } else {
        alert('Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // Reset form
    setLeadFormData({
      name: '',
      phone: '',
      email: '',
      message: `I'm interested in this property: `,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">This property may have been sold or removed.</p>
          <Link to="/resale-properties">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b py-4 px-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/resale-properties">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Button>
          </Link>
          
          <div className="flex gap-3">
            <Badge className="bg-blue-600 text-white">
              {property.sellerType}
            </Badge>
            {property.possession === 'Ready to Move' && (
              <Badge className="bg-green-600 text-white">
                Ready to Move
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                {property.images && property.images.length > 0 ? (
                  <div>
                    {/* Main Image */}
                    <div className="relative h-96 bg-gray-200">
                      <img
                        src={property.images[selectedImageIndex]}
                        alt={`${property.locality} - Image ${selectedImageIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23e5e7eb" width="800" height="600"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage Not Available%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex + 1} / {property.images.length}
                      </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {property.images.length > 1 && (
                      <div className="p-4 flex gap-2 overflow-x-auto">
                        {property.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              index === selectedImageIndex
                                ? 'border-blue-600 scale-105'
                                : 'border-gray-200 hover:border-blue-400'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center bg-gray-100">
                    <Building2 className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                      {property.bhk || property.propertyType}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span className="text-lg">
                        {property.locality}, {property.city}
                      </span>
                    </div>
                    {property.projectName && (
                      <p className="text-gray-600 mt-1">in {property.projectName}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Price */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-baseline gap-2">
                    <IndianRupee className="w-6 h-6 text-blue-600" />
                    <span className="text-4xl font-bold text-blue-600">
                      {property.price}
                    </span>
                    {property.priceNegotiable && (
                      <Badge className="ml-2 border border-gray-300">
                        Negotiable
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Area</div>
                      <div className="font-semibold">{property.area}</div>
                    </div>
                  </div>

                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">Bathrooms</div>
                        <div className="font-semibold">{property.bathrooms}</div>
                      </div>
                    </div>
                  )}

                  {property.parking && (
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">Parking</div>
                        <div className="font-semibold">{property.parking}</div>
                      </div>
                    </div>
                  )}

                  {property.balconies && (
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">Balconies</div>
                        <div className="font-semibold">{property.balconies}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Sofa className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Furnishing</div>
                      <div className="font-semibold">{property.furnished}</div>
                    </div>
                  </div>

                  {property.facing && (
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">Facing</div>
                        <div className="font-semibold">{property.facing}</div>
                      </div>
                    </div>
                  )}

                  {property.floorNumber && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">Floor</div>
                        <div className="font-semibold">{property.floorNumber}</div>
                      </div>
                    </div>
                  )}

                  {property.ageOfProperty && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">Age</div>
                        <div className="font-semibold">{property.ageOfProperty}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Property</h3>
                  <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
                </div>

                {/* Key Highlights */}
                {property.keyHighlights && property.keyHighlights.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {property.keyHighlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-semibold">{property.propertyType}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Possession Status</span>
                    <span className="font-semibold">{property.possession}</span>
                  </div>

                  {property.totalFloors && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Total Floors</span>
                      <span className="font-semibold">{property.totalFloors}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Listed By</span>
                    <span className="font-semibold">{property.sellerType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Contact Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle>Contact Seller</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">Seller</div>
                      <div className="font-semibold">{property.sellerName}</div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 mb-4"
                  onClick={handleContactSeller}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Get Contact Details
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By contacting, you agree to our Terms of Service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Form Dialog */}
      <AlertDialog open={showContactForm} onOpenChange={setShowContactForm}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Get Seller Contact Details</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide your details to receive the seller's contact information.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div>
              <Label htmlFor="lead-name">Your Name *</Label>
              <Input
                id="lead-name"
                value={leadFormData.name}
                onChange={(e) => setLeadFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="lead-phone">Phone Number *</Label>
              <Input
                id="lead-phone"
                value={leadFormData.phone}
                onChange={(e) => setLeadFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="10-digit mobile number"
                required
              />
            </div>

            <div>
              <Label htmlFor="lead-email">Email Address *</Label>
              <Input
                id="lead-email"
                type="email"
                value={leadFormData.email}
                onChange={(e) => setLeadFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="lead-message">Message</Label>
              <Textarea
                id="lead-message"
                value={leadFormData.message}
                onChange={(e) => setLeadFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
              />
            </div>

            <AlertDialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowContactForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={submittingLead}
              >
                {submittingLead ? 'Submitting...' : 'Get Contact Details'}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

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
              Thank You!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-2">
              <p>Your inquiry has been sent successfully.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                <p className="font-semibold text-blue-900 mb-2">Seller Contact Details:</p>
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2 text-blue-800">
                    <User className="w-4 h-4" />
                    <span>{property.sellerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <Phone className="w-4 h-4" />
                    <span>{property.sellerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <Mail className="w-4 h-4" />
                    <span>{property.sellerEmail}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm">
                The seller has also been notified of your interest and may reach out to you directly.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleSuccessClose} className="w-full bg-blue-600 hover:bg-blue-700">
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
