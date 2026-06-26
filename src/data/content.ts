export interface ContentItem {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'sport' | 'documentary';
  year: number;
  rating: string;
  matchPercent: number;
  duration?: string;
  seasons?: number;
  genres: string[];
  synopsis: string;
  backdrop: string;
  thumbnail: string;
  cast: { name: string; role: string; avatar: string }[];
  isHDR?: boolean;
  is4K?: boolean;
  audio?: string;
  trailerUrl?: string;
  streamUrl?: string;
  progress?: number; // 0-100
  isFavorite?: boolean;
  isNew?: boolean;
  episodes?: Episode[];
  similar?: string[];
}

export interface Episode {
  id: string;
  number: number;
  season: number;
  title: string;
  synopsis: string;
  duration: string;
  thumbnail: string;
  progress?: number;
}

const UNSPLASH = {
  city: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80',
  space: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80',
  castle: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=1920&q=80',
  car: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1920&q=80',
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
  ocean: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80',
  cyber: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80',
  desert: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80',
  stadium: 'https://images.unsplash.com/photo-1540747913346-19212a4328b5?w=1920&q=80',
  racing: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920&q=80',
  underwater: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1920&q=80',
  volcano: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1920&q=80',
  heist: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
};

const THUMB = {
  city: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80',
  space: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80',
  castle: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=400&q=80',
  car: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=400&q=80',
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
  ocean: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
  cyber: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
  desert: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=80',
  stadium: 'https://images.unsplash.com/photo-1540747913346-19212a4328b5?w=400&q=80',
  racing: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80',
  underwater: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80',
  volcano: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80',
  heist: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
};

