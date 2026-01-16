import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart3, Clock, Shield, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

export default function PropertyIntelligenceSection() {
  const features = [
    {
      icon: BarChart3,
      title: 'Structured Data',
      description: 'Comprehensive property data organized for easy and analysis',
    },
    {
      icon: TrendingUp,
      title: 'Market Comparisons',
      description: 'Side-by-side comparisons of properties with real-time market insights',
    },
    {
      icon: Clock,
      title: 'Delivery Timelines',
      description: 'Accurate project delivery schedules & construction progress tracking',
    },
    {
      icon: Shield,
      title: 'Risk Indicators',
      description: 'Transparent risk assessment and developer credibility verification',
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="intelligence" className="relative py-16 overflow-hidden bg-gradient-to-br from-[#0d1b3e] via-[#152548] to-[#0d1b3e]">
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Text */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white leading-tight">
            Make Informed Property Decisions
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">with </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBB040] via-[#f5a623] to-[#FBB040]">
              Data-Driven Intelligence
            </span>
          </h3>
          <p className="text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Compare, analyze, and de-risk property investments across Gurgaon, Noida, and Dubai using structured data, market intelligence, and unbiased insights.
          </p>
        </div>

        {/* 3D Isometric Map Illustration */}
        <div className="flex justify-center mb-10 relative">
          <div className="relative w-full max-w-xl h-48">
            {/* Isometric 3D Map Base */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ transform: 'perspective(800px) rotateX(30deg) rotateZ(-25deg)' }}>
                {/* Map surface */}
                <div className="relative w-72 h-40 bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-xl border border-blue-500/30 backdrop-blur-sm shadow-2xl">
                  {/* Grid lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#60A5FA" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#60A5FA" strokeWidth="0.5" />
                    <line x1="0" y1="75" x2="100" y2="75" stroke="#60A5FA" strokeWidth="0.5" />
                    <line x1="25" y1="0" x2="25" y2="100" stroke="#60A5FA" strokeWidth="0.5" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#60A5FA" strokeWidth="0.5" />
                    <line x1="75" y1="0" x2="75" y2="100" stroke="#60A5FA" strokeWidth="0.5" />
                  </svg>
                  
                  {/* Location pins */}
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/50"></div>
                  <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/50" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/50" style={{ animationDelay: '0.4s' }}></div>
                  <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" style={{ animationDelay: '0.5s' }}></div>
                  
                  {/* Magnifying glass */}
                  <div className="absolute -right-6 top-1/3" style={{ transform: 'rotateX(-30deg) rotateZ(25deg)' }}>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-3 border-blue-400 bg-blue-900/20 backdrop-blur-sm shadow-xl"></div>
                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-1 bg-blue-400 rounded-full" style={{ transform: 'rotate(45deg)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating data elements */}
            <div className="absolute top-2 left-8 text-blue-300/60 text-[10px] font-mono animate-pulse">
              5.1%
            </div>
            <div className="absolute top-4 right-12 text-blue-300/60 text-[10px] font-mono animate-pulse" style={{ animationDelay: '0.5s' }}>
              $1201
            </div>
            
            {/* Bar chart on left */}
            <div className="absolute left-0 top-1/4">
              <svg width="70" height="60" viewBox="0 0 100 80" className="opacity-40">
                <rect x="10" y="50" width="12" height="30" fill="#60A5FA" />
                <rect x="28" y="40" width="12" height="40" fill="#60A5FA" />
                <rect x="46" y="30" width="12" height="50" fill="#60A5FA" />
                <rect x="64" y="20" width="12" height="60" fill="#60A5FA" />
                <rect x="82" y="35" width="12" height="45" fill="#60A5FA" />
              </svg>
            </div>
            
            {/* Line chart on right */}
            <div className="absolute right-0 top-1/4">
              <svg width="90" height="60" viewBox="0 0 120 80" className="opacity-40">
                <polyline points="10,60 30,45 50,35 70,25 90,30" fill="none" stroke="#60A5FA" strokeWidth="2" />
                <circle cx="10" cy="60" r="3" fill="#60A5FA" />
                <circle cx="30" cy="45" r="3" fill="#60A5FA" />
                <circle cx="50" cy="35" r="3" fill="#60A5FA" />
                <circle cx="70" cy="25" r="3" fill="#60A5FA" />
                <circle cx="90" cy="30" r="3" fill="#60A5FA" />
              </svg>
            </div>
            
            {/* Pie chart indicator */}
            <div className="absolute top-8 right-24 opacity-30">
              <svg width="45" height="45" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="25" fill="none" stroke="#60A5FA" strokeWidth="2" />
                <path d="M30,30 L30,5 A25,25 0 0,1 50,40 Z" fill="#60A5FA" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 rounded-xl"
            >
              <CardHeader className="pb-2 pt-4">
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-3 rounded-lg backdrop-blur-sm">
                    <feature.icon className="h-7 w-7 text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-base font-bold text-white text-center">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <p className="text-slate-300 text-xs text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={() => scrollToSection('contact')}
            className="bg-gradient-to-r from-[#FBB040] to-[#f5a623] hover:from-[#f5a623] hover:to-[#FBB040] text-slate-900 font-semibold px-8 py-3 text-base rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Explore Property Intelligence
          </Button>
        </div>
      </div>
    </section>
  );
}
