import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from './ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export default function LocationSelector() {
  const navigate = useNavigate();

  const locations = [
    {
      name: 'Gurgaon',
      count: '84 projects',
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop',
      path: '/city/gurgaon',
    },
    {
      name: 'Noida',
      count: '62 projects',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
      path: '/city/noida',
    },
    {
      name: 'Dubai',
      count: '124 projects',
      image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop',
      path: '/city/dubai',
    },
  ];

  return (
    <section id="cities" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {locations.map((location) => (
            <Card
              key={location.name}
              className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border border-slate-200 rounded-lg"
              onClick={() => navigate({ to: location.path })}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{location.name}</h3>
                  <p className="text-white/80 text-sm">{location.count}</p>
                </div>
              </div>
              <CardContent className="p-4 bg-white">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: location.path });
                  }}
                >
                  View Projects
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
