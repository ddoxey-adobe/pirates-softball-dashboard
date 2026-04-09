/**
 * Pirates Softball Dashboard — Storage Layer
 *
 * localStorage wrapper with JSON serialization.
 * Future hook point for Supabase migration:
 *   - Replace the body of load/save/remove with Supabase calls
 *   - The rest of the app imports only these functions, so the swap is seamless
 */

/**
 * Load a value from localStorage, parsed as JSON.
 * Returns `defaultValue` if the key is missing or the JSON is invalid.
 */
export function load(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * Save a value to localStorage as JSON.
 */
export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove a key from localStorage.
 */
export function remove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * List all Pirates-related keys currently in localStorage.
 */
export function listKeys(prefix = 'pirates-') {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keys.push(key);
    }
  }
  return keys;
}
