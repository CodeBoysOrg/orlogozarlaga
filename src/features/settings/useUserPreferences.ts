"use client";

import { useSyncExternalStore } from "react";
import {
  defaultPreferences,
  normalizePreferences,
  persistPreferences,
  readStoredPreferences,
  settingsUpdatedEvent,
  type UserPreferences,
} from "./preferences";

let cachedSnapshot = defaultPreferences;
let cachedSnapshotKey = JSON.stringify(defaultPreferences);

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => callback();
  window.addEventListener(settingsUpdatedEvent, handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    window.removeEventListener(settingsUpdatedEvent, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

function getSnapshot() {
  const nextSnapshot = readStoredPreferences();
  const nextSnapshotKey = JSON.stringify(nextSnapshot);

  if (nextSnapshotKey === cachedSnapshotKey) {
    return cachedSnapshot;
  }

  cachedSnapshot = nextSnapshot;
  cachedSnapshotKey = nextSnapshotKey;
  return cachedSnapshot;
}

function getServerSnapshot() {
  return defaultPreferences;
}

export function useUserPreferences() {
  const preferences = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const updatePreferences = (
    updater:
      | Partial<UserPreferences>
      | ((current: UserPreferences) => Partial<UserPreferences> | UserPreferences),
  ) => {
    const current = readStoredPreferences();
    const patch =
      typeof updater === "function" ? updater(current) : updater;
    const next = normalizePreferences({
      ...current,
      ...patch,
    });
    persistPreferences(next);
  };

  return {
    preferences,
    updatePreferences,
  };
}
