import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CONTENT } from '../data/content';
import ContentCard from '../components/cards/ContentCard';

const FILTERS = ['All', 'Action', 'Sci-Fi', 'Thriller', 'Documentary', 'Adventure'];
const SORT_OPTIONS = ['Match %', 'Year', 'A–Z'];

const MoviesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sort, setSort] = useState('Match %');

  const movies = CONTENT.filter(c => c.type === 'movie' || c.type === 'documentary');

  let filtered = activeFilter === 'All'
    ? movies
    : movies.filter(c => c.genres.some(g => g === activeFilter));

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'Match %') return b.matchPercent - a.matchPercent;
    if (sort === 'Year') return b.year - a.year;
    if (sort === 'A–Z') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] pt-10 pb-16"
      style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))', paddingRight: '2rem' }}
    >
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white font-black text-3xl">Movies</h1>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-sm">Sort:</span>
            <div className="flex gap-1">
              {SORT_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sort === s ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white hover:bg-white/8'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-white ${
                activeFilter === f
                  ? 'bg-white text-black'
                  : 'bg-white/8 text-white/60 hover:bg-white/14 hover:text-white border border-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
            >
              <ContentCard content={item} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/40 text-lg">No movies found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MoviesPage;