export const CONTENT: ContentItem[] = [
  {
    id: 'velocity',
    title: 'Velocity',
    type: 'movie',
    year: 2026,
    rating: 'PG-13',
    matchPercent: 98,
    duration: '2H 12M',
    genres: ['Action', 'Thriller', 'Sci-Fi'],
    synopsis: 'Experience the next generation of entertainment with interactive storylines and stunning visuals. Watch anywhere, cancel anytime.',
    backdrop: UNSPLASH.car,
    thumbnail: THUMB.car,
    is4K: true,
    isHDR: true,
    audio: '5.1',
    progress: 0,
    cast: [
      { name: 'Marcus Chen', role: 'Kai Voss', avatar: 'https://i.pravatar.cc/100?img=1' },
      { name: 'Ava Storm', role: 'Lena Rho', avatar: 'https://i.pravatar.cc/100?img=5' },
      { name: 'Derek Walsh', role: 'Commander Steele', avatar: 'https://i.pravatar.cc/100?img=3' },
    ],
    similar: ['void-signal', 'heist-protocol', 'chrome-dawn'],
  },
  {
    id: 'void-signal',
    title: 'Signal of the Void',
    type: 'movie',
    year: 2026,
    rating: 'R',
    matchPercent: 98,
    duration: '2H 18M',
    genres: ['Sci-Fi', 'Thriller'],
    synopsis: 'When an anomalous signal is detected from the edge of the solar system, a veteran pilot and a rogue AI must navigate through treacherous deep space to uncover the truth behind humanity\'s greatest mystery.',
    backdrop: UNSPLASH.space,
    thumbnail: THUMB.space,
    is4K: true,
    isHDR: true,
    audio: '5.1',
    progress: 45,
    cast: [
      { name: 'Elena Voss', role: 'Capt. Reyna Cruz', avatar: 'https://i.pravatar.cc/100?img=9' },
      { name: 'James Okafor', role: 'ARIA (Voice)', avatar: 'https://i.pravatar.cc/100?img=12' },
      { name: 'Priya Nakamura', role: 'Dr. Yuki Han', avatar: 'https://i.pravatar.cc/100?img=16' },
    ],
    similar: ['velocity', 'deep-horizon', 'echo-protocol'],
  },
  {
    id: 'shadow-kingdom',
    title: 'Shadow Kingdom',
    type: 'series',
    year: 2025,
    rating: 'TV-MA',
    matchPercent: 95,
    seasons: 3,
    genres: ['Fantasy', 'Drama', 'Adventure'],
    synopsis: 'In a world where shadow magic determines social rank, a powerless girl discovers she holds the rarest ability of all — and must choose between revolution and survival.',
    backdrop: UNSPLASH.castle,
    thumbnail: THUMB.castle,
    is4K: true,
    isHDR: true,
    audio: '5.1',
    progress: 72,
    cast: [
      { name: 'Sophia Reyes', role: 'Kira Ashlen', avatar: 'https://i.pravatar.cc/100?img=20' },
      { name: 'Marcus Thorne', role: 'Lord Vael', avatar: 'https://i.pravatar.cc/100?img=22' },
    ],
    episodes: [
      { id: 'sk-s1e1', number: 1, season: 1, title: 'The Null', synopsis: 'Kira discovers her unique ability.', duration: '58m', thumbnail: THUMB.castle, progress: 100 },
      { id: 'sk-s1e2', number: 2, season: 1, title: 'Court of Shadows', synopsis: 'Infiltrating the capital.', duration: '62m', thumbnail: THUMB.forest, progress: 100 },
      { id: 'sk-s1e3', number: 3, season: 1, title: 'Blood Oath', synopsis: 'Alliances are tested.', duration: '55m', thumbnail: THUMB.castle, progress: 72 },
    ],
    similar: ['iron-realm', 'witches-fall', 'void-signal'],
  },
  {
    id: 'chrome-dawn',
    title: 'Chrome Dawn',
    type: 'series',
    year: 2026,
    rating: 'TV-MA',
    matchPercent: 94,
    seasons: 2,
    genres: ['Cyberpunk', 'Noir', 'Action'],
    synopsis: 'In a rain-soaked megalopolis, a disgraced detective teams up with a corporate whistleblower to expose a conspiracy that reaches the top of the city\'s tech oligarchy.',
    backdrop: UNSPLASH.cyber,
    thumbnail: THUMB.cyber,
    is4K: true,
    isHDR: true,
    audio: '5.1',
    progress: 28,
    cast: [
      { name: 'Ryo Tanaka', role: 'Det. Harlow', avatar: 'https://i.pravatar.cc/100?img=30' },
      { name: 'Zara Kim', role: 'Echo-7', avatar: 'https://i.pravatar.cc/100?img=32' },
    ],
    similar: ['void-signal', 'heist-protocol', 'velocity'],
  },
  {
    id: 'heist-protocol',
    title: 'Heist Protocol',
    type: 'movie',
    year: 2026,
    rating: 'PG-13',
    matchPercent: 91,
    duration: '1H 58M',
    genres: ['Action', 'Crime', 'Thriller'],
    synopsis: 'Five strangers with nothing in common are recruited for an impossible heist: the most secure vault in the world. But the real prize might be something none of them expected.',
    backdrop: UNSPLASH.heist,
    thumbnail: THUMB.heist,
    is4K: true,
    isHDR: false,
    audio: '5.1',
    progress: 0,
    cast: [
      { name: 'Lena Ortega', role: 'Ghost', avatar: 'https://i.pravatar.cc/100?img=40' },
      { name: 'Finn O\'Brien', role: 'Architect', avatar: 'https://i.pravatar.cc/100?img=42' },
    ],
    similar: ['velocity', 'chrome-dawn'],
  },
  {
    id: 'deep-horizon',
    title: 'Deep Horizon',
    type: 'documentary',
    year: 2025,
    rating: 'PG',
    matchPercent: 89,
    duration: '1H 42M',
    genres: ['Documentary', 'Science', 'Nature'],
    synopsis: 'Journey to the furthest reaches of the ocean\'s unexplored trenches, where life exists in impossible conditions and secrets older than civilization await discovery.',
    backdrop: UNSPLASH.underwater,
    thumbnail: THUMB.underwater,
    is4K: true,
    isHDR: true,
    audio: '5.1',
    progress: 60,
    cast: [],
    similar: ['void-signal', 'echo-protocol'],
  },
  {
    id: 'iron-realm',
    title: 'Iron Realm',
    type: 'series',
    year: 2025,
    rating: 'TV-14',
    matchPercent: 93,
    seasons: 4,
    genres: ['Fantasy', 'Action', 'Drama'],
    synopsis: 'The ancient kingdoms of iron and fire collide as a new power rises from the ashes of a forgotten war.',
    backdrop: UNSPLASH.volcano,
    thumbnail: THUMB.volcano,
    is4K: true,
    isHDR: true,
    audio: '5.1',
    progress: 100,
    cast: [
      { name: 'Aldric Storm', role: 'King Varen', avatar: 'https://i.pravatar.cc/100?img=50' },
    ],
    similar: ['shadow-kingdom', 'witches-fall'],
  },
  {
    id: 'echo-protocol',
    title: 'Echo Protocol',
    type: 'movie',
    year: 2026,
    rating: 'PG-13',
    matchPercent: 92,
    duration: '2H 05M',
    genres: ['Sci-Fi', 'Mystery', 'Thriller'],
    synopsis: 'A memory archaeologist discovers that the echoes she recovers from dead minds contain a warning — one that changes everything she knows about consciousness.',
    backdrop: UNSPLASH.mountain,
    thumbnail: THUMB.mountain,
    is4K: true,
    isHDR: true,
    audio: '5.1',
    progress: 0,
    cast: [
      { name: 'Mia Farrow', role: 'Dr. Caden', avatar: 'https://i.pravatar.cc/100?img=60' },
    ],
    similar: ['void-signal', 'deep-horizon'],
  },
  {
    id: 'witches-fall',
    title: 'When Witches Fall',
    type: 'series',
    year: 2025,
    rating: 'TV-MA',
    matchPercent: 88,
    seasons: 2,
    genres: ['Horror', 'Fantasy', 'Drama'],
    synopsis: 'In a coastal village where the boundary between living and dead grows thin, a family of witches must prevent an ancient curse from consuming the world.',
    backdrop: UNSPLASH.ocean,
    thumbnail: THUMB.ocean,
    is4K: false,
    isHDR: false,
    audio: '5.1',
    progress: 15,
    cast: [],
    similar: ['shadow-kingdom', 'iron-realm'],
  },
  {
    id: 'desert-run',
    title: 'Desert Run',
    type: 'movie',
    year: 2026,
    rating: 'PG',
    matchPercent: 87,
    duration: '1H 50M',
    genres: ['Adventure', 'Drama'],
    synopsis: 'Across 2,000 miles of unforgiving desert, a father and daughter attempt the world\'s most dangerous ultramarathon.',
    backdrop: UNSPLASH.desert,
    thumbnail: THUMB.desert,
    is4K: true,
    isHDR: false,
    audio: '2.0',
    progress: 0,
    cast: [],
    similar: ['deep-horizon', 'echo-protocol'],
  },
  {
    id: 'live-finals',
    title: 'World Cup Finals 2026',
    type: 'sport',
    year: 2026,
    rating: 'G',
    matchPercent: 99,
    duration: '3H 00M',
    genres: ['Sports', 'Live'],
    synopsis: 'The biggest sporting event on the planet. Two nations. One trophy. Live from the iconic Lusail stadium.',
    backdrop: UNSPLASH.stadium,
    thumbnail: THUMB.stadium,
    is4K: true,
    isHDR: true,
    audio: '5.1',
    progress: 0,
    isNew: true,
    cast: [],
    similar: [],
  },
  {
    id: 'night-race',
    title: 'Night Race: Monaco GP',
    type: 'sport',
    year: 2026,
    rating: 'G',
    matchPercent: 96,
    duration: '2H 30M',
    genres: ['Sports', 'Racing', 'Live'],
    synopsis: 'Wheel to wheel at 200mph through the most iconic street circuit on earth. The Monaco Grand Prix under the lights.',
    backdrop: UNSPLASH.racing,
    thumbnail: THUMB.racing,
    is4K: true,
    isHDR: true,
    audio: '5.1',
    progress: 0,
    isNew: true,
    cast: [],
    similar: [],
  },
  {
    id: 'forest-world',
    title: 'Ancient Forests',
    type: 'documentary',
    year: 2025,
    rating: 'G',
    matchPercent: 85,
    duration: '1H 35M',
    genres: ['Documentary', 'Nature'],
    synopsis: 'Enter the oldest forests on Earth, where trees communicate, fungi network, and ecosystems millions of years old still hold their mysteries.',
    backdrop: UNSPLASH.forest,
    thumbnail: THUMB.forest,
    is4K: true,
    isHDR: true,
    audio: '5.1',
    progress: 0,
    cast: [],
    similar: ['deep-horizon'],
  },
];

