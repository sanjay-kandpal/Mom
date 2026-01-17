"use client";

import { useTheme } from "@/lib/hooks/use-theme";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="size-8 2xl:size-10 3xl:size-12 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <span className="material-symbols-outlined text-[20px] 2xl:text-[24px] 3xl:text-[28px]">
          dark_mode
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="size-8 2xl:size-10 3xl:size-12 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
    >
      <span className="material-symbols-outlined text-[20px] 2xl:text-[24px] 3xl:text-[28px] block dark:hidden">
        dark_mode
      </span>
      <span className="material-symbols-outlined text-[20px] 2xl:text-[24px] 3xl:text-[28px] hidden dark:block">
        light_mode
      </span>
    </button>
  );
}
