"use client";

import { useTheme } from "@/lib/hooks/use-theme";

export default function GetStartedHeader() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-100 dark:border-getstarted-primary/10 bg-white/80 dark:bg-getstarted-bg-dark/80 backdrop-blur-xl px-6 md:px-10 py-4">
      <div className="flex items-center gap-3">
        <div className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-getstarted-primary/30 bg-slate-50 dark:bg-getstarted-primary/5 text-primary-light dark:text-getstarted-primary">
          <span className="material-symbols-outlined getstarted text-[20px]">security</span>
        </div>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight font-outfit">
          Local MoM Generator
        </h2>
      </div>
      <div className="flex flex-1 justify-end items-center gap-4">
        <a
          className="text-slate-500 dark:text-slate-400 hover:text-primary-light dark:hover:text-getstarted-primary transition-colors text-sm font-medium font-outfit"
          href="#"
        >
          Privacy Policy
        </a>
        {mounted && (
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="size-8 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined getstarted text-[20px] block dark:hidden">
              dark_mode
            </span>
            <span className="material-symbols-outlined getstarted text-[20px] hidden dark:block">
              light_mode
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
