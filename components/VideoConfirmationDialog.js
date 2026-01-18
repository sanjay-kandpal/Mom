"use client";

import { Button } from "@/components/ui/button";

export default function VideoConfirmationDialog({ isOpen, onClose, onConfirm, fileName, fileSize }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-[#111318] w-full max-w-[500px] rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 flex flex-col overflow-hidden animate-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="p-6 pb-4 text-center">
          <h2 className="text-slate-900 dark:text-white tracking-tight text-[24px] font-bold leading-tight pb-2">
            Confirm Video Selection
          </h2>
          <p className="text-slate-600 dark:text-[#9da6b9] text-base font-normal leading-normal">
            Is this the correct video file?
          </p>
        </div>

        {/* Video Info */}
        <div className="px-6 py-4">
          <div className="bg-slate-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-light dark:text-getstarted-primary text-[20px]">
                video_file
              </span>
              <p className="text-slate-900 dark:text-white font-medium truncate">{fileName}</p>
            </div>
            {fileSize && (
              <p className="text-slate-500 dark:text-slate-400 text-sm ml-7">
                {formatFileSize(fileSize)}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            No, Cancel
          </Button>
          <Button
            className="flex-1 bg-primary-light dark:bg-getstarted-primary hover:bg-primary-light-hover dark:hover:bg-getstarted-primary/90 text-white dark:text-black"
            onClick={onConfirm}
          >
            Yes, Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
