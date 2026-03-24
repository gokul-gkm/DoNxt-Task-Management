import { type FC, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Testimonial } from "../../data/landingData";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialCardProps extends Testimonial {
  index: number;
}

const TestimonialCard: FC<TestimonialCardProps> = ({ quote, name, role, avatar, index }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top 90%",
      onEnter: () => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.65, delay: index * 0.12, ease: "power3.out" }
        );
      },
    });
  }, [index]);

  return (
    <div
      ref={ref}
      className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col gap-4 opacity-0 hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 hover:bg-slate-50/40 transition-all duration-300"
    >
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#3B82F6">
            <path d="M7 1l1.8 3.6L13 5.4l-3 2.9.7 4.1L7 10.4l-3.7 2 .7-4.1-3-2.9 4.2-.8z" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed italic">"{quote}"</p>
      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-slate-100">
        <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-100" />
        <div>
          <p className="text-xs font-bold text-gray-800">{name}</p>
          <p className="text-xs text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
