import { PagePlaceholder, PlaceholderBox } from '../../components';

export function SettingsPage() {
  return (
    <PagePlaceholder
      title="Settings"
      description="App preferences for the visitor."
      planned={['Language', 'Text size / accessibility options', 'Notification preferences', 'Account settings']}
    >
      <PlaceholderBox label="Settings list" size="md" />
    </PagePlaceholder>
  );
}
