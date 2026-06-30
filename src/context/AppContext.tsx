import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '../lib/supabase';

export interface TvProfile {
  id: string;
  name: string;
  avatar_url: string;
  color: string;
  is_kids: boolean;
}

export interface WatchHistoryEntry {
  content_id: string;
  episode_id?: string;
  progress: number;
  last_watched: string;
}

interface AppContextType {
  // Auth
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;

  // TV Profiles
  tvProfiles: TvProfile[];
  activeProfile: TvProfile | null;
  selectProfile: (profile: TvProfile) => void;
  createProfile: (name: string, color: string) => Promise<void>;

  // Content state
  favorites: string[];
  watchHistory: WatchHistoryEntry[];
  addToFavorites: (contentId: string) => Promise<void>;
  removeFromFavorites: (contentId: string) => Promise<void>;
  isFavorite: (contentId: string) => boolean;
  updateProgress: (contentId: string, progress: number, episodeId?: string) => Promise<void>;
  getProgress: (contentId: string) => number;

  // UI
  isNavOpen: boolean;
  setNavOpen: (open: boolean) => void;
  currentContentId: string | null;
  setCurrentContentId: (id: string | null) => void;
  isPlayerOpen: boolean;
  setPlayerOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tvProfiles, setTvProfiles] = useState<TvProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<TvProfile | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryEntry[]>([]);
  const [isNavOpen, setNavOpen] = useState(false);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const [isPlayerOpen, setPlayerOpen] = useState(false);

  // ── Auth state listener ──────────────────────────────────────
  useEffect(() => {
    // Safety timeout: if Supabase never responds (bad/missing keys), unblock UI after 3s
    const timeout = setTimeout(() => setAuthLoading(false), 3000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeout);
        setSession(session);
        setUser(session?.user ?? null);
        setAuthLoading(false);
      })
      .catch((err) => {
        // Corrupted/stale session in localStorage (e.g. from testing with
        // placeholder keys) can crash the Supabase client on init.
        // Wipe any sb-* auth keys and retry once with a clean slate.
        console.warn('Supabase getSession failed, clearing stale auth state:', err);
        try {
          Object.keys(localStorage)
            .filter(k => k.startsWith('sb-') || k.includes('supabase'))
            .forEach(k => localStorage.removeItem(k));
        } catch {}
        clearTimeout(timeout);
        setAuthLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  // ── Load TV profiles when user changes ───────────────────────
  useEffect(() => {
    if (!user) {
      setTvProfiles([]);
      setActiveProfile(null);
      setFavorites([]);
      setWatchHistory([]);
      return;
    }
    loadTvProfiles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ── Load profile data when activeProfile changes ─────────────
  useEffect(() => {
    if (!activeProfile) return;
    loadFavorites();
    loadWatchHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfile]);

  const loadTvProfiles = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('tv_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        // Tables might not exist yet — create a fallback local profile
        console.warn('tv_profiles not ready:', error.message);
        const fallback: TvProfile = {
          id: 'local-' + user.id,
          name: user.email?.split('@')[0] || 'Me',
          avatar_url: 'https://i.pravatar.cc/150?img=11',
          color: '#46d369',
          is_kids: false,
        };
        setTvProfiles([fallback]);
        setActiveProfile(fallback);
        return;
      }

      if (data && data.length > 0) {
        setTvProfiles(data as TvProfile[]);
        const savedId = localStorage.getItem('nexora_active_profile');
        const saved = data.find((p: any) => p.id === savedId);
        setActiveProfile(saved ? saved as TvProfile : data[0] as TvProfile);
      } else {
        // Signed in but no TV profiles — create a default one
        const fallback: TvProfile = {
          id: 'local-' + user.id,
          name: user.email?.split('@')[0] || 'Me',
          avatar_url: 'https://i.pravatar.cc/150?img=11',
          color: '#46d369',
          is_kids: false,
        };
        setTvProfiles([fallback]);
        setActiveProfile(fallback);
      }
    } catch (e) {
      console.error('loadTvProfiles exception:', e);
      // Always unblock the UI with a fallback profile
      const fallback: TvProfile = {
        id: 'local-' + (user?.id || 'guest'),
        name: user?.email?.split('@')[0] || 'Me',
        avatar_url: 'https://i.pravatar.cc/150?img=11',
        color: '#46d369',
        is_kids: false,
      };
      setTvProfiles([fallback]);
      setActiveProfile(fallback);
    }
  };

  const loadFavorites = async () => {
    if (!activeProfile || activeProfile.id.startsWith('local-')) return;
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('content_id')
        .eq('profile_id', activeProfile.id);
      if (!error) setFavorites(data?.map((f: any) => f.content_id) ?? []);
    } catch (e) { console.warn('loadFavorites:', e); }
  };

  const loadWatchHistory = async () => {
    if (!activeProfile || activeProfile.id.startsWith('local-')) return;
    try {
      const { data, error } = await supabase
        .from('watch_history')
        .select('content_id, episode_id, progress, last_watched')
        .eq('profile_id', activeProfile.id)
        .order('last_watched', { ascending: false });
      if (!error) setWatchHistory((data ?? []) as WatchHistoryEntry[]);
    } catch (e) { console.warn('loadWatchHistory:', e); }
  };

  // ── Auth actions ─────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw new Error(error.message);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('nexora_active_profile');
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message);
  }, []);

  // ── Profile actions ──────────────────────────────────────────
  const selectProfile = useCallback((profile: TvProfile) => {
    setActiveProfile(profile);
    localStorage.setItem('nexora_active_profile', profile.id);
  }, []);

  const createProfile = useCallback(async (name: string, color: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('tv_profiles')
      .insert({ user_id: user.id, name, color })
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (data) setTvProfiles(prev => [...prev, data as TvProfile]);
  }, [user]);

  // ── Favorites ────────────────────────────────────────────────
  const addToFavorites = useCallback(async (contentId: string) => {
    if (!activeProfile) return;
    // Optimistic update always
    setFavorites(prev => [...prev.filter(f => f !== contentId), contentId]);
    // Persist to DB only if real profile
    if (user && !activeProfile.id.startsWith('local-')) {
      try {
        await supabase.from('favorites').upsert({
          user_id: user.id, profile_id: activeProfile.id, content_id: contentId
        });
      } catch (e) { console.warn('addToFavorites:', e); }
    }
  }, [user, activeProfile]);

  const removeFromFavorites = useCallback(async (contentId: string) => {
    // Optimistic update
    setFavorites(prev => prev.filter(f => f !== contentId));
    if (activeProfile && !activeProfile.id.startsWith('local-')) {
      try {
        await supabase.from('favorites').delete()
          .eq('profile_id', activeProfile.id).eq('content_id', contentId);
      } catch (e) { console.warn('removeFromFavorites:', e); }
    }
  }, [activeProfile]);

  const isFavorite = useCallback((contentId: string) => {
    return favorites.includes(contentId);
  }, [favorites]);

  // ── Watch progress ───────────────────────────────────────────
  const updateProgress = useCallback(async (contentId: string, progress: number, episodeId?: string) => {
    const entry: WatchHistoryEntry = {
      content_id: contentId,
      episode_id: episodeId,
      progress,
      last_watched: new Date().toISOString(),
    };
    // Optimistic update
    setWatchHistory(prev => {
      const exists = prev.find(w => w.content_id === contentId);
      return exists
        ? prev.map(w => w.content_id === contentId ? entry : w)
        : [entry, ...prev];
    });
    // Persist to DB only if real profile
    if (user && activeProfile && !activeProfile.id.startsWith('local-')) {
      try {
        await supabase.from('watch_history').upsert({
          user_id: user.id,
          profile_id: activeProfile.id,
          content_id: contentId,
          episode_id: episodeId ?? null,
          progress,
          last_watched: new Date().toISOString(),
        }, { onConflict: 'profile_id,content_id' });
      } catch (e) { console.warn('updateProgress:', e); }
    }
  }, [user, activeProfile]);

  const getProgress = useCallback((contentId: string) => {
    return watchHistory.find(w => w.content_id === contentId)?.progress ?? 0;
  }, [watchHistory]);

  return (
    <AppContext.Provider value={{
      user,
      session,
      isAuthenticated: !!user,
      authLoading,
      login,
      signup,
      logout,
      resetPassword,
      tvProfiles,
      activeProfile,
      selectProfile,
      createProfile,
      favorites,
      watchHistory,
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
