import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContentItem } from '../../data/content';
import { useApp } from '../../context/AppContext';

interface HeroBannerProps {
  content: ContentItem;
  onPlay?: () => void;
}

const MetaBadge: React.FC<{ children: React.ReactNode; green?: boolean }> = ({ children, green }) => (
  <span className={`text-sm font-semibold ${green ? 'text-[#46d369]' : 'text-white/80'}`}>
    {children}
  </span>
);

const HeroBanner: React.FC<HeroBannerProps> = ({ content, onPlay }) => {
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites, setCurrentContentId, setPlayerOpen } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const fav = isFavorite(content.id);

  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = content.backdrop;
  }, [content.backdrop]);

  const handlePlay = () => {
    setCurrentContentId(content.id);
    setPlayerOpen(true);
    onPlay?.();
  };

  const handleMoreInfo = () => {
    navigate(`/content/${content.id}`);
  };

  const handleFavorite = () => {
    if (fav) removeFromFavorites(content.id);
    else addToFavorites(content.id);
  };

  return (
    <div className="relative w-full" style={{ height: 'min(56vw, 680px)' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-bg-primary">
        <AnimatePresence mode="wait">
          {imageLoaded && (
            <motion.img
              key={content.id}
              src={content.backdrop}
              alt=""
              className="w-full h-full object-cover object-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0fb0] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" style={{ background: 'linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,0.4) 30%, transparent 60%)' }} />
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0a0f]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-12 pl-[88px] pr-8" style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={content.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            {/* Title */}
            <h1
              className="font-black text-white leading-none tracking-tight mb-4"
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)' }}
            >
              {content.title.toUpperCase()}
            </h1>

            {/* Metadata row */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <MetaBadge green>{content.matchPercent}% Match</MetaBadge>
              <span className="text-white/30">•</span>
              <MetaBadge>{content.year}</MetaBadge>
              {content.genres[0] && (
                <>
                  <span className="text-white/30">•</span>
                  <MetaBadge>{content.genres[0].toUpperCase()} {content.genres[1] ? `THRILLER` : ''}</MetaBadge>
                </>
              )}
              {content.duration && (
                <>
                  <span className="text-white/30">•</span>
                  <MetaBadge>{content.duration}</MetaBadge>
                </>
              )}
              {content.is4K && (
                <>
                  <span className="text-white/30">•</span>
                  <MetaBadge>4K HDR</MetaBadge>
                </>
              )}
              {content.audio && (
                <>
                  <span className="text-white/30">•</span>
                  <MetaBadge>{content.audio}</MetaBadge>
                </>
              )}
            </div>

            {/* Synopsis */}
            <p className="text-white/85 text-base leading-relaxed mb-7 line-clamp-3 max-w-xl">
              {content.synopsis}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlay}
                className="flex items-center gap-3 px-8 py-3.5 bg-white text-black font-bold text-base rounded-md hover:bg-white/90 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 active:scale-95"
                tabIndex={0}
                aria-label={`Play ${content.title}`}
              >
                <Play size={20} fill="currentColor" />
                <span>Play</span>
              </button>

              <button
                onClick={handleMoreInfo}
                className="flex items-center gap-3 px-8 py-3.5 bg-white/20 text-white font-semibold text-base rounded-md hover:bg-white/30 transition-all duration-200 border border-white/20 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 active:scale-95 backdrop-blur-sm"
                tabIndex={0}
                aria-label={`More info about ${content.title}`}
              >
                <Info size={20} />
                <span>More Info</span>
              </button>

              <button
                onClick={handleFavorite}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/15 border border-white/25 hover:bg-white/25 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 backdrop-blur-sm"
                tabIndex={0}
                aria-label={fav ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {fav ? <Check size={18} className="text-[#46d369]" /> : <Plus size={18} className="text-white" />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar if watching */}
      {content.progress && content.progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full bg-[#e50914]"
            style={{ width: `${content.progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
