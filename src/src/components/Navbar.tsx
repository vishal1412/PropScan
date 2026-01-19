import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => navigate({ to: '/' })}
            className="flex items-center cursor-pointer"
          >
            <h1 className="text-xl font-bold text-slate-900">PropScan Intelligence</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate({ to: '/' })}
              className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
            >
              Home
            </button>
            
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
            >
              How It Works
            </button>

            <button
              onClick={() => navigate({ to: '/resale-properties' })}
              className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
            >
              Resale Properties
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-blue-600 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button
              onClick={() => {
                navigate({ to: '/' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-3 text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-3 text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              How It Works
            </button>

            <button
              onClick={() => {
                navigate({ to: '/resale-properties' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-3 text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Resale Properties
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-3 text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
