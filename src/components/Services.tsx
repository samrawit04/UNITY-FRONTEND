import {
  IconHeart,
  IconUsers,
  IconHeartHandshake,
  IconMessageCircle,
  IconCalendarEvent,
  IconDeviceLaptop
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const services = [
  { icon: IconHeart, title: "Pre-Marriage Counseling", id: 1 },
  { icon: IconUsers, title: "Marriage Counseling", id: 2 },
  { icon: IconHeartHandshake, title: "Conflict Resolution", id: 3 },
  { icon: IconMessageCircle, title: "Effective Communication Counseling", id: 4 },
  { icon: IconCalendarEvent, title: "Preparing for a Family Together", id: 5 },
  { icon: IconDeviceLaptop, title: "Online Sessions", id: 6 }
];

const Services = () => {
  return (
    <motion.div
      id="services"
      className="min-h-screen flex flex-col justify-center items-center px-4 scroll-mt-5 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <motion.h2
        className="text-2xl font-bold text-center mb-10"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Services
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            className="bg-purple-50 p-10 rounded-lg shadow-sm flex flex-col items-center text-center border hover:shadow-xl hover:scale-105 transition-all duration-300 gap-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="border border-gray-200 rounded-full p-4 mb-4 bg-gray-50">
              <service.icon size={28} stroke={1.5} className="text-purple-800" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">{service.title}</h3>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Services;
