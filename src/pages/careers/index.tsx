import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Careers() {
  const positions = [
    {
      title: "Licensed Therapist",
      description: "Provide professional marriage counseling to Ethiopian couples.",
      path: "/careers/therapist",
      icon: "🛋️"
    },
    {
      title: "Psychiatrist",
      description: "Address mental health aspects of relationship challenges.",
      path: "/careers/psychiatrist",
      icon: "🧠"
    },
    {
      title: "Clinical Social Worker",
      description: "Connect couples with community resources and support systems.",
      path: "/careers/social-worker",
      icon: "🤝"
    },
    {
      title: "Administrative Professional",
      description: "Support our counseling team's operations and client services.",
      path: "/careers/administrative",
      icon: "📋"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#4b2a75] mb-4">Join Our Team</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Help strengthen Ethiopian marriages through professional counseling services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {positions.map((position) => (
          <Link
            key={position.path}
            to={position.path}
            className="group border border-gray-200 rounded-lg p-8 hover:bg-[#f8f6fc] transition-colors duration-300 hover:shadow-md"
          >
            <div className="flex items-start">
              <span className="text-3xl mr-4">{position.icon}</span>
              <div>
                <h2 className="text-2xl font-semibold text-[#4b2a75] mb-2 group-hover:underline">
                  {position.title}
                </h2>
                <p className="text-gray-600 mb-4">{position.description}</p>
                <div className="flex items-center text-[#4b2a75] font-medium">
                  View position details
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#4b2a75] mb-4">
            Can't find your perfect role?
          </h3>
          <p className="text-gray-600 mb-4">
            We're always looking for talented professionals to join our mission.
          </p>
          <Button className="bg-[#4b2a75] hover:bg-[#3a1d5a] px-8 py-6 text-lg">
            <a href="mailto:etenesh4good@gmail.com" className="text-white no-underline">
                Contact Us About Opportunities
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}