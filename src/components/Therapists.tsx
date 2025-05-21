import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

const therapists = [
  { name: "Emma", id: 1, image: "/therapists/john.jpg" },
  { name: "Monica", id: 2, image: "/therapists/john.jpg" },
  { name: "Sandra", id: 3, image: "/therapists/john.jpg" },
  { name: "John", id: 4, image: "/therapists/john.jpg" },
  { name: "Amara", id: 5, image: "/therapists/john.jpg" }
];

const Therapists = () => {
  return (
    <div
      id="therapists"
      className="min-h-screen flex flex-col justify-center items-center px-4 py-12 scroll-mt-5 bg-white"
    >
      {/* Header */}
      <div className="text-center mb-12 w-full">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">
          Dedicated to help you
        </h3>
        <h2 className="text-2xl md:text-3xl font-bold">
          Our Highly Experienced Relationship Therapists
        </h2>
      </div>

      {/* Responsive Grid */}
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
          {therapists.map((therapist) => (
            <div key={therapist.id} className="flex flex-col items-center">
              <div className="w-32 h-40 md:w-40 md:h-48 rounded-lg overflow-hidden mb-3">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src={therapist.image}
                    alt={`${therapist.name}'s profile picture`}
                    className="object-cover w-full h-full rounded-none"
                  />
                  <AvatarFallback className="bg-gray-200 flex items-center justify-center rounded-none">
                    <User className="w-16 h-16 text-gray-500" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className="text-md md:text-lg font-semibold text-gray-800">
                {therapist.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Therapists;
