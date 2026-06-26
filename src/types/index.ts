export type ViewMode = 'home' | 'details' | 'player' | 'search' | 'profiles' | 'auth';
export type AuthMode = 'login' | 'signup' | 'reset';
export type NavItem = 'home' | 'series' | 'movies' | 'search' | 'settings' | 'profile';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isKids?: boolean;
}

export interface WatchHistoryEntry {
  contentId: string;
  progress: number;
  lastWatched: Date;
  episodeId?: string;
}

export interface AppUser {
  id: string;
  email: string;
  profiles: UserProfile[];
  activeProfileId: string;
  watchHistory: WatchHistoryEntry[];
  favorites: string[];
}
