import type { FC, ReactNode, RefObject } from "react";

export interface AuthStep {
  step: string;
  label: string;
  done?: boolean;
  active: boolean;
}

interface AuthHeroPanelProps {
  heading: string;
  subText: ReactNode;
  steps: AuthStep[];
  mobileHeading?: string;
  mobileStepLabels?: string[];
  mobileActiveIndex?: number;
  panelRef?: RefObject<HTMLDivElement | null>;
}

const AuthHeroPanel: FC<AuthHeroPanelProps> = ({
  heading,
  subText,
  steps,
  mobileHeading,
  mobileStepLabels,
  mobileActiveIndex = 0,
  panelRef,
}) => (
  <>
    <div
      ref={panelRef}
      className="hidden lg:flex w-[52%] bg-linear-to-br from-blue-50 to-indigo-50 flex-col items-center justify-center px-10 py-10 border-l border-gray-100"
    >
      <div className="text-center mb-8">
        <h2 className="text-xl font-extrabold text-gray-900 leading-tight mb-1.5">{heading}</h2>
        <p className="text-sm text-gray-500">{subText}</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {steps.map(({ step, label, done, active }) => (
          <div
            key={step}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
              active ? "bg-white border-blue-200 shadow-sm shadow-blue-100" : "bg-transparent border-gray-100"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                done
                  ? "bg-blue-500 text-white"
                  : active
                  ? "bg-blue-100 text-blue-500 border-2 border-blue-300"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {done ? "✓" : step}
            </div>
            <span
              className={`text-sm font-semibold ${
                active ? "text-gray-900" : done ? "text-gray-400 line-through" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="lg:hidden bg-linear-to-br from-blue-50 to-indigo-50 px-6 py-6 flex flex-col items-center text-center border-t border-gray-100">
      {mobileHeading && (
        <h2 className="text-lg font-extrabold text-gray-900 mb-1">{mobileHeading}</h2>
      )}
      {mobileStepLabels && (
        <div className="flex items-center gap-2 mt-2">
          {mobileStepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                  i < mobileActiveIndex
                    ? "bg-blue-500 text-white"
                    : i === mobileActiveIndex
                    ? "bg-blue-100 text-blue-500 border-2 border-blue-300"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i < mobileActiveIndex ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs font-semibold ${
                  i === mobileActiveIndex ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {label}
              </span>
              {i < mobileStepLabels.length - 1 && (
                <span className="text-gray-300 text-xs">›</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </>
);

export default AuthHeroPanel;
