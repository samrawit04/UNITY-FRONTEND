
import { IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-purple-100 pt-16 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center mb-3">
              <IconBrandFacebook size={20} className="text-[#4b2a75]" />
              <span className="ml-2 text-sm font-medium">UNITY</span>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              We are dedicated to helping couples build stronger, healthier relationships through professional guidance.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-[#4b2a75]"><IconBrandFacebook size={18} /></a>
              <a href="#" className="text-[#4b2a75]"><IconBrandTwitter size={18} /></a>
              <a href="#" className="text-[#4b2a75]"><IconBrandInstagram size={18} /></a>
              <a href="#" className="text-[#4b2a75]"><IconBrandLinkedin size={18} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="text-xs text-gray-600 space-y-2">
              <li><a href="#">About</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Team</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="text-xs text-gray-600 space-y-2">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Subscribe to Newsletter</h4>
            <div className="flex mb-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-l-md focus:outline-none"
              />
              <Button className="bg-[#4b2a75] hover:bg-[#3a2057] text-white rounded-r-md text-xs px-3">
                SEND
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between">
          <p>© 2025 Unity. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
