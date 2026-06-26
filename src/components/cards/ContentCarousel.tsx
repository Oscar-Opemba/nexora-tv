import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';
import { ContentItem } from '../../data/content';

interface ContentCarouselProps {
  title: string;
  items: ContentItem[];
  showProgress?: boolean;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, items, showProgress }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const cards = scrollRef.current?.querySelectorAll('[role="button"]');
    if (!cards) return;
    if (e.key === 'ArrowRight' && idx < cards.length - 1) {
      (cards[idx + 1] as HTMLElement).focus();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      (cards[idx - 1] as HTMLElement).focus();
      e.preventDefault();
    }
  };

  return (
    <section className="mb-8 group/carousel">
      <div className="flex items-center justify-between mb-3 pr-4" style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))' }}>
        <h2 className="text-white font-bold text-lg tracking-tight">{title}</h2>
        <div className="flex gap-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{ width: 'max(88px, calc(72px + 1.5rem))', background: 'linear-gradient(to right, #0a0a0f 60%, transparent)' }}
        />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[#0a0a0f] to-transparent" />

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto carousel-scroll"
          style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))', paddingRight: '2rem', paddingBottom: '8px' }}
          role="list"
        >
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              role="listitem"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
            >
              <ContentCard
                content={item}
                showProgress={showProgress}
                tabIndex={0}
                onFocus={() => {
                  const el = scrollRef.current?.querySelectorAll('[role="button"]')[idx] as HTMLElement;
                  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentCarousel;
