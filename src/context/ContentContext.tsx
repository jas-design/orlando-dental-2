import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CONTACT_INFO } from '../constants';

interface SiteContent {
  contactInfo: typeof CONTACT_INFO;
  // Add other dynamic content areas here
}

const ContentContext = createContext<{
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => Promise<void>;
  loading: boolean;
} | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>({
    contactInfo: CONTACT_INFO
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to global settings
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setContent(prev => ({
          ...prev,
          contactInfo: data.contactInfo || CONTACT_INFO
        }));
      } else {
        // Initialize with constants if doc doesn't exist
        setDoc(doc(db, 'settings', 'global'), { contactInfo: CONTACT_INFO });
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  const updateContent = async (newContent: Partial<SiteContent>) => {
    await setDoc(doc(db, 'settings', 'global'), newContent, { merge: true });
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
};
