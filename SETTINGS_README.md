# Settings feature

This update only adds Settings and the shared preference provider needed to apply and remember accessibility choices. The other pages, login/sign-up pages, navigation, backend workflows, dependencies and existing design tokens are unchanged.

## Run

```bash
npm install
npm run dev
```

Open `/visitor/settings`.

## Included

- English, Chinese, Malay and Tamil labels for the Settings page. Other pages retain their current language.
- Normal, large and extra-large text, high contrast and reduced motion across routes.
- Saved in-app notification preferences, with a test banner and a dismiss button.
- Account settings placeholder. No authentication or account operations were added.
- Reset to defaults with confirm/cancel buttons.
- Browser storage persistence, validation of stored values, cross-tab synchronization, and a session-only fallback when storage is blocked.

## Files

- `src/pages/visitor/SettingsPage.tsx`: Settings controls.
- `src/components/settings/settingsStore.ts`: shared types, defaults and saved-data validation.
- `src/components/settings/SettingsProvider.tsx`: preference state, storage, accessibility attributes and optional notification banners.
- `src/components/settings/settingsStrings.ts`: Settings translations.
- `src/components/settings/settings.css`: Settings layout and accessibility preference rules.
- `src/main.tsx`: wraps the existing app in `SettingsProvider`.

## Connecting notifications later

The current notification preferences and test banner work. Existing help/feedback pages were deliberately left unchanged, so they do not yet send banners through this provider. They retain their existing confirmation messages.

When the team implements notification delivery, use `useSettings()` inside a component, then call `notify('help', message)` or `notify('feedback', message)` after an actual successful action. The provider checks the master preference and the category preference before showing the banner. No email, browser push, permission prompt or background notification service is included.

Settings are stored under `mint.visitor-settings.v1`. Reset affects only this key, leaving the team's other saved data alone.
