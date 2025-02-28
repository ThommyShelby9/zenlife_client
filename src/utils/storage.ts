/**
 * Check if local storage is available
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
};

/**
 * Save item to local storage
 */
export const setStorageItem = (key: string, value: unknown): boolean => {
  if (!isLocalStorageAvailable()) return false;

  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    return false;
  }
};

/**
 * Get item from local storage
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (!isLocalStorageAvailable()) return defaultValue;

  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) return defaultValue;
    return JSON.parse(serializedValue) as T;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return defaultValue;
  }
};

/**
 * Remove item from local storage
 */
export const removeStorageItem = (key: string): boolean => {
  if (!isLocalStorageAvailable()) return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error removing from localStorage:', e);
    return false;
  }
};

/**
 * Clear all items from local storage
 */
export const clearStorage = (): boolean => {
  if (!isLocalStorageAvailable()) return false;

  try {
    localStorage.clear();
    return true;
  } catch (e) {
    console.error('Error clearing localStorage:', e);
    return false;
  }
};

/**
 * Get storage usage information
 */
export const getStorageInfo = (): { used: number; quota: number; percentUsed: number } => {
  if (!isLocalStorageAvailable()) {
    return { used: 0, quota: 0, percentUsed: 0 };
  }

  try {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        totalSize += (key.length + (value ? value.length : 0)) * 2; // UTF-16 uses 2 bytes per character
      }
    }

    // Approximate local storage quota (varies by browser)
    const quota = 5 * 1024 * 1024; // 5MB is a common limit
    const percentUsed = (totalSize / quota) * 100;

    return {
      used: totalSize,
      quota,
      percentUsed
    };
  } catch (e) {
    console.error('Error calculating storage info:', e);
    return { used: 0, quota: 0, percentUsed: 0 };
  }
};

// Session storage variants

/**
 * Check if session storage is available
 */
const isSessionStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
    return true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
};

/**
 * Save item to session storage
 */
export const setSessionItem = (key: string, value: unknown): boolean => {
  if (!isSessionStorageAvailable()) return false;

  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
    return true;
  } catch (e) {
    console.error('Error saving to sessionStorage:', e);
    return false;
  }
};

/**
 * Get item from session storage
 */
export const getSessionItem = <T>(key: string, defaultValue: T): T => {
  if (!isSessionStorageAvailable()) return defaultValue;

  try {
    const serializedValue = sessionStorage.getItem(key);
    if (serializedValue === null) return defaultValue;
    return JSON.parse(serializedValue) as T;
  } catch (e) {
    console.error('Error reading from sessionStorage:', e);
    return defaultValue;
  }
};

/**
 * Remove item from session storage
 */
export const removeSessionItem = (key: string): boolean => {
  if (!isSessionStorageAvailable()) return false;

  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error removing from sessionStorage:', e);
    return false;
  }
};

/**
 * Clear all items from session storage
 */
export const clearSessionStorage = (): boolean => {
  if (!isSessionStorageAvailable()) return false;

  try {
    sessionStorage.clear();
    return true;
  } catch (e) {
    console.error('Error clearing sessionStorage:', e);
    return false;
  }
};
