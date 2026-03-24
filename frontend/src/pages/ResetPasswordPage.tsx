import { type FC, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { authService } from "../services/api/auth.api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetSchema, type ResetSchemaType } from "../lib/validations/auth.z.validation";
import InputField from "../components/ui/InputField";
import Logo from "../components/ui/Logo";
import { EmailIcon, LockIcon, EyeIcon, EyeOffIcon, SpinnerIcon, ShieldCheckIcon, WarningIcon } from "../components/ui/icons";
import AuthHeroPanel, { type AuthStep } from "../components/ui/AuthHeroPanel";

const validSteps: AuthStep[] = [
  { step: "1", label: "Requested a reset link", done: true,  active: false },
  { step: "2", label: "Opened link from email",  done: true,  active: false },
  { step: "3", label: "Set your new password",   done: false, active: true  },
];

const invalidSteps: AuthStep[] = [
  { step: "1", label: "Requested a reset link", done: true,  active: false },
  { step: "2", label: "Opened link from email",  done: true,  active: false },
  { step: "3", label: "Set your new password",   done: false, active: false },
];

const ResetPasswordPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const invalidLink = !email || !token;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetSchemaType>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
  });

  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const leftRef      = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);
  const logoRef      = useRef<HTMLDivElement>(null);
  const iconRef      = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLDivElement>(null);
  const formItemsRef = useRef<HTMLElement[]>([]);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const reg = (el: HTMLElement | null) => {
    if (el && !formItemsRef.current.includes(el)) formItemsRef.current.push(el);
  };

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(leftRef.current,      { opacity: 0, x: -32 }, { opacity: 1, x: 0, duration: 0.7 });
    tl.fromTo(rightRef.current,     { opacity: 0, x:  32 }, { opacity: 1, x: 0, duration: 0.7 }, "-=0.55");
    tl.fromTo(logoRef.current,      { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.5");
    tl.fromTo(iconRef.current,      { opacity: 0, scale: 0.6, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.35");
    tl.fromTo(headingRef.current,   { opacity: 0, y: 10  }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3");
    tl.fromTo(formItemsRef.current, { opacity: 0, y: 14  }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.07 }, "-=0.25");
  }, []);

  const handleBtnEnter = () =>
    gsap.to(submitBtnRef.current, { scale: 1.02, duration: 0.15, ease: "power1.out" });
  const handleBtnLeave = () =>
    gsap.to(submitBtnRef.current, { scale: 1, duration: 0.15, ease: "power1.out" });

  const onSubmit = async (data: ResetSchemaType) => {
    if (invalidLink) { toast.error("Invalid or missing reset link"); return; }
    try {
      const res = await authService.resetPassword(email, token, data.newPassword, data.confirmPassword);
      toast.success(res.message || "Password reset successfully!");
      navigate("/auth/sign-in", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-3 sm:p-5 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[480px]">

        {/* ── LEFT — Form ──────────────────────────────────────────── */}
        <div
          ref={leftRef}
          className="w-full lg:w-[48%] flex flex-col px-6 sm:px-10 pt-8 pb-8 lg:pt-12 lg:pb-12"
        >
          {/* Logo */}
          <div ref={logoRef} className="mb-8">
            <Logo size="md" />
          </div>

          <div ref={iconRef} className="mb-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${invalidLink ? "bg-red-500 shadow-red-200" : "bg-blue-500 shadow-blue-200"}`}>
              {invalidLink ? <WarningIcon /> : <ShieldCheckIcon />}
            </div>
          </div>

          <div ref={headingRef} className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-1.5">
              {invalidLink ? "Invalid Reset Link" : "Reset Password"}
            </h1>
            <p className="text-sm text-gray-500">
              {invalidLink
                ? "This link is invalid or has expired."
                : "Choose a strong new password for your account."}
            </p>
          </div>

          {invalidLink && (
            <div ref={reg} className="mb-4">
              <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 font-medium">
                Please request a new password reset link.
              </p>
            </div>
          )}

          {!invalidLink && (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5" noValidate>

              <div ref={reg} className="flex flex-col gap-1">
                <label htmlFor="email-readonly" className="text-xs font-semibold text-gray-700">
                  Email address
                </label>
                <InputField
                  id="email-readonly"
                  type="email"
                  value={email}
                  readOnly
                  icon={<EmailIcon />}
                  className="opacity-60 cursor-not-allowed"
                />
              </div>

              <div ref={reg} className="flex flex-col gap-1">
                <label htmlFor="newPassword" className="text-xs font-semibold text-gray-700">
                  New password
                </label>
                <InputField
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  icon={<LockIcon />}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowNew((s) => !s)}
                      className="text-blue-500 cursor-pointer"
                      aria-label={showNew ? "Hide password" : "Show password"}
                    >
                      {showNew ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <p className="text-xs text-red-500 mt-0.5 font-medium" role="alert">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div ref={reg} className="flex flex-col gap-1">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-700">
                  Confirm new password
                </label>
                <InputField
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                  icon={<LockIcon />}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="text-blue-500 cursor-pointer"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-0.5 font-medium" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div ref={reg}>
                <button
                  ref={submitBtnRef}
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={handleBtnEnter}
                  onMouseLeave={handleBtnLeave}
                  aria-busy={isSubmitting}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <SpinnerIcon className="w-4 h-4" />
                      Resetting…
                    </span>
                  ) : (
                    "Reset Password →"
                  )}
                </button>
              </div>
            </form>
          )}

          {invalidLink && (
            <div ref={reg} className="mt-1">
              <Link
                to="/auth/forgot-password"
                className="w-full flex items-center justify-center py-3 border-2 border-blue-100 hover:border-blue-300 text-blue-500 hover:text-blue-600 bg-blue-50 text-sm font-bold rounded-xl transition-colors duration-200"
              >
                Request a new link →
              </Link>
            </div>
          )}

=          <div ref={reg} className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <Link to="/auth/sign-in" className="text-blue-500 hover:text-blue-600 font-bold transition-colors duration-150">
              Back to Login
            </Link>
          </div>
        </div>

        {/* ── RIGHT — Shared hero panel ──────────────────────────────── */}
        <AuthHeroPanel
          panelRef={rightRef}
          heading={invalidLink ? "Link expired?" : "Almost done!"}
          subText={
            invalidLink
              ? "Request a new link to regain access."
              : "Set a strong new password to secure your account."
          }
          steps={invalidLink ? invalidSteps : validSteps}
          mobileHeading={invalidLink ? "Link expired?" : "Almost done!"}
          mobileStepLabels={["Request", "Open", "Reset"]}
          mobileActiveIndex={invalidLink ? 1 : 2}
        />
      </div>
    </div>
  );
};

export default ResetPasswordPage;