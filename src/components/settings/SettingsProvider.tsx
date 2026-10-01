import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import {
  defaultSettings,
  parseSettings,
  SETTINGS_KEY,
  type VisitorSettings,
} from "./settingsStore";
import { useLocation } from "react-router-dom";
import { paths } from "../../routes/paths";
import "./settings.css";

type NotificationKind = "help" | "feedback";
export const STAFF_LANGUAGE_KEY = "mint.staff-language.v1";

function parseLanguage(value: string | null): VisitorSettings["language"] {
  return value === "zh" || value === "ms" || value === "ta" ? value : "en";
}

interface SettingsContextValue {
  settings: VisitorSettings;
  staffLanguage: VisitorSettings["language"];
  currentLanguage: VisitorSettings["language"];
  storageAvailable: boolean;
  updateSettings: (patch: Partial<VisitorSettings>) => void;
  updateStaffLanguage: (language: VisitorSettings["language"]) => void;
  resetSettings: () => void;
  notify: (kind: NotificationKind, message: string) => void;
}
const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [settings, setSettings] = useState(() => {
    try {
      return parseSettings(localStorage.getItem(SETTINGS_KEY));
    } catch {
      return { ...defaultSettings };
    }
  });
  const [staffLanguage, setStaffLanguage] = useState(() => {
    try {
      return parseLanguage(localStorage.getItem(STAFF_LANGUAGE_KEY));
    } catch {
      return "en";
    }
  });
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [notice, setNotice] = useState<{
    kind: NotificationKind;
    message: string;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [settings]);
  useEffect(() => {
    try {
      localStorage.setItem(STAFF_LANGUAGE_KEY, staffLanguage);
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [staffLanguage]);
  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key === SETTINGS_KEY || event.key === null)
        setSettings(parseSettings(event.newValue));
      if (event.key === STAFF_LANGUAGE_KEY || event.key === null)
        setStaffLanguage(parseLanguage(event.newValue));
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const currentLanguage = location.pathname.startsWith("/staff")
    ? staffLanguage
    : location.pathname.startsWith("/visitor") ||
        location.pathname === paths.privacyPolicy ||
        location.pathname === paths.terms
      ? settings.language
      : "en";
  useLayoutEffect(() => {
    document.documentElement.dataset.textSize = settings.textSize;
    document.documentElement.dataset.theme = settings.darkMode ? "dark" : "light";
    document.documentElement.dataset.highContrast = String(
      settings.highContrast,
    );
    document.documentElement.dataset.reduceMotion = String(
      settings.reduceMotion,
    );
    document.documentElement.lang = currentLanguage;
  }, [
    settings.textSize,
    settings.darkMode,
    settings.highContrast,
    settings.reduceMotion,
    currentLanguage,
  ]);
  const visibleNotice =
    notice &&
    settings.notifications &&
    (notice.kind === "help"
      ? settings.helpNotifications
      : settings.feedbackNotifications)
      ? notice
      : null;

  return (
    <SettingsContext.Provider
      value={{
        settings,
        staffLanguage,
        currentLanguage,
        storageAvailable,
        updateSettings: (patch) =>
          setSettings((previous) =>
            parseSettings(JSON.stringify({ ...previous, ...patch })),
          ),
        updateStaffLanguage: setStaffLanguage,
        resetSettings: () => {
          setSettings({ ...defaultSettings });
          setNotice(null);
        },
        notify: (kind, message) => {
          if (
            settings.notifications &&
            (kind === "help"
              ? settings.helpNotifications
              : settings.feedbackNotifications)
          )
            setNotice({ kind, message });
        },
      }}
    >
      {children}
      {visibleNotice && (
        <aside className="settings-notice" aria-label="Notification">
          <span role="status">{visibleNotice.message}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice(null)}
          >
            ×
          </button>
        </aside>
      )}
    </SettingsContext.Provider>
  );
}
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used inside SettingsProvider");
  return context;
}
