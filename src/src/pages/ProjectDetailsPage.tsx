import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, MapPin, Building2, Calendar, Phone, Mail, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import ContactModal from '../components/ContactModal';
import { DataService, type Project } from '../services/dataService';
import { toast } from 'sonner';

export default function ProjectDetailsPage() {
  const { cityName, projectSlug } = useParams({ strict: false });
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Load project data
  useEffect(() => {
    async function loadProject() {
      if (!cityName || !projectSlug) return;
      
      setIsLoading(true);
      try {
        const projects = await DataService.getPropertiesByCity(cityName);
        const foundProject = projects.find(
          (p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === projectSlug
        );
        
        if (foundProject) {
          setProject(foundProject);
        } else {
          toast.error('Project not found');
          navigate({ to: `/city/${cityName}` });
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast.error('Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProject();
  }, [cityName, projectSlug, navigate]);

  // Scroll spy for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'snapshot', 'location', 'amenities', 'contact'];
      const scrollPosition = window.scrollY + 150;

      for (const sectionId of sections.reverse()) {
        const element = document.getElementById(sectionId);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  const nextImage = () => {
    if (project?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const images = project.images || [];
  const amenities = project.amenities || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. PROJECT HERO SECTION */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate({ to: `/city/${cityName}` })}
            className="text-white hover:bg-white/10 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {cityName?.charAt(0).toUpperCase() + cityName?.slice(1)} Properties
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Project Info */}
            <div>
              {project.projectStatus && (
                <span className="inline-block px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full mb-4">
                  {project.projectStatus}
                </span>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.name}</h1>
              
              <div className="space-y-3 text-slate-300 mb-6">
                {project.builder && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <span className="text-lg">By {project.builder}</span>
                  </div>
                )}
                
                {project.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span className="text-lg">{project.location}, {cityName?.charAt(0).toUpperCase() + cityName?.slice(1)}</span>
                  </div>
                )}
                
                {project.possession && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="text-lg">Possession: {project.possession}</span>
                  </div>
                )}
              </div>

              {project.price && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <p className="text-slate-300 text-sm mb-1">Starting From</p>
                  <p className="text-3xl font-bold">{project.price}</p>
                  {project.pricePerSqft && (
                    <p className="text-slate-300 text-sm mt-1">@ {project.pricePerSqft}</p>
                  )}
                </div>
              )}

              {/* Primary CTAs */}
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => setShowContactModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Book Site Visit
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowContactModal(true)}
                  className="bg-white text-slate-900 hover:bg-slate-100 px-8"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Now
                </Button>
              </div>
            </div>

            {/* Right: Hero Image */}
            {images.length > 0 && (
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={images[currentImageIndex]}
                  alt={project.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setShowLightbox(true)}
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. STICKY TOP TASK BAR */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'snapshot', label: 'Snapshot' },
              { id: 'location', label: 'Location' },
              { id: 'amenities', label: 'Amenities' },
              { id: 'contact', label: 'Contact for Site Visit' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeSection === item.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 3. IMAGE GALLERY */}
        {images.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Project Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-md"
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setShowLightbox(true);
                  }}
                >
                  <img src={img} alt={`${project.name} - Image ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. OVERVIEW */}
        <section id="overview" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Overview</h2>
          <Card>
            <CardContent className="p-8">
              <div className="prose max-w-none text-slate-700 leading-relaxed">
                {project.description?.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 5. PROJECT SNAPSHOT */}
        <section id="snapshot" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Project Snapshot</h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {project.landArea && (
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-slate-600 font-medium">Land Area</span>
                    <span className="text-slate-900 font-semibold">{project.landArea}</span>
                  </div>
                )}
                {project.numberOfTowers && (
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-slate-600 font-medium">Number of Towers</span>
                    <span className="text-slate-900 font-semibold">{project.numberOfTowers}</span>
                  </div>
                )}
                {project.numberOfFloors && (
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-slate-600 font-medium">Number of Floors</span>
                    <span className="text-slate-900 font-semibold">{project.numberOfFloors}</span>
                  </div>
                )}
                {project.size && (
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-slate-600 font-medium">Size Range</span>
                    <span className="text-slate-900 font-semibold">{project.size}</span>
                  </div>
                )}
                {project.configuration && (
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-slate-600 font-medium">Configuration</span>
                    <span className="text-slate-900 font-semibold">{project.configuration}</span>
                  </div>
                )}
                {project.projectStatus && (
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-slate-600 font-medium">Project Status</span>
                    <span className="text-slate-900 font-semibold">{project.projectStatus}</span>
                  </div>
                )}
                {project.possession && (
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-slate-600 font-medium">Possession</span>
                    <span className="text-slate-900 font-semibold">{project.possession}</span>
                  </div>
                )}
                {project.rera && (
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-slate-600 font-medium">RERA Number</span>
                    <span className="text-slate-900 font-semibold">{project.rera}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 6. PROJECT HIGHLIGHTS */}
        {project.highlights && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Project Highlights</h2>
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-4">
                  {project.highlights.split('\n').map((highlight, idx) => (
                    highlight.trim() && (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <span className="text-slate-700">{highlight}</span>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 7. PRICE & PAYMENT PLAN */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Price & Payment Plan</h2>
          <Card>
            <CardContent className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Pricing</h3>
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-slate-600 mb-2">Starting From</p>
                  <p className="text-3xl font-bold text-slate-900">{project.price}</p>
                  {project.pricePerSqft && (
                    <p className="text-slate-600 mt-2">Price per sqft: {project.pricePerSqft}</p>
                  )}
                </div>
              </div>

              {project.paymentPlan && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Payment Plan</h3>
                  <div className="prose max-w-none text-slate-700">
                    {project.paymentPlan.split('\n').map((line, idx) => (
                      line.trim() && <p key={idx} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {project.brochurePath && (
                <Button variant="outline" className="mt-6">
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </Button>
              )}
            </CardContent>
          </Card>

          {/* CTA after price */}
          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={() => setShowContactModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12"
            >
              Get Best Price
            </Button>
          </div>
        </section>

        {/* 8. AMENITIES */}
        {amenities.length > 0 && (
          <section id="amenities" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Amenities</h2>
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 9. LOCATION */}
        <section id="location" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Location</h2>
          <Card>
            <CardContent className="p-8">
              {project.location && (
                <p className="text-slate-700 mb-6 text-lg">
                  Located in {project.location}, {cityName?.charAt(0).toUpperCase() + cityName?.slice(1)}
                </p>
              )}
              <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">Map integration can be added with coordinates</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 10. ABOUT THE DEVELOPER */}
        {project.builder && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">About the Developer</h2>
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">{project.builder}</h3>
                <p className="text-slate-700 leading-relaxed">
                  {project.builder} is a renowned real estate developer known for delivering quality projects
                  across prime locations. With years of experience and expertise in the industry, they have
                  established themselves as a trusted name in real estate development.
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 11. CONTACT SECTION */}
        <section id="contact" className="scroll-mt-24">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Interested in this project?</h2>
              <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                Get in touch with our property advisors for site visits, pricing details, and exclusive offers.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => setShowContactModal(true)}
                  className="bg-white text-blue-600 hover:bg-slate-100 px-8"
                >
                  Book Site Visit
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowContactModal(true)}
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8"
                >
                  Contact Property Advisor
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        projectName={project.name}
        city={cityName}
      />

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
          
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 text-white hover:bg-white/10 p-3 rounded-full"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 text-white hover:bg-white/10 p-3 rounded-full"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
          
          <img
            src={images[currentImageIndex]}
            alt={project.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Sticky Bottom CTA (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t shadow-lg p-4 z-30">
        <Button
          size="lg"
          onClick={() => setShowContactModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Contact Now
        </Button>
      </div>
    </div>
  );
}
