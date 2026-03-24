import { useEffect, useRef, type FC } from "react";
import { gsap } from "gsap";

const RedirectProgress: FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.fromTo(barRef.current, { width: "0%" }, { width: "100%", duration: 3, ease: "none" });
  }, []);

  return (
    <div className="mb-4 rounded-xl overflow-hidden bg-green-50 border border-green-100">
      <div ref={barRef} className="h-1 bg-green-400 rounded-full" style={{ width: "0%" }} />
      <p className="text-xs text-center py-2 text-gray-500">
        Redirecting to login in 3 seconds…
      </p>
    </div>
  );
};

export default RedirectProgress;
