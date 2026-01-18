/**
 * Extract video metadata from file handle and file object
 * @param {FileSystemFileHandle|null} fileHandle - File system handle (may be null)
 * @param {File} file - File object
 * @returns {Promise<object>} Video metadata object
 */
export async function extractVideoMetadata(fileHandle, file) {
  const metadata = {
    fileHandle: null, // File handles cannot be serialized, store null
    fileName: file.name,
    fileSize: file.size,
    duration: null,
    resolution: { width: null, height: null },
    createdAt: file.lastModified ? new Date(file.lastModified).toISOString() : new Date().toISOString(),
    lastOpenedAt: new Date().toISOString(),
  };

  // Extract duration and resolution using video element
  try {
    const videoMetadata = await extractVideoProperties(file);
    metadata.duration = videoMetadata.duration;
    metadata.resolution = {
      width: videoMetadata.width,
      height: videoMetadata.height,
    };
  } catch (error) {
    console.warn("Failed to extract video properties:", error);
  }

  return metadata;
}

/**
 * Extract video properties (duration, resolution) using HTMLVideoElement
 * @param {File} file - Video file
 * @returns {Promise<object>} Video properties
 */
function extractVideoProperties(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    video.preload = "metadata";
    video.src = url;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };

    video.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video metadata"));
    };

    // Timeout after 10 seconds
    setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error("Video metadata extraction timeout"));
    }, 10000);
  });
}
