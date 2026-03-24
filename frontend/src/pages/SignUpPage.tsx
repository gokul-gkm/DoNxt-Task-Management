import { type FC, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { signUpSchema, type SignupSchemaType } from "../lib/validations/auth.z.validation";
import { authService } from "../services/api/auth.api";
import InputField from "../components/ui/InputField";
import Logo from "../components/ui/Logo";
import { UserIcon, EmailIcon, LockIcon, EyeIcon, EyeOffIcon, SpinnerIcon } from "../components/ui/icons";

const SignUp: FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const leftRef      = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);
  const logoRef      = useRef<HTMLDivElement>(null);
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
    tl.fromTo(headingRef.current,   { opacity: 0, y:  10 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3");
    tl.fromTo(formItemsRef.current, { opacity: 0, y:  14 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.07 }, "-=0.25");
  }, []);

  const handleBtnEnter = () =>
    gsap.to(submitBtnRef.current, { scale: 1.02, duration: 0.15, ease: "power1.out" });
  const handleBtnLeave = () =>
    gsap.to(submitBtnRef.current, { scale: 1,    duration: 0.15, ease: "power1.out" });

  const onSubmit = async (data: SignupSchemaType) => {
    try {
      await authService.signup(data);
      toast.success("Account created! Please verify your email.");
      navigate("/auth/sign-in", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Sign up failed. Please try again.");
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
          <div ref={logoRef} className="mb-8">
            <Logo size="md" />
          </div>

          <div ref={headingRef} className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-1.5">
              Create Your Account
            </h1>
            <p className="text-sm text-gray-500">Get started for free</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5" noValidate>

            <div ref={reg} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label htmlFor="firstName" className="text-xs font-semibold text-gray-700">
                  First Name
                </label>
                <InputField
                  id="firstName"
                  type="text"
                  placeholder="John"
                  autoFocus
                  autoComplete="given-name"
                  icon={<UserIcon />}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-0.5 font-medium" role="alert">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="lastName" className="text-xs font-semibold text-gray-700">
                  Last Name
                </label>
                <InputField
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  autoComplete="family-name"
                  icon={<UserIcon />}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-0.5 font-medium" role="alert">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

=            <div ref={reg} className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-semibold text-gray-700">
                Email
              </label>
              <InputField
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                icon={<EmailIcon />}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-0.5 font-medium" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

=            <div ref={reg} className="flex flex-col gap-1">
              <label htmlFor="password" className="text-xs font-semibold text-gray-700">
                Password
              </label>
              <InputField
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                icon={<LockIcon />}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-blue-500 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-0.5 font-medium" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div ref={reg} className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-700">
                Confirm Password
              </label>
              <InputField
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat your password"
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

            {/* Submit */}
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
                    Creating account…
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          <div ref={reg} className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/auth/sign-in" className="text-blue-500 hover:text-blue-600 font-bold transition-colors duration-150">
              Log In
            </Link>
          </div>
        </div>

        {/* ── RIGHT — Hero image  ─────────────────────────── */}
        <div
          ref={rightRef}
          className="hidden lg:flex w-[52%] bg-gradient-to-br from-blue-50 to-indigo-50 flex-col items-center justify-center px-10 py-10 border-l border-gray-100"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-extrabold text-gray-900 leading-tight mb-1.5">
              Boost your productivity.
            </h2>
            <p className="text-sm text-gray-500">
              Organize your <span className="font-semibold text-gray-700">tasks</span> efficiently.
            </p>
          </div>
          <img
            src="/login-hero.png"
            alt="Person working at a desk with task management UI"
            className="w-full max-w-sm mx-auto object-contain drop-shadow-lg"
          />
        </div>

        <div className="lg:hidden bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-6 flex flex-col items-center text-center border-t border-gray-100">
          <h2 className="text-lg font-extrabold text-gray-900 mb-1">Boost your productivity.</h2>
          <p className="text-xs text-gray-500 mb-4">
            Organize your <span className="font-semibold text-gray-700">tasks</span> efficiently.
          </p>
          <img
            src="/login-hero.png"
            alt="Person working at a desk with task management UI"
            className="w-full max-w-[220px] sm:max-w-xs object-contain drop-shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
