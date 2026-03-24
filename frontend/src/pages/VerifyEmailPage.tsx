import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { toast } from "sonner";
import { authService } from "../services/api/auth.api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../components/ui/Logo";
import { SpinnerIcon } from "../components/ui/icons";
import AuthHeroPanel, { type AuthStep } from "../components/ui/AuthHeroPanel";
import VerifyStatusIcon, { type VerifyStatus } from "../components/ui/VerifyStatusIcon";
import RedirectProgress from "../components/ui/RedirectProgress";

const heroSteps: AuthStep[] = [
  { step: "1", label: "Create your account",    done: true,  active: false },
  { step: "2", label: "Verify your email",       done: false, active: true  },
  { step: "3", label: "Start organizing tasks",  done: false, active: false },
];

const titles: Record<VerifyStatus, string> = {
  idle:      "Verify Your Email",
  verifying: "Verifying…",
  success:   "Email Verified!",
  error:     "Verification Failed",
};
const subtitles: Record<VerifyStatus, string> = {
  idle:      "One click away from getting started",
  verifying: "Please wait a moment",
  success:   "Redirecting you to login shortly",
  error:     "Something went wrong",
};
const msgStyle: Record<VerifyStatus, string> = {
  idle:      "text-gray-500  bg-blue-50   border border-blue-100",
  verifying: "text-gray-500  bg-blue-50   border border-blue-100",
  success:   "text-green-700 bg-green-50  border border-green-100",
  error:     "text-red-600   bg-red-50    border border-red-100",
};

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status,  setStatus]  = useState<VerifyStatus>("idle");
  const [message, setMessage] = useState("Click the button below to verify your email address");

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const leftRef       = useRef<HTMLDivElement>(null);
  const rightRef      = useRef<HTMLDivElement>(null);
  const logoRef       = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLDivElement>(null);
  const formItemsRef  = useRef<HTMLElement[]>([]);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const msgBoxRef     = useRef<HTMLDivElement>(null);

  const reg = (el: HTMLElement | null) => {
    if (el && !formItemsRef.current.includes(el)) formItemsRef.current.push(el);
  };

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(leftRef.current,      { opacity: 0, x: -32 }, { opacity: 1, x: 0, duration: 0.7 });
    tl.fromTo(rightRef.current,     { opacity: 0, x:  32 }, { opacity: 1, x: 0, duration: 0.7 }, "-=0.55");
    tl.fromTo(logoRef.current,      { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.5");
    tl.fromTo(headingRef.current,   { opacity: 0, y:  10 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3");
    tl.fromTo(formItemsRef.current, { opacity: 0, y:  14 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.07 }, "-=0.25");
  }, []);

  useEffect(() => {
    if (!email || !token) {
      setStatus("error");
      setMessage("Invalid verification link. Please check your email or request a new one.");
    }
  }, [email, token]);

  useEffect(() => {
    if (!msgBoxRef.current) return;
    gsap.fromTo(
      msgBoxRef.current,
      { opacity: 0, y: 6, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
    );
  }, [message]);

  const handleBtnEnter = () =>
    gsap.to(primaryBtnRef.current, { scale: 1.02, duration: 0.15, ease: "power1.out" });
  const handleBtnLeave = () =>
    gsap.to(primaryBtnRef.current, { scale: 1,    duration: 0.15, ease: "power1.out" });

  const handleVerify = async () => {
    if (!email || !token) {
      toast.error("Missing email or token — please use the link from your email.");
      return;
    }
    try {
      setStatus("verifying");
      setMessage("Verifying your email…");
      const res = await authService.verifyEmail(email, token);
      setStatus("success");
      setMessage(res?.message || "Email verified successfully!");
      toast.success("Email verified successfully!");
      setTimeout(() => navigate("/auth/sign-in", { replace: true }), 3000);
    } catch (err: any) {
      const msg = err.message || "Verification failed. Please try again.";
      setStatus("error");
      setMessage(msg);
      toast.error(msg);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address is missing from the link.");
      return;
    }
    try {
      setStatus("verifying");
      setMessage("Sending verification email…");
      await authService.resendEmailVerification(email);
      setStatus("idle");
      setMessage("Verification email sent! Please check your inbox.");
      toast.success("Verification email sent successfully!");
    } catch (err: any) {
      const msg = err.message || "Failed to send verification email.";
      setStatus("error");
      setMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-3 sm:p-5 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[480px]">

        {/* ── LEFT — Content ───────────────────────────────────────── */}
        <div
          ref={leftRef}
          className="w-full lg:w-[48%] flex flex-col px-6 sm:px-10 pt-8 pb-8 lg:pt-12 lg:pb-12"
        >
          <div ref={logoRef} className="mb-8">
            <Logo size="md" />
          </div>

          <VerifyStatusIcon status={status} />

          <div ref={headingRef} className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-1.5">
              {titles[status]}
            </h1>
            <p className="text-sm text-gray-500">{subtitles[status]}</p>
          </div>

          <div ref={reg} className="mb-4">
            <div
              ref={msgBoxRef}
              className={`px-4 py-3 rounded-xl text-sm font-medium ${msgStyle[status]}`}
            >
              {status === "verifying" ? (
                <span className="flex items-center gap-2">
                  <SpinnerIcon className="w-4 h-4 shrink-0" />
                  {message}
                </span>
              ) : (
                message
              )}
            </div>
          </div>

          {status === "success" && (
            <div ref={reg}>
              <RedirectProgress />
            </div>
          )}

          {email && (
            <div ref={reg} className="mb-4 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-500">
              Verifying for{" "}
              <span className="font-semibold text-gray-700 font-mono">{email}</span>
            </div>
          )}

          <div ref={reg} className="flex flex-col gap-3">

            {status === "idle" && (
              <button
                ref={primaryBtnRef}
                onClick={handleVerify}
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors duration-200 shadow-md shadow-blue-200 cursor-pointer"
              >
                Verify My Email →
              </button>
            )}

            {status === "success" && (
              <button
                ref={primaryBtnRef}
                onClick={() => navigate("/auth/sign-in", { replace: true })}
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors duration-200 shadow-md shadow-blue-200 cursor-pointer"
              >
                Go to Login →
              </button>
            )}

            {status === "error" && (
              <>
                <button
                  ref={primaryBtnRef}
                  onClick={() => navigate("/auth/sign-in")}
                  onMouseEnter={handleBtnEnter}
                  onMouseLeave={handleBtnLeave}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors duration-200 shadow-md shadow-blue-200 cursor-pointer"
                >
                  Go to Login
                </button>
                <button
                  onClick={handleResend}
                  disabled={!email}
                  className="w-full py-3 border-2 border-blue-100 hover:border-blue-300 text-blue-500 hover:text-blue-600 bg-blue-50 text-sm font-bold rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend Verification Email
                </button>
              </>
            )}
          </div>

          <div ref={reg} className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
            <Link
              to="/auth/sign-in"
              className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-150"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>

        <AuthHeroPanel
          panelRef={rightRef}
          heading="Almost there!"
          subText={<>Verify your <span className="font-semibold text-gray-700">email address</span> to get started.</>}
          steps={heroSteps}
          mobileHeading="Almost there!"
          mobileStepLabels={["Account", "Verify", "Start"]}
          mobileActiveIndex={1}
        />
      </div>
    </div>
  );
}