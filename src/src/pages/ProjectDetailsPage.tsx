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
      {/* 1. CINEMATIC HERO SECTION - 80-90vh */}
      <section className="relative h-[90vh] min-h-[700px] overflow-hidden">
        {/* Background Image Slider with Enhanced Gradient */}
        <div className="absolute inset-0">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentHeroImage]}
                alt={project.name}
                className="w-full h-full object-cover transition-opacity duration-1000"
              />
              {/* Dramatic gradient overlay - top to bottom for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevHeroImage}
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white p-4 rounded-full transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={nextHeroImage}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white p-4 rounded-full transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                  
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentHeroImage(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentHeroImage ? 'bg-white w-14' : 'bg-white/50 w-10 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
            </div>
          )}
        </div>

        {/* Back Button with Glass Effect */}
        <button
          onClick={() => navigate({ to: `/city/${cityName}` })}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">Back to {cityDisplay}</span>
        </button>

        {/* Hero Content - Launch Banner Style */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-5xl">
              {/* Project Status Badge */}
              {project.projectStatus && (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full mb-8 font-bold text-sm tracking-wide uppercase shadow-lg">
                  {project.projectStatus}
                </div>
              )}
              
              {/* Project Name - SIGNIFICANTLY LARGER */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.95] tracking-tight">
                {project.name}
              </h1>
              
              {/* Location - Smaller, Elegant */}
              {project.location && (
                <div className="flex items-center gap-3 text-white/95 mb-4 text-lg md:text-xl">
                  <MapPin className="h-6 w-6" />
                  <span className="font-light">{project.location}, {cityDisplay}</span>
                </div>
              )}
              
              {/* Developer - Refined */}
              {project.builder && (
                <div className="flex items-center gap-3 text-white/90 mb-10 text-base md:text-lg">
                  <Building2 className="h-5 w-5" />
                  <span className="font-light">By {project.builder}</span>
                </div>
              )}

              {/* Price - Visually Highlighted Pill/Card */}
              {project.price && (
                <div className="inline-block bg-white/95 backdrop-blur-lg rounded-2xl px-10 py-6 mb-12 shadow-2xl">
                  <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-1">Starting From</p>
                  <p className="text-5xl md:text-6xl font-black text-slate-900">{project.price}</p>
                  {project.pricePerSqft && (
                    <p className="text-slate-600 font-medium mt-2">@ {project.pricePerSqft}</p>
                  )}
                </div>
              )}

              {/* Primary CTAs - Increased Padding & Glass Effect */}
              <div className="flex flex-wrap gap-5">
                <Button
                  size="lg"
                  onClick={() => setShowContactModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 text-white px-12 py-7 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-blue-600/50 transition-all duration-300"
                >
                  <Phone className="h-6 w-6 mr-3" />
                  Book Site Visit
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowContactModal(true)}
                  className="bg-white/95 hover:bg-white hover:-translate-y-1 text-slate-900 border-0 px-12 py-7 text-lg font-bold rounded-2xl shadow-2xl transition-all duration-300"
                >
                  <Mail className="h-6 w-6 mr-3" />
                  Enquire Now
                </Button>
                {project.brochurePath && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 hover:-translate-y-1 backdrop-blur-lg text-white border-white/30 px-12 py-7 text-lg font-bold rounded-2xl transition-all duration-300"
                  >
                    <Download className="h-6 w-6 mr-3" />
                    Download Brochure
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REFINED STICKY NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-md">
        <div className="container mx-auto px-6 lg:px-16">
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
                className={`relative px-10 py-6 text-base font-bold whitespace-nowrap transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT SECTIONS */}
      
      {/* 3. OVERVIEW SECTION - Storytelling Layout */}
      <section id="overview" className="py-28 bg-white scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-12">
              Overview
            </h2>
            {project.description && (
              <div className="space-y-8">
                {project.description.split('\n\n').map((paragraph, idx) => (
                  paragraph.trim() && (
                    <p key={idx} className="text-2xl text-slate-700 leading-relaxed font-light">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. PROJECT SNAPSHOT - Luxury Fact Panel */}
      <section id="snapshot" className="py-28 bg-slate-50 scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-16">
              Project Snapshot
            </h2>
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {project.landArea && (
                  <div className="p-10 md:p-12 hover:bg-white/50 transition-all duration-300">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Land Area</p>
                    <p className="text-3xl md:text-4xl font-black text-slate-900">{project.landArea}</p>
                  </div>
                )}
                {project.numberOfTowers && (
                  <div className="p-10 md:p-12 hover:bg-white/50 transition-all duration-300">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Number of Towers</p>
                    <p className="text-3xl md:text-4xl font-black text-slate-900">{project.numberOfTowers}</p>
                  </div>
                )}
                {project.numberOfFloors && (
                  <div className="p-10 md:p-12 hover:bg-white/50 transition-all duration-300">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Floors</p>
                    <p className="text-3xl md:text-4xl font-black text-slate-900">{project.numberOfFloors}</p>
                  </div>
                )}
                {project.size && (
                  <div className="p-10 md:p-12 hover:bg-white/50 transition-all duration-300">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Unit Sizes</p>
                    <p className="text-3xl md:text-4xl font-black text-slate-900">{project.size}</p>
                  </div>
                )}
                {project.configuration && (
                  <div className="p-10 md:p-12 hover:bg-white/50 transition-all duration-300">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Configurations</p>
                    <p className="text-3xl md:text-4xl font-black text-slate-900">{project.configuration}</p>
                  </div>
                )}
                {project.projectStatus && (
                  <div className="p-10 md:p-12 hover:bg-white/50 transition-all duration-300">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Project Status</p>
                    <p className="text-3xl md:text-4xl font-black text-slate-900">{project.projectStatus}</p>
                  </div>
                )}
                {project.possession && (
                  <div className="p-10 md:p-12 hover:bg-white/50 transition-all duration-300">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Possession</p>
                    <p className="text-3xl md:text-4xl font-black text-slate-900">{project.possession}</p>
                  </div>
                )}
                {project.rera && (
                  <div className="p-10 md:p-12 hover:bg-white/50 transition-all duration-300">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">RERA Number</p>
                    <p className="text-3xl md:text-4xl font-black text-slate-900">{project.rera}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HIGHLIGHTS SECTION - Aspirational Showcase */}
      {project.highlights && (
        <section id="highlights" className="py-28 bg-white scroll-mt-24">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-16 text-center">
                Project Highlights
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {project.highlights.split('\n').map((highlight, idx) => (
                  highlight.trim() && (
                    <div key={idx} className="flex flex-col items-center text-center gap-5 p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                        <CheckCircle className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-xl font-semibold text-slate-800 leading-relaxed">{highlight.replace(/^[✔✓•-]\s*/, '')}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Price & Payment Section - Premium CTA */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTI0IDI2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              Pricing & Payment Plans
            </h2>
            <p className="text-2xl text-slate-300 mb-16 font-light">
              Flexible payment options tailored to your needs
            </p>
            
            {project.price && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 md:p-16 mb-14 inline-block border border-white/20 shadow-2xl">
                <p className="text-slate-300 mb-4 text-lg uppercase tracking-wider font-bold">Starting From</p>
                <p className="text-7xl md:text-8xl font-black mb-4">{project.price}</p>
                {project.pricePerSqft && (
                  <p className="text-slate-300 text-xl font-medium">@ {project.pricePerSqft}</p>
                )}
              </div>
            )}

            {project.paymentPlan && (
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 md:p-12 mb-14 text-left max-w-3xl mx-auto border border-white/10">
                <h3 className="text-3xl font-black mb-8">Payment Plan</h3>
                <div className="space-y-4 text-slate-300">
                  {project.paymentPlan.split('\n').map((line, idx) => (
                    line.trim() && <p key={idx} className="text-xl leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-6 justify-center">
              <Button
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="bg-blue-600 hover:bg-blue-700 hover:-translate-y-2 hover:shadow-2xl text-white px-16 py-8 text-xl font-bold rounded-2xl shadow-xl transition-all duration-300"
              >
                Get Best Price
              </Button>
              {project.brochurePath && (
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 hover:-translate-y-2 backdrop-blur-lg text-white border-2 border-white/30 px-16 py-8 text-xl font-bold rounded-2xl transition-all duration-300"
                >
                  <Download className="h-6 w-6 mr-3" />
                  Download Brochure
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PLANS SECTION - Visual First with Captions */}
      <section id="plans" className="py-28 bg-white scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-20 text-center">
              Site & Floor Plans
            </h2>
            {images.length > 0 && (
              <div className="grid md:grid-cols-2 gap-12">
                {images.map((img, idx) => (
                  <div key={idx} className="group">
                    <div
                      className="relative aspect-[16/10] rounded-3xl overflow-hidden cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-500"
                      onClick={() => {
                        setLightboxImage(img);
                        setShowLightbox(true);
                      }}
                    >
                      <img src={img} alt={`Plan ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                          <span className="text-white text-xl font-bold">View Full Size</span>
                          <Maximize2 className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-slate-600 mt-6 text-lg font-medium">Plan {idx + 1}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. AMENITIES SECTION - World-Class Experience */}
      {amenities.length > 0 && (
        <section id="amenities" className="py-28 bg-slate-50 scroll-mt-24">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-20 text-center">
                World-Class Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-5 p-8 bg-white rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-200"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                      <Home className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-center text-slate-800 font-semibold text-lg">{amenity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mid-Page CTA - Emotional Appeal */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTI0IDI2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
              Your Dream Home Awaits
            </h3>
            <p className="text-2xl text-blue-100 mb-12 font-light leading-relaxed">
              Experience luxury living at its finest. Schedule a personalized site visit and discover why this is the perfect place to call home.
            </p>
            <Button
              size="lg"
              onClick={() => setShowContactModal(true)}
              className="bg-white text-blue-600 hover:bg-slate-50 hover:-translate-y-2 hover:shadow-2xl px-16 py-8 text-xl font-bold rounded-2xl shadow-xl transition-all duration-300"
            >
              <Phone className="h-6 w-6 mr-3" />
              Schedule Your Visit
            </Button>
          </div>
        </div>
      </section>

      {/* 8. LOCATION SECTION - Connectivity Experience */}
      <section id="location" className="py-28 bg-white scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-12 text-center">
              Prime Location
            </h2>
            {project.location && (
              <p className="text-3xl text-slate-700 mb-16 text-center font-light">
                {project.location}, {cityDisplay}
              </p>
            )}
            <div className="aspect-[21/9] bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl overflow-hidden mb-14 shadow-2xl border border-slate-300">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-12">
                  <MapPin className="h-20 w-20 text-slate-400 mx-auto mb-6" />
                  <p className="text-slate-500 text-xl font-medium">Interactive map integration</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-12 md:p-16 border border-slate-200 shadow-xl">
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-8">Location Advantages</h3>
              <div className="space-y-6">
                <p className="text-2xl text-slate-700 leading-relaxed font-light">
                  Strategically positioned in {project.location}, this premium development offers unparalleled connectivity 
                  to major business districts, entertainment zones, and key infrastructure.
                </p>
                <p className="text-2xl text-slate-700 leading-relaxed font-light">
                  Experience the perfect harmony of urban convenience and serene living, with easy access to highways, 
                  metro stations, and essential amenities right at your doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ABOUT THE DEVELOPER - Brand Story */}
      {project.builder && (
        <section className="py-28 bg-slate-50">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-20 text-center">
                About the Developer
              </h2>
              <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl p-12 md:p-20 border border-slate-200">
                <div className="mb-10">
                  <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">{project.builder}</h3>
                  <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
                </div>
                <div className="space-y-8 text-slate-700">
                  <p className="text-2xl leading-relaxed font-light">
                    {project.builder} stands as a distinguished name in real estate development, renowned for creating 
                    architectural masterpieces that redefine contemporary living standards.
                  </p>
                  <p className="text-2xl leading-relaxed font-light">
                    With decades of expertise and an unwavering commitment to excellence, they have established 
                    themselves as industry leaders, delivering projects that seamlessly blend innovation, quality, 
                    and timely execution.
                  </p>
                  <p className="text-2xl leading-relaxed font-light">
                    Their distinguished portfolio showcases a legacy of trust, making them one of the most 
                    sought-after developers in the premium real estate sector.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 10. FINAL CONTACT SECTION - Premium CTA */}
      <section id="contact" className="py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white scroll-mt-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTI0IDI2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-10 leading-tight">
              Ready to Make This Your Home?
            </h2>
            <p className="text-2xl text-blue-100 mb-16 font-light leading-relaxed">
              Connect with our property experts for personalized assistance, exclusive offers, and priority access to site visits
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="bg-white text-blue-600 hover:bg-slate-50 hover:-translate-y-2 hover:shadow-2xl px-16 py-8 text-xl font-bold rounded-2xl shadow-xl transition-all duration-300"
              >
                <Phone className="h-6 w-6 mr-3" />
                Book Site Visit
              </Button>
              <Button
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="bg-white/10 hover:bg-white/20 hover:-translate-y-2 backdrop-blur-lg text-white border-2 border-white/30 px-16 py-8 text-xl font-bold rounded-2xl transition-all duration-300"
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

      {/* Sticky Bottom CTA (Mobile) - Premium Styling */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl p-5 z-30">
        <Button
          size="lg"
          onClick={() => setShowContactModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 hover:shadow-xl text-white font-bold py-7 rounded-xl transition-all duration-300"
        >
          <Phone className="h-6 w-6 mr-2" />
          Contact Now
        </Button>
      </div>
    </div>
  );
}
