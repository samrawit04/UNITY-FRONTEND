
import { IconLeaf } from "@tabler/icons-react";
// import ImagePlaceholder from "./ImagePlaceholder";

const AboutUs = () => {
  return (
    <div id="about" className="flex-1 scroll-mt-24 pt-24">
      <div className="flex items-center gap-2 mb-4">
        <IconLeaf className="text-[#4b2a75]" size={20} />
        <span className="text-sm uppercase font-semibold text-[#4b2a75]">ABOUT US</span>
      </div>
      <h2 className="text-3xl font-bold mb-6">Transforming Lives Through Care</h2>
      
      <div className="flex mb-6">
        <div className="mr-4">
          <div className="w-24 h-44 rounded-lg overflow-hidden">
            <img   src =" https://images.pexels.com/photos/1378723/pexels-photo-1378723.jpeg?auto=compress&cs=tinysrgb&w=600"/>
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
      </div>
    </div>
  );
};

export default AboutUs;