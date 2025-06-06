import { IconLeaf } from "@tabler/icons-react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <motion.div
      id="about"
      className="flex-1 scroll-mt-24 pt-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="flex items-center gap-2 mb-4"
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <IconLeaf className="text-[#4b2a75]" size={20} />
        <span className="text-sm uppercase font-semibold text-[#4b2a75]">ABOUT US</span>
      </motion.div>

      <motion.h2
        className="text-3xl font-bold mb-6"
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
      >
        Transforming Lives Through Care
      </motion.h2>

      <motion.div
        className="flex mb-6"
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="mr-4">
          <div className="w-24 h-44 rounded-lg overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1378723/pexels-photo-1378723.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="About Us"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Welcome to Unity Consultancy, where we dedicate ourselves to helping couples build stronger, healthier relationships through professional guidance and support.
          </p>
          <p className="text-sm text-gray-600">
            Our team of certified therapists brings years of experience and compassion to each session, creating a safe space for couples to explore challenges and grow together.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutUs;
