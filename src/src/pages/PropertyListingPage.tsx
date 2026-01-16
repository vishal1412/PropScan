import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCities, useGetPropertiesByCity } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Building2, MapPin, Calendar, DollarSign, Home, Loader2 } from 'lucide-react';
import { getAllDummyProperties } from '../lib/dummyPropertyData';

export default function PropertyListingPage() {
  const navigate = useNavigate();
  const { data: cities, isLoading: citiesLoading } = useGetCities();

  // Load all dummy properties
  const dummyProperties = useMemo(() => {
    return getAllDummyProperties();
  }, []);

  // Get backend properties for all cities using citySlug
  const gurgaonCity = cities?.find(c => c.slug === 'gurgaon');
  const noidaCity = cities?.find(c => c.slug === 'noida');
  const dubaiCity = cities?.find(c => c.slug === 'dubai');

  const { data: gurgaonProperties } = useGetPropertiesByCity(gurgaonCity?.slug ?? null);
  const { data: noidaProperties } = useGetPropertiesByCity(noidaCity?.slug ?? null);
  const { data: dubaiProperties } = useGetPropertiesByCity(dubaiCity?.slug ?? null);

  // Merge all properties
  const allProperties = useMemo(() => {
    const backendProps = [
      ...(gurgaonProperties || []),
      ...(noidaProperties || []),
      ...(dubaiProperties || []),
    ];

    if (backendProps.length > 0) {
      return backendProps;
    }

    return dummyProperties;
  }, [gurgaonProperties, noidaProperties, dubaiProperties, dummyProperties]);

  const getCityName = (citySlug: string) => {
    switch (citySlug.toLowerCase()) {
      case 'gurgaon':
        return 'Gurgaon';
      case 'noida':
        return 'Noida';
      case 'dubai':
        return 'Dubai';
      default:
        return 'Unknown';
    }
  };

  if (citiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">All Properties</h1>
            <p className="text-slate-600">Browse all available properties across cities</p>
          </div>
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {allProperties && allProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProperties.map((property) => {
              const propertyId = typeof property.id === 'bigint' ? property.id.toString() : String(property.id);
              const cityName = getCityName(property.citySlug);
              const citySlug = property.citySlug;

              return (
                <Card
                  key={propertyId}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate({ to: `/city/${citySlug}` })}
                >
                  <div className="h-48 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center relative">
                    <Building2 className="h-16 w-16 text-blue-600 opacity-80" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary">{cityName}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{property.projectName}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {property.builder}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-700">{property.priceRange}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Home className="h-4 w-4" />
                      <span>{property.sizes}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>{property.possession}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>No Properties Available</CardTitle>
              <CardDescription>
                There are currently no properties listed. Check back soon!
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
