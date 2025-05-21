
import { Button } from "@/components/ui/button";

const positions = [
  {
    title: "Licensed Therapist",
    description: "Join our team of therapists dedicated to helping couples build stronger relationships.",
    id: 1
  },
  {
    title: "Psychiatrist",
    description: "Work with couples to address mental health concerns and improve relationship dynamics.",
    id: 2
  },
  {
    title: "Clinical Social Worker",
    description: "Provide social support and resources to couples facing relationship challenges.",
    id: 3
  },
  {
    title: "Administrative Professional",
    description: "Support our clinical team and ensure smooth operations for our clients.",
    id: 4
  }
];

const Career = () => {
  return (
    <div className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold">Build Your Career with Unity</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {positions.map((position) => (
          <div key={position.id} className="bg-[#f8f6fc] rounded-lg p-6 hover:shadow-md transition-all duration-300">
            <h3 className="text-sm font-semibold mb-2">{position.title}</h3>
            <p className="text-xs text-gray-600 mb-4">{position.description}</p>
            <div className="flex justify-end">
              <button className="text-[#4b2a75] text-xs">→</button>
            </div>
          </div>
        ))}
      </div>
      
      {/* <div className="flex justify-end">
        <Button className="bg-[#4b2a75] hover:bg-[#3a2057] rounded-full px-6 py-2 text-sm">
          EXPLORE MORE
        </Button>
      </div> */}
    </div>
  );
};

export default Career;
