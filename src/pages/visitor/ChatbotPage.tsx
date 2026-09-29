import { PagePlaceholder, PlaceholderBox } from '../../components';

export function ChatbotPage() {
  return (
    <PagePlaceholder
      title="Museum Chatbot"
      description="Visitors will ask questions about the museum and its exhibits here."
      planned={[
        'Chat message list',
        'Message input box',
        'Suggested questions',
        'Chatbot service connection (not chosen yet)',
      ]}
    >
      <PlaceholderBox label="Chat conversation" note="No chatbot connected" size="lg" />
      <PlaceholderBox label="Message input" size="sm" />
    </PagePlaceholder>
  );
}
