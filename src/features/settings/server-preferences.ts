import { parsePreferencesCookie } from "./preferences";

export function getServerPreferences(rawCookieValue?: string | null) {
  return parsePreferencesCookie(rawCookieValue);
}

