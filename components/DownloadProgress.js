"use client";

export default function DownloadProgress({ progress, timeRemaining, currentFile, fileProgress, onCancel }) {
  if (progress === undefined || progress === null) return null;
  
  const percentage = typeof progress === 'object' ? progress.totalPercentage || progress.percentage : progress;
  const fileProgressPercentage = fileProgress || (typeof progress === 'object' ? progress.fileProgress : 0);

  // Format file name for display
  const getDisplayFileName = (fileName) => {
    if (!fileName) return "";
    const fileInfo = {
      "ffmpeg-core.wasm": "FFmpeg Core",
      "ffmpeg-core.worker.js": "Worker Script",
    };
    return fileInfo[fileName] || fileName;
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 w-80">
      <div className="bg-white dark:bg-[#1c1f27] border border-slate-200 dark:border-gray-800 rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-light dark:text-getstarted-primary text-[20px] animate-spin">
              progress_activity
            </span>
            <span className="text-slate-900 dark:text-white text-sm font-medium">
              Downloading FFmpeg
            </span>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {currentFile && (
          <div className="mb-3">
            <p className="text-slate-600 dark:text-[#9da6b9] text-xs mb-1">
              {getDisplayFileName(currentFile)}
            </p>
            {fileProgressPercentage > 0 && fileProgressPercentage < 100 && (
              <div className="w-full bg-slate-200 dark:bg-[#282e39] rounded-full h-1.5 overflow-hidden mb-2">
                <div
                  className="bg-primary-light/60 dark:bg-getstarted-primary/60 h-1.5 rounded-full transition-all duration-200"
                  style={{ width: `${fileProgressPercentage}%` }}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-900 dark:text-white text-sm font-semibold">
            {percentage}%
          </span>
          <span className="text-slate-500 dark:text-[#9da6b9] text-xs">
            {timeRemaining || "Downloading..."}
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-[#282e39] rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary-light dark:bg-getstarted-primary h-2 rounded-full transition-all duration-300 relative"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/20 animate-pulse w-full h-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
