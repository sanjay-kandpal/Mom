"use client";

export default function AudioExtractionModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSelectOption = (option) => {
    onSelect(option);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-[#111318] w-full max-w-[720px] rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="p-6 pb-2 text-center">
          <h2 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight pb-2">
            Select Audio Extraction Method
          </h2>
          <p className="text-slate-600 dark:text-[#9da6b9] text-base font-normal leading-normal max-w-lg mx-auto">
            Choose a method to extract audio from your video file.
            <span className="block text-sm mt-1 text-primary-light/80 dark:text-getstarted-primary/80">
              Each method has different strengths depending on your video format and requirements.
            </span>
          </p>
        </div>

        {/* Scrollable Content: Extraction Options */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {/* Option 1: FFmpeg */}
          <div className="group relative flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-[#1c1f27] p-4 shadow-lg border border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-gray-700 transition-colors">
            <div className="flex flex-[2_2_0px] flex-col justify-center gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-light dark:text-getstarted-primary text-[20px]">
                    settings
                  </span>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                    FFmpeg
                  </p>
                </div>
                <p className="text-slate-600 dark:text-[#9da6b9] text-sm font-normal leading-normal">
                  Best for high-quality extraction and format conversion. Requires WebAssembly setup. Ideal for complex video formats and when you need precise control.
                </p>
              </div>
              <button
                onClick={() => handleSelectOption("ffmpeg")}
                className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-slate-100 dark:bg-[#282e39] hover:bg-slate-200 dark:hover:bg-[#323946] text-slate-900 dark:text-white text-sm font-medium transition-colors w-fit group-hover:bg-slate-200 dark:group-hover:bg-[#323946]"
              >
                <span>Select</span>
              </button>
            </div>
            <div className="w-32 sm:w-48 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg hidden sm:block relative overflow-hidden border border-slate-200 dark:border-gray-700">
              <div className="absolute inset-0 bg-blue-900/10 dark:bg-blue-900/20 mix-blend-overlay"></div>
            </div>
          </div>

          {/* Option 2: Media Web API (Recommended) */}
          <div className="relative flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-[#1c1f27] p-4 shadow-[0_0_15px_rgba(30,58,138,0.15)] dark:shadow-[0_0_15px_rgba(0,255,194,0.15)] border border-primary-light/50 dark:border-getstarted-primary/50">
            <div className="flex flex-[2_2_0px] flex-col justify-center gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-light dark:text-getstarted-primary text-[20px]">
                    play_circle
                  </span>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                    Media Web API
                  </p>
                  <span className="bg-primary-light/20 dark:bg-getstarted-primary/20 text-primary-light dark:text-getstarted-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Recommended
                  </span>
                </div>
                <p className="text-slate-600 dark:text-[#9da6b9] text-sm font-normal leading-normal">
                  Browser-native solution, faster setup. Best for standard formats (MP4, WEBM). Recommended for most users and simpler workflows.
                </p>
              </div>
              <button
                onClick={() => handleSelectOption("media-api")}
                className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-primary-light dark:bg-getstarted-primary hover:bg-primary-light-hover dark:hover:brightness-110 text-white dark:text-black text-sm font-medium transition-colors w-fit"
              >
                <span>Select</span>
              </button>
            </div>
            <div className="w-32 sm:w-48 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg hidden sm:block relative overflow-hidden border border-slate-200 dark:border-gray-700">
              <div className="absolute inset-0 bg-green-900/10 dark:bg-green-900/20 mix-blend-overlay"></div>
            </div>
          </div>
        </div>

        {/* Footer Section: Privacy Note */}
        <div className="bg-slate-50 dark:bg-[#0b0d11] p-6 border-t border-slate-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 bg-primary-light/10 dark:bg-getstarted-primary/10 p-3 rounded-lg border border-primary-light/10 dark:border-getstarted-primary/10">
              <span className="material-symbols-outlined text-primary-light dark:text-getstarted-primary text-xl mt-0.5">
                lock
              </span>
              <p className="text-sm text-slate-600 dark:text-[#9da6b9] leading-snug">
                <span className="text-slate-900 dark:text-white font-medium">Privacy Note:</span>{" "}
                Your video is processed locally. No data leaves your device.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-600 dark:text-[#9da6b9] hover:text-slate-900 dark:hover:text-white text-sm font-medium px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
