import { type FC, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { authService } from "../../services/api/auth.api";
import { Link } from "react-router-dom";
import { forgotSchema, type ForgotSchemaType } from "../../lib/validations/auth.z.validation";
import InputField from "../../components/ui/InputField";
import Logo from "../../components/ui/Logo";
import { EmailIcon, LockKeyIcon, SpinnerIcon } from "../../components/ui/icons";
import AuthHeroPanel, { type AuthStep } from "../../components/ui/AuthHeroPanel";

const steps: AuthStep[] = [
  { step: "1", label: "Enter your email address", active: true  },
  { step: "2", label: "Check your inbox for the link", active: false },
  { step: "3", label: "Set your new password", active: false },
];

const ForgotPasswordPage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotSchemaType>({
    resolver: zodResolver(forgotSchema),
    mode: "onChange",
  });

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

  const onSubmit = async (data: ForgotSchemaType) => {
    try {
      const res = await authService.forgotPassword(data.email);
      toast.success(res.message || "Password reset link sent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-3 sm:p-5 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-120">

        <div
          ref={leftRef}
          className="w-full lg:w-[48%] flex flex-col px-6 sm:px-10 pt-8 pb-8 lg:pt-12 lg:pb-12"
        >
          <div ref={logoRef} className="mb-8">
            <Logo size="md" />
          </div>

          <div ref={iconRef} className="mb-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500 shadow-md shadow-blue-200 flex items-center justify-center">
              <LockKeyIcon />
            </div>
          </div>

          <div ref={headingRef} className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-1.5">
              Forgot Password?
            </h1>
            <p className="text-sm text-gray-500">
              No worries — enter your email and we'll send you a reset link right away.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5" noValidate>

            <div ref={reg} className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-semibold text-gray-700">
                Email address
              </label>
              <InputField
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                icon={<EmailIcon />}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-0.5 font-medium" role="alert">
                  {errors.email.message}
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
                    Sending link…
                  </span>
                ) : (
                  "Send Reset Link →"
                )}
              </button>
            </div>
          </form>

          <div ref={reg} className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <Link to="/auth/sign-in" className="text-blue-500 hover:text-blue-600 font-bold transition-colors duration-150">
              Back to Login
            </Link>
          </div>
        </div>

        <AuthHeroPanel
          panelRef={rightRef}
          heading="Recover your access."
          subText={<>We'll send a <span className="font-semibold text-gray-700">secure link</span> to your inbox.</>}
          steps={steps}
          mobileHeading="Recover your access."
          mobileStepLabels={["Email", "Check", "Reset"]}
          mobileActiveIndex={0}
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;