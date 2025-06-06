import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Hero = () => {
  const fullText = "Welcome to Unity";
  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = 150;
    const resetDelay = 1000; // pause before starting again

    let typingTimeout;

    if (index < fullText.length) {
      typingTimeout = setTimeout(() => {
        setTypedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, typingSpeed);
    } else {
      typingTimeout = setTimeout(() => {
        setTypedText("");
        setIndex(0);
      }, resetDelay);
    }

    return () => clearTimeout(typingTimeout);
  }, [index]);

  return (
    <div
      id="home"
      className="relative w-full h-screen pt-16 flex items-center justify-center text-white "
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
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 text-center px-4 max-w-3xl mx-auto mb-40"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          {typedText}
          <span className="animate-pulse">|</span>
        </h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-2xl md:text-3xl font-bold mb-6"
        >
          Couples Consultancy
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-base md:text-lg mb-8"
        >
          Your trusted advisors for marriage, pre-marital, and couple counseling.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="flex justify-center mt-6"
        >
          <Link to="/select-role">
            <Button className="bg-white hover:bg-[#3a2057] hover:text-white text-black rounded-full px-8 py-5 flex items-center gap-2">
              <span>Start Your Journey</span>
              <span className="flex items-center justify-center rounded-full bg-black w-5 h-5 text-white">→</span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
