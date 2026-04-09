import { useState, useCallback } from 'react';
import { load, save } from '@app/storage';

/**
 * useStorage — React hook wrapping localStorage with JSON serialization.
 *
 * Works like useState but persists to localStorage under `key`.
 * When Supabase is wired in, swap the underlying storage.js functions
 * and this hook continues to work unchanged.
 *
 * @param {string} key       localStorage key
 * @param {*}      initial   default value if nothing stored
 */
export default function useStorage(key, initial) {
  const [value, setValue] = useState(() => load(key, initial));

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        save(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, set];
}
