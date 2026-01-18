import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, MapPin, Building2, Calendar, Phone, Mail, Download, ChevronLeft, ChevronRight, X, Home, Users, CheckCircle, Maximize2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import ContactModal from '../components/ContactModal';
import GoogleMap from '../components/GoogleMap';
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
      const sections = ['overview', 'snapshot', 'highlights', 'plans', 'amenities', 'floor-plans', 'construction-updates', 'location', 'contact'];
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

        {/* Back Button - Subtle */}
        <button
          onClick={() => navigate({ to: `/city/${cityName}` })}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white rounded-lg transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-normal text-sm">{cityDisplay}</span>
        </button>

        {/* Hero Content - Composed & Signature */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-4xl">
              {/* Glass Effect Background */}
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 md:p-10">
                {/* Project Status Badge */}
                {project.projectStatus && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-900/80 text-white rounded-full text-xs font-medium tracking-wide uppercase mb-6">
                    {project.projectStatus}
                  </div>
                )}
                
                {/* Project Name - Playfair Display, 42-44px, weight 500 */}
                <h1 className="font-serif text-[2.625rem] md:text-[2.75rem] font-medium text-white leading-[1.15] tracking-tight mb-8">
                  {project.name}
                </h1>
                
                {/* Elegant Subline */}
                {project.location && (
                  <p className="text-white/90 text-base font-normal mb-8 leading-relaxed">
                    An exclusive residential enclave in {project.location}, {cityDisplay}
                  </p>
                )}
                
                {/* Developer - Refined */}
                {project.builder && (
                  <div className="flex items-center gap-2 text-white/75 text-sm mb-10">
                    <Building2 className="h-4 w-4" />
                    <span className="font-normal">By {project.builder}</span>
                  </div>
                )}

                {/* Price Card - Elevated */}
                {project.price && (
                  <div className="inline-block bg-white rounded-xl px-8 py-5 mb-10 shadow-lg">
                    <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider mb-1">Starting From</p>
                    <p className="text-[2rem] font-medium text-slate-900 tracking-tight">{project.price}</p>
                    {project.pricePerSqft && (
                      <p className="text-slate-600 text-xs font-normal mt-1">@ {project.pricePerSqft}</p>
                    )}
                  </div>
                )}

                {/* Primary CTAs - Composed, Not Demanding */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    onClick={() => setShowContactModal(true)}
                    className="bg-blue-900 hover:bg-blue-950 text-white px-8 py-4 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule a Private Site Visit
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setShowContactModal(true)}
                    className="bg-white hover:bg-slate-50 text-slate-900 border-0 px-8 py-4 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Speak with a Consultant
                  </Button>
                  {project.brochurePath && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 text-sm font-medium rounded-lg transition-all duration-200"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Brochure
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REFINED STICKY NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'snapshot', label: 'Snapshot' },
              { id: 'highlights', label: 'Highlights' },
              { id: 'plans', label: 'Plans' },
              { id: 'amenities', label: 'Amenities' },
              ...(project.floorPlans && project.floorPlans.length > 0 ? [{ id: 'floor-plans', label: 'Floor Plans' }] : []),
              ...(project.constructionUpdates && project.constructionUpdates.length > 0 ? [{ id: 'construction-updates', label: 'Progress' }] : []),
              { id: 'location', label: 'Location' },
              { id: 'contact', label: 'Contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeSection === item.id
                    ? 'text-blue-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT SECTIONS */}
      
      {/* 3. OVERVIEW SECTION - Brochure Tone */}
      <section id="overview" className="py-24 bg-white scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-medium text-slate-900 mb-10 tracking-tight">
              Overview
            </h2>
            {project.description ? (
              <div className="space-y-6">
                {project.description.split('\n\n').map((paragraph, idx) => (
                  paragraph.trim() && (
                    <p key={idx} className="text-[15px] text-slate-700 leading-[1.75] font-normal">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-[15px] text-slate-700 leading-[1.75] font-normal">
                  {project.name} is a thoughtfully planned residential development that brings together contemporary architecture, expansive open spaces, and refined living experiences.
                </p>
                <p className="text-[15px] text-slate-700 leading-[1.75] font-normal">
                  Designed for discerning homeowners, the project offers spacious residences complemented by world-class amenities and seamless connectivity, creating a lifestyle that balances comfort, privacy, and sophistication.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. PROJECT SNAPSHOT - Brochure Style */}
      <section id="snapshot" className="py-24 bg-slate-50/50 scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-2xl font-medium text-slate-900 mb-12 tracking-tight">
              Project at a Glance
            </h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
              <div className="divide-y divide-slate-200">
                <div className="grid md:grid-cols-2 divide-x divide-slate-200">
                  {project.landArea && (
                    <div className="px-10 py-8">
                      <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-2">Land Area</p>
                      <p className="text-lg font-medium text-slate-900">{project.landArea}</p>
                    </div>
                  )}
                  {project.numberOfTowers && (
                    <div className="px-10 py-8">
                      <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-2">Number of Towers</p>
                      <p className="text-lg font-medium text-slate-900">{project.numberOfTowers}</p>
                    </div>
                  )}
                </div>
                <div className="grid md:grid-cols-2 divide-x divide-slate-200">
                  {project.numberOfFloors && (
                    <div className="px-10 py-8">
                      <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-2">Floors</p>
                      <p className="text-lg font-medium text-slate-900">{project.numberOfFloors}</p>
                    </div>
                  )}
                  {project.size && (
                    <div className="px-10 py-8">
                      <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-2">Unit Sizes</p>
                      <p className="text-lg font-medium text-slate-900">{project.size}</p>
                    </div>
                  )}
                </div>
                <div className="grid md:grid-cols-2 divide-x divide-slate-200">
                  {project.configuration && (
                    <div className="px-10 py-8">
                      <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-2">Configurations</p>
                      <p className="text-lg font-medium text-slate-900">{project.configuration}</p>
                    </div>
                  )}
                  {project.projectStatus && (
                    <div className="px-10 py-8">
                      <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-2">Project Status</p>
                      <p className="text-lg font-medium text-slate-900">{project.projectStatus}</p>
                    </div>
                  )}
                </div>
                <div className="grid md:grid-cols-2 divide-x divide-slate-200">
                  {project.possession && (
                    <div className="px-10 py-8">
                      <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-2">Possession</p>
                      <p className="text-lg font-medium text-slate-900">{project.possession}</p>
                    </div>
                  )}
                  {project.rera && (
                    <div className="px-10 py-8">
                      <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-2">RERA Number</p>
                      <p className="text-lg font-medium text-slate-900">{project.rera}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HIGHLIGHTS SECTION - Breathable Grid */}
      {project.highlights && (
        <section id="highlights" className="py-24 bg-white scroll-mt-24">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-2xl font-medium text-slate-900 mb-12 tracking-tight text-center">
                Project Highlights
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {project.highlights.split('\n').map((highlight, idx) => (
                  highlight.trim() && (
                    <div key={idx} className="flex items-start gap-4 p-6 rounded-lg bg-slate-50/50 border border-slate-200 hover:bg-white transition-all duration-200">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-900/10 flex items-center justify-center mt-1">
                        <CheckCircle className="h-4 w-4 text-blue-900" />
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

      {/* Price & Payment Section - Confident, Transparent */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTI0IDI2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] " />
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-medium mb-6">
              Pricing & Payment Plans
            </h2>
            <p className="text-base text-slate-300 mb-14 font-normal leading-relaxed max-w-2xl mx-auto">
              Transparent pricing and flexible payment structures, thoughtfully designed to suit your investment preferences.
            </p>
            
            {project.price && (
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-10 mb-12 inline-block border border-white/10">
                <p className="text-slate-400 mb-2 text-xs uppercase tracking-wider font-medium">Starting From</p>
                <p className="text-5xl font-medium mb-2">{project.price}</p>
                {project.pricePerSqft && (
                  <p className="text-slate-300 text-sm font-normal">@ {project.pricePerSqft}</p>
                )}
              </div>
            )}

            {project.paymentPlan && (
              <div className="bg-white/5 rounded-xl p-8 mb-12 text-left max-w-2xl mx-auto">
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
                className="bg-blue-900 hover:bg-blue-950 text-white px-10 py-4 text-sm font-medium rounded-lg shadow-md transition-all duration-200"
              >
                Get Best Price
              </Button>
              {project.brochurePath && (
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md text-white border border-white/20 px-10 py-4 text-sm font-medium rounded-lg transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PLANS SECTION - Thoughtfully Designed Layouts */}
      <section id="plans" className="py-24 bg-slate-50/50 scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-2xl font-medium text-slate-900 mb-6 text-center tracking-tight">
              Site & Floor Plans
            </h2>
            <p className="text-[15px] text-slate-600 mb-12 text-center font-normal max-w-2xl mx-auto">
              Explore thoughtfully designed layouts that maximize space, light, and functionality.
            </p>
            {images.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8">
                {images.map((img, idx) => (
                  <div key={idx} className="group">
                    <div
                      className="relative aspect-[16/10] rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                      onClick={() => {
                        setLightboxImage(img);
                        setShowLightbox(true);
                      }}
                    >
                      <img src={img} alt={`Plan ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

      {/* 7. AMENITIES SECTION - Curated Lifestyle */}
      {amenities.length > 0 && (
        <section id="amenities" className="py-24 bg-white scroll-mt-24">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-2xl font-medium text-slate-900 mb-12 text-center tracking-tight">
                Carefully Curated Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-3 p-5 bg-slate-50/50 rounded-lg hover:bg-white transition-all duration-200 border border-slate-200"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-900/10 flex items-center justify-center">
                      <Home className="h-5 w-5 text-blue-900" />
                    </div>
                    <p className="text-center text-slate-700 font-normal text-sm">{amenity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FLOOR PLANS SECTION - If available from extraction */}
      {project.floorPlans && project.floorPlans.length > 0 && (
        <section id="floor-plans" className="py-24 bg-white scroll-mt-24">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-2xl font-medium text-slate-900 mb-12 text-center tracking-tight">
                Floor Plans
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.floorPlans.map((plan) => (
                  <div key={plan.id} className="bg-slate-50/50 rounded-lg overflow-hidden border border-slate-200 hover:shadow-md transition-all">
                    <div className="aspect-[4/3] bg-slate-100 relative">
                      <img 
                        src={plan.image} 
                        alt={plan.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZsb29yIFBsYW48L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-slate-900 mb-2">{plan.title}</h3>
                      {plan.size && (
                        <p className="text-sm text-slate-600 mb-2">Size: {plan.size}</p>
                      )}
                      {plan.description && (
                        <p className="text-sm text-slate-700 leading-relaxed">{plan.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONSTRUCTION UPDATES SECTION - If available */}
      {project.constructionUpdates && project.constructionUpdates.length > 0 && (
        <section id="construction-updates" className="py-24 bg-slate-50/50 scroll-mt-24">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-serif text-2xl font-medium text-slate-900 mb-12 text-center tracking-tight">
                Construction Progress
              </h2>
              <div className="space-y-8">
                {project.constructionUpdates.map((update) => (
                  <div key={update.id} className="bg-white rounded-lg p-8 border border-slate-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-medium text-slate-900 mb-2">{update.title}</h3>
                        <p className="text-sm text-slate-500">{new Date(update.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      {update.progress && (
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-medium text-blue-900">{update.progress}%</div>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-4">{update.description}</p>
                    {update.images && update.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {update.images.map((img, idx) => (
                          <img 
                            key={idx}
                            src={img} 
                            alt={`Construction update ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                            onClick={() => {
                              setLightboxImage(img);
                              setShowLightbox(true);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mid-Page CTA - Aspirational Tone */}
      <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTI0IDI2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] " />
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-serif text-3xl font-medium text-white mb-6 leading-tight">
              Discover a Lifestyle You'll Love
            </h3>
            <p className="text-base text-slate-300 mb-10 font-normal leading-relaxed">
              Experience thoughtfully designed living spaces, world-class amenities, and a community built around sophistication and comfort.
            </p>
            <Button
              size="lg"
              onClick={() => setShowContactModal(true)}
              className="bg-white text-slate-900 hover:bg-slate-50 px-10 py-4 text-sm font-medium rounded-lg shadow-md transition-all duration-200"
            >
              <Phone className="h-4 w-4 mr-2" />
              Schedule a Private Site Visit
            </Button>
          </div>
        </div>
      </section>

      {/* 8. LOCATION SECTION - Strategic Connectivity */}
      <section id="location" className="py-24 bg-slate-50/50 scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-2xl font-medium text-slate-900 mb-8 text-center tracking-tight">
              Prime Location
            </h2>
            {project.location && (
              <p className="text-base text-slate-600 mb-12 text-center font-normal">
                {project.location}, {cityDisplay}
              </p>
            )}
            
            {/* Live Google Maps Integration */}
            {project.latitude && project.longitude ? (
              <div className="mb-10">
                <GoogleMap
                  latitude={project.latitude}
                  longitude={project.longitude}
                  projectName={project.name}
                  locationDescription={`${project.location}, ${cityDisplay}`}
                  zoom={15}
                  height="450px"
                />
              </div>
            ) : (
              <div className="aspect-[21/9] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden mb-10 shadow-sm border border-slate-200">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-normal">Map location not available</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg p-10 border border-slate-200">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Location Advantages</h3>
              <div className="space-y-5">
                <p className="text-[15px] text-slate-700 leading-[1.75] font-normal">
                  Strategically located in {project.location}, {cityDisplay}, {project.name} enjoys excellent connectivity to major business hubs, social infrastructure, and arterial road networks—making everyday living both convenient and well-connected.
                </p>
                <p className="text-[15px] text-slate-700 leading-[1.75] font-normal">
                  Experience the perfect balance of accessibility and tranquility, with seamless connections to key destinations while enjoying the peace of a thoughtfully planned residential environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ABOUT THE DEVELOPER - Brand Elevation */}
      {project.builder && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-2xl font-medium text-slate-900 mb-14 text-center tracking-tight">
                About the Developer
              </h2>
              <div className="bg-slate-50/50 rounded-lg p-10 md:p-12 border border-slate-200">
                <div className="mb-8">
                  <h3 className="text-xl font-medium text-slate-900 mb-4">{project.builder}</h3>
                  <div className="w-20 h-0.5 bg-blue-900 rounded-full" />
                </div>
                <div className="space-y-6 text-slate-700">
                  <p className="text-[15px] leading-[1.75] font-normal">
                    {project.builder} is committed to creating residential environments that reflect quality, integrity, and thoughtful design. With a focus on long-term value and customer trust, the brand has consistently delivered projects that stand the test of time—both in construction excellence and lifestyle appeal.
                  </p>
                  <p className="text-[15px] leading-[1.75] font-normal">
                    Every project is conceived with meticulous attention to detail, ensuring that residents experience not just a home, but a refined way of living that resonates with their aspirations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 10. FINAL CONTACT SECTION - Reassuring Tone */}
      <section id="contact" className="py-24 bg-slate-50/50 text-slate-900 scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-medium mb-6 leading-tight">
              We're Here to Assist You
            </h2>
            <p className="text-base text-slate-600 mb-12 font-normal leading-relaxed max-w-2xl mx-auto">
              Our property consultants are available to answer your questions, arrange site visits, and guide you through your investment journey.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="bg-blue-900 hover:bg-blue-950 text-white px-10 py-4 text-sm font-medium rounded-lg shadow-md transition-all duration-200"
              >
                <Phone className="h-4 w-4 mr-2" />
                Schedule a Private Site Visit
              </Button>
              <Button
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 px-10 py-4 text-sm font-medium rounded-lg transition-all duration-200"
              >
                <Mail className="h-4 w-4 mr-2" />
                Speak with a Consultant
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

      {/* Sticky Bottom CTA (Mobile) - Composed */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg p-4 z-30">
        <Button
          size="lg"
          onClick={() => setShowContactModal(true)}
          className="w-full bg-blue-900 hover:bg-blue-950 text-white font-medium py-4 rounded-lg transition-all duration-200"
        >
          <Phone className="h-4 w-4 mr-2" />
          Contact Now
        </Button>
      </div>
    </div>
  );
}
