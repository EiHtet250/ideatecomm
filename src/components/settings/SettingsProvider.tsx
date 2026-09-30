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
import "./settings.css";

type NotificationKind = "help" | "feedback";
interface SettingsContextValue {
  settings: VisitorSettings;
  storageAvailable: boolean;
  updateSettings: (patch: Partial<VisitorSettings>) => void;
  resetSettings: () => void;
  notify: (kind: NotificationKind, message: string) => void;
}
const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(() => {
    try {
      return parseSettings(localStorage.getItem(SETTINGS_KEY));
    } catch {
      return { ...defaultSettings };
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
    function sync(event: StorageEvent) {
      if (event.key === SETTINGS_KEY || event.key === null)
        setSettings(parseSettings(event.newValue));
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useLayoutEffect(() => {
    document.documentElement.dataset.textSize = settings.textSize;
    document.documentElement.dataset.highContrast = String(
      settings.highContrast,
    );
    document.documentElement.dataset.reduceMotion = String(
      settings.reduceMotion,
    );
  }, [settings.textSize, settings.highContrast, settings.reduceMotion]);
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
        storageAvailable,
        updateSettings: (patch) =>
          setSettings((previous) =>
            parseSettings(JSON.stringify({ ...previous, ...patch })),
          ),
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
