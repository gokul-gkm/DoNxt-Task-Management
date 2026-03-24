import type { ToasterProps } from "sonner";

const iconBox = (gradient: string, shadow: string, children: React.ReactNode) => (
  <div
    style={{
      width: 20,
      height: 20,
      borderRadius: 6,
      background: gradient,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxShadow: shadow,
    }}
  >
    {children}
  </div>
);

export const toastIcons: ToasterProps["icons"] = {
  success: iconBox(
    "linear-gradient(135deg,#22C55E,#16A34A)",
    "0 2px 8px rgba(34,197,94,0.30)",
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: iconBox(
    "linear-gradient(135deg,#FF6B6B,#FF4444)",
    "0 2px 8px rgba(255,107,107,0.30)",
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.8} strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  warning: iconBox(
    "linear-gradient(135deg,#FBBF24,#F59E0B)",
    "0 2px 8px rgba(251,191,36,0.30)",
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  info: iconBox(
    "linear-gradient(135deg,#7C5CFC,#C084FC)",
    "0 2px 8px rgba(124,92,252,0.30)",
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8h.01M12 12v4" />
    </svg>
  ),
  loading: iconBox(
    "rgba(124,92,252,0.10)",
    "none",
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#7C5CFC" strokeWidth={2.5} strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <path d="M12 2a10 10 0 0110 10" />
    </svg>
  ),
};

export const toastOptions: ToasterProps["toastOptions"] = {
  duration: 3500,
  classNames: {
    toast:       "!rounded-2xl !border !shadow-xl !px-4 !py-3.5 !text-sm !font-medium",
    title:       "!font-semibold !text-[13.5px]",
    description: "!text-xs !mt-0.5",
    icon:        "!mr-2.5",
    default:     "!bg-white/90 !backdrop-blur-xl !border-[rgba(120,100,220,0.14)] !text-[#1A1033] !shadow-[0_12px_36px_rgba(124,92,252,0.14)]",
    success:     "!bg-white/90 !backdrop-blur-xl !border-[rgba(34,197,94,0.18)]   !text-[#1A1033] !shadow-[0_12px_36px_rgba(34,197,94,0.12)]",
    error:       "!bg-white/90 !backdrop-blur-xl !border-[rgba(255,107,107,0.20)] !text-[#1A1033] !shadow-[0_12px_36px_rgba(255,107,107,0.14)]",
    warning:     "!bg-white/90 !backdrop-blur-xl !border-[rgba(251,191,36,0.22)]  !text-[#1A1033] !shadow-[0_12px_36px_rgba(251,191,36,0.12)]",
    actionButton: "!bg-[#7C5CFC] !text-white !rounded-xl !text-xs !font-semibold !px-3 !py-1.5",
    cancelButton: "!bg-[rgba(124,92,252,0.08)] !text-[#7A7390] !rounded-xl !text-xs !font-semibold !px-3 !py-1.5",
    closeButton:  "!bg-[rgba(124,92,252,0.06)] !border-[rgba(124,92,252,0.12)] !text-[#7A7390] !rounded-lg hover:!bg-[rgba(124,92,252,0.12)]",
  },
  style: {
    fontFamily: "'DM Sans', sans-serif",
  },
};