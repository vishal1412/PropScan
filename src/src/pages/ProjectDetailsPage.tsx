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
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium text-sm">{cityDisplay}</span>
        </button>

        {/* Hero Content - Refined & Calm */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-5xl space-y-6">
              {/* Project Status Badge */}
              {project.projectStatus && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/90 text-white rounded-full text-xs font-medium tracking-wide uppercase">
                  {project.projectStatus}
                </div>
              )}
              
              {/* Project Name - 40-44px, weight 500-600 */}
              <h1 className="text-[2.5rem] md:text-[2.75rem] font-semibold text-white leading-[1.15] tracking-tight">
                {project.name}
              </h1>
              
              {/* Location - Elegant, muted */}
              {project.location && (
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span className="font-normal">{project.location}, {cityDisplay}</span>
                </div>
              )}
              
              {/* Developer - Refined */}
              {project.builder && (
                <div className="flex items-center gap-2 text-white/75 text-sm">
                  <Building2 className="h-4 w-4" />
                  <span className="font-normal">By {project.builder}</span>
                </div>
              )}

              {/* Price - Subtle Card */}
              {project.price && (
                <div className="inline-block bg-white/95 backdrop-blur-lg rounded-xl px-8 py-4 mt-2 shadow-lg">
                  <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider mb-1">Starting From</p>
                  <p className="text-3xl font-semibold text-slate-900 tracking-tight">{project.price}</p>
                  {project.pricePerSqft && (
                    <p className="text-slate-600 text-xs font-normal mt-1">@ {project.pricePerSqft}</p>
                  )}
                </div>
              )}

              {/* Primary CTAs - Refined & Inviting */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  size="lg"
                  onClick={() => setShowContactModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Book Site Visit
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowContactModal(true)}
                  className="bg-white/95 hover:bg-white text-slate-900 border-0 px-8 py-5 text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enquire Now
                </Button>
                {project.brochurePath && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white border-white/30 px-8 py-5 text-sm font-medium rounded-lg transition-all duration-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Brochure
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REFINED STICKY NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
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
                className={`relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT SECTIONS */}
      
      {/* 3. OVERVIEW SECTION - Storytelling Layout */}
      <section id="overview" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-medium text-slate-900 mb-8 tracking-tight">
              Overview
            </h2>
            {project.description && (
              <div className="space-y-6">
                {project.description.split('\n\n').map((paragraph, idx) => (
                  paragraph.trim() && (
                    <p key={idx} className="text-[15px] text-slate-600 leading-[1.7] font-normal">
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
      <section id="snapshot" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-medium text-slate-900 mb-10 tracking-tight">
              Project Snapshot
            </h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200/60">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/60">
                {project.landArea && (
                  <div className="p-8 hover:bg-slate-50/50 transition-colors duration-200">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Land Area</p>
                    <p className="text-xl font-medium text-slate-900">{project.landArea}</p>
                  </div>
                )}
                {project.numberOfTowers && (
                  <div className="p-8 hover:bg-slate-50/50 transition-colors duration-200">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Number of Towers</p>
                    <p className="text-xl font-medium text-slate-900">{project.numberOfTowers}</p>
                  </div>
                )}
                {project.numberOfFloors && (
                  <div className="p-8 hover:bg-slate-50/50 transition-colors duration-200">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Floors</p>
                    <p className="text-xl font-medium text-slate-900">{project.numberOfFloors}</p>
                  </div>
                )}
                {project.size && (
                  <div className="p-8 hover:bg-slate-50/50 transition-colors duration-200">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Unit Sizes</p>
                    <p className="text-xl font-medium text-slate-900">{project.size}</p>
                  </div>
                )}
                {project.configuration && (
                  <div className="p-8 hover:bg-slate-50/50 transition-colors duration-200">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Configurations</p>
                    <p className="text-xl font-medium text-slate-900">{project.configuration}</p>
                  </div>
                )}
                {project.projectStatus && (
                  <div className="p-8 hover:bg-slate-50/50 transition-colors duration-200">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Project Status</p>
                    <p className="text-xl font-medium text-slate-900">{project.projectStatus}</p>
                  </div>
                )}
                {project.possession && (
                  <div className="p-8 hover:bg-slate-50/50 transition-colors duration-200">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Possession</p>
                    <p className="text-xl font-medium text-slate-900">{project.possession}</p>
                  </div>
                )}
                {project.rera && (
                  <div className="p-8 hover:bg-slate-50/50 transition-colors duration-200">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">RERA Number</p>
                    <p className="text-xl font-medium text-slate-900">{project.rera}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HIGHLIGHTS SECTION - Aspirational Showcase */}
      {project.highlights && (
        <section id="highlights" className="py-20 bg-white scroll-mt-24">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-medium text-slate-900 mb-10 tracking-tight text-center">
                Project Highlights
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.highlights.split('\n').map((highlight, idx) => (
                  highlight.trim() && (
                    <div key={idx} className="flex items-start gap-4 p-6 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:shadow-md hover:bg-white transition-all duration-200">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-[15px] font-normal text-slate-700 leading-relaxed">{highlight.replace(/^[✔✓•-]\s*/, '')}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Price & Payment Section - Premium CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTI0IDI2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] " />
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-medium mb-6">
              Pricing & Payment Plans
            </h2>
            <p className="text-base text-slate-300 mb-12 font-normal leading-relaxed">
              Flexible payment options tailored to your needs
            </p>
            
            {project.price && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-10 mb-10 inline-block border border-white/10 shadow-lg">
                <p className="text-slate-300 mb-2 text-[10px] uppercase tracking-wider font-medium">Starting From</p>
                <p className="text-5xl font-semibold mb-2">{project.price}</p>
                {project.pricePerSqft && (
                  <p className="text-slate-300 text-sm font-normal">@ {project.pricePerSqft}</p>
                )}
              </div>
            )}

            {project.paymentPlan && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-10 text-left max-w-2xl mx-auto border border-white/5">
                <h3 className="text-lg font-medium mb-6">Payment Plan</h3>
                <div className="space-y-3 text-slate-300">
                  {project.paymentPlan.split('\n').map((line, idx) => (
                    line.trim() && <p key={idx} className="text-sm leading-relaxed font-normal">{line}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 text-sm font-medium rounded-lg shadow-lg transition-all duration-200"
              >
                Get Best Price
              </Button>
              {project.brochurePath && (
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white border border-white/20 px-10 py-5 text-sm font-medium rounded-lg transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PLANS SECTION - Visual First with Captions */}
      <section id="plans" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-medium text-slate-900 mb-12 text-center tracking-tight">
              Site & Floor Plans
            </h2>
            {images.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8">
                {images.map((img, idx) => (
                  <div key={idx} className="group">
                    <div
                      className="relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                      onClick={() => {
                        setLightboxImage(img);
                        setShowLightbox(true);
                      }}
                    >
                      <img src={img} alt={`Plan ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <span className="text-white text-sm font-medium">View Full Size</span>
                          <Maximize2 className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-slate-500 mt-3 text-sm font-normal">Plan {idx + 1}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. AMENITIES SECTION - World-Class Experience */}
      {amenities.length > 0 && (
        <section id="amenities" className="py-20 bg-slate-50 scroll-mt-24">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-medium text-slate-900 mb-12 text-center tracking-tight">
                World-Class Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-3 p-5 bg-white rounded-lg hover:shadow-md transition-all duration-200 border border-slate-200/60"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center">
                      <Home className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-center text-slate-700 font-normal text-sm">{amenity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mid-Page CTA - Emotional Appeal */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTI0IDI2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] " />
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-medium text-white mb-5 leading-tight">
              Your Dream Home Awaits
            </h3>
            <p className="text-base text-blue-100 mb-8 font-normal leading-relaxed">
              Experience luxury living at its finest. Schedule a personalized site visit and discover why this is the perfect place to call home.
            </p>
            <Button
              size="lg"
              onClick={() => setShowContactModal(true)}
              className="bg-white text-blue-600 hover:bg-slate-50 px-10 py-5 text-sm font-medium rounded-lg shadow-lg transition-all duration-200"
            >
              <Phone className="h-4 w-4 mr-2" />
              Schedule Your Visit
            </Button>
          </div>
        </div>
      </section>

      {/* 8. LOCATION SECTION - Connectivity Experience */}
      <section id="location" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-medium text-slate-900 mb-8 text-center tracking-tight">
              Prime Location
            </h2>
            {project.location && (
              <p className="text-lg text-slate-600 mb-10 text-center font-normal">
                {project.location}, {cityDisplay}
              </p>
            )}
            <div className="aspect-[21/9] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden mb-10 shadow-sm border border-slate-200/60">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-normal">Interactive map integration</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-8 md:p-10 border border-slate-200/60">
              <h3 className="text-lg font-medium text-slate-900 mb-5">Location Advantages</h3>
              <div className="space-y-4">
                <p className="text-[15px] text-slate-600 leading-[1.7] font-normal">
                  Strategically positioned in {project.location}, this premium development offers unparalleled connectivity 
                  to major business districts, entertainment zones, and key infrastructure.
                </p>
                <p className="text-[15px] text-slate-600 leading-[1.7] font-normal">
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
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-medium text-slate-900 mb-12 text-center tracking-tight">
                About the Developer
              </h2>
              <div className="bg-white rounded-xl shadow-sm p-10 md:p-12 border border-slate-200/60">
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-slate-900 mb-3">{project.builder}</h3>
                  <div className="w-16 h-0.5 bg-blue-600 rounded-full" />
                </div>
                <div className="space-y-5 text-slate-600">
                  <p className="text-[15px] leading-[1.7] font-normal">
                    {project.builder} stands as a distinguished name in real estate development, renowned for creating 
                    architectural masterpieces that redefine contemporary living standards.
                  </p>
                  <p className="text-[15px] leading-[1.7] font-normal">
                    With decades of expertise and an unwavering commitment to excellence, they have established 
                    themselves as industry leaders, delivering projects that seamlessly blend innovation, quality, 
                    and timely execution.
                  </p>
                  <p className="text-[15px] leading-[1.7] font-normal">
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
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white scroll-mt-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTI0IDI2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] " />
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-medium mb-6 leading-tight">
              Ready to Make This Your Home?
            </h2>
            <p className="text-base text-blue-100 mb-10 font-normal leading-relaxed">
              Connect with our property experts for personalized assistance, exclusive offers, and priority access to site visits
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="bg-white text-blue-600 hover:bg-slate-50 px-10 py-5 text-sm font-medium rounded-lg shadow-lg transition-all duration-200"
              >
                <Phone className="h-4 w-4 mr-2" />
                Book Site Visit
              </Button>
              <Button
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white border border-white/20 px-10 py-5 text-sm font-medium rounded-lg transition-all duration-200"
              >
                <Mail className="h-4 w-4 mr-2" />
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
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200/60 shadow-lg p-4 z-30">
        <Button
          size="lg"
          onClick={() => setShowContactModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-5 rounded-lg transition-all duration-200"
        >
          <Phone className="h-4 w-4 mr-2" />
          Contact Now
        </Button>
      </div>
    </div>
  );
}
