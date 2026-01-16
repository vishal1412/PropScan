import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Search, GitCompare } from 'lucide-react';

export default function FinalCTASection() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#0A2540] to-[#1E3A5F] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Make an Informed Property Decision?
          </h2>
          <p className="text-lg text-gray-300 mb-10">
            Start exploring properties with data-backed insights and expert guidance today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 h-12 rounded-full"
              onClick={() => navigate({ to: '/city/gurgaon' })}
            >
              Browse Properties
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 h-12 rounded-full"
              onClick={() => navigate({ to: '/city/gurgaon' })}
            >
              Compare Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
