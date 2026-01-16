import { DollarSign, BarChart3, Eye, Lightbulb } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export default function AboutUsSection() {
  const features = [
    {
      icon: DollarSign,
      title: 'No Hidden Commissions',
      description: 'Transparent pricing with zero developer commissions. Pay only for our advisory services.'
    },
    {
      icon: BarChart3,
      title: 'Data-Driven Analysis',
      description: 'Make decisions based on comprehensive market data and unbiased property comparisons.'
    },
    {
      icon: Eye,
      title: 'Complete Transparency',
      description: 'Full disclosure of property details, pricing, and market conditions with no hidden agenda.'
    },
    {
      icon: Lightbulb,
      title: 'Expert Advisory',
      description: 'Professional guidance from experienced consultants to help you make informed choices.'
    }
  ];

  return (
    <section id="why-trust" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Why Trust PropScan Intelligence?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We provide unbiased, data-backed property insights to help you make confident decisions
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border border-slate-200 hover:shadow-lg transition-all duration-300 group text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-lg mb-4 group-hover:bg-blue-100 transition-colors">
                      <Icon className="h-7 w-7 text-blue-600\" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
