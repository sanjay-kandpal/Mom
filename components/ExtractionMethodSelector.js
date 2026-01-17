"use client";

export default function ExtractionMethodSelector({ selectedMethod, onOpenModal }) {
  if (!selectedMethod) return null;

  const methodInfo = {
    "media-api": {
      name: "Media Web API",
      icon: "play_circle",
      color: "text-primary-light dark:text-getstarted-primary",
    },
    "ffmpeg": {
      name: "FFmpeg",
      icon: "settings",
      color: "text-primary-light dark:text-getstarted-primary",
    },
  };

  const method = methodInfo[selectedMethod];

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <button
        onClick={onOpenModal}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#1c1f27] border border-slate-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <span className={`material-symbols-outlined ${method.color} text-[20px]`}>
          {method.icon}
        </span>
        <span className="text-slate-900 dark:text-white text-sm font-medium">
          {method.name}
        </span>
        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[16px]">
          expand_more
        </span>
      </button>
    </div>
  );
}