export const HERO_CONTENT = CONTENT[0];

export const CONTINUE_WATCHING = CONTENT.filter(c => c.progress && c.progress > 0 && c.progress < 100);

export const TRENDING = [...CONTENT].sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 8);

export const RECOMMENDED = CONTENT.filter(c => c.matchPercent >= 90);

export const LIVE_SPORTS = CONTENT.filter(c => c.type === 'sport');

export const RECENTLY_ADDED = CONTENT.filter(c => c.isNew || c.year === 2026).slice(0, 8);

export const CATEGORIES = [
  { id: 'action', label: 'Action & Thriller', color: '#e50914' },
  { id: 'sci-fi', label: 'Sci-Fi', color: '#0071eb' },
  { id: 'fantasy', label: 'Fantasy', color: '#6a0dad' },
  { id: 'documentary', label: 'Documentary', color: '#46d369' },
  { id: 'drama', label: 'Drama', color: '#f5a623' },
  { id: 'sports', label: 'Live Sports', color: '#00b4d8' },
  { id: 'horror', label: 'Horror', color: '#8b0000' },
  { id: 'comedy', label: 'Comedy', color: '#ffd60a' },
];

export const getContentById = (id: string) => CONTENT.find(c => c.id === id);
export const getRelatedContent = (ids: string[]) => ids.map(id => getContentById(id)).filter(Boolean) as ContentItem[];

export const searchContent = (query: string): ContentItem[] => {
  const q = query.toLowerCase();
  return CONTENT.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.genres.some(g => g.toLowerCase().includes(q)) ||
    c.synopsis.toLowerCase().includes(q)
  );
};
