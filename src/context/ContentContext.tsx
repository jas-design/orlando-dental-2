import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CONTACT_INFO, DEFAULT_THEME_COLORS } from '../constants';

interface SiteContent {
  contactInfo: typeof CONTACT_INFO;
  themeColors: typeof DEFAULT_THEME_COLORS;
}

const ContentContext = createContext<{
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => Promise<void>;
  loading: boolean;
} | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>({
    contactInfo: CONTACT_INFO,
    themeColors: DEFAULT_THEME_COLORS
  });
  const [loading, setLoading] = useState(true);

  // Function to apply colors to CSS variables
  const applyThemeColors = (colors: typeof DEFAULT_THEME_COLORS) => {
    const root = document.documentElement;
    root.style.setProperty('--color-brand-primary', colors.primary);
    root.style.setProperty('--color-brand-secondary', colors.secondary);
    root.style.setProperty('--color-brand-dark', colors.dark);
    root.style.setProperty('--color-brand-light', colors.light);
    root.style.setProperty('--color-brand-accent', colors.accent);
  };

  useEffect(() => {
    // Listen to global settings
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const newColors = data.themeColors || DEFAULT_THEME_COLORS;
        setContent(prev => ({
          ...prev,
          contactInfo: data.contactInfo || CONTACT_INFO,
          themeColors: newColors
        }));
        applyThemeColors(newColors);
      } else {
        // Initialize with constants if doc doesn't exist
        setDoc(doc(db, 'settings', 'global'), { 
          contactInfo: CONTACT_INFO,
          themeColors: DEFAULT_THEME_COLORS 
        });
        applyThemeColors(DEFAULT_THEME_COLORS);
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
