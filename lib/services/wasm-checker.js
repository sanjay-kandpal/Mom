import { areFilesCached, verifyFiles } from "./ffmpeg-downloader";

const DOWNLOAD_STATUS_KEY = "ffmpeg-download-status";
const DOWNLOAD_STATUS_DOWNLOADING = "downloading";
const DOWNLOAD_STATUS_COMPLETED = "completed";
const DOWNLOAD_STATUS_IDLE = "idle";

/**
 * Check if downloads are in progress
 * @returns {boolean} True if downloads are currently in progress
 */
function isDownloadInProgress() {
  if (typeof window === "undefined") return false;
  const status = sessionStorage.getItem(DOWNLOAD_STATUS_KEY);
  return status === DOWNLOAD_STATUS_DOWNLOADING;
}

/**
 * Wait for downloads to complete (polling)
 * @param {number} maxWaitTime - Maximum time to wait in milliseconds (default: 5 minutes)
 * @param {number} pollInterval - Polling interval in milliseconds (default: 500ms)
 * @returns {Promise<boolean>} True if downloads completed, false if timeout
 */
async function waitForDownloadComplete(maxWaitTime = 5 * 60 * 1000, pollInterval = 500) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    if (!isDownloadInProgress()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  return false;
}

/**
 * Check if WASM files are available in IndexedDB
 * Waits for any ongoing downloads to complete before checking
 * @returns {Promise<boolean>} True if WASM files are cached and valid
 */
export async function checkWasmAvailability() {
  try {
    // Check if downloads are in progress
    if (isDownloadInProgress()) {
      console.log("WASM files are currently downloading, waiting for completion...");
      
      // Wait for downloads to complete (max 5 minutes)
      const completed = await waitForDownloadComplete();
      if (!completed) {
        console.warn("Download wait timeout, checking current status...");
      }
    }

    const cached = await areFilesCached();
    if (!cached) {
      return false;
    }

    const verification = await verifyFiles();
    return verification.allValid;
  } catch (error) {
    console.error("Error checking WASM availability:", error);
    return false;
  }
}

/**
 * Set download status in sessionStorage
 * @param {string} status - Download status (downloading, completed, idle)
 */
export function setDownloadStatus(status) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DOWNLOAD_STATUS_KEY, status);
}

/**
 * Get current download status
 * @returns {string} Current download status
 */
export function getDownloadStatus() {
  if (typeof window === "undefined") return DOWNLOAD_STATUS_IDLE;
  return sessionStorage.getItem(DOWNLOAD_STATUS_KEY) || DOWNLOAD_STATUS_IDLE;
}
