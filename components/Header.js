"use client";

import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white/80 dark:bg-getstarted-bg-dark/80 backdrop-blur-xl border-b border-slate-100 dark:border-getstarted-primary/10 sticky top-0 z-50">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-16">
        <div className="flex items-center justify-between h-16 2xl:h-20">
          <div className="flex items-center gap-3 2xl:gap-4">
            <Link
              href="/"
              className="flex items-center justify-center size-8 2xl:size-10 3xl:size-12 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Back to Get Started"
            >
              <span className="material-symbols-outlined text-[20px] 2xl:text-[24px] 3xl:text-[28px]">arrow_back</span>
            </Link>
            <div className="flex items-center justify-center size-8 2xl:size-10 3xl:size-12 rounded-lg bg-primary-light/10 dark:bg-getstarted-primary/5 border border-primary-light/30 dark:border-getstarted-primary/30 text-primary-light dark:text-getstarted-primary">
              <span className="material-symbols-outlined text-[24px] 2xl:text-[28px] 3xl:text-[32px]">smart_toy</span>
            </div>
            <h1 className="text-lg 2xl:text-xl 3xl:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Local MoM Generator
            </h1>
            <div className="hidden md:flex items-center gap-1.5 2xl:gap-2 px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full bg-primary-light/5 dark:bg-getstarted-primary/5 border border-primary-light/20 dark:border-getstarted-primary/20 ml-4 2xl:ml-6">
              <span className="material-symbols-outlined text-primary-light dark:text-getstarted-primary text-[16px] 2xl:text-[18px] 3xl:text-[20px]">
                shield_lock
              </span>
              <span className="text-xs 2xl:text-sm 3xl:text-base font-semibold text-primary-light dark:text-getstarted-primary">
                100% Local Processing
              </span>
            </div>
          </div>
          <nav className="flex items-center gap-6 2xl:gap-8">
            <a
              className="text-sm 2xl:text-base font-medium text-slate-600 dark:text-slate-400 hover:text-primary-light dark:hover:text-getstarted-primary transition-colors"
              href="#"
            >
              How it works
            </a>
            <a
              className="text-sm 2xl:text-base font-medium text-slate-600 dark:text-slate-400 hover:text-primary-light dark:hover:text-getstarted-primary transition-colors"
              href="#"
            >
              Settings
            </a>
            <ThemeToggle />
            <button className="size-8 2xl:size-10 3xl:size-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[20px] 2xl:text-[24px] 3xl:text-[28px]">
                person
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
