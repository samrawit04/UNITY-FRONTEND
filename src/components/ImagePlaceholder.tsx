
import React from "react";

interface ImagePlaceholderProps {
  className?: string;
  text?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ 
  className = "w-full h-full", 
  text = "Image" 
}) => {
  return (
    <div 
      className={`${className} bg-gray-200 flex items-center justify-center text-gray-500 text-xs overflow-hidden`}
    >
      {text}
    </div>
  );
};

export default ImagePlaceholder;
