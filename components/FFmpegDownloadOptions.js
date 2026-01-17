"use client";

export default function FFmpegDownloadOptions({ isOpen, onClose, onStartDownload }) {
  if (!isOpen) return null;

  const downloadOptions = [
    {
      id: "ffmpeg-wasm",
      name: "FFmpeg.wasm Core",
      description: "WebAssembly version of FFmpeg for browser use",
      size: "~8MB",
      icon: "code",
    },
    {
      id: "ffmpeg-core",
      name: "FFmpeg Core Files",
      description: "Essential FFmpeg binaries and libraries",
      size: "~12MB",
      icon: "settings",
    },
    {
      id: "ffmpeg-codecs",
      name: "Additional Codecs",
      description: "Extended codec support for various formats",
      size: "~15MB",
      icon: "tune",
    },
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = (optionId) => {
    onStartDownload(optionId);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-[#111318] w-full max-w-[600px] rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="p-6 pb-2 text-center">
          <h2 className="text-slate-900 dark:text-white tracking-tight text-[24px] font-bold leading-tight pb-2">
            Download FFmpeg Components
          </h2>
          <p className="text-slate-600 dark:text-[#9da6b9] text-base font-normal leading-normal max-w-lg mx-auto">
            The following components will be downloaded for video to audio extraction. All components are required for full functionality.
          </p>
        </div>

        {/* Scrollable Content: Download Options */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {downloadOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-3 rounded-xl bg-white dark:bg-[#1c1f27] p-4 border border-slate-200 dark:border-gray-800"
            >
              <span className="material-symbols-outlined text-primary-light dark:text-getstarted-primary text-[24px]">
                {option.icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">
                    {option.name}
                  </p>
                  <span className="text-slate-500 dark:text-[#9da6b9] text-xs">
                    {option.size}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-[#9da6b9] text-sm font-normal leading-normal mt-1">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-[#0b0d11] p-6 border-t border-slate-200 dark:border-gray-800">
          <div className="flex items-center justify-between gap-4">
            <div className="text-slate-600 dark:text-[#9da6b9] text-sm">
              Total size: ~35MB
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="text-slate-600 dark:text-[#9da6b9] hover:text-slate-900 dark:hover:text-white text-sm font-medium px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDownload("all")}
                className="flex items-center justify-center gap-2 rounded-lg h-9 px-6 bg-primary-light dark:bg-getstarted-primary hover:bg-primary-light-hover dark:hover:brightness-110 text-white dark:text-black text-sm font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download All</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
