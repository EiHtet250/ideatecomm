import { PagePlaceholder, PlaceholderBox } from '../../components';
import { useSettings } from '../../components/settings/SettingsProvider';
import { translateVisitorText } from '../../components/settings/visitorStrings';

export function DiscoveryTrailPlaceholderPage() {
  const { currentLanguage } = useSettings();
  const t = (text: string) => translateVisitorText(text, currentLanguage);
  return (
    <PagePlaceholder title={t("Discovery Trail")} description={t("A guided trail around the museum is coming soon.")}>
      <PlaceholderBox label={t("Discovery Trail preview")} note={t("Trail routes and stops will appear here.")} size="md" />
    </PagePlaceholder>
  );
}