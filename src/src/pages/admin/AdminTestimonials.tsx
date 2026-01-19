import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Plus, Trash2, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  name: string;
  city: string;
  message: string;
  createdAt: string;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTestimonials();
    const interval = setInterval(loadTestimonials, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadTestimonials = () => {
    try {
      const existingData = localStorage.getItem('testimonials_data');
      const data = existingData ? JSON.parse(existingData) : [];
      console.log('Loaded testimonials:', data.length);
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    }
  };

  const addTestData = () => {
    setName('Ajay Mishra');
    setCity('Noida');
    setMessage('wonderful');
    toast.success('Test data filled! Click Save to add.');
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!city.trim()) {
      toast.error('City is required');
      return;
    }
    if (!message.trim()) {
      toast.error('Message is required');
      return;
    }

    try {
      const existingData = localStorage.getItem('testimonials_data');
      const testimonialsList = existingData ? JSON.parse(existingData) : [];
      
      const newTestimonial: Testimonial = {
        id: `test_${Date.now()}_${Math.random()?.toString(36).substr(2, 9)}`,
        name: name.trim(),
        city: city.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
      };
      
      testimonialsList.push(newTestimonial);
      localStorage.setItem('testimonials_data', JSON.stringify(testimonialsList));
      
      console.log('✅ Testimonial saved:', newTestimonial);
      console.log('Total:', testimonialsList.length);
      
      toast.success(`✅ Testimonial added! Total: ${testimonialsList.length}`);
      
      setName('');
      setCity('');
      setMessage('');
      setShowForm(false);
      loadTestimonials();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save testimonial');
    }
  };

  const handleDelete = (id: string) => {
    try {
      const existingData = localStorage.getItem('testimonials_data');
      const testimonialsList = existingData ? JSON.parse(existingData) : [];
      const updated = testimonialsList.filter((t: Testimonial) => t.id !== id);
      localStorage.setItem('testimonials_data', JSON.stringify(updated));
      
      console.log('Deleted. Remaining:', updated.length);
      toast.success('Testimonial deleted!');
      setDeletingId(null);
      loadTestimonials();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-slate-600 mt-1">Manage customer testimonials and reviews</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadTestimonials} variant="outline" size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(!showForm)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            {showForm ? 'Cancel' : 'Add Testimonial'}
          </Button>
        </div>
      </div>

      {/* ADD TESTIMONIAL FORM */}
      {showForm && (
        <Card className="mb-8 border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Add New Testimonial
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Client Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter client name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city (e.g., Noida, Gurgaon, Dubai)"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message">Testimonial Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter the client's testimonial..."
                  className="mt-1 min-h-[120px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSave}
                  size="lg"
                  className="flex-1"
                >
                  Save Testimonial
                </Button>
                <Button 
                  onClick={addTestData}
                  variant="outline"
                  size="lg"
                >
                  Fill Test Data
                </Button>
                <Button 
                  onClick={() => {
                    setName('');
                    setCity('');
                    setMessage('');
                    setShowForm(false);
                  }}
                  variant="outline"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TESTIMONIALS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Testimonials ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="w-[120px]">City</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[150px]">Created</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No testimonials yet. Add your first testimonial above.
                    </TableCell>
                  </TableRow>
                ) : (
                  testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell className="font-medium">{testimonial.name}</TableCell>
                      <TableCell>{testimonial.city}</TableCell>
                      <TableCell className="max-w-md truncate">{testimonial.message}</TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingId(testimonial.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingId && handleDelete(deletingId)} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
