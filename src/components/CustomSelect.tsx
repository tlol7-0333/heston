"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (newValue: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Selecione...",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full h-11 px-4 rounded-full bg-zinc-900/90 border flex items-center justify-between text-sm text-white transition-all ${
          open
            ? "border-[#087E96] ring-1 ring-[#087E96]/40"
            : "border-zinc-700 hover:border-[#087E96]"
        }`}
      >
        <span className="truncate leading-none">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 text-[#38bdf8]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 shadow-2xl p-1.5 overflow-hidden space-y-0.5">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm flex items-center justify-between cursor-pointer transition-colors text-left ${
                  isSelected
                    ? "bg-[#087E96]/20 text-[#38bdf8] font-medium"
                    : "hover:bg-zinc-800 text-zinc-200"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#38bdf8] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
