import { useEffect, useState } from 'react';
import {
  DEMO_VISITOR_ACCOUNT_KEY,
  DEMO_VISITOR_UPDATED,
  readDemoVisitorAccount,
} from '../services/demoVisitor';

export function useDemoVisitorAccount() {
  const [account, setAccount] = useState(readDemoVisitorAccount);

  useEffect(() => {
    const refresh = () => setAccount(readDemoVisitorAccount());
    const onStorage = (event: StorageEvent) => {
      if (event.key === DEMO_VISITOR_ACCOUNT_KEY || event.key === null) refresh();
    };
    window.addEventListener(DEMO_VISITOR_UPDATED, refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(DEMO_VISITOR_UPDATED, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return account;
}
