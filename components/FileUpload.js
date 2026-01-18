"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import VideoConfirmationDialog from "./VideoConfirmationDialog";
import { selectVideoFile } from "@/lib/services/file-selector";
import { extractVideoMetadata } from "@/lib/services/video-metadata";
import { storeVideoMetadata } from "@/lib/services/indexeddb";
import { checkWasmAvailability } from "@/lib/services/wasm-checker";
import { extractAudioWithProgress } from "@/lib/services/audio-extraction";

export default function FileUpload({ onWasmDownloadRequired, wasmDownloadComplete, onAudioExtracted }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pendingFile, setPendingFile] = useState(null); // Store file waiting for WASM
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState({ percentage: 0, status: "" });
  const hasProcessedCompletionRef = useRef(false);

  const handleChooseVideo = async () => {
    try {
      const { fileHandle, file } = await selectVideoFile();
      setSelectedFile(file);
      setIsConfirming(true);
    } catch (error) {
      if (error.name !== "AbortError" && error.message !== "File selection cancelled") {
        console.error("Error selecting file:", error);
      }
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;

    setIsConfirming(false);
    setIsExtracting(true);
    setExtractionProgress({ percentage: 0, status: "Extracting metadata..." });

    try {
      // Extract and store video metadata
      const metadata = await extractVideoMetadata(null, selectedFile);
      await storeVideoMetadata(metadata);
      setExtractionProgress({ percentage: 20, status: "Metadata stored" });

      // Check WASM availability (will wait if downloads are in progress)
      setExtractionProgress({ percentage: 20, status: "Checking WASM availability..." });
      const wasmAvailable = await checkWasmAvailability();
      
      if (!wasmAvailable) {
        // Store file for later processing after WASM download
        setPendingFile(selectedFile);
        setIsExtracting(false);
        setSelectedFile(null);
        if (onWasmDownloadRequired) {
          onWasmDownloadRequired();
        }
        return;
      }

      // Process the file
      await processVideoFile(selectedFile);
    } catch (error) {
      console.error("Error processing video:", error);
      setExtractionProgress({ percentage: 0, status: `Error: ${error.message}` });
      setIsExtracting(false);
      setPendingFile(null);
    }
  };

  // Process video file (extract audio)
  const processVideoFile = useCallback(async (file) => {
    if (!file) return;

    setIsExtracting(true);
    setExtractionProgress({ percentage: 25, status: "Initializing audio extraction..." });
    
    try {
      const audioBlob = await extractAudioWithProgress(
        file,
        (percentage, status) => {
          setExtractionProgress({ percentage, status });
        }
      );

      setExtractionProgress({ percentage: 100, status: "Audio extraction complete!" });
      
      // Pass audio blob to parent
      if (onAudioExtracted) {
        onAudioExtracted(audioBlob, file.name);
      }
      
      // Reset after a delay
      setTimeout(() => {
        setIsExtracting(false);
        setSelectedFile(null);
        setPendingFile(null);
        setExtractionProgress({ percentage: 0, status: "" });
      }, 2000);
    } catch (error) {
      console.error("Error extracting audio:", error);
      setExtractionProgress({ percentage: 0, status: `Error: ${error.message}` });
      setIsExtracting(false);
      setPendingFile(null);
      throw error;
    }
  }, [onAudioExtracted]);

  const handleCancel = () => {
    setIsConfirming(false);
    setSelectedFile(null);
  };

  // Resume processing when WASM download completes
  useEffect(() => {
    const resumeProcessing = async () => {
      if (pendingFile && !isExtracting) {
        // Check if WASM is now available
        const wasmAvailable = await checkWasmAvailability();
        console.log("Checking WASM availability:", wasmAvailable, "pendingFile:", !!pendingFile, "isExtracting:", isExtracting);
        if (wasmAvailable) {
          console.log("WASM download complete, resuming video processing...");
          hasProcessedCompletionRef.current = true;
          setIsExtracting(true);
          setExtractionProgress({ percentage: 20, status: "WASM ready, resuming extraction..." });
          
          try {
            await processVideoFile(pendingFile);
          } catch (error) {
            console.error("Error resuming video processing:", error);
            setExtractionProgress({ percentage: 0, status: `Error: ${error.message}` });
            setIsExtracting(false);
            setPendingFile(null);
          }
        }
      }
    };

    // If download just completed and we haven't processed it yet, wait a bit for IndexedDB writes to complete, then check
    if (wasmDownloadComplete && pendingFile && !isExtracting && !hasProcessedCompletionRef.current) {
      console.log("WASM download completion detected, waiting for IndexedDB writes...");
      // Wait 500ms for IndexedDB writes to complete
      const timeoutId = setTimeout(() => {
        console.log("Checking WASM availability after download...");
        resumeProcessing();
      }, 500);
      return () => clearTimeout(timeoutId);
    }

    // Reset the flag when download status changes
    if (!wasmDownloadComplete) {
      hasProcessedCompletionRef.current = false;
    }

    // Check periodically if WASM becomes available (always poll when there's a pending file)
    if (pendingFile) {
      const interval = setInterval(resumeProcessing, 1000); // Check every second
      return () => clearInterval(interval);
    }
  }, [pendingFile, isExtracting, processVideoFile, wasmDownloadComplete]);

  return (
    <>
      <div className="p-6 md:p-8 2xl:p-10 3xl:p-12 flex flex-col flex-grow items-center justify-center text-center">
        <div className="w-full max-w-md 2xl:max-w-lg 3xl:max-w-xl aspect-[4/3] rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-primary-light/50 dark:hover:border-getstarted-primary/50 transition-all cursor-pointer group flex flex-col items-center justify-center p-8 2xl:p-10 3xl:p-12 gap-6 2xl:gap-8">
          {isExtracting ? (
            <>
              <div className="size-16 2xl:size-20 3xl:size-24 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-light dark:text-getstarted-primary text-[32px] 2xl:text-[40px] 3xl:text-[48px] animate-spin">
                  sync
                </span>
              </div>
              <div className="space-y-2 2xl:space-y-3">
                <h3 className="text-lg 2xl:text-xl 3xl:text-2xl font-bold text-slate-900 dark:text-white">
                  Processing...
                </h3>
                <p className="text-sm 2xl:text-base 3xl:text-lg text-slate-500 dark:text-slate-400">
                  {extractionProgress.status}
                </p>
                <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 mt-4">
                  <div
                    className="bg-primary-light dark:bg-getstarted-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${extractionProgress.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {extractionProgress.percentage}%
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="size-16 2xl:size-20 3xl:size-24 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-primary-light dark:text-getstarted-primary text-[32px] 2xl:text-[40px] 3xl:text-[48px]">
                  cloud_upload
                </span>
              </div>
              <div className="space-y-2 2xl:space-y-3">
                <h3 className="text-lg 2xl:text-xl 3xl:text-2xl font-bold text-slate-900 dark:text-white">
                  Drag & drop your recording
                </h3>
                <p className="text-sm 2xl:text-base 3xl:text-lg text-slate-500 dark:text-slate-400 px-4 2xl:px-6">
                  Supports MP4, MOV, WEBM. <br /> Max file size depends on your browser
                  limits.
                </p>
              </div>
              <Button
                onClick={handleChooseVideo}
                className="w-auto min-w-[140px] 2xl:min-w-[160px] 3xl:min-w-[180px] 2xl:h-11 3xl:h-12 2xl:text-base 3xl:text-lg bg-primary-light dark:bg-getstarted-primary hover:bg-primary-light-hover dark:hover:bg-getstarted-primary/90 text-white dark:text-black"
              >
                Choose Video
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="mt-8 2xl:mt-10 3xl:mt-12 max-w-xs 2xl:max-w-sm 3xl:max-w-md mx-auto space-y-3 2xl:space-y-4">
        <div className="flex items-start gap-3 2xl:gap-4 text-left p-3 2xl:p-4 3xl:p-5 rounded-lg bg-blue-50 dark:bg-getstarted-primary/5 border border-blue-100 dark:border-getstarted-primary/20">
          <span className="material-symbols-outlined text-primary-light dark:text-getstarted-primary text-[20px] 2xl:text-[24px] 3xl:text-[28px] shrink-0 mt-0.5">
            lock
          </span>
          <p className="text-xs 2xl:text-sm 3xl:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Your file is processed locally via WebAssembly. No audio or video
            data is ever sent to a server.
          </p>
        </div>
      </div>
      <VideoConfirmationDialog
        isOpen={isConfirming}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        fileName={selectedFile?.name}
        fileSize={selectedFile?.size}
      />
    </>
  );
}
