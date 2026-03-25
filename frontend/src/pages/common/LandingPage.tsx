import { type FC, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import LandingNavbar from "../../components/ui/LandingNavbar";
import MiniDashboard from "../../components/ui/MiniDashboard";
import FloatingBadge from "../../components/ui/FloatingBadge";
import FeatureCard from "../../components/ui/FeatureCard";
import TestimonialCard from "../../components/ui/TestimonialCard";
import AnimatedStat from "../../components/ui/AnimatedStat";
import { ArrowRightIcon, PlayCircleIcon } from "../../components/ui/icons";

import {
  features,
  stats,
  testimonials,
  steps,
  footerColumns,
} from "../../data/landingData";

gsap.registerPlugin(ScrollTrigger);

const LandingPage: FC = () => {
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const heroTextRef  = useRef<HTMLDivElement>(null);
  const heroCTARef   = useRef<HTMLDivElement>(null);
  const heroBoardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.25 });

    tl.fromTo(heroBadgeRef.current,
      { opacity: 0, y: 16, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.5)" }
    );
    tl.fromTo(heroTextRef.current,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      "-=0.2"
    );
    tl.fromTo(heroCTARef.current,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );
    tl.fromTo(heroBoardRef.current,
      { opacity: 0, y: 50, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" },
      "-=0.3"
    );

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <div className="bg-slate-50 text-gray-900 overflow-x-hidden">
      <LandingNavbar />

      <section className="relative min-h-screen flex flex-col items-center justify-center text-center pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[5%] w-120 h-120 rounded-full bg-blue-100/70 blur-[120px]" />
          <div className="absolute top-[30%] right-[-5%] w-90 h-90 rounded-full bg-indigo-100/60 blur-[100px]" />
          <div className="absolute bottom-[5%] left-[30%] w-75 h-75 rounded-full bg-sky-100/50 blur-[90px]" />
          <div
            className="absolute inset-0 opacity-[0.30]"
            style={{
              backgroundImage: "radial-gradient(circle, #94A3B8 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div ref={heroBadgeRef} className="opacity-0 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-blue-600 tracking-wide">NOW IN PUBLIC BETA — FREE TO USE</span>
        </div>

        <div ref={heroTextRef} className="opacity-0 max-w-4xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tight mb-6">
            <span className="block text-gray-900">Work moves</span>
            <span className="block bg-linear-to-r from-blue-500 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
              at your speed.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mt-6">
            DoNxt is the task management tool built for teams that ship.
            Create projects, add tasks with due-date timers, and watch your dashboard track everything — beautifully.
          </p>
        </div>

        <div ref={heroCTARef} className="opacity-0 flex flex-col sm:flex-row items-center gap-4 mt-10">
          <a
            href="/auth/sign-up"
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-base rounded-2xl transition-all duration-200 shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:scale-105"
          >
            <span>Start for free</span>
            <ArrowRightIcon className="group-hover:translate-x-1 transition-transform duration-200" />
          </a>
          <a href="#how-it-works" className="inline-flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-800 font-medium text-sm border border-slate-200 hover:border-slate-300 bg-white rounded-2xl transition-all duration-200 shadow-sm">
            <PlayCircleIcon />
            See how it works
          </a>
        </div>

        <div className="flex items-center gap-4 mt-9 opacity-60">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <img key={i} src={`https://i.pravatar.cc/32?img=${i * 3}`} alt="" className="w-7 h-7 rounded-full ring-2 ring-slate-100 object-cover" />
            ))}
          </div>
          <p className="text-xs text-gray-400">
            <span className="text-gray-700 font-bold">50,000+</span> teams already using DoNxt
          </p>
        </div>

        <div ref={heroBoardRef} className="opacity-0 w-full max-w-2xl mt-20 relative">
          <FloatingBadge label="Design screens done ✓" sub="Just completed" color="bg-emerald-400" delay={0} className="-top-7 -left-2.5 sm:-left-12.5 z-10" />
          <FloatingBadge label="API docs · 2h 14m left" sub="High priority" color="bg-rose-400" delay={0.7} className="top-[30%] -right-2.5 sm:-right-15 z-10" />
          <FloatingBadge label="Sprint velocity +40%" sub="This week" color="bg-blue-400" delay={1.2} className="-bottom-6 left-[10%] z-10" />

          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/70 p-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
              </div>
              <div className="flex-1 h-5 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400">
                app.donxt.com/dashboard
              </div>
            </div>
            <MiniDashboard />
          </div>

          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-blue-200/40 blur-3xl rounded-full pointer-events-none" />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STATS STRIP
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="border-y border-slate-200/80 bg-linear-to-b from-white to-slate-50 py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((s) => <AnimatedStat key={s.label} value={s.value} label={s.label} />)}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FEATURES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="features" className="py-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-5 uppercase tracking-widest">
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Everything you need.<br />
            <span className="bg-linear-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Nothing you don't.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Carefully crafted for teams that move fast, think clearly, and ship with confidence.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HOW IT WORKS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="how-it-works" className="py-28 px-4 sm:px-6 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 mb-6 uppercase tracking-widest">
                How it works
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-6">
                From idea to done.<br />
                <span className="text-gray-400 font-medium text-3xl sm:text-4xl">In record time.</span>
              </h2>
              <div className="flex flex-col gap-6">
                {steps.map(({ step, title, desc, color }) => (
                  <div key={step} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${color} shadow-lg flex items-center justify-center text-xs font-black text-white shrink-0`}>
                      {step}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/auth/sign-up" className="inline-flex items-center gap-2 mt-10 text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors duration-150 group">
                Get started in 30 seconds
                <ArrowRightIcon className="group-hover:translate-x-1 transition-transform duration-200 w-3.5 h-3.5" />
              </a>
            </div>

  
            <div className="relative">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                      <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="1" y="1" width="5" height="5" rx="1.2" />
                        <rect x="8" y="1" width="5" height="5" rx="1.2" />
                        <rect x="1" y="8" width="5" height="5" rx="1.2" />
                        <path d="M10 8v4M8 10h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Mobile App v2</p>
                      <p className="text-[10px] text-gray-400">4 tasks · 2 pending</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-lg">Active</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {[
                    { name: "Set up authentication", done: true, priority: "High", time: null },
                    { name: "Design onboarding screens", done: true, priority: "High", time: null },
                    { name: "Build task timer component", done: false, priority: "High", time: "2h 14m" },
                    { name: "Write unit tests", done: false, priority: "Low", time: "1d 6h" },
                  ].map(({ name, done, priority, time }) => (
                    <div key={name} className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border ${done ? "bg-white border-slate-100" : "bg-white border-slate-200"}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${done ? "bg-emerald-500 border-emerald-500" : "border-gray-300"}`}>
                        {done && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>
                      <p className={`text-xs font-medium flex-1 leading-tight ${done ? "line-through text-gray-400" : "text-gray-700"}`}>{name}</p>
                      {!done && time && (
                        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <circle cx="5" cy="5" r="4" stroke="#F97316" strokeWidth="1.2" />
                            <path d="M5 2.5v2.5l1.5 1.5" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" />
                          </svg>
                          <span className="text-[10px] font-bold text-orange-500">{time}</span>
                        </div>
                      )}
                      {!done && !time && (
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{priority}</span>
                      )}
                    </div>
                  ))}
                </div>

                
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400 font-medium">Completion</span>
                    <span className="text-gray-700 font-bold">50%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: "50%" }} />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-blue-100/60 blur-3xl rounded-full pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TESTIMONIALS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="testimonials" className="py-28 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-5 uppercase tracking-widest">
            Testimonials
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Teams love DoNxt.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => <TestimonialCard key={t.name} {...t} index={i} />)}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CTA BANNER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl px-8 sm:px-16 py-16 text-center shadow-2xl shadow-blue-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="relative z-10">
              <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-4">Ready to move faster?</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5">
                Start organizing.<br />Stop overthinking.
              </h2>
              <p className="text-blue-100 text-base sm:text-lg mb-10 max-w-lg mx-auto">
                Join 50,000+ teams who chose DoNxt to ship faster, work smarter, and actually enjoy their workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/auth/sign-up" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-blue-600 font-black text-sm rounded-2xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:scale-105">
                  Get started — it's free
                  <ArrowRightIcon />
                </a>
                <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-7 py-4 text-white border border-white/30 hover:border-white/60 rounded-2xl font-medium text-sm transition-all duration-200">
                  See how it works
                </a>
              </div>
              <p className="text-blue-200/70 text-xs mt-6">No credit card required · Free forever plan · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FOOTER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2 sm:col-span-4 lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9L7.5 13.5L15 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-lg font-black text-gray-900 tracking-tight">DoNxt</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                The task management workspace built for teams that ship. Create projects, track tasks, meet deadlines.
              </p>
              <div className="flex gap-3 mt-5">
                {["T", "G", "L"].map((s) => (
                  <a key={s} href="#" className="w-8 h-8 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all duration-150 text-xs font-bold">
                    {s}
                  </a>
                ))}
              </div>
            </div>


            {footerColumns.map(({ heading, links }) => (
              <div key={heading}>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">{heading}</p>
                <div className="flex flex-col gap-2.5">
                  {links.map((l) => (
                    <a key={l} href="#" className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-150">{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100">
            <p className="text-xs text-gray-400">© 2026 DoNxt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;