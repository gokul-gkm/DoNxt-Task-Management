import { type FC, type KeyboardEvent, useRef, useState } from "react";
import { gsap } from "gsap";

interface TagInputProps {
  tags:      string[];
  onAdd:    (tag: string) => void;
  onRemove: (tag: string) => void;
  tagColorMap?: Record<string, string>;
}

const defaultTagColorMap: Record<string, string> = {
  Design:    "bg-purple-50 text-purple-600 border-purple-100",
  Frontend:  "bg-blue-50 text-blue-600 border-blue-100",
  Backend:   "bg-indigo-50 text-indigo-600 border-indigo-100",
  API:       "bg-cyan-50 text-cyan-600 border-cyan-100",
  Bug:       "bg-red-50 text-red-500 border-red-100",
  Testing:   "bg-amber-50 text-amber-600 border-amber-100",
  Research:  "bg-green-50 text-green-600 border-green-100",
  Marketing: "bg-pink-50 text-pink-600 border-pink-100",
};

const TagInput: FC<TagInputProps> = ({ tags, onAdd, onRemove, tagColorMap = defaultTagColorMap }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const inputRef          = useRef<HTMLInputElement>(null);
  const tagRefs           = useRef<Map<string, HTMLElement>>(new Map());

  const getTagClasses = (tag: string): string =>
    tagColorMap[tag] ?? "bg-gray-100 text-gray-600 border-gray-200";

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = input.trim();
      if (!val) return;
      if (tags.includes(val)) { setError("Tag already added."); return; }
      onAdd(val);
      setInput("");
      setError("");
      requestAnimationFrame(() => {
        const el = tagRefs.current.get(val);
        if (el) gsap.fromTo(el, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: "back.out(1.5)" });
      });
    }
    if (e.key === "Escape") setInput("");
    if (e.key === "Backspace" && !input && tags.length > 0) onRemove(tags[tags.length - 1]);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">Tags</label>
      <div
        onClick={() => inputRef.current?.focus()}
        className="min-h-11 w-full flex flex-wrap gap-1.5 px-3 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 cursor-text transition duration-200"
      >
        {tags.map((tag) => (
          <span
            key={tag}
            ref={(el) => { if (el) tagRefs.current.set(tag, el); }}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getTagClasses(tag)}`}
          >
            {tag}
            <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(tag); }}
              className="hover:opacity-70 transition-opacity cursor-pointer shrink-0"
              aria-label={`Remove ${tag}`}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(""); }}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "e.g. Design, Frontend… press Enter" : "Add more…"}
          className="flex-1 min-w-30 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none border-none"
        />
      </div>
      {error
        ? <p role="alert" className="text-xs text-red-500">{error}</p>
        : <p className="text-xs text-gray-400">Press Enter to add · Backspace to remove last</p>
      }
    </div>
  );
};

export default TagInput;
