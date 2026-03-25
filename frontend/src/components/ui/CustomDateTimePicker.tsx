import { type FC, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export interface CustomDateTimePickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  required?: boolean;
}

const CustomDateTimePicker: FC<CustomDateTimePickerProps> = ({
  id, label, value, onChange, error, required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDayClick = (day: number) => {
    const newDate = new Date(selectedDate || new Date());
    newDate.setFullYear(viewDate.getFullYear());
    newDate.setMonth(viewDate.getMonth());
    newDate.setDate(day);
    setSelectedDate(newDate);
    updateValue(newDate);
  };

  const handleTimeChange = (type: "h" | "m", val: number) => {
    const newDate = new Date(selectedDate || new Date());
    if (type === "h") newDate.setHours(val);
    else newDate.setMinutes(val);
    setSelectedDate(newDate);
    updateValue(newDate);
  };

  const updateValue = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    onChange(formatted);
  };

  const toggleOpen = () => {
    if (isOpen) {
      gsap.to(popoverRef.current, {
        opacity: 0,
        y: -10,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setIsOpen(false)
      });
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (isOpen && popoverRef.current) {
      gsap.fromTo(popoverRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (isOpen) toggleOpen();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const days = [];
  const startDay = startDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());

  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`prev-${i}`} className="h-8 w-8 text-transparent flex items-center justify-center text-[10px] uppercase font-bold text-gray-200">
    </div>);
  }

  for (let d = 1; d <= totalDays; d++) {
    const isSelected = selectedDate && 
      selectedDate.getDate() === d && 
      selectedDate.getMonth() === viewDate.getMonth() && 
      selectedDate.getFullYear() === viewDate.getFullYear();
    const isToday = new Date().getDate() === d && 
      new Date().getMonth() === viewDate.getMonth() && 
      new Date().getFullYear() === viewDate.getFullYear();

    days.push(
      <button
        key={d}
        type="button"
        onClick={() => handleDayClick(d)}
        className={`h-8 w-8 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center cursor-pointer ${
          isSelected 
            ? "bg-indigo-600 text-white shadow-md scale-110" 
            : isToday ? "text-indigo-600 font-bold border border-indigo-100" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        {d}
      </button>
    );
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i); 

  return (
    <div className="flex flex-col gap-1.5 antialiased" ref={containerRef}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-indigo-500 ml-0.5">*</span>}
      </label>
      
      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={toggleOpen}
          className={`w-full flex items-center gap-3 px-4 py-2.5 border rounded-lg bg-white text-sm transition-all duration-200 shadow-sm hover:border-indigo-300 ${
            error ? "border-red-400 focus:ring-red-100" : "border-gray-200"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
            {value ? new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Select date & time"}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-auto text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </button>

        {isOpen && (
          <div 
            ref={popoverRef}
            className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[70] flex gap-4 min-w-[320px] origin-top"
          >
            <div className="flex-1 border-r border-gray-50 pr-4">
              <div className="flex items-center justify-between mb-4">
                <button 
                  type="button"
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                  className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
                </button>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                  {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button 
                  type="button"
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                  className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"></path></svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                  <div key={d} className="h-8 w-8 flex items-center justify-center text-[10px] font-bold text-gray-300 uppercase">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days}
              </div>
            </div>

            <div className="w-24">
              <div className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-4 text-center">Time</div>
              <div className="flex h-48 gap-px">
                <div className="flex-1 overflow-y-auto no-scrollbar py-20 px-1 hover:no-scrollbar">
                  {hours.map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleTimeChange("h", h)}
                      className={`w-full py-1.5 text-xs font-medium transition-all duration-200 rounded-lg ${
                        selectedDate?.getHours() === h ? "text-indigo-600 bg-indigo-50 font-bold" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {h.toString().padStart(2, "0")}
                    </button>
                  ))}
                </div>
                <div className="w-px bg-gray-50 my-2" />
                <div className="flex-1 overflow-y-auto no-scrollbar py-20 px-1 hover:no-scrollbar">
                  {minutes.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleTimeChange("m", m)}
                      className={`w-full py-1.5 text-xs font-medium transition-all duration-200 rounded-lg ${
                        selectedDate?.getMinutes() === m ? "text-indigo-600 bg-indigo-50 font-bold" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {m.toString().padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 ml-1 animate-in fade-in slide-in-from-left-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomDateTimePicker;
