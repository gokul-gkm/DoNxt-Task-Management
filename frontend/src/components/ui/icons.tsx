import type { FC, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Mail envelope icon */
export const EmailIcon: FC<IconProps> = (props) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M1.5 5l6.5 4.5L14.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/** Padlock icon */
export const LockIcon: FC<IconProps> = (props) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/** Eye-open icon (password visible) */
export const EyeIcon: FC<IconProps> = (props) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <circle cx="8" cy="8" r="2.2" stroke="#3B82F6" strokeWidth="1.3" />
    <path
      d="M1.5 8C2.5 5.5 5 3.5 8 3.5s5.5 2 6.5 4.5C13.5 10.5 11 12.5 8 12.5S2.5 10.5 1.5 8Z"
      stroke="#3B82F6"
      strokeWidth="1.3"
    />
  </svg>
);

/** Eye-off icon (password hidden) */
export const EyeOffIcon: FC<IconProps> = (props) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4Z" stroke="#3B82F6" strokeWidth="1.3" />
    <circle cx="8" cy="8" r="2" stroke="#3B82F6" strokeWidth="1.3" />
    <path d="M2 2L14 14" stroke="#3B82F6" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/** Spinner icon for loading states */
export const SpinnerIcon: FC<IconProps> = (props) => (
  <svg
    className={`animate-spin ${props.className ?? "w-4 h-4"}`}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

/** Checkmark icon (used in logo) */
export const CheckIcon: FC<IconProps> = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M3 10L8 15L17 5"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** User / person icon */
export const UserIcon: FC<IconProps> = (props) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M3 14c0-2.76 2.24-5 5-5s5 2.24 5 5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Landing page icons ───────────────────────────────────────────────────────

/** Grid + add icon (Project Workspaces) */
export const GridPlusIcon: FC<IconProps> = (props) => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" {...props}>
    <rect x="2" y="2" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <rect x="14" y="2" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <rect x="2" y="14" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M17 17.5h6M20 14.5v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

/** Task list with checkmark (Task Management) */
export const TaskListIcon: FC<IconProps> = (props) => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" {...props}>
    <path d="M5 13h16M5 8h10M5 18h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="20" cy="18" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M19 18l.8.8 1.4-1.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Clock icon (Due Date Timers) */
export const ClockIcon: FC<IconProps> = (props) => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" {...props}>
    <circle cx="13" cy="13" r="10" stroke="currentColor" strokeWidth="1.7" />
    <path d="M13 7v6l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Chart line (Progress Dashboard) */
export const ChartLineIcon: FC<IconProps> = (props) => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" {...props}>
    <path d="M4 20L8 13.5L12 17L17 10L22 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 23h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/** Star (Priority Scoring) */
export const StarIcon: FC<IconProps> = (props) => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" {...props}>
    <path d="M13 3L15.2 9.8H22.5L16.6 14L18.9 20.8L13 16.5L7.1 20.8L9.4 14L3.5 9.8H10.8L13 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

/** Team + add (Team Collaboration) */
export const TeamPlusIcon: FC<IconProps> = (props) => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" {...props}>
    <circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M3 23c0-3.866 3.134-7 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M19 13v9M15 17h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/** Arrow right (CTA) */
export const ArrowRightIcon: FC<IconProps> = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Play circle (See how it works) */
export const PlayCircleIcon: FC<IconProps> = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M6.5 5.5L10.5 8l-4 2.5V5.5Z" fill="currentColor" />
  </svg>
);

/** Hamburger menu icon */
export const MenuIcon: FC<IconProps> = (props) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" {...props}>
    <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Close / X icon */
export const CloseIcon: FC<IconProps> = (props) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" {...props}>
    <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ─── Auth page icons ──────────────────────────────────────────────────────────

/** Lock + keyhole icon (Forgot Password header) */
export const LockKeyIcon: FC<IconProps> = (props) => (
  <svg className="w-7 h-7" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
    <circle cx="12" cy="16" r="1" fill="#fff" stroke="none" />
  </svg>
);

/** Shield with checkmark (valid reset link state) */
export const ShieldCheckIcon: FC<IconProps> = (props) => (
  <svg className="w-7 h-7" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

/** Triangle warning (invalid / expired link) */
export const WarningIcon: FC<IconProps> = (props) => (
  <svg className="w-7 h-7" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// ─── Verify email page icons ──────────────────────────────────────────────────

/** Open envelope (idle verify state) */
export const EmailOpenIcon: FC<IconProps> = (props) => (
  <svg className="w-7 h-7" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

/** Check / success state */
export const CheckCircleIcon: FC<IconProps> = (props) => (
  <svg className="w-7 h-7" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

/** X / error state */
export const XCircleIcon: FC<IconProps> = (props) => (
  <svg className="w-7 h-7" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);
