import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';
import { MapPin, Image as ImageIcon, Save, RotateCcw, Eye, Loader2 } from 'lucide-react';
import { DataService } from '../../services/dataService';

interface CityPageConfig {
  backgroundImage: string;
  title: string;
  subtitle: string;
  description: string;
}

interface CityData {
  id: string;
  name: string;
  slug: string;
}

type CityPagesConfig = Record<string, CityPageConfig>;

const getDefaultConfigForCity = (cityName: string): CityPageConfig => ({
  backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
  title: `Properties in ${cityName}`,
  subtitle: 'Discover premium real estate opportunities',
  description: `Explore the best residential and commercial properties in ${cityName} with expert guidance`,
});

export default function CityPagesEditor() {
  const [cities, setCities] = useState<CityData[]>([]);
  const [config, setConfig] = useState<CityPagesConfig>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCitiesAndConfig();
  }, []);

  const loadCitiesAndConfig = async () => {
    try {
      setLoading(true);
      // Load cities from JSON file
      const citiesData = await DataService.loadCities();
      setCities(citiesData);

      // Load saved config from localStorage
      const savedConfig = localStorage.getItem('city_pages_config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      } else {
        // Initialize default config for all cities
        const defaultConfig: CityPagesConfig = {};
        citiesData.forEach((city) => {
          defaultConfig[city.slug] = getDefaultConfigForCity(city.name);
        });
        setConfig(defaultConfig);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
      toast.error('Failed to load cities data');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = () => {
    try {
      localStorage.setItem('city_pages_config', JSON.stringify(config));
      toast.success('City pages configuration saved successfully!');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    }
  };

  const resetToDefault = () => {
    if (confirm('Are you sure you want to reset to default configuration? This cannot be undone.')) {
      const defaultConfig: CityPagesConfig = {};
      cities.forEach((city) => {
        defaultConfig[city.slug] = getDefaultConfigForCity(city.name);
      });
      setConfig(defaultConfig);
      localStorage.removeItem('city_pages_config');
      toast.success('Configuration reset to default');
      setHasChanges(false);
    }
  };

  const updateCityConfig = (citySlug: string, field: keyof CityPageConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [citySlug]: {
        ...prev[citySlug],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const renderCityEditor = (city: CityData) => {
    const cityConfig = config[city.slug];

    if (!cityConfig) {
      return null;
    }

    return (
      <Card className="shadow-xl border-2">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {city.name} City Page
          </CardTitle>
          <CardDescription>Configure the {city.name} property listing page</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Background Image */}
          <div className="space-y-2">
            <Label>Background Image URL</Label>
            <Input
              value={cityConfig.backgroundImage}
              onChange={(e) => updateCityConfig(city.slug, 'backgroundImage', e.target.value)}
              placeholder="https://example.com/image.jpg or data:image..."
            />
            <p className="text-xs text-slate-500">
              You can use an external URL or paste a base64 data URI
            </p>
            {cityConfig.backgroundImage && (
              <div className="mt-4 rounded-lg overflow-hidden border-2">
                <div className="relative h-64">
                  <img
                    src={cityConfig.backgroundImage}
                    alt={`${city.name} background preview`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-slate-900/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h2 className="text-3xl font-bold">{cityConfig.title}</h2>
                      <p className="text-lg mt-2">{cityConfig.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Page Title</Label>
            <Input
              value={cityConfig.title}
              onChange={(e) => updateCityConfig(city.slug, 'title', e.target.value)}
              placeholder={`Properties in ${city.name}`}
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={cityConfig.subtitle}
              onChange={(e) => updateCityConfig(city.slug, 'subtitle', e.target.value)}
              placeholder="Discover premium real estate opportunities"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description (Meta)</Label>
            <Textarea
              value={cityConfig.description}
              onChange={(e) => updateCityConfig(city.slug, 'description', e.target.value)}
              placeholder="SEO description for the page"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading cities...</p>
        </div>
      </div>
    );
  }

  if (cities.length === 0) {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <MapPin className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Cities Found</h2>
          <p className="text-slate-600">
            No cities data found in cities.json. Please ensure the file exists and contains valid city data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <MapPin className="h-8 w-8 text-blue-600" />
                City Pages Editor
              </h1>
              <p className="text-slate-600 mt-1">
                Customize background images and content for each city page ({cities.length} {cities.length === 1 ? 'city' : 'cities'})
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetToDefault}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </Button>
              <Button
                onClick={saveConfig}
                disabled={!hasChanges}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
          {hasChanges && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 text-yellow-800 text-sm">
              ⚠️ You have unsaved changes. Click "Save Changes" to apply them to the city pages.
            </div>
          )}
        </div>

        {/* Tabs for different cities */}
        <Tabs defaultValue={cities[0]?.slug} className="space-y-6">
          <div style={{ gridTemplateColumns: `repeat(${cities.length}, 1fr)` }}>
            <TabsList className="grid w-full h-auto p-1 bg-white shadow-md">
              {cities.map((city) => (
                <TabsTrigger key={city.id} value={city.slug} className="py-3">
                  {city.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {cities.map((city) => (
            <TabsContent key={city.id} value={city.slug}>
              {renderCityEditor(city)}
            </TabsContent>
          ))}
        </Tabs>

        {/* Helper Section */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <ImageIcon className="h-5 w-5" />
              How to Add Custom Images
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 space-y-2">
            <p><strong>Option 1:</strong> Use an image URL from Unsplash, Pexels, or your own hosting:</p>
            <code className="block bg-blue-100 p-2 rounded text-xs">
              https://images.unsplash.com/photo-XXXXX?auto=format&fit=crop&w=2000&q=80
            </code>
            
            <p className="mt-4"><strong>Option 2:</strong> Convert your image to base64 and paste the data URI:</p>
            <code className="block bg-blue-100 p-2 rounded text-xs">
              data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
            </code>
            
            <p className="mt-4">
              💡 <strong>Tip:</strong> For best results, use images with dimensions of at least 1920x400 pixels.
              Cities are dynamically loaded from the cities.json file in the data folder.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
