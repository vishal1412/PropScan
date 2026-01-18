import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Building2, MapPin, Calendar, DollarSign, Home, Loader2, X, CheckCircle2, XCircle, AlertCircle, Phone, User, Mail, MessageSquare, UserCircle2, ArrowRight } from 'lucide-react';
import { DataService } from '../services/dataService';
import { toast } from 'sonner';

interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  pricePerSqft?: string;
  possession: string;
  builder: string;
  size: string;
  configuration?: string;
  developer?: string;
  delivery?: string;
  paymentPlan: string;
  description: string;
  highlights: string;
  amenities?: string[];
  rera?: string;
  images: string[];
  status: 'active' | 'inactive';
  projectStatus?: 'New Launch' | 'Under Construction' | 'Ready to Move';
  verifiedStatus?: 'Verified' | 'In Progress';
  createdAt: string;
}

interface CityPropertyPageProps {
  citySlug: string;
}

export default function CityPropertyPage({ citySlug }: CityPropertyPageProps) {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    projectInterested: '',
  });
  const [cityConfig, setCityConfig] = useState({
    backgroundImage: '',
    title: '',
    subtitle: '',
    description: '',
  });

  useEffect(() => {
    loadProperties();
    loadCityConfig();
  }, [citySlug]);

  const loadCityConfig = () => {
    const savedConfig = localStorage.getItem('city_pages_config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        const cityKey = citySlug.toLowerCase();
        if (config[cityKey]) {
          setCityConfig(config[cityKey]);
        } else {
          setDefaultCityConfig();
        }
      } catch (error) {
        console.error('Error loading city config:', error);
        setDefaultCityConfig();
      }
    } else {
      setDefaultCityConfig();
    }
  };

  const setDefaultCityConfig = () => {
    const displayName = getCityDisplayName();
    let backgroundImage = '';
    
    switch (citySlug.toLowerCase()) {
      case 'gurgaon':
        backgroundImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAC0AeADASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAQFAgMGAQcI/8QAQxABAAEDAgQDBQUGBAUEAwAAAAECAxEEBSESMUFRBhMiYXGBkaEUMkKxwQcjUnLR8DNigtJDU5Lh8RUkQ4MWRGP/xAAZAQEBAAMBAAAAAAAAAAAAAAAAAQIDBAX/xAAkEQEBAQACAgICAQUAAAAAAAAAAQIRAyExEhMEQSIyUXGRsf/aAAwDAQACEQMRAD8A+oAA';
        break;
      case 'noida':
        backgroundImage = 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=2000&q=80';
        break;
      case 'dubai':
        backgroundImage = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=80';
        break;
    }
    
    setCityConfig({
      backgroundImage,
      title: `Properties in ${displayName}`,
      subtitle: 'Discover premium real estate opportunities',
      description: `Explore the best residential and commercial properties in ${displayName}`,
    });
  };

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const cityProperties = await DataService.getPropertiesByCity(citySlug);
      // Filter only active properties
      const activeProperties = cityProperties.filter(p => p.status === 'active');
      setProperties(activeProperties);
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSelectedProperties([]);
    setShowComparison(false);
  }, [citySlug]);

  const getCityImage = () => {
    switch (citySlug.toLowerCase()) {
      case 'gurgaon':
        return '/assets/generated/gurgaon-city.dim_800x600.jpg';
      case 'noida':
        return '/assets/generated/noida-city.dim_800x600.jpg';
      case 'dubai':
        return '/assets/generated/dubai-city.dim_800x600.jpg';
      default:
        return '/assets/generated/gurgaon-city.dim_800x600.jpg';
    }
  };

  const getCityDisplayName = () => {
    return citySlug.charAt(0).toUpperCase() + citySlug.slice(1);
  };

  const handleToggleCompare = (property: Property) => {
    setSelectedProperties((prev) => {
      const exists = prev.find((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      } else {
        if (prev.length >= 4) {
          return prev;
        }
        return [...prev, property];
      }
    });
  };

  const handleClearComparison = () => {
    setSelectedProperties([]);
    setShowComparison(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation - only required fields
    if (!contactForm.name.trim()) {
      toast.error('Full Name is required');
      return;
    }

    if (!contactForm.email.trim()) {
      toast.error('Email Address is required');
      return;
    }

    if (!contactForm.phone.trim()) {
      toast.error('Phone Number is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build message with optional fields
      const projectInfo = contactForm.projectInterested ? `Project Interested: ${contactForm.projectInterested}` : '';
      const userMessage = contactForm.message.trim() || '';
      const fullMessage = [userMessage, projectInfo].filter(Boolean).join('\n\n');

      const success = await DataService.addLead({
        name: contactForm.name.trim(),
        phone: contactForm.phone.trim(),
        email: contactForm.email.trim(),
        city: getCityDisplayName(),
        budget: '',
        purpose: 'Contact Our Expert',
        message: fullMessage || `Enquiry about properties in ${getCityDisplayName()}`,
      });

      if (success) {
        // Show success message
        toast.success('Thank you! Our expert will contact you shortly.', {
          duration: 5000,
          position: 'top-center',
        });
        
        // Close modal and reset form
        setShowContactModal(false);
        setContactForm({ 
          name: '', 
          email: '', 
          phone: '', 
          message: '',
          projectInterested: '' 
        });
      } else {
        toast.error('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={cityConfig.backgroundImage || getCityImage()}
          alt={`${getCityDisplayName()} cityscape`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to default image if configured image fails
            (e.target as HTMLImageElement).src = getCityImage();
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-slate-900/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">{cityConfig.title || `Properties in ${getCityDisplayName()}`}</h1>
            <p className="text-xl text-slate-200">{cityConfig.subtitle || 'Discover premium real estate opportunities'}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          {selectedProperties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-base px-4 py-2">
                {selectedProperties.length} of 4 selected
              </Badge>
              <Button
                onClick={() => setShowComparison(!showComparison)}
                disabled={selectedProperties.length < 2}
              >
                {showComparison ? 'Hide' : 'Show'} Comparison
              </Button>
              <Button variant="outline" onClick={handleClearComparison}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          )}
        </div>

        {showComparison && selectedProperties.length >= 2 && (
          <Card className="mb-8 border-2 border-primary shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Property Comparison</CardTitle>
                  <CardDescription>Compare selected properties side by side</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowComparison(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px] font-bold">Feature</TableHead>
                        {selectedProperties.map((property) => (
                          <TableHead key={property.id} className="min-w-[250px]">
                            <div className="font-bold text-base">{property.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{property.builder}</div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold bg-slate-50">Price Range</TableCell>
                        {selectedProperties.map((property) => (
                          <TableCell key={property.id} className="font-medium text-green-700">
                            {property.price}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold bg-slate-50">Price Per Sq Ft</TableCell>
                        {selectedProperties.map((property) => (
                          <TableCell key={property.id} className="font-medium text-blue-600">
                            {property.pricePerSqft || 'N/A'}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold bg-slate-50">Size Range</TableCell>
                        {selectedProperties.map((property) => (
                          <TableCell key={property.id}>
                            <div className="text-sm whitespace-pre-wrap">{property.size}</div>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold bg-slate-50">Project Status</TableCell>
                        {selectedProperties.map((property) => (
                          <TableCell key={property.id}>
                            <Badge 
                              variant={property.projectStatus === 'Ready to Move' ? 'default' : 'secondary'}
                              className={
                                property.projectStatus === 'Ready to Move' ? 'bg-green-600' : 
                                property.projectStatus === 'New Launch' ? 'bg-blue-600' : 
                                'bg-orange-600'
                              }
                            >
                              {property.projectStatus || 'N/A'}
                            </Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold bg-slate-50">Verification Status</TableCell>
                        {selectedProperties.map((property) => (
                          <TableCell key={property.id}>
                            <Badge 
                              variant="default"
                              className={property.verifiedStatus === 'Verified' ? 'bg-blue-600' : 'bg-yellow-600'}
                            >
                              {property.verifiedStatus === 'Verified' ? '✓ Verified' : '⏳ In Progress'}
                            </Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold bg-slate-50">Location</TableCell>
                        {selectedProperties.map((property) => (
                          <TableCell key={property.id}>
                            <div className="flex items-start gap-1">
                              <MapPin className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                              <span className="text-sm">{property.location}</span>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold bg-slate-50">Possession Date</TableCell>
                        {selectedProperties.map((property) => (
                          <TableCell key={property.id}>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-orange-600" />
                              <span className="text-sm">{property.possession}</span>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold bg-slate-50">Payment Plan</TableCell>
                        {selectedProperties.map((property) => (
                          <TableCell key={property.id}>
                            <div className="text-sm whitespace-pre-wrap">{property.paymentPlan}</div>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold bg-slate-50">Key Highlights</TableCell>
                        {selectedProperties.map((property) => (
                          <TableCell key={property.id}>
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">{property.highlights}</div>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const isSelected = selectedProperties.some((p) => p.id === property.id);
              const canSelect = selectedProperties.length < 4 || isSelected;

              return (
                <Card
                  key={property.id.toString()}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-300 relative ${
                    isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                  } ${
                    property.highlighted ? 'ring-4 ring-amber-400 shadow-2xl border-2 border-amber-300' : ''
                  }`}
                >
                  {/* RERA Badge */}
                  {property.rera && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-green-600 text-white">RERA</Badge>
                    </div>
                  )}

                  {/* Verification Badge */}
                  {property.verifiedStatus && (
                    <div className={`absolute ${property.rera ? 'top-14' : 'top-4'} left-4 z-10`}>
                      <Badge className={property.verifiedStatus === 'Verified' ? 'bg-blue-600 text-white' : 'bg-yellow-600 text-white'}>
                        {property.verifiedStatus === 'Verified' ? '✓ Verified by PropScan' : '⏳ In Progress'}
                      </Badge>
                    </div>
                  )}

                  {/* Close/Select Button */}
                  <button
                    onClick={() => handleToggleCompare(property)}
                    disabled={!canSelect}
                    className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>

                  {/* Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center relative overflow-hidden group">
                    {property.images && property.images.length > 0 ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            const icon = document.createElement('div');
                            icon.innerHTML = '<svg class="h-16 w-16 text-blue-600 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>';
                            parent.appendChild(icon.firstChild!);
                          }
                        }}
                      />
                    ) : (
                      <Building2 className="h-16 w-16 text-blue-600 opacity-80" />
                    )}
                  </div>

                  <CardContent className="p-6">
                    {/* Project Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{property.name}</h3>
                    
                    {/* Location */}
                    <p className="text-sm text-gray-600 mb-4">{property.location}</p>

                    {/* Price Range */}
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">Price Range</span>
                      <p className="text-base font-semibold text-gray-900">{property.price}</p>
                    </div>

                    {/* Price Per Sqft */}
                    {property.pricePerSqft && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Price Per Sq Ft</span>
                        <p className="text-base font-semibold text-blue-600">{property.pricePerSqft}</p>
                      </div>
                    )}

                    {/* Size */}
                    {property.size && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Size</span>
                        <p className="text-base font-semibold text-gray-900">{property.size}</p>
                      </div>
                    )}

                    {/* Configuration */}
                    {property.configuration && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Configuration</span>
                        <p className="text-base font-semibold text-gray-900">{property.configuration}</p>
                      </div>
                    )}

                    {/* Developer */}
                    {(property.developer || property.builder) && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Developer</span>
                        <p className="text-base font-semibold text-gray-900">{property.developer || property.builder}</p>
                      </div>
                    )}

                    {/* Delivery */}
                    {(property.delivery || property.possession) && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Delivery</span>
                        <p className="text-base font-semibold text-gray-900">{property.delivery || property.possession}</p>
                      </div>
                    )}

                    {/* Project Status */}
                    {property.projectStatus && (
                      <div className="mb-4">
                        <span className="text-xs text-gray-500">Status</span>
                        <p className={`text-base font-semibold ${
                          property.projectStatus === 'Ready to Move' ? 'text-green-600' : 
                          property.projectStatus === 'New Launch' ? 'text-blue-600' : 
                          'text-orange-600'
                        }`}>
                          {property.projectStatus}
                        </p>
                      </div>
                    )}

                    {/* Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="mb-4">
                        <span className="text-xs text-gray-500 block mb-2">Amenities</span>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.slice(0, 5).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {property.amenities.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{property.amenities.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Compare Checkbox */}
                    <div className="mb-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Checkbox
                        id={`compare-${property.id}`}
                        checked={selectedProperties.some(p => p.id === property.id)}
                        onCheckedChange={() => handleToggleCompare(property)}
                        disabled={selectedProperties.length >= 4 && !selectedProperties.some(p => p.id === property.id)}
                      />
                      <label 
                        htmlFor={`compare-${property.id}`}
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Add to Compare {selectedProperties.length >= 4 && !selectedProperties.some(p => p.id === property.id) && '(Max 4)'}
                      </label>
                    </div>

                    {/* View Full Details Button */}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const projectSlug = property.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        navigate({ to: `/city/${citySlug}/project/${projectSlug}` });
                      }}
                    >
                      More Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto border-2 border-slate-200 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-slate-100 p-4">
                  <AlertCircle className="h-12 w-12 text-slate-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-slate-900">No Projects Currently Available</CardTitle>
              <CardDescription className="text-base text-slate-600 mt-2">
                There are currently no properties listed for {getCityDisplayName()}. Please check back soon or contact our team for upcoming projects.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      {/* Footer with CTA */}
      <footer className="bg-gradient-to-br from-slate-100 to-blue-50 border-t border-slate-200">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Left side - Footer info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                PropScan Intelligence
              </h3>
              <p className="text-sm text-gray-600 max-w-md">
                Your trusted partner for property intelligence in {getCityDisplayName()}. Making informed real estate decisions easier.
              </p>
            </div>

            {/* Right side - CTA Card */}
            <div 
              style={{
                width: '360px',
                borderRadius: '16px',
                background: 'linear-gradient(to bottom, #F4F8FF, #EAF1FF)',
                boxShadow: '0 12px 30px rgba(0, 40, 120, 0.12)',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '24px 24px 20px 24px' }}>
                {/* Icon */}
                <div className="flex justify-center mb-3">
                  <div 
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#3B6EF5'
                    }}
                  >
                    <UserCircle2 className="text-white" style={{ width: '24px', height: '24px' }} />
                  </div>
                </div>

                {/* Heading */}
                <h3 
                  className="text-center mb-2"
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: '#0F172A'
                  }}
                >
                  Shortlisting Properties?<br />Get Expert Help
                </h3>
                
                {/* Subtext */}
                <p 
                  className="text-center mx-auto mb-4"
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.5,
                    color: '#475569',
                    maxWidth: '300px'
                  }}
                >
                  Get unbiased guidance to compare, shortlist, and select the right property — without sales pressure.
                </p>
                
                {/* CTA Button */}
                <Button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full flex items-center justify-center gap-2 mb-4 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    height: '44px',
                    padding: '0 20px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    backgroundColor: '#2563EB',
                    color: 'white',
                    boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)',
                    border: 'none'
                  }}
                >
                  Talk to a Property Advisor
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </Button>

                {/* Trust Indicators - Inline Single Row */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 style={{ width: '14px', height: '14px', color: '#16A34A' }} />
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#334155' }}>
                      Free Consultation
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 style={{ width: '14px', height: '14px', color: '#16A34A' }} />
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#334155' }}>
                      Expert Guidance
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 style={{ width: '14px', height: '14px', color: '#16A34A' }} />
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#334155' }}>
                      No Obligation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Expert Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-[560px] p-0">
          <button
            onClick={() => setShowContactModal(false)}
            className="absolute right-4 top-4 rounded-full p-1.5 opacity-60 ring-offset-background transition-all hover:opacity-100 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none z-50"
          >
            <X className="h-4 w-4 text-gray-700" />
            <span className="sr-only">Close</span>
          </button>

          {/* Header with Avatar */}
          <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Contact Our Expert</h2>
              <p className="text-sm text-gray-600 mt-0.5">About Properties in {getCityDisplayName()}</p>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="px-6 pt-5 pb-6">
            <div className="space-y-3.5">
            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3.5 gap-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="contact-name" className="text-sm font-semibold text-gray-900">
                  Full Name <span className="text-red-500 text-xs">*</span>
                </Label>
                <Input
                  id="contact-name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-email" className="text-sm font-semibold text-gray-900">
                  Email Address <span className="text-red-500 text-xs">*</span>
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="your@email.com"
                  className="h-10"
                  required
                />
              </div>
            </div>

            {/* Row 2: Phone and Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3.5 gap-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="contact-phone" className="text-sm font-semibold text-gray-900">
                  Phone Number <span className="text-red-500 text-xs">*</span>
                </Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="+91 9123456789"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-project" className="text-sm font-semibold text-gray-900">
                  Project Interested In
                </Label>
                <Select 
                  value={contactForm.projectInterested} 
                  onValueChange={(value) => setContactForm({ ...contactForm, projectInterested: value })}
                >
                  <SelectTrigger className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select a project (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select a project (optional)</SelectItem>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.name}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-1.5">
              <Label htmlFor="contact-message" className="text-sm font-semibold text-gray-900">
                Message
              </Label>
              <Textarea
                id="contact-message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Any additional details you'd like to share (optional)"
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Enquiry'
                )}
              </Button>
            </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
