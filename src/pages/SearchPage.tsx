import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Mic, TrendingUp } from 'lucide-react';
import { searchContent, CONTENT, CATEGORIES, ContentItem } from '../data/content';
import ContentCard from '../components/cards/ContentCard';

const TRENDING_SEARCHES = ['Sci-Fi', 'Action', 'Fantasy', 'Live Sports', 'Documentary', 'New Releases'];

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [results, setResults] = useState<ContentItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runSearch = useCallback((q: string, cat: string | null) => {
    setHasSearched(true);
    let res = q.trim() ? searchContent(q) : [...CONTENT];
    if (cat) {
      res = res.filter(c => c.genres.some(g => g.toLowerCase().includes(cat.toLowerCase())));
    }
    setResults(res);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() || activeCategory) runSearch(query, activeCategory);
      else { setHasSearched(false); setResults([]); }
    }, 200);
    return () => clearTimeout(timer);
  }, [query, activeCategory, runSearch]);

  const handleClear = () => {
    setQuery('');
    setActiveCategory(null);
    setHasSearched(false);
    setResults([]);
    inputRef.current?.focus();
  };

  const handleTrending = (term: string) => {
    setQuery(term);
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] pt-8 pb-16"
      style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))', paddingRight: '2rem' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Search input */}
        <div className="relative mb-6 max-w-2xl">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search titles, genres, actors..."
            className="w-full h-14 pl-12 pr-20 bg-white/8 border border-white/12 rounded-xl text-white placeholder-white/30 text-base focus:outline-none focus:border-white/30 focus:bg-white/12 transition-all"
            aria-label="Search content"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                onClick={handleClear}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Clear search"
              >
                <X size={16} className="text-white/60" />
              </button>
            )}
            <button
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Voice search"
            >
              <Mic size={16} className="text-white/40" />
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-white ${
                activeCategory === cat.label
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Trending searches (when no query) */}
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            <motion.div
              key="trending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-[#46d369]" />
                  <h2 className="text-white font-bold text-sm uppercase tracking-widest">Trending Searches</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map(t => (
                    <button
                      key={t}
                      onClick={() => handleTrending(t)}
                      className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/70 text-sm hover:bg-white/10 hover:text-white transition-all"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* All content grid */}
              <h2 className="text-white font-bold text-lg mb-4">All Content</h2>
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                {CONTENT.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <ContentCard content={item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">
                  {results.length > 0
                    ? `${results.length} result${results.length !== 1 ? 's' : ''}`
                    : 'No results'}
                  {query && <span className="text-white/40 font-normal"> for "{query}"</span>}
                </h2>
              </div>

              {results.length > 0 ? (
                <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                  {results.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <ContentCard content={item} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Search size={48} className="text-white/15 mb-4" />
                  <p className="text-white/50 text-lg mb-2">No results found</p>
                  <p className="text-white/30 text-sm">Try a different title, genre, or cast member</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchPage;
