import { Award, Users, FileCheck, Headphones } from 'lucide-react';

export default function WhyTrustSection() {
  const reasons = [
    {
      icon: Award,
      title: 'Verified Properties',
      description: 'Every property is thoroughly verified and authenticated before listing',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Experienced property advisors with deep market knowledge',
    },
    {
      icon: FileCheck,
      title: 'Legal Compliance',
      description: 'Complete legal documentation and compliance verification',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your queries',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* Top rounded image with cityscape */}
          <div className="flex justify-center mb-6">
            <div className="relative w-36 h-36 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=400&fit=crop" 
                alt="Trust" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
              <div className="absolute bottom-3 left-0 right-0 text-white font-bold text-lg">
                Trust
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-4">
            Why Trust PropScan Intelligence?
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            We've built our reputation on trust, transparency, and delivering exceptional results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-10">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-md">
                  <reason.icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {reason.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-slate-900 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
            Explore Property Intelligence
          </button>
        </div>
      </div>
    </section>
  );
}
