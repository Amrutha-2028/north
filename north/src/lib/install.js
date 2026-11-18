import { useSyncExternalStore } from "react";

/*
  "Add to home screen" support. Chrome/Edge/Android fire beforeinstallprompt,
  which we keep so a button can trigger it later. iOS Safari has no prompt, so
  the UI shows Share → Add to Home Screen instructions instead.
*/

let deferredPrompt = null;
let installed = false;
const listeners = new Set();
const emit = () => listeners.forEach((listener) => listener());

if (typeof window !== "undefined") {
  installed =
    window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    emit();
  });

  window.addEventListener("appinstalled", () => {
    installed = true;
    deferredPrompt = null;
    emit();
  });
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

let snapshot = { canPrompt: false, installed: false };
const getSnapshot = () => {
  const canPrompt = Boolean(deferredPrompt);
  if (snapshot.canPrompt !== canPrompt || snapshot.installed !== installed) {
    snapshot = { canPrompt, installed };
  }
  return snapshot;
};

export function useInstall() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice.catch(() => null);
    deferredPrompt = null;
    emit();
    return choice?.outcome === "accepted";
  };

  const isIOS =
    typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

  return { ...state, isIOS, promptInstall };
}
