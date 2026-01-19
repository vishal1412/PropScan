import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { DataService, ResaleProperty } from '../services/dataService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Building2, MapPin, Bed, ArrowRight, Home, TrendingUp, Filter } from 'lucide-react';

export default function ResalePropertiesPage() {
  const [properties, setProperties] = useState<ResaleProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState<ResaleProperty[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedBHK, setSelectedBHK] = useState<string>('all');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      // Only load approved and active properties for public view
      const allProperties = await DataService.loadResaleProperties('approved');
      const activeProperties = allProperties.filter(p => p.listingStatus === 'active');
      setProperties(activeProperties);
      setFilteredProperties(activeProperties);
    } catch (error) {
      console.error('Error loading resale properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...properties];

    if (selectedCity !== 'all') {
      filtered = filtered.filter(p => p.city.toLowerCase() === selectedCity.toLowerCase());
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.propertyType === selectedType);
    }

    if (selectedBHK !== 'all') {
      filtered = filtered.filter(p => p.bhk === selectedBHK);
    }

    setFilteredProperties(filtered);
  }, [selectedCity, selectedType, selectedBHK, properties]);

  // Get unique values for filters
  const cities = Array.from(new Set(properties.map(p => p.city)));
  const propertyTypes = Array.from(new Set(properties.map(p => p.propertyType)));
  const bhkOptions = Array.from(new Set(properties.filter(p => p.bhk).map(p => p.bhk!)));

  const formatPrice = (price: string) => {
    // Format price nicely (e.g., "1.5 Cr", "85 Lac")
    return price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Resale Property Marketplace</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Buy or Sell <span className="text-orange-400">Resale Properties</span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Connect directly with property owners and investors. Find your dream home or sell your property hassle-free.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6"
              onClick={() => document.getElementById('list-property-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Home className="w-5 h-5 mr-2" />
              List Your Property for Free
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 border-2"
              onClick={() => document.getElementById('properties-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Properties
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{properties.length}+</div>
            <div className="text-gray-600">Active Listings</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{cities.length}+</div>
            <div className="text-gray-600">Cities</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-600">Free Listing</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section id="properties-section" className="py-8 px-4 bg-gray-50 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filter Properties</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* BHK Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
              <select
                value={selectedBHK}
                onChange={(e) => setSelectedBHK(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All BHK</option>
                {bhkOptions.map(bhk => (
                  <option key={bhk} value={bhk}>{bhk}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedType('all');
                  setSelectedBHK('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredProperties.length}</span> of <span className="font-semibold">{properties.length}</span> properties
          </div>
        </div>
      </section>

      {/* Properties Listing */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <Card className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or be the first to list a property!</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => document.getElementById('list-property-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                List Your Property
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Link 
                  key={property.id} 
                  to="/resale-property/$id"
                  params={{ id: property.id }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
                    {/* Property Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      {property.images && property.images.length > 0 ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.locality}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
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

                    <CardContent className="p-4">
                      {/* Price */}
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="text-2xl font-bold text-blue-600">
                          ₹{formatPrice(property.price)}
                        </div>
                        {property.priceNegotiable && (
                          <Badge className="text-xs border border-gray-300">
                            Negotiable
                          </Badge>
                        )}
                      </div>

                      {/* Property Type & BHK */}
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-800">
                          {property.bhk || property.propertyType}
                        </span>
                        {property.area && (
                          <span className="text-gray-600 text-sm">• {property.area}</span>
                        )}
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="font-medium text-gray-800">{property.locality}</div>
                          <div className="text-gray-600">{property.city}</div>
                        </div>
                      </div>

                      {/* Property Features */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {property.bathrooms && (
                          <Badge className="text-xs border border-gray-300">
                            {property.bathrooms} Bath
                          </Badge>
                        )}
                        {property.parking && (
                          <Badge className="text-xs border border-gray-300">
                            {property.parking} Parking
                          </Badge>
                        )}
                        <Badge className="text-xs border border-gray-300">
                          {property.furnished}
                        </Badge>
                      </div>

                      {/* View Details Button */}
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* List Property CTA Section */}
      <section id="list-property-form" className="py-20 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Home className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            List Your Property for Free
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Reach thousands of potential buyers. No hidden charges, no commissions. 100% free listing!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Fill the Form</h3>
                <p className="text-orange-100 text-sm">
                  Provide basic property details, upload photos, and submit
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Quick Approval</h3>
                <p className="text-orange-100 text-sm">
                  Our team reviews and approves within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Get Leads</h3>
                <p className="text-orange-100 text-sm">
                  Connect with serious buyers directly
                </p>
              </CardContent>
            </Card>
          </div>

          <Link to="/list-property">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-10 py-6 shadow-xl"
            >
              Start Listing Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
