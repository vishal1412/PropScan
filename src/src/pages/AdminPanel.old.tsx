import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminAuth } from '../hooks/useAdminAuth';
import {
  useGetLeads,
  useGetTestimonials,
  useAddTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useGetCities,
  useGetPropertiesByCity,
  useAddProperty,
  useUpdateProperty,
  useDeleteProperty,
} from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { toast } from 'sonner';
import { Loader2, Trash2, Edit, Download, LogOut, Plus, Building2, MapPin, Calendar, DollarSign, CheckCircle, AlertCircle, Shield, Image as ImageIcon } from 'lucide-react';
import type { Property, City } from '../backend.d';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAdminAuth();
  const [showLoginForm, setShowLoginForm] = useState(!isAuthenticated);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const { login } = useAdminAuth();

  const { data: leads, isLoading: leadsLoading } = useGetLeads();
  const { data: testimonials } = useGetTestimonials();
  const { data: cities, isLoading: citiesLoading } = useGetCities();

  const addTestimonialMutation = useAddTestimonial();
  const updateTestimonialMutation = useUpdateTestimonial();
  const deleteTestimonialMutation = useDeleteTestimonial();
  const addPropertyMutation = useAddProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  const [newTestimonial, setNewTestimonial] = useState({ name: '', city: '', feedback: '' });
  const [editingTestimonial, setEditingTestimonial] = useState<{ id: bigint; name: string; city: string; feedback: string } | null>(null);
  const [isEditTestimonialDialogOpen, setIsEditTestimonialDialogOpen] = useState(false);

  // City tabs for property management
  const [selectedCityTab, setSelectedCityTab] = useState<string>('gurgaon');
  
  // Get the city object for the selected tab
  const selectedCity = (cities as City[] | undefined)?.find(c => c.slug === selectedCityTab);
  const { data: properties, isLoading: propertiesLoading, refetch: refetchProperties } = useGetPropertiesByCity(selectedCity?.slug ?? null);
  
  const [newProperty, setNewProperty] = useState({
    projectName: '',
    builder: '',
    priceRange: '',
    sizes: '',
    location: '',
    possession: '',
    paymentPlan: '',
    highlights: '',
    prosAndCons: '',
    imageUrl: '',
  });
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isEditPropertyDialogOpen, setIsEditPropertyDialogOpen] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState<{ id: bigint; citySlug: string } | null>(null);
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<bigint | null>(null);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginUsername, loginPassword);
    if (success) {
      toast.success('Login successful!');
      setShowLoginForm(false);
      setLoginUsername('');
      setLoginPassword('');
    } else {
      toast.error('Invalid username or password');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginForm(true);
    }
  }, [isAuthenticated]);

  // Refetch properties when city changes
  useEffect(() => {
    if (selectedCity?.slug) {
      refetchProperties();
    }
  }, [selectedCity?.slug, refetchProperties]);

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name.trim() || !newTestimonial.city.trim() || !newTestimonial.feedback.trim()) {
      toast.error('Please fill all testimonial fields');
      return;
    }
    try {
      await addTestimonialMutation.mutateAsync(newTestimonial);
      setNewTestimonial({ name: '', city: '', feedback: '' });
      toast.success('Testimonial added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add testimonial');
    }
  };

  const handleUpdateTestimonial = async () => {
    if (!editingTestimonial) return;
    if (!editingTestimonial.name.trim() || !editingTestimonial.city.trim() || !editingTestimonial.feedback.trim()) {
      toast.error('Please fill all testimonial fields');
      return;
    }
    try {
      await updateTestimonialMutation.mutateAsync(editingTestimonial);
      setEditingTestimonial(null);
      setIsEditTestimonialDialogOpen(false);
      toast.success('Testimonial updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update testimonial');
    }
  };

  const handleDeleteTestimonial = async () => {
    if (!deletingTestimonialId) return;
    try {
      await deleteTestimonialMutation.mutateAsync(deletingTestimonialId);
      setDeletingTestimonialId(null);
      toast.success('Testimonial deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete testimonial');
    }
  };

  const handleAddProperty = async () => {
    // Validate that a city is selected
    if (!selectedCity || !selectedCity.slug) {
      toast.error('Please select a city first');
      return;
    }

    // Validate required fields
    if (!newProperty.projectName.trim() || !newProperty.builder.trim() || !newProperty.priceRange.trim()) {
      toast.error('Please fill required property fields (Project Name, Builder, Price Range)');
      return;
    }

    try {
      await addPropertyMutation.mutateAsync({
        citySlug: selectedCity.slug,
        ...newProperty,
      });
      setNewProperty({
        projectName: '',
        builder: '',
        priceRange: '',
        sizes: '',
        location: '',
        possession: '',
        paymentPlan: '',
        highlights: '',
        prosAndCons: '',
        imageUrl: '',
      });
      toast.success(`Property added successfully to ${selectedCity.name}`);
      await refetchProperties();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add property');
    }
  };

  const handleUpdateProperty = async () => {
    if (!editingProperty || !selectedCity) return;
    if (!editingProperty.projectName.trim() || !editingProperty.builder.trim() || !editingProperty.priceRange.trim()) {
      toast.error('Please fill required property fields (Project Name, Builder, Price Range)');
      return;
    }
    try {
      await updatePropertyMutation.mutateAsync({
        id: editingProperty.id,
        citySlug: selectedCity.slug,
        projectName: editingProperty.projectName,
        builder: editingProperty.builder,
        priceRange: editingProperty.priceRange,
        sizes: editingProperty.sizes,
        location: editingProperty.location,
        possession: editingProperty.possession,
        paymentPlan: editingProperty.paymentPlan,
        highlights: editingProperty.highlights,
        prosAndCons: editingProperty.prosAndCons,
        imageUrl: editingProperty.imageUrl || '',
      });
      setEditingProperty(null);
      setIsEditPropertyDialogOpen(false);
      toast.success('Property updated successfully');
      await refetchProperties();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update property');
    }
  };

  const handleDeleteProperty = async () => {
    if (!deletingProperty) return;
    try {
      await deletePropertyMutation.mutateAsync(deletingProperty);
      setDeletingProperty(null);
      toast.success('Property deleted successfully');
      await refetchProperties();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete property');
    }
  };

  const handleDownloadLeads = () => {
    if (!leads || leads.length === 0) {
      toast.error('No leads to download');
      return;
    }

    const headers = ['ID', 'Full Name', 'Mobile Number', 'Email', 'City Interested', 'Budget Range', 'Purpose', 'Message', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        lead.id.toString(),
        `"${lead.fullName}"`,
        `"${lead.mobileNumber}"`,
        `"${lead.email}"`,
        `"${lead.cityInterested}"`,
        `"${lead.budgetRange}"`,
        `"${lead.purpose}"`,
        `"${lead.message}"`,
        new Date(Number(lead.createdAt) / 1000000).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Leads downloaded successfully');
  };

  const handleLogout = async () => {
    logout();
    setShowLoginForm(true);
    toast.success('Logged out successfully');
    navigate({ to: '/' });
  };

  // Show login form if not authenticated
  if (showLoginForm || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-4 rounded-full">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>
            <CardDescription className="text-base">Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginUsername}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Shield className="mr-2 h-5 w-5" />
                Login
              </Button>
              <div className="text-center pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate({ to: '/' })}
                >
                  Back to Home
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (citiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Define the three cities we support
  const supportedCities = [
    { slug: 'gurgaon', name: 'Gurgaon' },
    { slug: 'noida', name: 'Noida' },
    { slug: 'dubai', name: 'Dubai' },
  ];

  // Check if cities are initialized (backend has default cities)
  const citiesReady = cities && (cities as City[]).length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-slate-600 mt-1">Manage properties across Gurgaon, Noida & Dubai</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="lg"
              className="border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Show loading status */}
        {citiesLoading && (
          <Alert className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <AlertTitle className="text-blue-900 font-semibold">Loading System</AlertTitle>
            <AlertDescription className="text-blue-800">
              Loading cities (Gurgaon, Noida, Dubai)... Please wait.
            </AlertDescription>
          </Alert>
        )}

        {/* Show success message when fully loaded */}
        {citiesReady && !citiesLoading && (
          <Alert className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-900 font-semibold">System Ready</AlertTitle>
            <AlertDescription className="text-green-800">
              All cities (Gurgaon, Noida, Dubai) are loaded and ready. You can now manage properties.
            </AlertDescription>
          </Alert>
        )}

        {citiesReady ? (
          <Tabs value={selectedCityTab} onValueChange={setSelectedCityTab} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-2">
              <TabsList className="grid w-full grid-cols-5 h-auto gap-1">
                <TabsTrigger 
                  value="gurgaon" 
                  className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Gurgaon</span>
                  <span className="sm:hidden">GGN</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="noida"
                  className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Noida</span>
                  <span className="sm:hidden">NDA</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="dubai"
                  className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Dubai</span>
                  <span className="sm:hidden">DXB</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="testimonials"
                  className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <span className="hidden sm:inline">Testimonials</span>
                  <span className="sm:hidden">Test</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="leads"
                  className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  Leads
                </TabsTrigger>
              </TabsList>
            </div>

            {/* City Tabs - Gurgaon, Noida, Dubai */}
            {supportedCities.map((cityInfo) => (
              <TabsContent key={cityInfo.slug} value={cityInfo.slug} className="space-y-6 mt-6">
                {/* Add Property Card */}
                <Card className="border-2 border-blue-100 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      Add New Project to {cityInfo.name}
                    </CardTitle>
                    <CardDescription className="text-base">Create a new property listing for {cityInfo.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* City confirmation alert */}
                    {selectedCity && (
                      <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <AlertDescription className="text-blue-900 font-medium">
                          This property will be added to <strong className="text-blue-700">{selectedCity.name}</strong>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="projectName">Project Name *</Label>
                        <Input
                          id="projectName"
                          value={newProperty.projectName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProperty({ ...newProperty, projectName: e.target.value })}
                          placeholder="e.g., Skyline Residences"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="builder">Builder *</Label>
                        <Input
                          id="builder"
                          value={newProperty.builder}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProperty({ ...newProperty, builder: e.target.value })}
                          placeholder="e.g., ABC Developers"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priceRange">Price Range *</Label>
                        <Input
                          id="priceRange"
                          value={newProperty.priceRange}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProperty({ ...newProperty, priceRange: e.target.value })}
                          placeholder="e.g., ₹1.2Cr – ₹2.5Cr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sizes">Sizes</Label>
                        <Input
                          id="sizes"
                          value={newProperty.sizes}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProperty({ ...newProperty, sizes: e.target.value })}
                          placeholder="e.g., 1200 – 2500 sqft"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newProperty.location}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProperty({ ...newProperty, location: e.target.value })}
                          placeholder="e.g., Sector 65"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="possession">Possession</Label>
                        <Input
                          id="possession"
                          value={newProperty.possession}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProperty({ ...newProperty, possession: e.target.value })}
                          placeholder="e.g., Dec 2027"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentPlan">Payment Plan</Label>
                      <Textarea
                        id="paymentPlan"
                        value={newProperty.paymentPlan}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProperty({ ...newProperty, paymentPlan: e.target.value })}
                        placeholder="e.g., Construction Linked"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="highlights">Highlights</Label>
                      <Textarea
                        id="highlights"
                        value={newProperty.highlights}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProperty({ ...newProperty, highlights: e.target.value })}
                        placeholder="e.g., Near Metro, Low Density, RERA Approved"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prosAndCons">Pros & Cons</Label>
                      <Textarea
                        id="prosAndCons"
                        value={newProperty.prosAndCons}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProperty({ ...newProperty, prosAndCons: e.target.value })}
                        placeholder="Pros: Great location, modern amenities&#10;Cons: Higher price point"
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Property Image URL
                      </Label>
                      <Input
                        id="imageUrl"
                        value={newProperty.imageUrl}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProperty({ ...newProperty, imageUrl: e.target.value })}
                        placeholder="e.g., https://example.com/image.jpg"
                      />
                      {newProperty.imageUrl && (
                        <div className="mt-2 border rounded-lg overflow-hidden">
                          <img
                            src={newProperty.imageUrl}
                            alt="Property preview"
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={handleAddProperty} 
                      disabled={addPropertyMutation.isPending} 
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      {addPropertyMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      <Plus className="mr-2 h-5 w-5" />
                      Add Project to {selectedCity?.name || cityInfo.name}
                    </Button>
                  </CardContent>
                </Card>

                {/* Existing Properties Card */}
                <Card className="border-2 border-slate-100 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Existing Projects in {cityInfo.name}</CardTitle>
                          <CardDescription className="text-base mt-1">
                            {propertiesLoading ? (
                              'Loading properties...'
                            ) : properties && properties.length > 0 ? (
                              `${properties.length} project${properties.length !== 1 ? 's' : ''} found`
                            ) : (
                              'No projects currently exist for this city'
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {propertiesLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {properties && properties.length > 0 ? (
                          properties.map((property) => (
                            <div key={property.id.toString()} className="border-2 rounded-xl overflow-hidden hover:border-blue-400 transition-colors bg-gradient-to-br from-white to-blue-50/30 shadow-md hover:shadow-xl">
                              <div className="flex flex-col md:flex-row gap-4">
                                {/* Property Image */}
                                <div className="md:w-48 h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative overflow-hidden group">
                                  {property.imageUrl ? (
                                    <img 
                                      src={property.imageUrl} 
                                      alt={property.projectName}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        const parent = (e.target as HTMLImageElement).parentElement;
                                        if (parent) {
                                          const icon = document.createElement('div');
                                          icon.className = 'flex items-center justify-center w-full h-full';
                                          icon.innerHTML = '<svg class="h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>';
                                          parent.appendChild(icon);
                                        }
                                      }}
                                    />
                                  ) : (
                                    <Building2 className="h-16 w-16 text-blue-400" />
                                  )}
                                </div>
                                {/* Property Details */}
                                <div className="flex-1 p-4 space-y-3">
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                      <h4 className="font-bold text-xl text-slate-900">{property.projectName}</h4>
                                      <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                                        <Building2 className="h-3 w-3" />
                                        {property.builder}
                                      </p>
                                      <p className="text-base text-green-700 font-semibold mt-2 flex items-center gap-1">
                                        <DollarSign className="h-4 w-4" />
                                        {property.priceRange}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setEditingProperty(property);
                                          setIsEditPropertyDialogOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => setDeletingProperty({ id: property.id, citySlug: property.citySlug })}
                                      >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                    {property.location && (
                                      <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border">
                                        <MapPin className="h-3 w-3" />
                                        {property.location}
                                      </span>
                                    )}
                                    {property.sizes && <span className="bg-white px-3 py-1 rounded-full border">{property.sizes}</span>}
                                    {property.possession && (
                                      <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border">
                                        <Calendar className="h-3 w-3" />
                                        {property.possession}
                                      </span>
                                    )}
                                  </div>
                                  {property.highlights && (
                                    <p className="text-sm text-slate-600 line-clamp-2 bg-blue-50/50 p-2 rounded">{property.highlights}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                            <div className="flex justify-center mb-4">
                              <div className="rounded-full bg-slate-100 p-4">
                                <AlertCircle className="h-12 w-12 text-slate-400" />
                              </div>
                            </div>
                            <p className="text-slate-700 font-semibold text-lg mb-2">No Projects Currently Exist</p>
                            <p className="text-sm text-slate-500 mb-4">There are no properties listed for {cityInfo.name} at this time.</p>
                            <p className="text-xs text-slate-400">Add your first project using the form above</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-6 mt-6">
              <Card className="border-2 border-green-100 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    Add New Testimonial
                  </CardTitle>
                  <CardDescription className="text-base">Create a new customer testimonial</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={newTestimonial.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                        placeholder="Customer name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={newTestimonial.city}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTestimonial({ ...newTestimonial, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback *</Label>
                    <Textarea
                      id="feedback"
                      value={newTestimonial.feedback}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTestimonial({ ...newTestimonial, feedback: e.target.value })}
                      placeholder="Customer feedback"
                      rows={4}
                    />
                  </div>
                  <Button 
                    onClick={handleAddTestimonial} 
                    disabled={addTestimonialMutation.isPending}
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    {addTestimonialMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    <Plus className="mr-2 h-5 w-5" />
                    Add Testimonial
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Existing Testimonials</CardTitle>
                      <CardDescription className="text-base mt-1">Manage customer testimonials</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {testimonials && testimonials.length > 0 ? (
                      testimonials.map((testimonial) => (
                        <div key={testimonial.id.toString()} className="border-2 rounded-xl p-5 hover:border-green-400 transition-colors bg-gradient-to-r from-white to-green-50/30 shadow-sm hover:shadow-md">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-slate-900">{testimonial.name}</h4>
                              <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {testimonial.city}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-200 hover:bg-blue-50 hover:border-blue-400"
                                onClick={() => {
                                  setEditingTestimonial(testimonial);
                                  setIsEditTestimonialDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="hover:bg-red-600"
                                onClick={() => setDeletingTestimonialId(testimonial.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 mt-3 italic bg-white/50 p-3 rounded-lg border border-green-100">"{testimonial.feedback}"</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                        <div className="flex justify-center mb-4">
                          <div className="rounded-full bg-slate-100 p-4">
                            <AlertCircle className="h-12 w-12 text-slate-400" />
                          </div>
                        </div>
                        <p className="text-slate-700 font-semibold text-lg mb-2">No Testimonials Yet</p>
                        <p className="text-sm text-slate-500">Add your first customer testimonial using the form above</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leads Tab */}
            <TabsContent value="leads" className="mt-6">
              <Card className="border-2 border-purple-100 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg">
                        <Download className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Lead Submissions</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {leads && leads.length > 0 ? `${leads.length} lead${leads.length !== 1 ? 's' : ''} captured` : 'No leads yet'}
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      onClick={handleDownloadLeads} 
                      variant="default"
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : leads && leads.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Mobile</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Budget</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {leads.map((lead) => (
                            <TableRow key={lead.id.toString()}>
                              <TableCell className="font-medium">{lead.fullName}</TableCell>
                              <TableCell>{lead.mobileNumber}</TableCell>
                              <TableCell>{lead.email || '-'}</TableCell>
                              <TableCell>{lead.cityInterested}</TableCell>
                              <TableCell>{lead.budgetRange || '-'}</TableCell>
                              <TableCell>{lead.purpose}</TableCell>
                              <TableCell>{new Date(Number(lead.createdAt) / 1000000).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 py-8">No leads submitted yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <p className="text-slate-700 font-medium text-lg mb-2">Loading System</p>
              <p className="text-sm text-slate-500">Loading Gurgaon, Noida, and Dubai...</p>
              <p className="text-xs text-slate-400 mt-2">Please wait a moment</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Testimonial Dialog */}
      <Dialog open={isEditTestimonialDialogOpen} onOpenChange={setIsEditTestimonialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>Update the testimonial details</DialogDescription>
          </DialogHeader>
          {editingTestimonial && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={editingTestimonial.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city">City *</Label>
                <Input
                  id="edit-city"
                  value={editingTestimonial.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTestimonial({ ...editingTestimonial, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-feedback">Feedback *</Label>
                <Textarea
                  id="edit-feedback"
                  value={editingTestimonial.feedback}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingTestimonial({ ...editingTestimonial, feedback: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTestimonialDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTestimonial} disabled={updateTestimonialMutation.isPending}>
              {updateTestimonialMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Property Dialog */}
      <Dialog open={isEditPropertyDialogOpen} onOpenChange={setIsEditPropertyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update the project details</DialogDescription>
          </DialogHeader>
          {editingProperty && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-projectName">Project Name *</Label>
                  <Input
                    id="edit-projectName"
                    value={editingProperty.projectName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProperty({ ...editingProperty, projectName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-builder">Builder *</Label>
                  <Input
                    id="edit-builder"
                    value={editingProperty.builder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProperty({ ...editingProperty, builder: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priceRange">Price Range *</Label>
                  <Input
                    id="edit-priceRange"
                    value={editingProperty.priceRange}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProperty({ ...editingProperty, priceRange: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sizes">Sizes</Label>
                  <Input
                    id="edit-sizes"
                    value={editingProperty.sizes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProperty({ ...editingProperty, sizes: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editingProperty.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProperty({ ...editingProperty, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-possession">Possession</Label>
                  <Input
                    id="edit-possession"
                    value={editingProperty.possession}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProperty({ ...editingProperty, possession: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-paymentPlan">Payment Plan</Label>
                <Textarea
                  id="edit-paymentPlan"
                  value={editingProperty.paymentPlan}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingProperty({ ...editingProperty, paymentPlan: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-highlights">Highlights</Label>
                <Textarea
                  id="edit-highlights"
                  value={editingProperty.highlights}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingProperty({ ...editingProperty, highlights: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-prosAndCons">Pros & Cons</Label>
                <Textarea
                  id="edit-prosAndCons"
                  value={editingProperty.prosAndCons}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingProperty({ ...editingProperty, prosAndCons: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Property Image URL
                </Label>
                <Input
                  id="edit-imageUrl"
                  value={editingProperty.imageUrl || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProperty({ ...editingProperty, imageUrl: e.target.value })}
                  placeholder="e.g., https://example.com/image.jpg"
                />
                {editingProperty.imageUrl && (
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img
                      src={editingProperty.imageUrl}
                      alt="Property preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPropertyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProperty} disabled={updatePropertyMutation.isPending}>
              {updatePropertyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Property Confirmation */}
      <AlertDialog open={!!deletingProperty} onOpenChange={(open: boolean) => !open && setDeletingProperty(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this property?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this project. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProperty} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deletePropertyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Testimonial Confirmation */}
      <AlertDialog open={!!deletingTestimonialId} onOpenChange={(open: boolean) => !open && setDeletingTestimonialId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this testimonial. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTestimonial} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteTestimonialMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
