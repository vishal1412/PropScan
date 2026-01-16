import { useNavigate } from '@tanstack/react-router';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate({ to: '/' });
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">PropScan Intelligence</h3>
            <p className="text-sm leading-relaxed mb-4">
              Your trusted partner for unbiased property intelligence and expert guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate({ to: '/' })}
                  className="hover:text-blue-400 transition-colors text-sm"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-blue-400 transition-colors text-sm"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-blue-400 transition-colors text-sm"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ to: '/admin' })}
                  className="hover:text-blue-400 transition-colors text-sm"
                >
                  Admin Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-base font-bold text-white mb-4">Cities</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate({ to: '/city/gurgaon' })}
                  className="hover:text-blue-400 transition-colors text-sm"
                >
                  Gurgaon
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ to: '/city/noida' })}
                  className="hover:text-blue-400 transition-colors text-sm"
                >
                  Noida
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ to: '/city/dubai' })}
                  className="hover:text-blue-400 transition-colors text-sm"
                >
                  Dubai
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+911234567890" className="text-sm hover:text-blue-400 transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@propscan.com" className="text-sm hover:text-blue-400 transition-colors">
                  info@propscan.com
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-6 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} PropScan Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
