/**
 * FFmpeg Configuration
 * CDN URLs and file information for FFmpeg.wasm
 */

export const FFMPEG_VERSION = "0.12.6";
export const FFMPEG_CDN_BASE = `https://unpkg.com/@ffmpeg/core@${FFMPEG_VERSION}/dist/umd`;

/**
 * FFmpeg files to download
 */
export const FFMPEG_FILES = {
  // FIX: 'core' should be the JavaScript file, not WASM
  core: {
    key: "ffmpeg-core.js",  // ← Changed from .wasm to .js
    url: `${FFMPEG_CDN_BASE}/ffmpeg-core.js`,
    size: 500 * 1024, // ~500KB
    type: "js",
    description: "FFmpeg.wasm Core JavaScript",
  },
  // ADD: Separate wasm entry
  wasm: {
    key: "ffmpeg-core.wasm",
    url: `${FFMPEG_CDN_BASE}/ffmpeg-core.wasm`,
    size: 8 * 1024 * 1024, // ~8MB
    type: "wasm",
    description: "FFmpeg.wasm Core - WebAssembly binary",
  },
  worker: {
    key: "ffmpeg-core.worker.js",
    url: `${FFMPEG_CDN_BASE}/ffmpeg-core.worker.js`,
    size: 50 * 1024, // ~50KB
    type: "js",
    description: "FFmpeg Worker Script",
  },
};

/**
 * Alternative CDN (jsDelivr) as fallback
 */
export const FFMPEG_CDN_FALLBACK = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${FFMPEG_VERSION}/dist/umd`;

/**
 * Get file URL with fallback support
 * @param {string} fileName - Name of the file
 * @param {boolean} useFallback - Use fallback CDN
 * @returns {string}
 */
export function getFileUrl(fileName, useFallback = false) {
  const base = useFallback ? FFMPEG_CDN_FALLBACK : FFMPEG_CDN_BASE;
  return `${base}/${fileName}`;
}

/**
 * Get total download size
 * @returns {number} Total size in bytes
 */
export function getTotalSize() {
  return Object.values(FFMPEG_FILES).reduce((total, file) => total + file.size, 0);
}

/**
 * Get file info by key
 * @param {string} key - File key
 * @returns {object|null}
 */
export function getFileInfo(key) {
  return Object.values(FFMPEG_FILES).find((file) => file.key === key) || null;
}

/**
 * Get all file keys
 * @returns {string[]}
 */
export function getAllFileKeys() {
  return Object.values(FFMPEG_FILES).map((file) => file.key);
}