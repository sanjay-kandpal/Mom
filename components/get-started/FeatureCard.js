export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-getstarted-card-dark p-8 dark:border-glow hover:border-primary-light/20 dark:hover:border-getstarted-primary/20 transition-all duration-300 group">
      <div className="size-14 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-400 group-hover:text-primary-light dark:group-hover:text-getstarted-primary group-hover:border-primary-light/20 dark:group-hover:border-getstarted-primary/30 transition-colors">
        <span className="material-symbols-outlined getstarted text-[32px]">{icon}</span>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-slate-900 dark:text-white text-xl font-semibold tracking-tight font-outfit">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-500 text-sm font-light leading-relaxed font-outfit">
          {description}
        </p>
      </div>
    </div>
  );
}
