import { type FC, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Stat } from "../../data/landingData";

gsap.registerPlugin(ScrollTrigger);

const AnimatedStat: FC<Stat> = ({ value, label }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      onEnter: () => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 24, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "back.out(1.4)" }
        );
      },
    });
  }, []);

  return (
    <div ref={ref} className="text-center opacity-0">
      <div className="text-4xl sm:text-5xl font-black text-blue-600 mb-2 tracking-tight">{value}</div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
    </div>
  );
};

export default AnimatedStat;
