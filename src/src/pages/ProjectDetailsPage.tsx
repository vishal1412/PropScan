import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, MapPin, Building2, Calendar, Phone, Mail, Download, ChevronLeft, ChevronRight, X, Home, Users, CheckCircle, Maximize2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import ContactModal from '../components/ContactModal';
import { DataService, type Project } from '../services/dataService';
import { toast } from 'sonner';

export default function ProjectDetailsPage() {
  const { cityName, projectSlug } = useParams({ strict: false });
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
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
      const sections = ['overview', 'snapshot', 'highlights', 'plans', 'amenities', 'location', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sectionId);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  const nextHeroImage = () => {
    if (project?.images) {
      setCurrentHeroImage((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevHeroImage = () => {
    if (project?.images) {
      setCurrentHeroImage((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-6 text-lg">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const images = project.images || [];
  const amenities = project.amenities || [];
  const cityDisplay = cityName ? cityName.charAt(0).toUpperCase() + cityName.slice(1) : '';

  return (
    <div className="min-h-screen bg-white">
      {/* 1. FULL-WIDTH HERO SECTION */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentHeroImage]}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevHeroImage}
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
                  >
                    <ChevronLeft className="h-7 w-7" />
                  </button>
                  <button
                    onClick={nextHeroImage}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
                  >
                    <ChevronRight className="h-7 w-7" />
                  </button>
                  
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentHeroImage(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentHeroImage ? 'bg-white w-12' : 'bg-white/50 w-8'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            </div>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate({ to: `/city/${cityName}` })}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to {cityDisplay}</span>
        </button>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl">
              {/* Project Status Badge */}
              {project.projectStatus && (
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full mb-6 font-semibold text-sm tracking-wide">
                  {project.projectStatus}
                </div>
              )}
              
              {/* Project Name */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {project.name}
              </h1>
              
              {/* Location */}
              {project.location && (
                <div className="flex items-center gap-3 text-white/90 mb-4 text-xl">
                  <MapPin className="h-6 w-6" />
                  <span>{project.location}, {cityDisplay}</span>
                </div>
              )}
              
              {/* Developer */}
              {project.builder && (
                <div className="flex items-center gap-3 text-white/90 mb-8 text-lg">
                  <Building2 className="h-5 w-5" />
                  <span>By {project.builder}</span>
                </div>
              )}

              {/* Price */}
              {project.price && (
                <div className="inline-block bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-5 mb-10">
                  <p className="text-slate-600 text-sm font-medium mb-1">Starting From</p>
                  <p className="text-4xl font-bold text-slate-900">{project.price}</p>
                  {project.pricePerSqft && (
                    <p className="text-slate-600 text-sm mt-1">@ {project.pricePerSqft}</p>
                  )}
                </div>
              )}

              {/* Primary CTAs */}
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => setShowContactModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all"
                >
                  <Phone className="h-5 w-5 mr-3" />
                  Book Site Visit
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowContactModal(true)}
                  className="bg-white/95 hover:bg-white text-slate-900 border-0 px-10 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all"
                >
                  <Mail className="h-5 w-5 mr-3" />
                  Enquire Now
                </Button>
                {project.brochurePath && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/30 px-10 py-6 text-lg rounded-xl transition-all"
                  >
                    <Download className="h-5 w-5 mr-3" />
                    Download Brochure
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STICKY NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'snapshot', label: 'Snapshot' },
              { id: 'highlights', label: 'Highlights' },
              { id: 'plans', label: 'Plans' },
              { id: 'amenities', label: 'Amenities' },
              { id: 'location', label: 'Location' },
              { id: 'contact', label: 'Contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-8 py-5 text-base font-semibold whitespace-nowrap border-b-3 transition-all ${
                  activeSection === item.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT SECTIONS */}
      
      {/* 3. OVERVIEW SECTION - Editorial Style */}
      <section id="overview" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
              Overview
            </h2>
            {project.description && (
              <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-6">
                {project.description.split('\n\n').map((paragraph, idx) => (
                  paragraph.trim() && (
                    <p key={idx} className="text-xl leading-relaxed">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. PROJECT SNAPSHOT - Developer Table Style */}
      <section id="snapshot" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12">
              Project Snapshot
            </h2>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {project.landArea && (
                  <div className="p-8 hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Land Area</p>
                    <p className="text-2xl font-bold text-slate-900">{project.landArea}</p>
                  </div>
                )}
                {project.numberOfTowers && (
                  <div className="p-8 hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Number of Towers</p>
                    <p className="text-2xl font-bold text-slate-900">{project.numberOfTowers}</p>
                  </div>
                )}
                {project.numberOfFloors && (
                  <div className="p-8 hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Floors</p>
                    <p className="text-2xl font-bold text-slate-900">{project.numberOfFloors}</p>
                  </div>
                )}
                {project.size && (
                  <div className="p-8 hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Unit Sizes</p>
                    <p className="text-2xl font-bold text-slate-900">{project.size}</p>
                  </div>
                )}
                {project.configuration && (
                  <div className="p-8 hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Configurations</p>
                    <p className="text-2xl font-bold text-slate-900">{project.configuration}</p>
                  </div>
                )}
                {project.projectStatus && (
                  <div className="p-8 hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Project Status</p>
                    <p className="text-2xl font-bold text-slate-900">{project.projectStatus}</p>
                  </div>
                )}
                {project.possession && (
                  <div className="p-8 hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Possession</p>
                    <p className="text-2xl font-bold text-slate-900">{project.possession}</p>
                  </div>
                )}
                {project.rera && (
                  <div className="p-8 hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">RERA Number</p>
                    <p className="text-2xl font-bold text-slate-900">{project.rera}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HIGHLIGHTS SECTION - Icon + Text Grid */}
      {project.highlights && (
        <section id="highlights" className="py-20 bg-white scroll-mt-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center">
                Project Highlights
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {project.highlights.split('\n').map((highlight, idx) => (
                  highlight.trim() && (
                    <div key={idx} className="flex items-start gap-4 p-6 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg text-slate-800 leading-relaxed">{highlight.replace(/^[✔✓•-]\s*/, '')}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Price & Payment Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pricing & Payment Plans
            </h2>
            <p className="text-xl text-slate-300 mb-12">
              Flexible payment options tailored to your needs
            </p>
            
            {project.price && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 mb-10 inline-block">
                <p className="text-slate-300 mb-3 text-lg">Starting From</p>
                <p className="text-6xl font-bold mb-3">{project.price}</p>
                {project.pricePerSqft && (
                  <p className="text-slate-300 text-lg">@ {project.pricePerSqft}</p>
                )}
              </div>
            )}

            {project.paymentPlan && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-10 text-left max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold mb-6">Payment Plan</h3>
                <div className="space-y-3 text-slate-300">
                  {project.paymentPlan.split('\n').map((line, idx) => (
                    line.trim() && <p key={idx} className="text-lg">{line}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg rounded-xl"
              >
                Get Best Price
              </Button>
              {project.brochurePath && (
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/30 px-12 py-6 text-lg rounded-xl"
                >
                  <Download className="h-5 w-5 mr-3" />
                  Download Brochure
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PLANS SECTION - Site & Floor Plans */}
      <section id="plans" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center">
              Site & Floor Plans
            </h2>
            {images.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all"
                    onClick={() => {
                      setLightboxImage(img);
                      setShowLightbox(true);
                    }}
                  >
                    <img src={img} alt={`Plan ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Maximize2 className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. AMENITIES SECTION - Visual First */}
      {amenities.length > 0 && (
        <section id="amenities" className="py-20 bg-slate-50 scroll-mt-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center">
                World-Class Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Home className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-center text-slate-800 font-medium">{amenity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA After Amenities */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Experience the Lifestyle You Deserve
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Schedule a site visit to explore this exceptional property
            </p>
            <Button
              size="lg"
              onClick={() => setShowContactModal(true)}
              className="bg-white text-blue-600 hover:bg-slate-100 px-12 py-6 text-lg rounded-xl shadow-xl"
            >
              <Phone className="h-5 w-5 mr-3" />
              Book Your Site Visit
            </Button>
          </div>
        </div>
      </section>

      {/* 8. LOCATION SECTION - Map + Explanation */}
      <section id="location" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center">
              Prime Location
            </h2>
            {project.location && (
              <p className="text-2xl text-slate-700 mb-10 text-center">
                {project.location}, {cityDisplay}
              </p>
            )}
            <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden mb-10 shadow-xl">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">Interactive map integration</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Location Advantages</h3>
              <div className="prose prose-lg max-w-none text-slate-700">
                <p className="text-xl leading-relaxed">
                  Strategically located in {project.location}, this project offers excellent connectivity 
                  to major landmarks, business hubs, and entertainment zones. Experience the perfect blend 
                  of convenience and tranquility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ABOUT THE DEVELOPER - Brand Section */}
      {project.builder && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center">
                About the Developer
              </h2>
              <div className="bg-white rounded-2xl shadow-xl p-10 md:p-16">
                <h3 className="text-3xl font-bold text-slate-900 mb-6">{project.builder}</h3>
                <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
                  <p>
                    {project.builder} is a distinguished name in real estate development, known for creating 
                    landmark projects that redefine modern living. With years of experience and a commitment 
                    to excellence, they have established themselves as a trusted developer.
                  </p>
                  <p>
                    Their portfolio showcases a perfect blend of innovative design, quality construction, 
                    and timely delivery, making them one of the most sought-after developers in the region.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 10. FINAL CONTACT SECTION */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Make This Your Home?
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Connect with our property experts for personalized assistance, site visits, and exclusive offers
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="bg-white text-blue-600 hover:bg-slate-100 px-12 py-7 text-lg rounded-xl shadow-2xl"
              >
                <Phone className="h-6 w-6 mr-3" />
                Book Site Visit
              </Button>
              <Button
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-12 py-7 text-lg rounded-xl"
              >
                <Mail className="h-6 w-6 mr-3" />
                Contact Property Advisor
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        projectName={project.name}
        city={cityName}
      />

      {/* Lightbox */}
      {showLightbox && lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 text-white hover:bg-white/10 p-3 rounded-full transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          
          <img
            src={lightboxImage}
            alt={project.name}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}

      {/* Sticky Bottom CTA (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t shadow-2xl p-4 z-30">
        <Button
          size="lg"
          onClick={() => setShowContactModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6"
        >
          <Phone className="h-5 w-5 mr-2" />
          Contact Now
        </Button>
      </div>
    </div>
  );
}
