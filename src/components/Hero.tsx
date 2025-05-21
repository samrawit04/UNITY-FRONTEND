import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      id="home"
      className="relative w-full h-screen pt-16 flex items-center justify-center text-white"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 bg-[#4b2a75] bg-opacity-75">
        <img
          src="https://images.pexels.com/photos/1415131/pexels-photo-1415131.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Couple silhouette"
          className="w-full h-full object-cover mix-blend-overlay opacity-50"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mb-40">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome to Unity</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Couples Consultancy</h2>
        <p className="text-base md:text-lg mb-8">
          Your trusted advisors for marriage, pre-marital, and couple counseling.
        </p>

        <Link to="/select-role" className="flex justify-center mt-6">
          <Button className="bg-white hover:bg-[#3a2057] hover:text-white text-black rounded-full px-8 py-5 flex items-center gap-2">
            <span>Start Your Journey</span>
            <span className="flex items-center justify-center rounded-full bg-black w-5 h-5 text-white">→</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
