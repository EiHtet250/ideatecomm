import type { ChatLanguage } from "../../types/help";

export const SETTINGS_KEY = "mint.visitor-settings.v1";
export interface VisitorSettings {
  language: ChatLanguage;
  textSize: "normal" | "large" | "extra-large";
  darkMode: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  notifications: boolean;
  helpNotifications: boolean;
  feedbackNotifications: boolean;
}
export const defaultSettings: VisitorSettings = {
  language: "en",
  textSize: "normal",
  darkMode: false,
  highContrast: false,
  reduceMotion: false,
  notifications: true,
  helpNotifications: true,
  feedbackNotifications: true,
};

/** Stored data is untrusted: invalid values fall back individually. */
export function parseSettings(raw: string | null): VisitorSettings {
  try {
    const data: unknown = JSON.parse(raw ?? "{}");
    if (!data || typeof data !== "object" || Array.isArray(data))
      return { ...defaultSettings };
    const value = data as Record<string, unknown>;
    const boolean = (key: keyof VisitorSettings) =>
      typeof value[key] === "boolean"
        ? (value[key] as boolean)
        : (defaultSettings[key] as boolean);
    return {
      language: ["en", "zh", "ms", "ta"].includes(String(value.language))
        ? (value.language as ChatLanguage)
        : "en",
      textSize: ["normal", "large", "extra-large"].includes(
        String(value.textSize),
      )
        ? (value.textSize as VisitorSettings["textSize"])
        : "normal",
      darkMode: boolean("darkMode"),
      highContrast: boolean("highContrast"),
      reduceMotion: boolean("reduceMotion"),
      notifications: boolean("notifications"),
      helpNotifications: boolean("helpNotifications"),
      feedbackNotifications: boolean("feedbackNotifications"),
    };
  } catch {
    return { ...defaultSettings };
  }
}
