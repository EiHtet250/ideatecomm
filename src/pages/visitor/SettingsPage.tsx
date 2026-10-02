import { useState } from "react";
import { Link } from "react-router-dom";
import { LogoutButton } from "../../components/auth/LogoutButton";
import { useAuthUser } from "../../components/auth/useAuthUser";
import { paths } from "../../routes/paths";
import { useSettings } from "../../components/settings/SettingsProvider";
import { getSettingsStrings } from "../../components/settings/settingsStrings";
import type { VisitorSettings } from "../../components/settings/settingsStore";

export function SettingsPage() {
  const { settings, updateSettings, resetSettings, storageAvailable, notify } =
    useSettings();
  const t = getSettingsStrings(settings.language);
  const { user } = useAuthUser();
  const [restored, setRestored] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  function toggle(
    key:
      | "darkMode"
      | "highContrast"
      | "reduceMotion"
      | "notifications"
      | "helpNotifications"
      | "feedbackNotifications",
    label: string,
    disabled = false,
  ) {
    return (
      <label className="settings-toggle" key={key}>
        <span>{label}</span>
        <input
          type="checkbox"
          role="switch"
          checked={settings[key]}
          disabled={disabled}
          onChange={(event) => updateSettings({ [key]: event.target.checked })}
        />
      </label>
    );
  }
  return (
    <div className="page settings-page" lang={settings.language}>
      <header className="page__header">
        <h1 className="page__title">{t.title}</h1>
        <p className="page__description">{t.intro}</p>
      </header>
      <p className="settings-save-status" role="status">
        {storageAvailable ? t.saved : t.storageError}
      </p>
      <div className="settings-grid">
        <section className="settings-card" aria-labelledby="settings-language">
          <h2 id="settings-language">{t.language}</h2>
          <label className="form-field" htmlFor="guide-language">
            <span>{t.guideLanguage}</span>
            <select
              id="guide-language"
              className="form-field__input"
              value={settings.language}
              onChange={(event) =>
                updateSettings({
                  language: event.target.value as VisitorSettings["language"],
                })
              }
              aria-describedby="language-hint"
            >
              <option value="en" lang="en">
                English
              </option>
              <option value="zh" lang="zh">
                中文
              </option>
              <option value="ms" lang="ms">
                Bahasa Melayu
              </option>
              <option value="ta" lang="ta">
                தமிழ்
              </option>
            </select>
          </label>
          <p id="language-hint" className="muted">
            {t.languageHint}
          </p>
        </section>
        <section
          className="settings-card"
          aria-labelledby="settings-accessibility"
        >
          <h2 id="settings-accessibility">{t.accessibility}</h2>
          <label className="form-field" htmlFor="text-size">
            <span>{t.textSize}</span>
            <select
              id="text-size"
              className="form-field__input"
              value={settings.textSize}
              onChange={(event) =>
                updateSettings({
                  textSize: event.target.value as VisitorSettings["textSize"],
                })
              }
            >
              <option value="normal">{t.normal}</option>
              <option value="large">{t.large}</option>
              <option value="extra-large">{t.extraLarge}</option>
            </select>
          </label>
          {toggle("darkMode", t.darkMode)}
          {toggle("highContrast", t.highContrast)}
          {toggle("reduceMotion", t.reduceMotion)}
        </section>
        <section
          className="settings-card"
          aria-labelledby="settings-notifications"
        >
          <h2 id="settings-notifications">{t.notifications}</h2>
          {toggle("notifications", t.inApp)}
          {toggle(
            "helpNotifications",
            t.helpConfirmations,
            !settings.notifications,
          )}
          {toggle(
            "feedbackNotifications",
            t.feedbackConfirmations,
            !settings.notifications,
          )}
          <p className="muted">{t.notificationHint}</p>
          <button
            className="btn settings-secondary"
            type="button"
            disabled={!settings.notifications || !settings.helpNotifications}
            onClick={() => notify("help", t.testMessage)}
          >
            {t.test}
          </button>
        </section>
        <section className="settings-card" aria-labelledby="settings-account">
          <h2 id="settings-account">{t.account}</h2>
          {user ? (
            <p className="settings-account">
              <span className="muted">{t.accountSignedIn}</span>
              <strong>{user.name}</strong>
              <span className="settings-account__email">{user.email}</span>
            </p>
          ) : (
            <p className="muted">{t.accountGuest}</p>
          )}
          <div className="settings-actions">
            <Link className="btn settings-secondary" to={paths.profile}>
              {t.accountProfile}
            </Link>
            <LogoutButton variant="page" />
          </div>
        </section>
      </div>
      <p role="status">{restored ? t.resetSaved : ""}</p>
      <section className="settings-reset">
        {confirmReset ? (
          <>
            <p>{t.resetQuestion}</p>
            <div className="settings-actions">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  resetSettings();
                  setRestored(true);
                  setConfirmReset(false);
                }}
              >
                {t.restore}
              </button>
              <button
                className="btn settings-secondary"
                type="button"
                onClick={() => setConfirmReset(false)}
              >
                {t.cancel}
              </button>
            </div>
          </>
        ) : (
          <button
            className="btn settings-secondary"
            type="button"
            onClick={() => setConfirmReset(true)}
          >
            {t.reset}
          </button>
        )}
      </section>
    </div>
  );
}
