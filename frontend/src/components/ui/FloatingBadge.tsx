import { type FC, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface FloatingBadgeProps {
  label: string;
  sub: string;
  color: string;
  delay: number;
  className?: string;
}

const FloatingBadge: FC<FloatingBadgeProps> = ({ label, sub, color, delay, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(ref.current, {
      y: "+=8",
      duration: 2.5 + delay * 0.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay,
    });
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`absolute bg-white rounded-2xl border border-slate-200 shadow-lg px-3.5 py-2.5 flex items-center gap-2.5 pointer-events-none select-none ${className}`}
    >
      <div className={`w-2.5 h-2.5 rounded-full ${color} shrink-0`} />
      <div>
        <p className="text-gray-800 text-xs font-bold leading-tight">{label}</p>
        <p className="text-gray-400 text-[10px] mt-0.5">{sub}</p>
      </div>
    </div>
  );
};

export default FloatingBadge;
