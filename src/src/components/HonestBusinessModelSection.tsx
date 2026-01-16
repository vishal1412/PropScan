import { CheckCircle2 } from 'lucide-react';

export default function HonestBusinessModelSection() {
  const commitments = [
    'Zero developer commissions',
    'Unbiased property recommendations',
    'Transparent fee structure',
    'Complete market disclosure',
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#0A2540] to-[#1E3A5F] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-4 py-1.5 rounded-full font-bold text-sm mb-6">
              100% Transparent
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Honest Business Model</h2>
          <p className="text-lg text-gray-300 mb-10">
            We operate on a transparent, fee-based advisory model without developer commissions,
            ensuring completely unbiased property recommendations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {commitments.map((commitment, index) => (
              <div key={index} className="flex items-center gap-3 text-left bg-white/5 backdrop-blur p-4 rounded-lg">
                <div className="bg-green-400/20 p-2 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                </div>
                <span className="text-base">{commitment}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
