const DB_NAME = "ffmpeg-cache";
const DB_VERSION = 1;
const STORE_NAME = "files";

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
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
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
