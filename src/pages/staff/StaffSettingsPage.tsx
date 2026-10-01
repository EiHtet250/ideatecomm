import { useSettings } from "../../components/settings/SettingsProvider";
import { getStaffStrings } from "../../components/staff/staffStrings";
import type { ChatLanguage } from "../../types/help";

const unavailableMessage: Record<ChatLanguage, string> = {
  en: "Browser storage is unavailable. This setting lasts for this session only.",
  zh: "浏览器存储不可用。此设置仅在本次会话期间有效。",
  ms: "Storan pelayar tidak tersedia. Tetapan ini hanya digunakan untuk sesi ini.",
  ta: "உலாவி சேமிப்பகம் இல்லை. இந்த அமைப்பு இந்த அமர்வுக்கு மட்டுமே பொருந்தும்.",
};

export function StaffSettingsPage() {
  const { currentLanguage, staffLanguage, updateStaffLanguage, storageAvailable } =
    useSettings();
  const t = getStaffStrings(currentLanguage).languageSettings;

  return (
    <div className="page settings-page">
      <header className="page__header">
        <h1 className="page__title">{t.title}</h1>
        <p className="page__description">{t.description}</p>
      </header>
      <p className="settings-save-status" role="status">
        {storageAvailable ? t.saved : unavailableMessage[currentLanguage]}
      </p>
      <section className="settings-card" aria-labelledby="staff-language-heading">
        <h2 id="staff-language-heading">{t.languageLabel}</h2>
        <label className="form-field" htmlFor="staff-language">
          <span>{t.languageLabel}</span>
          <select
            id="staff-language"
            className="form-field__input"
            value={staffLanguage}
            onChange={(event) =>
              updateStaffLanguage(event.target.value as ChatLanguage)
            }
          >
            <option value="en" lang="en">English</option>
            <option value="zh" lang="zh">中文</option>
            <option value="ms" lang="ms">Bahasa Melayu</option>
            <option value="ta" lang="ta">தமிழ்</option>
          </select>
        </label>
      </section>
    </div>
  );
}
