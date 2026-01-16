import { Button } from './ui/button';

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          alt="City Skyline"
          className="w-full h-full object-cover"
        />
        {/* Dark blue overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2540]/90 via-[#1E3A5F]/85 to-[#0A2540]/90"></div>
        
        {/* Data visualization overlay effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/4 w-40 h-32 border-2 border-yellow-400 rounded-lg animate-pulse"></div>
          <div className="absolute top-40 right-1/4 w-32 h-32 border-2 border-blue-400 rounded-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-36 h-24 border-2 border-orange-400 rounded-lg animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Make Informed Property Decisions
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              with Data-Driven Intelligence
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-10">
            Compare properties across Gurgaon, Noida, and Dubai with transparent insights,
            comprehensive market intelligence, and unbiased expert advisory.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => scrollToSection('cities')}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white h-14 px-10 text-lg font-semibold rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300"
            >
              Explore Properties
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
