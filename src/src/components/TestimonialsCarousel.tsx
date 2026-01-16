import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  city: string;
  message: string;
  createdAt: string;
}

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadTestimonials();
    
    // Listen for storage events to update testimonials in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'testimonials_data') {
        console.log('Testimonials updated in localStorage');
        loadTestimonials();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for updates (for same-tab updates)
    const intervalId = setInterval(loadTestimonials, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  const loadTestimonials = () => {
    // Read directly from localStorage with key 'testimonials_data'
    const existingData = localStorage.getItem('testimonials_data');
    console.log('Loading testimonials from localStorage:', existingData);
    const data = existingData ? JSON.parse(existingData) : [];
    console.log('Parsed testimonials:', data);
    setTestimonials(data);
    setIsLoading(false);
  };

  // Auto-scroll with pause functionality
  useEffect(() => {
    if (testimonials.length === 0 || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = container.scrollWidth / testimonials.length;
    
    const scrollToNext = () => {
      if (isPaused) return;
      
      const nextIndex = (currentIndex + 1) % testimonials.length;
      setCurrentIndex(nextIndex);
      
      container.scrollTo({
        left: cardWidth * nextIndex,
        behavior: 'smooth',
      });
    };

    // Pause for 3-4 seconds before moving to next
    const pauseDuration = 3500; // 3.5 seconds
    const intervalId = setInterval(scrollToNext, pauseDuration);

    return () => clearInterval(intervalId);
  }, [testimonials.length, currentIndex, isPaused]);

  // Handle manual scroll and pause auto-scroll
  const handleScroll = () => {
    setIsPaused(true);
    
    // Resume auto-scroll after 5 seconds of no interaction
    setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  if (testimonials.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            What Our Clients Say
          </h2>
          <p className="text-slate-600">Trusted by thousands of property buyers</p>
        </div>
        
        <div className="relative">
          {/* Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#3b82f6 #e2e8f0',
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-[90%] md:w-[45%] lg:w-[30%] snap-center"
              >
                <Card className="border border-slate-200 shadow-lg h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-blue-600 mb-3" />
                    <p className="text-slate-700 text-base mb-4 italic leading-relaxed line-clamp-4">
                      "{testimonial.message}"
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-base">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{testimonial.name}</p>
                        <p className="text-xs text-slate-600">{testimonial.city}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Scroll Indicators (Dots) */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  const container = scrollContainerRef.current;
                  if (container) {
                    const cardWidth = container.scrollWidth / testimonials.length;
                    container.scrollTo({
                      left: cardWidth * index,
                      behavior: 'smooth',
                    });
                  }
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-8 bg-blue-600' 
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .testimonials-container div::-webkit-scrollbar {
          height: 8px;
        }
        .testimonials-container div::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .testimonials-container div::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }
        .testimonials-container div::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}} />
    </section>
  );
}
