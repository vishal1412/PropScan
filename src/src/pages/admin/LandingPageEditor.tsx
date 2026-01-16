import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';
import { 
  Edit, Image, Eye, EyeOff, Trash2, Save, RotateCcw, 
  Layout, Type, ImageIcon, Award, TrendingUp, MessageSquare 
} from 'lucide-react';

interface LandingPageConfig {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
    visible: boolean;
  };
  aboutUs: {
    visible: boolean;
    cards: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  howItWorks: {
    visible: boolean;
    steps: Array<{
      number: string;
      title: string;
      description: string;
      image: string;
    }>;
  };
  statistics: {
    visible: boolean;
    stats: Array<{
      value: string;
      label: string;
    }>;
  };
  testimonials: {
    visible: boolean;
    title: string;
    subtitle: string;
  };
  leadForm: {
    visible: boolean;
    title: string;
    subtitle: string;
    successMessage: string;
  };
}

const defaultConfig: LandingPageConfig = {
  hero: {
    title: 'Make Informed Property Decisions',
    subtitle: 'with Data-Driven Intelligence',
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
    ctaText: 'Explore Properties',
    visible: true,
  },
  aboutUs: {
    visible: true,
    cards: [
      { title: 'Trusted by Thousands', description: 'Join 10,000+ satisfied property buyers', icon: 'Award' },
      { title: 'Expert Guidance', description: '15+ years of market expertise', icon: 'Users' },
      { title: 'Verified Projects', description: 'Only RERA approved properties', icon: 'Shield' },
      { title: 'Best Prices', description: 'Guaranteed lowest market rates', icon: 'TrendingUp' },
    ],
  },
  howItWorks: {
    visible: true,
    steps: [
      {
        number: '1',
        title: 'Comprehensive Property Search',
        description: 'Browse through our curated selection of verified properties',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      },
      {
        number: '2',
        title: 'Side-by-Side Project Comparison',
        description: 'Compare multiple properties to find your perfect match',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      },
      {
        number: '3',
        title: 'Detailed Project Intelligence',
        description: 'Access comprehensive data and insights for informed decisions',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      },
      {
        number: '4',
        title: 'Expert Advisory Services',
        description: 'Get personalized guidance from our property experts',
        image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  statistics: {
    visible: true,
    stats: [
      { value: '10,000+', label: 'Happy Customers' },
      { value: '500+', label: 'Properties Listed' },
      { value: '15+', label: 'Years Experience' },
      { value: '98%', label: 'Satisfaction Rate' },
    ],
  },
  testimonials: {
    visible: true,
    title: 'What Our Clients Say',
    subtitle: 'Trusted by thousands of property buyers',
  },
  leadForm: {
    visible: true,
    title: 'Get Expert Property Advice',
    subtitle: 'Fill out the form below and our experts will contact you',
    successMessage: 'Information is saved, someone from advisor team will contact you shortly',
  },
};

export default function LandingPageEditor() {
  const [config, setConfig] = useState<LandingPageConfig>(defaultConfig);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    const savedConfig = localStorage.getItem('landing_page_config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error loading config:', error);
        toast.error('Failed to load saved configuration');
      }
    }
  };

  const saveConfig = () => {
    try {
      localStorage.setItem('landing_page_config', JSON.stringify(config));
      toast.success('Landing page configuration saved successfully!');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    }
  };

  const resetToDefault = () => {
    if (confirm('Are you sure you want to reset to default configuration? This cannot be undone.')) {
      setConfig(defaultConfig);
      localStorage.removeItem('landing_page_config');
      toast.success('Configuration reset to default');
      setHasChanges(false);
    }
  };

  const updateConfig = (path: string[], value: any) => {
    setConfig((prev) => {
      const newConfig = JSON.parse(JSON.stringify(prev));
      let current: any = newConfig;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newConfig;
    });
    setHasChanges(true);
  };

  const toggleSectionVisibility = (section: keyof LandingPageConfig) => {
    updateConfig([section, 'visible'], !config[section].visible);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Layout className="h-8 w-8 text-blue-600" />
                Landing Page Editor
              </h1>
              <p className="text-slate-600 mt-1">
                Customize your landing page content, images, and sections
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
              ⚠️ You have unsaved changes. Click "Save Changes" to apply them to the landing page.
            </div>
          )}
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full h-auto p-1 bg-white shadow-md">
            <TabsTrigger value="hero" className="py-3">Hero Section</TabsTrigger>
            <TabsTrigger value="about" className="py-3">About Us</TabsTrigger>
            <TabsTrigger value="howitworks" className="py-3">How It Works</TabsTrigger>
            <TabsTrigger value="statistics" className="py-3">Statistics</TabsTrigger>
            <TabsTrigger value="testimonials" className="py-3">Testimonials</TabsTrigger>
            <TabsTrigger value="leadform" className="py-3">Lead Form</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card className="shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Hero Section
                    </CardTitle>
                    <CardDescription>Main banner at the top of the page</CardDescription>
                  </div>
                  <Button
                    variant={config.hero.visible ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleSectionVisibility('hero')}
                    className="flex items-center gap-2"
                  >
                    {config.hero.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {config.hero.visible ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={config.hero.title}
                    onChange={(e) => updateConfig(['hero', 'title'], e.target.value)}
                    placeholder="Main heading"
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={config.hero.subtitle}
                    onChange={(e) => updateConfig(['hero', 'subtitle'], e.target.value)}
                    placeholder="Secondary heading"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Background Image URL</Label>
                  <Input
                    value={config.hero.backgroundImage}
                    onChange={(e) => updateConfig(['hero', 'backgroundImage'], e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {config.hero.backgroundImage && (
                    <div className="mt-2 rounded-lg overflow-hidden border-2">
                      <img
                        src={config.hero.backgroundImage}
                        alt="Hero background preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Call-to-Action Button Text</Label>
                  <Input
                    value={config.hero.ctaText}
                    onChange={(e) => updateConfig(['hero', 'ctaText'], e.target.value)}
                    placeholder="Button text"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Us Section */}
          <TabsContent value="about">
            <Card className="shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      About Us Section
                    </CardTitle>
                    <CardDescription>Trust indicators and key features</CardDescription>
                  </div>
                  <Button
                    variant={config.aboutUs.visible ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleSectionVisibility('aboutUs')}
                    className="flex items-center gap-2"
                  >
                    {config.aboutUs.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {config.aboutUs.visible ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {config.aboutUs.cards.map((card, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader className="bg-slate-50">
                      <CardTitle className="text-lg">Card {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={card.title}
                          onChange={(e) => {
                            const newCards = [...config.aboutUs.cards];
                            newCards[index].title = e.target.value;
                            updateConfig(['aboutUs', 'cards'], newCards);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={card.description}
                          onChange={(e) => {
                            const newCards = [...config.aboutUs.cards];
                            newCards[index].description = e.target.value;
                            updateConfig(['aboutUs', 'cards'], newCards);
                          }}
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* How It Works Section */}
          <TabsContent value="howitworks">
            <Card className="shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="h-5 w-5" />
                      How It Works Section
                    </CardTitle>
                    <CardDescription>Step-by-step process explanation</CardDescription>
                  </div>
                  <Button
                    variant={config.howItWorks.visible ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleSectionVisibility('howItWorks')}
                    className="flex items-center gap-2"
                  >
                    {config.howItWorks.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {config.howItWorks.visible ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {config.howItWorks.steps.map((step, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader className="bg-slate-50">
                      <CardTitle className="text-lg">Step {step.number}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={step.title}
                          onChange={(e) => {
                            const newSteps = [...config.howItWorks.steps];
                            newSteps[index].title = e.target.value;
                            updateConfig(['howItWorks', 'steps'], newSteps);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={step.description}
                          onChange={(e) => {
                            const newSteps = [...config.howItWorks.steps];
                            newSteps[index].description = e.target.value;
                            updateConfig(['howItWorks', 'steps'], newSteps);
                          }}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          value={step.image}
                          onChange={(e) => {
                            const newSteps = [...config.howItWorks.steps];
                            newSteps[index].image = e.target.value;
                            updateConfig(['howItWorks', 'steps'], newSteps);
                          }}
                          placeholder="https://example.com/step-image.jpg"
                        />
                        {step.image && (
                          <div className="mt-2 rounded-lg overflow-hidden border-2">
                            <img
                              src={step.image}
                              alt={`Step ${step.number} preview`}
                              className="w-full h-32 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Section */}
          <TabsContent value="statistics">
            <Card className="shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Statistics Section
                    </CardTitle>
                    <CardDescription>Key numbers and achievements</CardDescription>
                  </div>
                  <Button
                    variant={config.statistics.visible ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleSectionVisibility('statistics')}
                    className="flex items-center gap-2"
                  >
                    {config.statistics.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {config.statistics.visible ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {config.statistics.stats.map((stat, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="p-4 space-y-3">
                        <div className="space-y-2">
                          <Label>Value</Label>
                          <Input
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...config.statistics.stats];
                              newStats[index].value = e.target.value;
                              updateConfig(['statistics', 'stats'], newStats);
                            }}
                            placeholder="10,000+"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...config.statistics.stats];
                              newStats[index].label = e.target.value;
                              updateConfig(['statistics', 'stats'], newStats);
                            }}
                            placeholder="Happy Customers"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Section */}
          <TabsContent value="testimonials">
            <Card className="shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Testimonials Section
                    </CardTitle>
                    <CardDescription>Customer reviews section settings</CardDescription>
                  </div>
                  <Button
                    variant={config.testimonials.visible ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleSectionVisibility('testimonials')}
                    className="flex items-center gap-2"
                  >
                    {config.testimonials.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {config.testimonials.visible ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={config.testimonials.title}
                    onChange={(e) => updateConfig(['testimonials', 'title'], e.target.value)}
                    placeholder="What Our Clients Say"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Subtitle</Label>
                  <Input
                    value={config.testimonials.subtitle}
                    onChange={(e) => updateConfig(['testimonials', 'subtitle'], e.target.value)}
                    placeholder="Trusted by thousands of property buyers"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Note:</strong> Testimonial content is managed in the "Testimonials" section of the admin panel.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lead Form Section */}
          <TabsContent value="leadform">
            <Card className="shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Lead Capture Form
                    </CardTitle>
                    <CardDescription>Contact form section settings</CardDescription>
                  </div>
                  <Button
                    variant={config.leadForm.visible ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleSectionVisibility('leadForm')}
                    className="flex items-center gap-2"
                  >
                    {config.leadForm.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {config.leadForm.visible ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Form Title</Label>
                  <Input
                    value={config.leadForm.title}
                    onChange={(e) => updateConfig(['leadForm', 'title'], e.target.value)}
                    placeholder="Get Expert Property Advice"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Form Subtitle</Label>
                  <Input
                    value={config.leadForm.subtitle}
                    onChange={(e) => updateConfig(['leadForm', 'subtitle'], e.target.value)}
                    placeholder="Fill out the form below..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Success Message</Label>
                  <Textarea
                    value={config.leadForm.successMessage}
                    onChange={(e) => updateConfig(['leadForm', 'successMessage'], e.target.value)}
                    placeholder="Message shown after form submission"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
