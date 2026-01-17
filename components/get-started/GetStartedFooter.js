export default function GetStartedFooter() {
  return (
    <footer className="flex flex-col items-center justify-center gap-4 px-5 py-12 text-center border-t border-slate-100 dark:border-white/5 bg-white/50 dark:bg-getstarted-bg-dark/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 text-primary-light dark:text-getstarted-primary font-semibold text-xs tracking-widest uppercase bg-slate-50 dark:bg-getstarted-primary/5 border border-slate-200 dark:border-getstarted-primary/20 px-5 py-2 rounded-full shadow-sm dark:shadow-[0_0_15px_rgba(0,255,194,0.1)] font-outfit">
        <div className="size-2 rounded-full bg-primary-light dark:bg-getstarted-primary dark:shadow-[0_0_8px_#00FFC2] animate-pulse"></div>
        Runs entirely on your device
      </div>
      <p className="text-slate-400 dark:text-slate-600 text-[10px] uppercase tracking-[0.2em] font-medium mt-2 font-outfit">
        © 2024 Local MoM Generator. Privacy First.
      </p>
    </footer>
  );
}
