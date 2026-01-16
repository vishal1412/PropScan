import React from 'react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Comprehensive Property Search',
      description: 'Search through our extensive database of verified properties across Gurgaon, Noida, and Dubai. Filter by location, budget, size, and amenities to find properties that match your exact requirements.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
      reverse: false,
    },
    {
      number: '2',
      title: 'Side-by-Side Project Comparison',
      description: 'Compare up to 3 properties simultaneously with detailed metrics including pricing, location, amenities, possession dates, and payment plans. Make informed decisions with transparent data.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      reverse: true,
    },
    {
      number: '3',
      title: 'Detailed Project Intelligence',
      description: 'Access comprehensive project reports including developer track record, construction progress, legal clearances, and market analysis. Get complete transparency before you invest.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      reverse: false,
    },
    {
      number: '4',
      title: 'Expert Advisory Services',
      description: 'Connect with our experienced property consultants for personalized guidance. Get unbiased recommendations based on your investment goals and preferences. We prioritize your interests.',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop',
      reverse: true,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            How PropScan Intelligence Works
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our comprehensive platform guides you through every step of your property search journey
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${step.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
            >
              {/* Image Side */}
              <div className="flex-1">
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-[350px] object-cover"
                  />
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white font-bold text-xl w-12 h-12 flex items-center justify-center rounded-full shadow-lg">
                    {step.number}
                  </div>
                  <div className="bg-blue-600 text-white font-bold text-xl w-12 h-12 flex items-center justify-center rounded-full shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
