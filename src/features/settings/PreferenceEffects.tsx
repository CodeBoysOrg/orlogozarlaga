"use client";

import { useEffect } from "react";
import {
  applyThemePreference,
  initializeDefaultPreferences,
  resolveLanguageCode,
} from "./preferences";
import { useUserPreferences } from "./useUserPreferences";

export default function PreferenceEffects() {
  const { preferences } = useUserPreferences();

  useEffect(() => {
    initializeDefaultPreferences();
    applyThemePreference(preferences.theme);
    document.documentElement.lang = resolveLanguageCode(preferences.language);
    document.body.dataset.density =
      preferences.dashboardDensity === "COMPACT" ? "compact" : "balanced";
  }, [
    preferences.dashboardDensity,
    preferences.language,
    preferences.theme,
  ]);

  return null;
}
