import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CONTENT } from '../data/content';
import ContentCard from '../components/cards/ContentCard';

const FILTERS = ['All', 'Drama', 'Sci-Fi', 'Fantasy', 'Cyberpunk', 'Horror'];

const SeriesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const series = CONTENT.filter(c => c.type === 'series');
  const filtered = activeFilter === 'All'
    ? series
    : series.filter(c => c.genres.some(g => g === activeFilter));

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] pt-10 pb-16"
      style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))', paddingRight: '2rem' }}
    >
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-white font-black text-3xl mb-6">Series</h1>

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
            <p className="text-white/40 text-lg">No series found for "{activeFilter}"</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SeriesPage;
