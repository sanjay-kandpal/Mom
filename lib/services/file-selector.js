/**
 * Select video file using File System Access API with fallback
 * @returns {Promise<{fileHandle: FileSystemFileHandle|null, file: File}>}
 */
export async function selectVideoFile() {
  // Check if File System Access API is supported
  if (window.showOpenFilePicker) {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Video files",
            accept: {
              "video/*": [".mp4", ".mov", ".webm", ".avi", ".mkv"],
            },
          },
        ],
        multiple: false,
      });

      const file = await fileHandle.getFile();
      return { fileHandle, file };
    } catch (error) {
      // User cancelled or error occurred
      if (error.name !== "AbortError") {
        console.error("Error selecting file:", error);
      }
      throw error;
    }
  } else {
    // Fallback to traditional file input
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/*";
      input.onchange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
          resolve({ fileHandle: null, file });
        } else {
          reject(new Error("No file selected"));
        }
      };
      input.oncancel = () => {
        reject(new Error("File selection cancelled"));
      };
      input.click();
    });
  }
}
