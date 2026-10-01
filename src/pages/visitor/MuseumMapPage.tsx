import { PagePlaceholder, PlaceholderBox } from '../../components';
import { useSettings } from '../../components/settings/SettingsProvider';
import { translateVisitorText } from '../../components/settings/visitorStrings';

/** Uses the shared floor/location/exhibit data in src/data (same as the Discovery Trail). */
export function MuseumMapPage() {
  const { currentLanguage } = useSettings();
  const t = (text: string) => translateVisitorText(text, currentLanguage);
  return (
    <PagePlaceholder
      title={t("Museum Map")}
      description={t("Free browsing of the museum's floors and exhibits.")}
      plannedTitle={t("Planned for this page")}
      planned={[
        t('Floor selector (uses src/data/floors.ts)'),
        t('Floor map with locations and exhibits (uses src/data/locations.ts and exhibits.ts)'),
        t('Exhibit details when a location is selected'),
        t('Optional directions after scanning a location QR code'),
      ]}
    >
      <PlaceholderBox label={t("Floor selector")} size="sm" />
      <PlaceholderBox label={t("Museum floor map")} note={t("Not built yet")} size="lg" />
      <PlaceholderBox label={t("Directions (after QR scan)")} size="sm" />
    </PagePlaceholder>
  );
}
