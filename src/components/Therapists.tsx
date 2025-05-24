import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Therapists = () => {
  const [counselors, setCounselors] = useState([]);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await fetch("http://localhost:3000/counselors");
        const data = await res.json();
        console.log("Counselors fetched:", data);

        setCounselors(data);
      } catch (err) {
        console.error("Failed to fetch counselors", err);
      }
    };

    fetchCounselors();
  }, []);

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
          Meet Our Highly Experienced Relationship Therapists
        </h2>
      </div>

      {/* Scrollable Row */}
      <div className="w-full max-w-6xl overflow-x-auto no-scrollbar">
        <div className="flex gap-20 px-4 mt-10">
         {counselors.map((counselor) => {
  const fullName = `${counselor.firstName || ""} ${counselor.lastName || ""}`.trim();
  return (
    <div
      key={counselor.id}
      className="flex flex-col items-center flex-shrink-0 min-w-[160px]"
    >
      <div className="w-32 h-40 md:w-40 md:h-48 rounded-lg overflow-hidden mb-4 shadow-md">
        <Avatar className="w-full h-full rounded-none">
          <AvatarImage
            src={
              counselor.image
                ? `http://localhost:3000/uploads/profile-pictures/${counselor.image}`
                : undefined
            }
            alt={`${fullName}'s profile`}
            className="object-cover w-full h-full rounded-none"
          />
          <AvatarFallback className="bg-gray-200 flex items-center justify-center rounded-none text-xl font-semibold text-purple-700">
            {counselor.firstName?.[0] || "?"}
          </AvatarFallback>
        </Avatar>
      </div>
      <p className="text-md md:text-lg font-semibold text-gray-800 text-center">
        {fullName || "Therapist"}
      </p>
    </div>
  );
})}

        </div>
      </div>

      {/* Tailwind utility to hide scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
    // <div>hi</div>
  );
};

export default Therapists;
