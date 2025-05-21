
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import OurMission from "@/components/OurMission";
import Services from "@/components/Services";
import CtaSection from "@/components/CtaSection";
import Therapists from "@/components/Therapists";
import Testimonials from "@/components/Testimonials";
import Career from "@/components/Career";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        <Hero />
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 py-16">
            <AboutUs />
            <OurMission />
          </div>
          <Services />
        </div>
        <CtaSection />
        <div className="container mx-auto px-4 py-16">
          <Therapists />
          <Testimonials />
          <Career />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
