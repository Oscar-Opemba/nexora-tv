import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroBanner from '../components/cards/HeroBanner';
import ContentCarousel from '../components/cards/ContentCarousel';
import {
  CONTENT,
  CONTINUE_WATCHING,
  TRENDING,
  RECOMMENDED,
  LIVE_SPORTS,
  RECENTLY_ADDED,
  CATEGORIES,
} from '../data/content';

// Rotate hero content every 8s
const HERO_POOL = CONTENT.filter(c => c.is4K).slice(0, 4);

const CategoriesGrid: React.FC = () => (
  <section className="mb-8">
    <h2 className="text-white font-bold text-lg tracking-tight mb-3" style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))' }}>
      Browse by Category
    </h2>
    <div
      className="grid grid-cols-4 gap-3"
      style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))', paddingRight: '2rem' }}
    >
      {CATEGORIES.map(cat => (
        <motion.button
          key={cat.id}
          className="relative h-16 rounded-lg overflow-hidden flex items-center justify-center font-bold text-white text-sm focus-visible:outline-2 focus-visible:outline-white"
          style={{ background: `linear-gradient(135deg, ${cat.color}90, ${cat.color}40)`, border: `1px solid ${cat.color}30` }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          tabIndex={0}
        >
          <span className="relative z-10">{cat.label}</span>
        </motion.button>
      ))}
    </div>
  </section>
);

const HomePage: React.FC = () => {
  const [heroIdx, setHeroIdx] = useState(0);

  // Auto-rotate hero
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx(i => (i + 1) % HERO_POOL.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Banner */}
      <HeroBanner content={HERO_POOL[heroIdx]} />

      {/* Hero indicator dots */}
      <div
        className="flex items-center gap-1.5 mb-6 mt-4"
        style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))' }}
      >
        {HERO_POOL.map((_, i) => (
          <button
            key={i}
            onClick={() => setHeroIdx(i)}
            className={`rounded-full transition-all duration-300 ${i === heroIdx ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'}`}
            aria-label={`View featured item ${i + 1}`}
          />
        ))}
      </div>

      {/* Continue Watching */}
      {CONTINUE_WATCHING.length > 0 && (
        <ContentCarousel title="Continue Watching" items={CONTINUE_WATCHING} showProgress />
      )}

      {/* Trending Now */}
      <ContentCarousel title="Trending Now" items={TRENDING} />

      {/* Recommended */}
      <ContentCarousel title="Recommended for You" items={RECOMMENDED} />

      {/* Live Sports */}
      <ContentCarousel title="Live Sports &amp; Highlights" items={LIVE_SPORTS} />

      {/* Categories */}
      <CategoriesGrid />

      {/* Recently Added */}
      <ContentCarousel title="Recently Added" items={RECENTLY_ADDED} />

      {/* Bottom padding */}
      <div className="h-16" />
    </div>
  );
};

export default HomePage;
