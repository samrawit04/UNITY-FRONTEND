
const OurMission = () => {
  return (
    <div className="flex-1 bg-[#f4f1fa] rounded-lg p-8 pt-10 mt-5">
      <h3 className="text-lg font-semibold mb-4">Our Mission</h3>
      
      <div className="space-y-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0 bg-[#edd9ff] rounded-full w-6 h-6 flex items-center justify-center mt-1">
            <span className="text-purple-700">1</span>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Empowering for Lasting Love</h4>
            <p className="text-xs text-gray-600">
              We provide couples with the tools and insights needed to build and maintain healthy, fulfilling relationships.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-shrink-0 bg-[#edd9ff] rounded-full w-6 h-6 flex items-center justify-center mt-1">
            <span className="text-purple-700">2</span>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Creating Positive Change through Quality Relationships</h4>
            <p className="text-xs text-gray-600">
              We believe that stronger relationships lead to stronger communities and work to create positive ripple effects.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-shrink-0 bg-[#edd9ff] rounded-full w-6 h-6 flex items-center justify-center mt-1">
            <span className="text-purple-700">3</span>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Promoting Healthy Communication</h4>
            <p className="text-xs text-gray-600">
              We teach effective communication strategies that help couples navigate conflicts and deepen their connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurMission;
