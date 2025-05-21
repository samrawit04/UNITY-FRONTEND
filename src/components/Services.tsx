import {
  IconHeart,
  IconUsers,
  IconHeartHandshake,
  IconMessageCircle,
  IconCalendarEvent,
  IconDeviceLaptop
} from "@tabler/icons-react";

const services = [
  {
    icon: IconHeart,
    title: "Pre-Marriage Counseling",
    id: 1
  },
  {
    icon: IconUsers,
    title: "Marriage Counseling",
    id: 2
  },
  {
    icon: IconHeartHandshake,
    title: "Conflict Resolution",
    id: 3
  },
  {
    icon: IconMessageCircle,
    title: "Effective Communication Counseling",
    id: 4
  },
  {
    icon: IconCalendarEvent,
    title: "Preparing for a Family Together",
    id: 5
  },
  {
    icon: IconDeviceLaptop,
    title: "Online Sessions",
    id: 6
  }
];

const Services = () => {
  return (
    <div
      id="services"
      className="min-h-screen flex flex-col justify-center items-center px-4 scroll-mt-5 bg-white"
    >
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-10">Services</h2>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center"
          >
            <div className="border border-gray-200 rounded-full p-4 mb-4">
              <service.icon size={24} stroke={1.5} />
            </div>
            <h3 className="text-sm font-medium">{service.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
