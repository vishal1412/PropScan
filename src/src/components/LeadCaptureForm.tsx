import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';
import { User, Phone, Mail, MapPin, DollarSign, Home, MessageSquare, ArrowRight } from 'lucide-react';
import { DataService } from '../services/dataService';

export default function LeadCaptureForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    budget: '',
    purpose: '',
    message: '',
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Full Name is required');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Mobile Number is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save lead to JSON file via API
      const success = await DataService.addLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || '',
        city: formData.city || '',
        budget: formData.budget || '',
        purpose: formData.purpose || '',
        message: formData.message.trim() || '',
      });

      if (!success) {
        throw new Error('Failed to save lead');
      }

      toast.success('Information is saved, someone from advisor team will contact you shortly', {
        duration: 4000,
        position: 'top-center',
      });
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        city: '',
        budget: '',
        purpose: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Get Expert Property Advice
              </h2>
              <p className="text-slate-600">
                Data-backed guidance. No commissions. No pressuure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name and Mobile Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      disabled={isSubmitting}
                      className="h-12 pl-11 border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter or mobile number"
                      required
                      disabled={isSubmitting}
                      className="h-12 pl-11 border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Email and City Interested In */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email <span className="text-slate-500">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email (optional)"
                      disabled={isSubmitting}
                      className="h-12 pl-11 border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-slate-700">
                    City Interested In
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                    <Select 
                      value={formData.city} 
                      onValueChange={(value) => handleInputChange('city', value)}
                    >
                      <SelectTrigger id="city" className="h-12 pl-11 border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg">
                        <SelectValue placeholder="Select a city" />
                        <SelectContent>
                          <SelectItem value="">Select a city</SelectItem>
                          <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                          <SelectItem value="Noida">Noida</SelectItem>
                          <SelectItem value="Dubai">Dubai</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Bangalore">Bangalore</SelectItem>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Budget Range and Purpose */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-medium text-slate-700">
                    Budget Range
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                    <Select 
                      value={formData.budget} 
                      onValueChange={(value) => handleInputChange('budget', value)}
                    >
                      <SelectTrigger id="budget" className="h-12 pl-11 border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg">
                        <SelectValue placeholder="Select budget range" />
                        <SelectContent>
                          <SelectItem value="">Select budget range</SelectItem>
                          <SelectItem value="Below 50L">Below ₹50L</SelectItem>
                          <SelectItem value="50L - 1Cr">₹50L - ₹1Cr</SelectItem>
                          <SelectItem value="1Cr - 2Cr">₹1Cr - ₹2Cr</SelectItem>
                          <SelectItem value="2Cr - 5Cr">₹2Cr - ₹5Cr</SelectItem>
                          <SelectItem value="Above 5Cr">Above ₹5Cr</SelectItem>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose" className="text-sm font-medium text-slate-700">
                    Purpose
                  </Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                    <Select 
                      value={formData.purpose} 
                      onValueChange={(value) => handleInputChange('purpose', value)}
                    >
                      <SelectTrigger id="purpose" className="h-12 pl-11 border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg">
                        <SelectValue placeholder="Select purpose" />
                        <SelectContent>
                          <SelectItem value="">Select purpose</SelectItem>
                          <SelectItem value="Investment">Investment</SelectItem>
                          <SelectItem value="Self Use">Self Use</SelectItem>
                          <SelectItem value="Rental">Rental</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Message (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-slate-700">
                  Message <span className="text-slate-500">(Optional)</span>
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Any specific requirements or questions?"
                    rows={4}
                    disabled={isSubmitting}
                    className="pl-11 pt-3 resize-none border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    Get Expert Advice
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              {/* Confidentiality Notice */}
              <p className="text-center text-sm text-slate-500 mt-4">
                Your details are 100% confidential. No spam. No broker calls.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
