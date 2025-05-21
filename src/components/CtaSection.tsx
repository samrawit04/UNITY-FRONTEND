
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';


const CtaSection = () => {
  return (
    <div className="bg-purple-900 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Whether you are newly married or adapting to a relationship after a significant change, our professional consultants are here to guide you to the right place.
        </p>
        
         {/* <Link to="/login" className="flex justify-center mt-3">
              <Button className="bg-white hover:bg-gray-100 text-black rounded-full px-8 py-2">
                Get Started!
              </Button>
        </Link>   */}
         <Link to="/register" className="flex justify-center mt-6">
          <Button className="bg-white hover:bg-[#3a2057] text-black rounded-full px-6 py-2 flex hover:text-white items-center gap-2">
            <span>Get Started!</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CtaSection;
