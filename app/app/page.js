"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import StatusFooter from "@/components/StatusFooter";
import AudioExtractionModal from "@/components/AudioExtractionModal";
import ExtractionMethodSelector from "@/components/ExtractionMethodSelector";
import FFmpegDownloadOptions from "@/components/FFmpegDownloadOptions";
import DownloadProgress from "@/components/DownloadProgress";
import { Card } from "@/components/ui/card";
import AudioPlayer from "@/components/AudioPlayer";
import { useFFmpeg } from "@/lib/hooks/use-ffmpeg";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [ffmpegDownloadStatus, setFfmpegDownloadStatus] = useState(null); // null, "options", "downloading", "completed"
  const [downloadProgress, setDownloadProgress] = useState({
    totalPercentage: 0,
    timeRemaining: "0 mins",
    currentFile: "",
    fileProgress: 0,
  });
  const downloadIntervalRef = useRef(null);
  const downloadAbortControllerRef = useRef(null);
  const [extractedAudio, setExtractedAudio] = useState(null);
  const [extractedAudioFileName, setExtractedAudioFileName] = useState(null);

  // Use FFmpeg hook
  const {
    downloadStatus,
    initStatus,
    downloadProgress: ffmpegProgress,
    error: ffmpegError,
    downloadAndInitialize,
    checkIfDownloaded,
    ffmpegReady,
  } = useFFmpeg();

  useEffect(() => {
    // Check if modal has been shown in this session
    const modalShown = sessionStorage.getItem("audioExtractionModalShown");
    
    if (!modalShown) {
      // Open modal after 7 seconds
      const timer = setTimeout(() => {
        setIsModalOpen(true);
        setHasShownModal(true);
        sessionStorage.setItem("audioExtractionModalShown", "true");
      }, 7000);

      return () => clearTimeout(timer);
    }

    // Load saved selection
    const savedMethod = localStorage.getItem("audioExtractionMethod");
    if (savedMethod) {
      setSelectedMethod(savedMethod);
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectOption = (option) => {
    if (option === "media-api") {
      setSelectedMethod("media-api");
      localStorage.setItem("audioExtractionMethod", "media-api");
      setIsModalOpen(false);
    } else if (option === "ffmpeg") {
      setSelectedMethod("ffmpeg");
      setFfmpegDownloadStatus("options");
      setIsModalOpen(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleStartDownload = async (optionId) => {
    try {
      setFfmpegDownloadStatus("downloading");
      setDownloadProgress({
        totalPercentage: 0,
        timeRemaining: "Calculating...",
        currentFile: "",
        fileProgress: 0,
      });

      // Start download and initialization
      const success = await downloadAndInitialize((totalPercentage, currentFile, fileProgress) => {
        // Calculate estimated time remaining (rough estimate)
        const remaining = totalPercentage < 100 
          ? Math.max(1, Math.ceil((100 - totalPercentage) / 10))
          : 0;
        
        setDownloadProgress({
          totalPercentage,
          timeRemaining: remaining > 0 ? `~${remaining} mins` : "Almost done...",
          currentFile: currentFile || "",
          fileProgress: fileProgress || 0,
        });
      });

      if (success) {
        setDownloadProgress({
          totalPercentage: 100,
          timeRemaining: "0 mins",
          currentFile: "",
          fileProgress: 100,
        });
        
        // Set download status to completed to trigger resume
        setFfmpegDownloadStatus("completed");
        
        // Update selected method after download completes
        setTimeout(() => {
          setSelectedMethod("ffmpeg");
          setFfmpegDownloadStatus(null);
          localStorage.setItem("audioExtractionMethod", "ffmpeg");
        }, 1000);
      } else {
        // Handle error
        setFfmpegDownloadStatus("error");
        console.error("FFmpeg download failed:", ffmpegError);
      }
    } catch (error) {
      console.error("Error starting download:", error);
      setFfmpegDownloadStatus("error");
      setDownloadProgress({
        totalPercentage: 0,
        timeRemaining: "Error",
        currentFile: "",
        fileProgress: 0,
      });
    }
  };

  const handleCancelDownload = () => {
    // Abort download if possible
    if (downloadAbortControllerRef.current) {
      downloadAbortControllerRef.current.abort();
      downloadAbortControllerRef.current = null;
    }
    
    if (downloadIntervalRef.current) {
      clearInterval(downloadIntervalRef.current);
      downloadIntervalRef.current = null;
    }
    
    setFfmpegDownloadStatus(null);
    setDownloadProgress({
      totalPercentage: 0,
      timeRemaining: "0 mins",
      currentFile: "",
      fileProgress: 0,
    });
    
    // Revert selected method if download was cancelled before completion
    const savedMethod = localStorage.getItem("audioExtractionMethod");
    setSelectedMethod(savedMethod || null);
  };

  const handleCloseDownloadOptions = () => {
    setFfmpegDownloadStatus(null);
    // Revert selected method if download options were closed without starting download
    const savedMethod = localStorage.getItem("audioExtractionMethod");
    if (savedMethod !== "ffmpeg") {
      setSelectedMethod(savedMethod || null);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen || ffmpegDownloadStatus === "options") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, ffmpegDownloadStatus]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-getstarted-bg-dark text-slate-900 dark:text-slate-300 transition-colors duration-200">
      <Header />
      <main className="flex-grow flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-16 max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 2xl:gap-8 3xl:gap-10 h-full min-h-[600px] 2xl:min-h-[700px]">
          {/* Left: File Upload */}
          <div className="flex flex-col h-full">
            <Card className="bg-white dark:bg-getstarted-card-dark rounded-xl shadow-sm border border-slate-100 dark:border-white/5 flex flex-col h-full overflow-hidden">
              <FileUpload 
                onWasmDownloadRequired={() => setFfmpegDownloadStatus("options")}
                wasmDownloadComplete={ffmpegDownloadStatus === "completed" || downloadStatus === "completed" || ffmpegReady}
                onAudioExtracted={(audioBlob, fileName) => {
                  setExtractedAudio(audioBlob);
                  setExtractedAudioFileName(fileName);
                }}
              />
            </Card>
          </div>
          
          {/* Right: Audio Player */}
          <div className="flex flex-col h-full">
            <Card className="bg-white dark:bg-getstarted-card-dark rounded-xl shadow-sm border border-slate-100 dark:border-white/5 flex flex-col h-full overflow-hidden">
              <AudioPlayer audioBlob={extractedAudio} fileName={extractedAudioFileName} />
            </Card>
          </div>
        </div>
      </main>
      <AudioExtractionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelect={handleSelectOption}
      />
      <FFmpegDownloadOptions
        isOpen={ffmpegDownloadStatus === "options"}
        onClose={handleCloseDownloadOptions}
        onStartDownload={handleStartDownload}
      />
      {ffmpegDownloadStatus === "downloading" ? (
        <DownloadProgress
          progress={downloadProgress.totalPercentage}
          timeRemaining={downloadProgress.timeRemaining}
          currentFile={downloadProgress.currentFile}
          fileProgress={downloadProgress.fileProgress}
          onCancel={handleCancelDownload}
        />
      ) : (
        <ExtractionMethodSelector
          selectedMethod={selectedMethod}
          onOpenModal={handleOpenModal}
        />
      )}
    </div>
  );
}
