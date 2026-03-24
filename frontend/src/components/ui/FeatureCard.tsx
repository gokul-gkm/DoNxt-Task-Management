import { type FC, useEffect, useRef } from "react";
import type { SVGProps } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Feature } from "../../data/landingData";
import {
  GridPlusIcon,
  TaskListIcon,
  ClockIcon,
  ChartLineIcon,
  StarIcon,
  TeamPlusIcon,
} from "./icons";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  GridPlusIcon,
  TaskListIcon,
  ClockIcon,
  ChartLineIcon,
  StarIcon,
  TeamPlusIcon,
};

interface FeatureCardProps extends Feature {
  index: number;
}

const FeatureCard: FC<FeatureCardProps> = ({
  iconName,
  title,
  desc,
  accentLight,
  accentText,
  index,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top 90%",
      onEnter: () => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.6, delay: (index % 3) * 0.1, ease: "power3.out" }
        );
      },
    });
  }, [index]);

  const Icon = iconMap[iconName];

  return (
    <div
      ref={ref}
      className="group bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50/80 hover:bg-slate-50/40 transition-all duration-300 opacity-0 cursor-default"
    >
      <div className={`w-12 h-12 rounded-xl ${accentLight} ${accentText} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
        {Icon && <Icon />}
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
};

export default FeatureCard;
