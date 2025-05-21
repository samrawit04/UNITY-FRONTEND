import { useState } from 'react';
import { IconUser, IconMenu2, IconX } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-purple-900 py-3 fixed w-full top-0 z-50">
      <div className="max-w-7xl  flex items-center justify-between mx-20">
        {/* Logo */}
        <Link to="/" className="flex place-items-end ml-10">
          <div className=" rounded-full p-1 ">
            <img src="/src/asset/logo.png" alt="Unity Logo" className="h-12 w-max" />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-14 ">
          <a href="#home" className="text-white hover:text-[#3a2057] font-normal">Home</a>
          <a href="#about" className="text-white hover:text-[#3a2057] font-normal">About</a>
          <a href="#services" className="text-white hover:text-[#3a2057] font-normal">Services</a>
          <a href="#therapists" className="text-white hover:text-[#3a2057] font-normal">Therapists</a>
          <Link to="/login" className="flex justify-center ">
              <Button className="bg-white hover:bg-[#3a2057] text-black px-9 py-1 rounded-full items-center font-medium hover:text-white transition duration-200 ">
                Sign In
              </Button>
          </Link>          
        </div>

        {/* Hamburger menu - Mobile */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <IconX className="text-white w-6 h-6" />
            ) : (
              <IconMenu2 className="text-white w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-purple-900 px-6 pt-4 pb-6 space-y-4">
          <a href="#home" onClick={() => setMenuOpen(false)} className="block text-white hover:text-[#3a2057] font-medium">Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)} className="block text-white hover:text-[#3a2057] font-medium">About</a>
          <a href="#services" onClick={() => setMenuOpen(false)} className="block text-white hover:text-[#3a2057] font-medium">Services</a>
          <a href="#therapists" onClick={() => setMenuOpen(false)} className="block text-white hover:text-[#3a2057] font-medium">Therapists</a>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-white hover:text-[#3a2057] font-medium">Sign In</Link> 
            
        </div>
      )}
    </nav>
  );
};

export default Navbar;
