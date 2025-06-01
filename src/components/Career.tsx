import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const positions = [
  {
    title: "Licensed Therapist",
    description: "Join our team of therapists dedicated to helping couples build stronger relationships.",
    path: "/careers/therapist",
    highlights: [
      "Culturally-sensitive counseling",
      "Flexible remote work",
      "Competitive compensation"
    ]
  },
  {
    title: "Psychiatrist",
    description: "Work with couples to address mental health concerns and improve relationship dynamics.",
    path: "/careers/psychiatrist",
    highlights: [
      "Collaborative team environment",
      "Telemedicine options",
      "Mental health advocacy"
    ]
  },
  {
    title: "Clinical Social Worker",
    description: "Provide social support and resources to couples facing relationship challenges.",
    path: "/careers/social-worker",
    highlights: [
      "Community impact",
      "Flexible scheduling",
      "Ethiopian context training"
    ]
  },
  {
    title: "Administrative Professional",
    description: "Support our clinical team and ensure smooth operations for our clients.",
    path: "/careers/administrative",
    highlights: [
      "Behind-the-scenes impact",
      "Career growth potential",
      "Tech-savvy environment"
    ]
  }
];

const Career = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#4b2a75] mb-3">Build Your Career with Unity</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our mission to strengthen Ethiopian marriages through professional counseling services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {positions.map((position) => (
            <Link
              key={position.path}
              to={position.path}
              className="group bg-[#f8f6fc] rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-l-4 hover:border-[#4b2a75]"
            >
              <div className="h-full flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-[#4b2a75] mb-3">{position.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{position.description}</p>
                  <ul className="space-y-1 mb-4">
                    {position.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-[#4b2a75] mr-2">•</span>
                        <span className="text-xs text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200">
                  <span className="text-xs text-[#4b2a75] font-medium">View details</span>
                  <span className="text-[#4b2a75] transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/careers">
            <Button
              variant="outline"
              className="border-[#4b2a75] text-[#4b2a75] hover:bg-[#4b2a75] hover:text-white rounded-full px-8 py-6"
            >
              Explore All Opportunities
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Career;
