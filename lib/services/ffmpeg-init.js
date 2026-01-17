import { getCachedFile } from "./ffmpeg-downloader";
import { FFMPEG_FILES, FFMPEG_CDN_BASE } from "../config/ffmpeg-config";

let ffmpegInstance = null;
let isInitializing = false;
let initializationPromise = null;
let FFmpegClass = null;
let fetchFileUtil = null;

/**
 * Get or create FFmpeg instance (singleton)
 * @returns {Promise<FFmpeg>}
 */
export async function getFFmpegInstance() {
  if (ffmpegInstance) {
    return ffmpegInstance;
  }

  if (isInitializing && initializationPromise) {
    return initializationPromise;
  }

  isInitializing = true;
  initializationPromise = initializeFFmpeg();
  
  try {
    ffmpegInstance = await initializationPromise;
    return ffmpegInstance;
  } finally {
    isInitializing = false;
    initializationPromise = null;
  }
}

/**
 * Load FFmpeg dynamically (client-side only)
 */
async function loadFFmpeg() {
  if (typeof window === "undefined") {
    throw new Error("FFmpeg can only be loaded in the browser");
  }

  if (FFmpegClass && fetchFileUtil) {
    return { FFmpeg: FFmpegClass, fetchFile: fetchFileUtil, toBlobURL: toBlobURLUtil };
  }

  try {
    // Dynamic import to avoid Next.js static analysis issues
    const [{ FFmpeg }, { fetchFile, toBlobURL }] = await Promise.all([
      import("@ffmpeg/ffmpeg"),
      import("@ffmpeg/util"),
    ]);

    FFmpegClass = FFmpeg;
    fetchFileUtil = fetchFile;
    toBlobURLUtil = toBlobURL;

    return { FFmpeg, fetchFile, toBlobURL };
  } catch (error) {
    console.error("Error loading FFmpeg modules:", error);
    const errorMessage = error?.message || error?.toString() || "Unknown error";
    throw new Error(`Failed to load FFmpeg: ${errorMessage}`);
  }
}

let toBlobURLUtil = null;

/**
 * Initialize FFmpeg with cached files or CDN
 * @returns {Promise<FFmpeg>}
 */
async function initializeFFmpeg() {
  // Load FFmpeg dynamically
  const { FFmpeg, fetchFile, toBlobURL } = await loadFFmpeg();
  const ffmpeg = new FFmpeg();

  try {
    // Hybrid approach: Always use CDN URLs for loading FFmpeg
    // Browser HTTP cache will automatically serve from cache if available
    // IndexedDB is still used for:
    // 1. Verifying files are downloaded
    // 2. Offline verification
    // 3. Progress tracking during download
    
    // Always use CDN URLs - browser cache handles it automatically
    const coreURL = await toBlobURL(
      `${FFMPEG_CDN_BASE}/${FFMPEG_FILES.core.key}`
    );
    const wasmURL = coreURL;
    
    // For single-threaded @ffmpeg/core, worker file doesn't exist
    // Don't set workerURL - FFmpeg will handle it internally

    // Load FFmpeg
    await ffmpeg.load({
      coreURL,
      wasmURL,
      // No workerURL for single-threaded version
    });

    // Optional: Set up logging
    ffmpeg.on("log", ({ message }) => {
      console.log("[FFmpeg]", message);
    });

    return ffmpeg;
  } catch (error) {
    console.error("Error initializing FFmpeg:", error);
    const errorMessage = error?.message || error?.toString() || "Unknown error";
    throw new Error(`Failed to initialize FFmpeg: ${errorMessage}`);
  }
}

/**
 * Check if FFmpeg is initialized
 * @returns {boolean}
 */
export function isFFmpegInitialized() {
  return ffmpegInstance !== null && ffmpegInstance.loaded;
}

/**
 * Reset FFmpeg instance (for testing or re-initialization)
 */
export function resetFFmpegInstance() {
  if (ffmpegInstance) {
    ffmpegInstance.terminate();
    ffmpegInstance = null;
  }
  isInitializing = false;
  initializationPromise = null;
}

/**
 * Extract audio from video file using FFmpeg
 * @param {File} videoFile - Video file to extract audio from
 * @param {string} outputFormat - Output audio format (e.g., 'mp3', 'aac', 'wav')
 * @returns {Promise<Blob>} Extracted audio blob
 */
export async function extractAudioFromVideo(videoFile, outputFormat = "aac") {
  const ffmpeg = await getFFmpegInstance();
  const { fetchFile } = await loadFFmpeg();

  try {
    const inputFileName = "input." + videoFile.name.split(".").pop();
    const outputFileName = `output.${outputFormat}`;

    // Write video file to FFmpeg filesystem
    await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile));

    // Execute FFmpeg command to extract audio
    await ffmpeg.exec([
      "-i",
      inputFileName,
      "-vn", // No video
      "-acodec",
      "copy", // Copy audio codec (or use 'libmp3lame' for MP3)
      outputFileName,
    ]);

    // Read output file
    const audioData = await ffmpeg.readFile(outputFileName);

    // Clean up files
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    // Convert to Blob
    return new Blob([audioData], {
      type: `audio/${outputFormat}`,
    });
  } catch (error) {
    console.error("Error extracting audio:", error);
    throw new Error(`Failed to extract audio: ${error.message}`);
  }
}
