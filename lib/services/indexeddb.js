const DB_NAME = "ffmpeg-cache";
const DB_VERSION = 3;
const STORE_NAME = "files";
const VIDEOS_STORE_NAME = "videos";

/**
 * Open or create IndexedDB database
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const transaction = event.target.transaction;
      
      // Create files store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      
      // Create videos store with indexes for O(log n) queries
      if (!db.objectStoreNames.contains(VIDEOS_STORE_NAME)) {
        const videosStore = db.createObjectStore(VIDEOS_STORE_NAME, { keyPath: "id", autoIncrement: true });
        videosStore.createIndex("fileName", "fileName", { unique: false });
        videosStore.createIndex("createdAt", "createdAt", { unique: false });
      }
    };
  });
}

/**
 * Ensure videos store exists (fallback for databases that weren't upgraded)
 * Checks if store exists and returns database, upgrade should happen automatically
 */
async function ensureVideosStore() {
  const db = await openDatabase();
  // If store doesn't exist, the upgrade should have created it
  // If it still doesn't exist, there's an issue with the upgrade
  if (!db.objectStoreNames.contains(VIDEOS_STORE_NAME)) {
    throw new Error("Videos store not found. Please refresh the page to upgrade the database.");
  }
  return db;
}

/**
 * Store a file in IndexedDB
 * @param {string} key - File key/name
 * @param {ArrayBuffer|string} data - File data
 */
export async function storeFile(key, data) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error("Error storing file in IndexedDB:", error);
    throw error;
  }
}

/**
 * Retrieve a file from IndexedDB
 * @param {string} key - File key/name
 * @returns {Promise<ArrayBuffer|string|null>}
 */
export async function getFile(key) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  } catch (error) {
    console.error("Error retrieving file from IndexedDB:", error);
    throw error;
  }
}

/**
 * Check if a file exists in IndexedDB
 * @param {string} key - File key/name
 * @returns {Promise<boolean>}
 */
export async function fileExists(key) {
  try {
    const file = await getFile(key);
    return file !== null;
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  }
}

/**
 * Clear all cached files
 */
export async function clearCache() {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error("Error clearing cache:", error);
    throw error;
  }
}

/**
 * Delete a specific file from cache
 * @param {string} key - File key/name
 */
export async function deleteFile(key) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error("Error deleting file from cache:", error);
    throw error;
  }
}

/**
 * Get all cached file keys
 * @returns {Promise<string[]>}
 */
export async function getAllKeys() {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error("Error getting all keys:", error);
    throw error;
  }
}

/**
 * Store video metadata in IndexedDB
 * @param {object} metadata - Video metadata object
 * @returns {Promise<number>} ID of stored video
 */
export async function storeVideoMetadata(metadata) {
  try {
    const db = await ensureVideosStore();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([VIDEOS_STORE_NAME], "readwrite");
      const store = transaction.objectStore(VIDEOS_STORE_NAME);
      const request = store.add({
        ...metadata,
        createdAt: metadata.createdAt || new Date().toISOString(),
        lastOpenedAt: new Date().toISOString(),
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error("Error storing video metadata:", error);
    throw error;
  }
}

/**
 * Get video metadata by ID
 * @param {number} id - Video ID
 * @returns {Promise<object|null>}
 */
export async function getVideoMetadata(id) {
  try {
    const db = await ensureVideosStore();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([VIDEOS_STORE_NAME], "readonly");
      const store = transaction.objectStore(VIDEOS_STORE_NAME);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  } catch (error) {
    console.error("Error retrieving video metadata:", error);
    throw error;
  }
}

/**
 * Get video metadata by fileName (O(log n) lookup using index)
 * @param {string} fileName - File name
 * @returns {Promise<object|null>}
 */
export async function getVideoMetadataByFileName(fileName) {
  try {
    const db = await ensureVideosStore();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([VIDEOS_STORE_NAME], "readonly");
      const store = transaction.objectStore(VIDEOS_STORE_NAME);
      const index = store.index("fileName");
      const request = index.get(fileName);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Update lastOpenedAt
          const updateTransaction = db.transaction([VIDEOS_STORE_NAME], "readwrite");
          const updateStore = updateTransaction.objectStore(VIDEOS_STORE_NAME);
          result.lastOpenedAt = new Date().toISOString();
          updateStore.put(result);
        }
        resolve(result || null);
      };
    });
  } catch (error) {
    console.error("Error retrieving video metadata by fileName:", error);
    throw error;
  }
}

/**
 * Get all videos (O(log n) queries using indexes)
 * @returns {Promise<object[]>}
 */
export async function getAllVideos() {
  try {
    const db = await ensureVideosStore();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([VIDEOS_STORE_NAME], "readonly");
      const store = transaction.objectStore(VIDEOS_STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  } catch (error) {
    console.error("Error getting all videos:", error);
    throw error;
  }
}

/**
 * Update video metadata
 * @param {object} metadata - Video metadata with id
 * @returns {Promise<void>}
 */
export async function updateVideoMetadata(metadata) {
  try {
    const db = await ensureVideosStore();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([VIDEOS_STORE_NAME], "readwrite");
      const store = transaction.objectStore(VIDEOS_STORE_NAME);
      const updatedMetadata = {
        ...metadata,
        lastOpenedAt: new Date().toISOString(),
      };
      const request = store.put(updatedMetadata);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error("Error updating video metadata:", error);
    throw error;
  }
}
