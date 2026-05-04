"use client";

export default function SectionLabel({ text, dark = false }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div
        className={`h-px w-8 ${dark ? "bg-accent-jesko/50" : "bg-black/33"}`}
      />
      <span
        className={`text-xs font-body font-[450] tracking-[0.3em] uppercase ${
          dark ? "text-accent-jesko" : "text-black"
        }`}
      >
        {text}
      </span>
    </div>
  );
}
