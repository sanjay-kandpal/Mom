import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center gap-10">
      <div className="flex flex-col gap-6 max-w-[850px]">
        <h1 className="text-slate-900 dark:text-white text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight font-outfit">
          Private, Browser-Only <br />
          <span className="text-primary-light dark:text-getstarted-primary dark:text-glow">Meeting Minutes</span>
        </h1>
        <h2 className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-light leading-relaxed max-w-[650px] mx-auto font-outfit">
          Transform your local meeting videos into structured summaries instantly. Your data never leaves this tab.
        </h2>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link
          href="/app"
          className="group flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-primary-light dark:bg-getstarted-primary hover:bg-primary-light-hover dark:hover:brightness-110 transition-all shadow-md dark:shadow-[0_0_30px_-5px_rgba(0,255,194,0.5)] hover:shadow-lg dark:hover:shadow-[0_0_40px_-5px_rgba(0,255,194,0.7)] text-white dark:text-black text-base font-bold tracking-wider uppercase font-outfit"
        >
          <span className="truncate">Get Started</span>
          <span className="material-symbols-outlined getstarted ml-2 text-[20px] transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
