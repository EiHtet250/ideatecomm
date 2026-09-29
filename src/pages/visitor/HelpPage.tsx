import { PagePlaceholder, PlaceholderBox } from '../../components';

export function HelpPage() {
  return (
    <PagePlaceholder
      title="Help"
      description="How to use the guide, and a way to ask museum staff for help."
      planned={[
        'Frequently asked questions',
        'How to use the Museum Map and Discovery Trail',
        'Request help from staff (will appear on the staff Help Requests page)',
      ]}
    >
      <PlaceholderBox label="FAQ" size="md" />
      <PlaceholderBox label="Ask staff for help" note="Request form not built yet" size="sm" />
    </PagePlaceholder>
  );
}
