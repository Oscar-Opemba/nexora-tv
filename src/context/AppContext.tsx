import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { UserProfile, AppUser, WatchHistoryEntry } from '../types';

interface AppContextType {
  user: AppUser | null;
  activeProfile: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  selectProfile: (profileId: string) => void;
  addToFavorites: (contentId: string) => void;
  removeFromFavorites: (contentId: string) => void;
  isFavorite: (contentId: string) => boolean;
  updateProgress: (contentId: string, progress: number, episodeId?: string) => void;
  getProgress: (contentId: string) => number;
  isNavOpen: boolean;
  setNavOpen: (open: boolean) => void;
  currentContentId: string | null;
  setCurrentContentId: (id: string | null) => void;
  isPlayerOpen: boolean;
  setPlayerOpen: (open: boolean) => void;
}

const DEFAULT_PROFILES: UserProfile[] = [
  { id: '1', name: 'Ozzie', avatar: 'https://i.pravatar.cc/150?img=11', color: '#e50914' },
  { id: '2', name: 'Guest', avatar: 'https://i.pravatar.cc/150?img=15', color: '#0071eb' },
  { id: 'kids', name: 'Kids', avatar: 'https://i.pravatar.cc/150?img=19', color: '#46d369', isKids: true },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isNavOpen, setNavOpen] = useState(false);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const [isPlayerOpen, setPlayerOpen] = useState(false);

  // Load persisted state
  useEffect(() => {
    const saved = localStorage.getItem('nexora_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch {}
    }
  }, []);

  const persistUser = (u: AppUser | null) => {
    if (u) localStorage.setItem('nexora_user', JSON.stringify(u));
    else localStorage.removeItem('nexora_user');
  };

  const login = useCallback(async (email: string, _password: string) => {
    // Mock auth — in production connect to Supabase
    const newUser: AppUser = {
      id: Math.random().toString(36).slice(2),
      email,
      profiles: DEFAULT_PROFILES,
      activeProfileId: DEFAULT_PROFILES[0].id,
      watchHistory: [],
      favorites: [],
    };
    setUser(newUser);
    persistUser(newUser);
  }, []);

  const signup = useCallback(async (email: string, _password: string, name: string) => {
    const profiles: UserProfile[] = [
      { id: '1', name, avatar: 'https://i.pravatar.cc/150?img=11', color: '#e50914' },
    ];
    const newUser: AppUser = {
      id: Math.random().toString(36).slice(2),
      email,
      profiles,
      activeProfileId: profiles[0].id,
      watchHistory: [],
      favorites: [],
    };
    setUser(newUser);
    persistUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, []);

  const selectProfile = useCallback((profileId: string) => {
    if (!user) return;
    const updated = { ...user, activeProfileId: profileId };
    setUser(updated);
    persistUser(updated);
  }, [user]);

  const addToFavorites = useCallback((contentId: string) => {
    if (!user) return;
    const updated = { ...user, favorites: [...user.favorites, contentId] };
    setUser(updated);
    persistUser(updated);
  }, [user]);

  const removeFromFavorites = useCallback((contentId: string) => {
    if (!user) return;
    const updated = { ...user, favorites: user.favorites.filter(f => f !== contentId) };
    setUser(updated);
    persistUser(updated);
  }, [user]);

  const isFavorite = useCallback((contentId: string) => {
    return user?.favorites.includes(contentId) ?? false;
  }, [user]);

  const updateProgress = useCallback((contentId: string, progress: number, episodeId?: string) => {
    if (!user) return;
    const existing = user.watchHistory.find(w => w.contentId === contentId);
    const entry: WatchHistoryEntry = {
      contentId,
      progress,
      lastWatched: new Date(),
      episodeId,
    };
    const history = existing
      ? user.watchHistory.map(w => w.contentId === contentId ? entry : w)
      : [...user.watchHistory, entry];
    const updated = { ...user, watchHistory: history };
    setUser(updated);
    persistUser(updated);
  }, [user]);

  const getProgress = useCallback((contentId: string) => {
    return user?.watchHistory.find(w => w.contentId === contentId)?.progress ?? 0;
  }, [user]);

  const activeProfile = user?.profiles.find(p => p.id === user.activeProfileId) ?? null;

  return (
    <AppContext.Provider value={{
      user,
      activeProfile,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      selectProfile,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      updateProgress,
      getProgress,
      isNavOpen,
      setNavOpen,
      currentContentId,
      setCurrentContentId,
      isPlayerOpen,
      setPlayerOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
