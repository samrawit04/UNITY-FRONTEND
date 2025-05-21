
import { IconStar } from "@tabler/icons-react";

const testimonials = [
  {
    stars: 5,
    text: "Unity counseling services helped me improve my relationship",
    name: "SARAH & MIKE",
    id: 1
  },
  {
    stars: 5,
    text: "Unity counseling services helped me improve my relationship",
    name: "JAMES & EMMA",
    id: 2
  },
  {
    stars: 5,
    text: "Unity counseling services helped me improve my relationship",
    name: "LISA & JOHN",
    id: 3
  }
];

const Testimonials = () => {
  return (
    <div className="py-16 bg-purple-100 -mx-4 px-4 my-16">
      <h2 className="text-2xl font-bold mb-2 text-center">Happy Clients</h2>
      <p className="text-center text-gray-600 text-sm mb-10">Read what our clients have to say about us</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex text-yellow-400 mb-3">
              {[...Array(testimonial.stars)].map((_, i) => (
                <IconStar key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <p className="text-sm mb-6">{testimonial.text}</p>
            <p className="text-xs font-semibold">{testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
