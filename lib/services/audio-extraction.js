import { getFFmpegInstance } from "./ffmpeg-init";
import { fetchFile } from "@ffmpeg/util";

/**
 * Extract audio from video with progress tracking
 * @param {File} videoFile - Video file to extract audio from
 * @param {function} onProgress - Progress callback (percentage: number, status: string)
 * @param {string} outputFormat - Output audio format (e.g., 'mp3', 'aac', 'wav')
 * @returns {Promise<Blob>} Extracted audio blob
 */
export async function extractAudioWithProgress(videoFile, onProgress, outputFormat = "aac") {
  const ffmpeg = await getFFmpegInstance();
  
  try {
    const inputFileName = "input." + videoFile.name.split(".").pop();
    const outputFileName = `output.${outputFormat}`;

    // Report initial progress
    if (onProgress) onProgress(10, "Loading video file...");

    // Write video file to FFmpeg filesystem
    await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile));
    
    if (onProgress) onProgress(30, "Extracting audio...");

    // Set up progress tracking
    let lastProgress = 30;
    const progressHandler = ({ progress }) => {
      if (progress !== undefined && !isNaN(progress)) {
        // Map FFmpeg progress (0-1) to our range (30-90)
        const mappedProgress = 30 + Math.floor(progress * 60);
        if (mappedProgress > lastProgress) {
          lastProgress = mappedProgress;
          if (onProgress) onProgress(mappedProgress, "Processing audio...");
        }
      }
    };

    ffmpeg.on("progress", progressHandler);

    try {
      // Execute FFmpeg command to extract audio
      await ffmpeg.exec([
        "-i",
        inputFileName,
        "-vn", // No video
        "-acodec",
        "copy", // Copy audio codec
        outputFileName,
      ]);
    } finally {
      // Remove progress handler
      ffmpeg.off("progress", progressHandler);
    }

    if (onProgress) onProgress(90, "Finalizing...");

    // Read output file
    const audioData = await ffmpeg.readFile(outputFileName);

    // Clean up files
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    if (onProgress) onProgress(100, "Complete");

    // Convert to Blob
    return new Blob([audioData], {
      type: `audio/${outputFormat}`,
    });
  } catch (error) {
    console.error("Error extracting audio:", error);
    if (onProgress) onProgress(0, `Error: ${error.message}`);
    throw new Error(`Failed to extract audio: ${error.message}`);
  }
}
