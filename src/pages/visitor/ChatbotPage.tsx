import { useRef } from 'react';
import { PagePlaceholder } from '../../components';
import { ChatComposer } from '../../components/chat/ChatComposer';
import { ChatMessageList } from '../../components/chat/ChatMessageList';
import { getChatStrings } from '../../components/chat/chatStrings';
import { QuickQuestions } from '../../components/chat/QuickQuestions';
import { useChat } from '../../components/chat/useChat';
import { useSettings } from '../../components/settings/SettingsProvider';
import { localizeVisitorTree } from '../../components/settings/visitorStrings';

export function ChatbotPage() {
  const { currentLanguage } = useSettings();
  const strings = localizeVisitorTree(getChatStrings(), currentLanguage);
  const { messages, pending, failure, send, retry } = useChat(currentLanguage);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <PagePlaceholder
      title={strings.page.title}
      description={strings.page.scope}
      plannedTitle={localizeVisitorTree("Planned for this page", currentLanguage)}
      planned={[
        'Refresh the knowledge base before the final demo (n8n/knowledge)',
        'Page buttons and labels in Chinese, Malay and Tamil (needs the language setting)',
        'Hand over to a staff member (human in the loop)',
      ]}
    >
      <div className="chat">
        <ChatMessageList strings={strings} messages={messages} pending={pending} failure={failure} onRetry={retry} />
        <QuickQuestions
          strings={strings.quick}
          pending={pending}
          onAsk={(question) => {
            send(question);
            inputRef.current?.focus();
          }}
        />
        <ChatComposer ref={inputRef} strings={strings.composer} pending={pending} onSend={send} />
      </div>
    </PagePlaceholder>
  );
}
