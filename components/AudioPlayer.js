"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AudioPlayer({ audioBlob, fileName }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [audioBlob]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audio.currentTime = percentage * duration;
  };

  const formatTime = (seconds) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDownload = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName ? fileName.replace(/\.[^/.]+$/, ".aac") : "extracted-audio.aac";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!audioBlob || !audioUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="size-16 2xl:size-20 3xl:size-24 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center">
          <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[32px] 2xl:text-[40px] 3xl:text-[48px]">
            graphic_eq
          </span>
        </div>
        <p className="mt-4 text-sm 2xl:text-base 3xl:text-lg text-slate-500 dark:text-slate-400">
          Audio will appear here after extraction
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 2xl:p-8 3xl:p-10">
      <div className="mb-6">
        <h3 className="text-lg 2xl:text-xl 3xl:text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Extracted Audio
        </h3>
        {fileName && (
          <p className="text-sm 2xl:text-base text-slate-500 dark:text-slate-400 truncate">
            {fileName.replace(/\.[^/.]+$/, ".aac")}
          </p>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Audio Player */}
          <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-6 2xl:p-8 border border-slate-200 dark:border-white/10">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Play Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={togglePlay}
                className="size-16 2xl:size-20 3xl:size-24 rounded-full bg-primary-light dark:bg-getstarted-primary hover:bg-primary-light-hover dark:hover:bg-getstarted-primary/90 text-white dark:text-black flex items-center justify-center shadow-lg transition-all hover:scale-105"
              >
                <span className="material-symbols-outlined text-[32px] 2xl:text-[40px] 3xl:text-[48px]">
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div
                className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="h-2 bg-primary-light dark:bg-getstarted-primary rounded-full transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            className="w-full bg-primary-light dark:bg-getstarted-primary hover:bg-primary-light-hover dark:hover:bg-getstarted-primary/90 text-white dark:text-black"
          >
            <span className="material-symbols-outlined mr-2">download</span>
            Download Audio
          </Button>
        </div>
      </div>
    </div>
  );
}
