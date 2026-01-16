import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import LocationSelector from '../components/LocationSelector';
import AboutUsSection from '../components/AboutUsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import LeadCaptureForm from '../components/LeadCaptureForm';
import PropertyIntelligenceSection from '../components/PropertyIntelligenceSection';
import HonestBusinessModelSection from '../components/HonestBusinessModelSection';
import WhyTrustSection from '../components/WhyTrustSection';
import StatisticsSection from '../components/StatisticsSection';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import Footer from '../components/Footer';

export default function HomePage() {

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <HeroSection />
        <LocationSelector />
        <AboutUsSection />
        <HowItWorksSection />
        <PropertyIntelligenceSection />
        <LeadCaptureForm />
        <HonestBusinessModelSection />
        <WhyTrustSection />
        <StatisticsSection />
        <TestimonialsCarousel />
      </div>
      <Footer />
    </>
  );
}
