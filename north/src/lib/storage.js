import { useCallback, useSyncExternalStore } from "react";

/*
  On-device storage for North.

  Everything a student enters (profile, GPA, resume, goals, saved scholarships,
  focus progress) lives in this browser's localStorage. Nothing is sent to a
  server. Components share one in-memory cache, so a change on one page shows
  up everywhere at once, and other open tabs update through the "storage" event.
*/

export const KEYS = {
  profile: "north:profile",
  gpa: "north:gpa",
  resume: "north:resume",
  scholarships: "north:scholarships",
  testScores: "north:test-scores",
  goals: "north-goals",
  constellations: "north-constellation-progress",
};

const PREFIXES = ["north:", "north-"];
const cache = new Map();
const listeners = new Map();

function resolve(initial) {
  return typeof initial === "function" ? initial() : initial;
}

function readRaw(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function read(key, initial) {
  if (cache.has(key)) return cache.get(key);

  let value;
  const raw = readRaw(key);
  if (raw !== null) {
    try {
      value = JSON.parse(raw);
    } catch {
      value = resolve(initial);
    }
  } else {
    value = resolve(initial);
  }

  cache.set(key, value);
  return value;
}

function notify(key) {
  listeners.get(key)?.forEach((listener) => listener());
}

function write(key, value) {
  cache.set(key, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked (private mode). Keep the in-memory value.
  }
  notify(key);
}

function subscribe(key, listener) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(listener);
  return () => listeners.get(key)?.delete(listener);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === null) {
      const keys = [...cache.keys()];
      cache.clear();
      keys.forEach(notify);
      return;
    }
    if (cache.has(event.key)) {
      cache.delete(event.key);
      notify(event.key);
    }
  });
}

/** Like useState, but saved on this device and shared across pages. */
export function usePersistentState(key, initial) {
  const value = useSyncExternalStore(
    useCallback((listener) => subscribe(key, listener), [key]),
    () => read(key, initial),
    () => resolve(initial)
  );

  const setValue = useCallback(
    (next) => {
      const current = read(key, initial);
      write(key, typeof next === "function" ? next(current) : next);
    },
    // `initial` is only a fallback for the first read, so it is not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [value, setValue];
}

export const defaultProfile = {
  name: "",
  school: "",
  grade: "",
  gradYear: "",
  state: "",
  citizenship: "",
  financialNeed: "",
  intendedMajor: "",
  interests: "",
  email: "",
};

/** Profile hook. The setter merges a partial update into the saved profile. */
export function useProfile() {
  const [stored, setStored] = usePersistentState(KEYS.profile, defaultProfile);
  const profile = stored && typeof stored === "object" ? stored : defaultProfile;

  const updateProfile = useCallback(
    (patch) => setStored((current) => ({ ...defaultProfile, ...current, ...patch })),
    [setStored]
  );

  return [{ ...defaultProfile, ...profile }, updateProfile];
}

function northKeys() {
  const keys = [];
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key && PREFIXES.some((prefix) => key.startsWith(prefix))) keys.push(key);
    }
  } catch {
    // Ignore blocked storage.
  }
  return keys;
}

/** Everything North has saved on this device, as one JSON-ready object. */
export function exportAll() {
  const data = {};
  northKeys().forEach((key) => {
    try {
      data[key] = JSON.parse(readRaw(key));
    } catch {
      data[key] = readRaw(key);
    }
  });
  return { app: "north", version: 1, exportedAt: new Date().toISOString(), data };
}

/** Restore a backup made by exportAll(). Returns how many items were restored. */
export function importAll(backup) {
  if (!backup || backup.app !== "north" || typeof backup.data !== "object") {
    throw new Error("This file is not a North backup.");
  }
  let count = 0;
  Object.entries(backup.data).forEach(([key, value]) => {
    if (!PREFIXES.some((prefix) => key.startsWith(prefix))) return;
    write(key, value);
    count += 1;
  });
  window.dispatchEvent(new Event("north-constellations-updated"));
  return count;
}

/** Delete everything North saved on this device. */
export function clearAll() {
  northKeys().forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore blocked storage.
    }
    cache.delete(key);
    notify(key);
  });
  window.dispatchEvent(new Event("north-constellations-updated"));
}

/** Rough size of North's saved data, in kilobytes. */
export function storageSizeKb() {
  const bytes = northKeys().reduce((total, key) => total + (readRaw(key)?.length || 0) + key.length, 0);
  return Math.max(0, Math.round((bytes * 2) / 102.4) / 10);
}
