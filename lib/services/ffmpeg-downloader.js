import { storeFile, fileExists, getFile } from "./indexeddb";
import { FFMPEG_FILES, getAllFileKeys, getFileInfo, getTotalSize, FFMPEG_CDN_FALLBACK, FFMPEG_VERSION } from "../config/ffmpeg-config";
import { fetchFile } from "@ffmpeg/util";
import { setDownloadStatus } from "./wasm-checker";

/**
 * Download a single file with progress tracking
 * @param {object} fileInfo - File information object
 * @param {function} onProgress - Progress callback (percentage, loaded, total)
 * @param {boolean} useFallback - Use fallback CDN
 * @returns {Promise<ArrayBuffer|string>}
 */
async function downloadFile(fileInfo, onProgress, useFallback = false) {
  let url = fileInfo.url;
  
  if (useFallback) {
    // Use jsDelivr CDN as fallback
    url = `${FFMPEG_CDN_FALLBACK}/${fileInfo.key}`;
  }

  try {
    // Use @ffmpeg/util's fetchFile which handles CORS and other issues better
    const data = await fetchFile(url, {
      progress: (loaded, total) => {
        if (onProgress && total > 0) {
          const percentage = Math.round((loaded / total) * 100);
          onProgress(percentage, loaded, total);
        }
      },
    });

      // fetchFile returns ArrayBuffer for binary files and can handle text
    if (fileInfo.type === "wasm") {
      // For WASM files, ensure we have ArrayBuffer
      if (data instanceof ArrayBuffer) {
        return data;
      } else if (data instanceof Uint8Array) {
        return data.buffer;
      } else {
        // Convert to ArrayBuffer if needed
        return new Uint8Array(data).buffer;
      }
    } else {
      // For JS files, convert to string
      if (typeof data === "string") {
        return data;
      } else if (data instanceof ArrayBuffer) {
        return new TextDecoder().decode(data);
      } else {
        return String(data);
      }
    }
  } catch (error) {
    console.error(`Error downloading ${fileInfo.key} from ${url}:`, error);
    
    // If primary CDN fails and we haven't tried fallback, retry with fallback
    if (!useFallback) {
      console.log(`Retrying ${fileInfo.key} with fallback CDN...`);
      return downloadFile(fileInfo, onProgress, true);
    }
    
    throw new Error(`Failed to download ${fileInfo.key}: ${error.message}`);
  }
}

/**
 * Download all FFmpeg files
 * @param {function} onProgress - Progress callback (totalPercentage, currentFile, fileProgress)
 * @param {function} onFileComplete - Callback when a file completes (fileName)
 * @returns {Promise<object>} Download result with success status
 */
export async function downloadFFmpegFiles(onProgress, onFileComplete) {
  const files = Object.values(FFMPEG_FILES);
  const totalSize = getTotalSize();
  let totalDownloaded = 0;
  const results = {};

  try {
    // Set download status to downloading
    setDownloadStatus("downloading");
    for (const fileInfo of files) {
      // Check if file already exists in cache
      const exists = await fileExists(fileInfo.key);
      if (exists) {
        // File already cached, skip download
        if (onFileComplete) onFileComplete(fileInfo.key);
        totalDownloaded += fileInfo.size;
        if (onProgress) {
          const totalPercentage = Math.round((totalDownloaded / totalSize) * 100);
          onProgress(totalPercentage, fileInfo.key, 100);
        }
        results[fileInfo.key] = { success: true, cached: true };
        continue;
      }

      // Skip worker file download for single-threaded @ffmpeg/core
      // The worker file doesn't exist in the single-threaded version
      if (fileInfo.key === "ffmpeg-core.worker.js") {
        console.log("Skipping worker file download - not available in single-threaded @ffmpeg/core");
        results[fileInfo.key] = { success: true, skipped: true };
        continue;
      }

      // Download file with progress tracking
      let fileProgress = 0;
      const fileData = await downloadFile(
        fileInfo,
        (percentage, loaded, total) => {
          fileProgress = percentage;
          totalDownloaded = totalDownloaded - (fileInfo.size * (fileProgress / 100)) + loaded;
          if (onProgress) {
            const totalPercentage = Math.round((totalDownloaded / totalSize) * 100);
            onProgress(totalPercentage, fileInfo.key, percentage);
          }
        },
        false // Try primary CDN first
      );

      // Store in IndexedDB
      await storeFile(fileInfo.key, fileData);

      if (onFileComplete) onFileComplete(fileInfo.key);
      results[fileInfo.key] = { success: true, cached: false };
    }

    // Store download metadata
    await storeFile("ffmpeg-version", FFMPEG_VERSION);
    await storeFile("ffmpeg-download-date", new Date().toISOString());

    // Set download status to completed
    setDownloadStatus("completed");

    return {
      success: true,
      files: results,
    };
  } catch (error) {
    console.error("Error downloading FFmpeg files:", error);
    // Set download status to idle on error
    setDownloadStatus("idle");
    return {
      success: false,
      error: error.message,
      files: results,
    };
  }
}

/**
 * Check if all FFmpeg files are cached
 * @returns {Promise<boolean>}
 */
export async function areFilesCached() {
  const keys = getAllFileKeys();
  for (const key of keys) {
    // Skip worker file check - it's not available in single-threaded @ffmpeg/core
    if (key === "ffmpeg-core.worker.js") {
      continue;
    }
    const exists = await fileExists(key);
    if (!exists) {
      console.log(`File not cached: ${key}`);
      return false;
    }
  }
  console.log("All required FFmpeg files are cached");
  return true;
}

/**
 * Get cached file
 * @param {string} key - File key
 * @returns {Promise<ArrayBuffer|string|null>}
 */
export async function getCachedFile(key) {
  return await getFile(key);
}

/**
 * Verify downloaded files are valid
 * @returns {Promise<object>} Verification result
 */
export async function verifyFiles() {
  const keys = getAllFileKeys();
  const results = {};

  for (const key of keys) {
    // Skip worker file verification - it's not available in single-threaded @ffmpeg/core
    if (key === "ffmpeg-core.worker.js") {
      results[key] = { valid: true, skipped: true };
      continue;
    }

    const file = await getFile(key);
    const fileInfo = getFileInfo(key);
    
    if (!file) {
      results[key] = { valid: false, reason: "File not found" };
      continue;
    }

    // Basic validation
    if (fileInfo.type === "wasm" && !(file instanceof ArrayBuffer)) {
      results[key] = { valid: false, reason: "Invalid WASM format" };
      continue;
    }

    if (fileInfo.type === "js" && typeof file !== "string") {
      results[key] = { valid: false, reason: "Invalid JS format" };
      continue;
    }

    results[key] = { valid: true };
  }

  const allValid = Object.values(results).every((r) => r.valid);
  return {
    allValid,
    results,
  };
}
