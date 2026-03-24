import { useEffect, useRef, type FC } from "react";
import { gsap } from "gsap";
import { SpinnerIcon, EmailOpenIcon, CheckCircleIcon, XCircleIcon } from "./icons";

export type VerifyStatus = "idle" | "verifying" | "success" | "error";

interface StatusIconProps {
  status: VerifyStatus;
}

const iconConfigs: Record<
  VerifyStatus,
  { colorClass: string; shadowClass: string; Icon: FC<{ className?: string }> }
> = {
  idle:      { colorClass: "bg-blue-500",  shadowClass: "shadow-blue-200",  Icon: EmailOpenIcon  },
  verifying: { colorClass: "bg-blue-500",  shadowClass: "shadow-blue-200",  Icon: (p) => <SpinnerIcon {...p} /> },
  success:   { colorClass: "bg-green-500", shadowClass: "shadow-green-200", Icon: CheckCircleIcon },
  error:     { colorClass: "bg-red-500",   shadowClass: "shadow-red-200",   Icon: XCircleIcon    },
};

const VerifyStatusIcon: FC<StatusIconProps> = ({ status }) => {
  const iconRef  = useRef<HTMLDivElement>(null);
  const prevRef  = useRef<VerifyStatus>(status);

  useEffect(() => {
    if (prevRef.current === status) return;
    prevRef.current = status;
    if (!iconRef.current) return;
    gsap.fromTo(
      iconRef.current,
      { scale: 0.5, opacity: 0, rotate: -20 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.45, ease: "back.out(1.7)" }
    );
  }, [status]);

  const { colorClass, shadowClass, Icon } = iconConfigs[status];

  return (
    <div className="flex justify-start mb-5">
      <div
        ref={iconRef}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${colorClass} ${shadowClass}`}
      >
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
};

export default VerifyStatusIcon;
