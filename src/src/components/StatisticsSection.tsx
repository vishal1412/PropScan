import { useEffect, useState } from 'react';
import { Database, BarChart3, TrendingUp, Clock } from 'lucide-react';

export default function StatisticsSection() {
  const stats = [
    { icon: Database, label: 'Projects Scanned', value: 5000, suffix: '+' },
    { icon: BarChart3, label: 'Projects Analyzed', value: 590, suffix: '+' },
    { icon: TrendingUp, label: 'Comparisons Made', value: 15000, suffix: '+' },
    { icon: Clock, label: 'Response Time', value: 24, suffix: ' Hrs' },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#0A2540] to-[#1E3A5F]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Trusted by Property Seekers Across Markets
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-full mb-4">
                <stat.icon className="h-8 w-8 text-blue-300" />
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-gray-300 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-4xl font-bold text-white">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}
