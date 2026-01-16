import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { AlertCircle, Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { DataService, type Project } from '../../services/dataService';

interface CityProjectsProps {
  selectedCity: string | null;
}

const CITY_NAMES: { [key: string]: string } = {
  gurgaon: 'Gurgaon',
  noida: 'Noida',
  dubai: 'Dubai',
};

// CRITICAL: Form state defined ONCE, never recreated
interface FormState {
  name: string;
  location: string;
  price: string;
  pricePerSqft: string;
  possession: string;
  builder: string;
  size: string;
  configuration: string;
  developer: string;
  delivery: string;
  paymentPlan: string;
  description: string;
  highlights: string;
  amenities: string[];
  rera: string;
  images: string[];
  status: 'active' | 'inactive';
  projectStatus: 'New Launch' | 'Under Construction' | 'Ready to Move';
  verifiedStatus: 'Verified' | 'In Progress';
  landArea: string;
  numberOfTowers: string;
  numberOfFloors: string;
  brochurePath: string;
  highlighted: boolean;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  location: '',
  price: '',
  pricePerSqft: '',
  possession: '',
  builder: '',
  size: '',
  configuration: '',
  developer: '',
  delivery: '',
  paymentPlan: '',
  description: '',
  highlights: '',
  amenities: [],
  rera: '',
  images: [],
  status: 'active',
  projectStatus: 'Under Construction',
  verifiedStatus: 'In Progress',
  landArea: '',
  numberOfTowers: '',
  numberOfFloors: '',
  brochurePath: '',
  highlighted: false,
};

export default function CityProjects({ selectedCity }: CityProjectsProps) {
  // STABLE STATE - Never recreate these
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [imageInput, setImageInput] = useState('');
  const [amenityInput, setAmenityInput] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);

  // Load projects when city changes
  const loadProjects = useCallback(async () => {
    if (!selectedCity) return;
    setIsLoading(true);
    try {
      const cityProjects = await DataService.getPropertiesByCity(selectedCity);
      setProjects(cityProjects);
      console.log(`📦 Loaded ${cityProjects.length} projects for ${selectedCity}`);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Form handlers - NO component recreation
  const handleInputChange = useCallback((field: keyof FormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddImage = useCallback(() => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput('');
    }
  }, [imageInput]);

  const handleRemoveImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const handleAddAmenity = useCallback(() => {
    if (amenityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput('');
    }
  }, [amenityInput]);

  const handleRemoveAmenity = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setImageInput('');
    setAmenityInput('');
    setEditingProject(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!selectedCity) {
      toast.error('No city selected');
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Location is required');
      return;
    }
    if (!formData.price.trim()) {
      toast.error('Price is required');
      return;
    }

    setIsLoading(true);
    try {
      let success = false;

      if (editingProject) {
        // UPDATE existing project
        success = await DataService.updateProperty(selectedCity, editingProject.id, formData);
      } else {
        // ADD new project
        success = await DataService.addProperty(selectedCity, formData);
      }

      if (success) {
        toast.success(editingProject ? 'Project updated successfully' : 'Project added successfully');
        setShowAddForm(false);
        resetForm();
        await loadProjects(); // Reload from storage
      } else {
        toast.error('Failed to save project');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Error saving project');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCity, formData, editingProject, resetForm, loadProjects]);

  const handleEdit = useCallback((project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      location: project.location,
      price: project.price,
      pricePerSqft: project.pricePerSqft || '',
      possession: project.possession || '',
      builder: project.builder || '',
      size: project.size || '',
      configuration: project.configuration || '',
      developer: project.developer || project.builder || '',
      delivery: project.delivery || project.possession || '',
      paymentPlan: project.paymentPlan || '',
      description: project.description || '',
      highlights: project.highlights || '',
      amenities: project.amenities || [],
      rera: project.rera || '',
      images: project.images || [],
      status: project.status || 'active',
      projectStatus: project.projectStatus || 'Under Construction',
      verifiedStatus: project.verifiedStatus || 'In Progress',
      landArea: project.landArea || '',
      numberOfTowers: project.numberOfTowers?.toString() || '',
      numberOfFloors: project.numberOfFloors?.toString() || '',
      brochurePath: project.brochurePath || '',
      highlighted: project.highlighted || false,
    });
    setShowAddForm(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!selectedCity || !deletingId) return;

    setIsLoading(true);
    try {
      const success = await DataService.deleteProperty(selectedCity, deletingId);
      if (success) {
        toast.success('Project deleted successfully');
        setDeletingId(null);
        await loadProjects();
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting project');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCity, deletingId, loadProjects]);

  if (!selectedCity) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Card className="max-w-md w-full shadow-lg border-2">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No City Selected</h3>
            <p className="text-slate-600">Please select a city from the sidebar to manage projects.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{CITY_NAMES[selectedCity]} Projects</h1>
          <p className="text-slate-600">Manage property projects for {CITY_NAMES[selectedCity]}</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Project List */}
      {!showAddForm && (
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle>Project List ({projects.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-slate-600 mt-4">Loading...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">No projects found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.location}</TableCell>
                      <TableCell>{project.price}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {project.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingId(project.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="shadow-lg border-2 max-w-3xl mx-auto">
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle>{editingProject ? 'Edit' : 'Add'} Project - {CITY_NAMES[selectedCity]}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900 pb-2 border-b">Basic Information</h3>
                
                <div>
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Skyline Residences"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Sector 45, Near Metro"
                  />
                </div>

                <div>
                  <Label htmlFor="builder">Builder Name</Label>
                  <Input
                    id="builder"
                    value={formData.builder}
                    onChange={(e) => handleInputChange('builder', e.target.value)}
                    placeholder="e.g., ABC Developers"
                  />
                </div>

                <div>
                  <Label htmlFor="developer">Developer</Label>
                  <Input
                    id="developer"
                    value={formData.developer}
                    onChange={(e) => handleInputChange('developer', e.target.value)}
                    placeholder="e.g., DLF Limited, Godrej Properties"
                  />
                </div>

                <div>
                  <Label htmlFor="rera">RERA Number</Label>
                  <Input
                    id="rera"
                    value={formData.rera}
                    onChange={(e) => handleInputChange('rera', e.target.value)}
                    placeholder="e.g., RERA12345678"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900 pb-2 border-b">Pricing & Details</h3>
                
                <div>
                  <Label htmlFor="price">Starting Price *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., ₹1.2 Cr - ₹2.5 Cr"
                  />
                </div>

                <div>
                  <Label htmlFor="pricePerSqft">Price Per Sq Ft</Label>
                  <Input
                    id="pricePerSqft"
                    value={formData.pricePerSqft}
                    onChange={(e) => handleInputChange('pricePerSqft', e.target.value)}
                    placeholder="e.g., ₹12,500/sq ft"
                  />
                </div>

                <div>
                  <Label htmlFor="size">Size (sq ft)</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    placeholder="e.g., 1200-2400 sq ft"
                  />
                </div>

                <div>
                  <Label htmlFor="configuration">Configuration</Label>
                  <Input
                    id="configuration"
                    value={formData.configuration}
                    onChange={(e) => handleInputChange('configuration', e.target.value)}
                    placeholder="e.g., 3-4 BHK, 4-5 BHK"
                  />
                </div>

                <div>
                  <Label htmlFor="projectStatus">Project Status</Label>
                  <select
                    id="projectStatus"
                    value={formData.projectStatus}
                    onChange={(e) => handleInputChange('projectStatus', e.target.value as 'New Launch' | 'Under Construction' | 'Ready to Move')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="New Launch">New Launch</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready to Move">Ready to Move</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="verifiedStatus">Verified by PropScan Team</Label>
                  <select
                    id="verifiedStatus"
                    value={formData.verifiedStatus}
                    onChange={(e) => handleInputChange('verifiedStatus', e.target.value as 'Verified' | 'In Progress')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Verified">Verified</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="possession">Possession Date</Label>
                  <Input
                    id="possession"
                    value={formData.possession}
                    onChange={(e) => handleInputChange('possession', e.target.value)}
                    placeholder="e.g., Dec 2026"
                  />
                </div>

                <div>
                  <Label htmlFor="delivery">Delivery Date</Label>
                  <Input
                    id="delivery"
                    value={formData.delivery}
                    onChange={(e) => handleInputChange('delivery', e.target.value)}
                    placeholder="e.g., Jun 2026"
                  />
                </div>

                <div>
                  <Label htmlFor="paymentPlan">Payment Plan</Label>
                  <Input
                    id="paymentPlan"
                    value={formData.paymentPlan}
                    onChange={(e) => handleInputChange('paymentPlan', e.target.value)}
                    placeholder="e.g., 20:80"
                  />
                </div>

                <div>
                  <Label htmlFor="landArea">Land Area</Label>
                  <Input
                    id="landArea"
                    value={formData.landArea}
                    onChange={(e) => handleInputChange('landArea', e.target.value)}
                    placeholder="e.g., 25 Acres"
                  />
                </div>

                <div>
                  <Label htmlFor="numberOfTowers">Number of Towers</Label>
                  <Input
                    id="numberOfTowers"
                    type="number"
                    value={formData.numberOfTowers}
                    onChange={(e) => handleInputChange('numberOfTowers', e.target.value)}
                    placeholder="e.g., 4"
                  />
                </div>

                <div>
                  <Label htmlFor="numberOfFloors">Number of Floors</Label>
                  <Input
                    id="numberOfFloors"
                    type="number"
                    value={formData.numberOfFloors}
                    onChange={(e) => handleInputChange('numberOfFloors', e.target.value)}
                    placeholder="e.g., G+45"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900 pb-2 border-b">Description</h3>
                
                <div>
                  <Label htmlFor="description">Short Overview</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the project"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="highlights">Key Highlights</Label>
                  <Textarea
                    id="highlights"
                    value={formData.highlights}
                    onChange={(e) => handleInputChange('highlights', e.target.value)}
                    placeholder="Enter key highlights, one per line"
                    rows={4}
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900 pb-2 border-b">Amenities</h3>
                
                <div className="flex gap-2">
                  <Input
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="Enter amenity (e.g., Swimming Pool, Clubhouse)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                  />
                  <Button type="button" onClick={handleAddAmenity}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {formData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        <span>{amenity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Brochure */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900 pb-2 border-b">Project Brochure</h3>
                
                <div>
                  <Label htmlFor="brochure">Project Brochure (PDF, DOC, DOCX - Max 10MB)</Label>
                  <div className="mt-2">
                    <input
                      id="brochure"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        // Validate file size (10MB)
                        if (file.size > 10 * 1024 * 1024) {
                          toast.error('File size must be less than 10MB');
                          e.target.value = '';
                          return;
                        }

                        // Validate file type
                        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                        if (!validTypes.includes(file.type)) {
                          toast.error('Only PDF, DOC, and DOCX files are allowed');
                          e.target.value = '';
                          return;
                        }

                        setUploadingBrochure(true);
                        try {
                          // Create a unique filename
                          const timestamp = Date.now();
                          const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                          const fileName = `${timestamp}_${sanitizedName}`;
                          const brochurePath = `/brochures/${fileName}`;

                          // In a real application, you would upload to a server here
                          // For now, we'll just store the path and show a success message
                          setFormData(prev => ({ ...prev, brochurePath }));
                          toast.success('Brochure ready for upload. Save the project to complete.');
                          
                          // Note: Actual file upload would happen on form save
                          console.log('Brochure staged for upload:', fileName);
                        } catch (error) {
                          console.error('Error staging brochure:', error);
                          toast.error('Failed to stage brochure');
                        } finally {
                          setUploadingBrochure(false);
                        }
                      }}
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer"
                      disabled={uploadingBrochure}
                    />
                    {uploadingBrochure && (
                      <p className="text-sm text-blue-600 mt-2">Processing brochure...</p>
                    )}
                    {formData.brochurePath && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓ Brochure: {formData.brochurePath.split('/').pop()}</span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, brochurePath: '' }))}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900 pb-2 border-b">Images</h3>
                
                <div className="flex gap-2">
                  <Input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Enter image URL"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  />
                  <Button type="button" onClick={handleAddImage}>
                    <Upload className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt="" className="w-full h-24 object-cover rounded border" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900 pb-2 border-b">Status</h3>
                
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={formData.status === 'active'}
                      onChange={() => handleInputChange('status', 'active')}
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={formData.status === 'inactive'}
                      onChange={() => handleInputChange('status', 'inactive')}
                    />
                    <span>Inactive</span>
                  </label>
                </div>

                <div className="pt-4 border-t">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.highlighted}
                      onChange={(e) => handleInputChange('highlighted', e.target.checked.toString())}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-slate-900">Highlight this project</span>
                      <p className="text-sm text-slate-600">Display with golden frame on city page for emphasis</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {isLoading ? 'Saving...' : 'Save Project'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Are you sure you want to delete this project? This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button onClick={() => setDeletingId(null)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
