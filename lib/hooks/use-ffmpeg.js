"use client";

import { useState, useEffect, useCallback } from "react";
import { downloadFFmpegFiles, areFilesCached, verifyFiles } from "../services/ffmpeg-downloader";
import { getFFmpegInstance, isFFmpegInitialized } from "../services/ffmpeg-init";

/**
 * Custom hook for managing FFmpeg download and initialization
 * @returns {object} FFmpeg state and functions
 */
export function useFFmpeg() {
  const [downloadStatus, setDownloadStatus] = useState("idle"); // idle, checking, downloading, completed, error
  const [initStatus, setInitStatus] = useState("idle"); // idle, initializing, ready, error
  const [downloadProgress, setDownloadProgress] = useState({
    totalPercentage: 0,
    currentFile: "",
    fileProgress: 0,
  });
  const [error, setError] = useState(null);
  const [ffmpegReady, setFfmpegReady] = useState(false);

  /**
   * Check if FFmpeg files are already downloaded
   */
  const checkIfDownloaded = useCallback(async () => {
    try {
      setDownloadStatus("checking");
      const cached = await areFilesCached();
      
      if (cached) {
        const verification = await verifyFiles();
        if (verification.allValid) {
          setDownloadStatus("completed");
          return true;
        } else {
          // Files exist but are invalid, need to re-download
          setDownloadStatus("idle");
          return false;
        }
      }
      
      setDownloadStatus("idle");
      return false;
    } catch (err) {
      console.error("Error checking download status:", err);
      setDownloadStatus("idle");
      return false;
    }
  }, []);

  /**
   * Download FFmpeg files
   * @param {function} onProgress - Optional progress callback
   */
  const downloadFFmpeg = useCallback(async (onProgress) => {
    try {
      setDownloadStatus("downloading");
      setError(null);
      setDownloadProgress({
        totalPercentage: 0,
        currentFile: "",
        fileProgress: 0,
      });

      await downloadFFmpegFiles(
        (totalPercentage, currentFile, fileProgress) => {
          setDownloadProgress({
            totalPercentage,
            currentFile,
            fileProgress,
          });
          if (onProgress) {
            onProgress(totalPercentage, currentFile, fileProgress);
          }
        },
        (fileName) => {
          console.log(`Downloaded: ${fileName}`);
        }
      );

      setDownloadStatus("completed");
      return true;
    } catch (err) {
      console.error("Error downloading FFmpeg:", err);
      setError(err.message);
      setDownloadStatus("error");
      return false;
    }
  }, []);

  /**
   * Initialize FFmpeg
   */
  const initializeFFmpeg = useCallback(async () => {
    try {
      setInitStatus("initializing");
      setError(null);

      // Ensure we're in the browser
      if (typeof window === "undefined") {
        throw new Error("FFmpeg can only be initialized in the browser");
      }

      const ffmpeg = await getFFmpegInstance();
      
      if (ffmpeg && isFFmpegInitialized()) {
        setInitStatus("ready");
        setFfmpegReady(true);
        return ffmpeg;
      } else {
        throw new Error("FFmpeg initialization failed - instance not ready");
      }
    } catch (err) {
      console.error("Error initializing FFmpeg:", err);
      const errorMessage = err?.message || err?.toString() || "Unknown error";
      setError(errorMessage);
      setInitStatus("error");
      setFfmpegReady(false);
      throw err;
    }
  }, []);

  /**
   * Download and initialize FFmpeg in one flow
   */
  const downloadAndInitialize = useCallback(async (onProgress) => {
    try {
      // Check if already downloaded
      const isDownloaded = await checkIfDownloaded();
      
      if (!isDownloaded) {
        // Download files
        const downloadSuccess = await downloadFFmpeg(onProgress);
        if (!downloadSuccess) {
          return false;
        }
      }

      // Initialize FFmpeg
      await initializeFFmpeg();
      return true;
    } catch (err) {
      console.error("Error in download and initialize:", err);
      setError(err.message);
      return false;
    }
  }, [checkIfDownloaded, downloadFFmpeg, initializeFFmpeg]);

  // Check on mount if files are already downloaded
  useEffect(() => {
    checkIfDownloaded();
  }, [checkIfDownloaded]);

  return {
    // State
    downloadStatus,
    initStatus,
    downloadProgress,
    error,
    ffmpegReady,
    
    // Functions
    downloadFFmpeg,
    initializeFFmpeg,
    downloadAndInitialize,
    checkIfDownloaded,
  };
}
