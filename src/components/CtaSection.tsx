import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CtaSection = () => {
  return (
    <motion.div
      className="relative text-white py-20 bg-fixed bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://images.stockcake.com/public/2/f/3/2f3d8f8c-f5fb-4b61-b992-87825736d47c_large/holding-hands-together-stockcake.jpg')",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <p className="text-lg max-w-2xl mx-auto mb-6 leading-relaxed font-medium">
          Whether you are newly married or adapting to a relationship after a significant change,
          our professional consultants are here to guide you to the right place.
        </p>

        <Link to="/register" className="flex justify-center mt-6">
          <Button className="bg-white hover:bg-[#3a2057] text-black hover:text-white rounded-full px-6 py-3 font-semibold transition duration-300 shadow-lg">
            Get Started!
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default CtaSection;
