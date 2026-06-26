import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Check, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContentItem } from '../../data/content';
import { useApp } from '../../context/AppContext';

interface ContentCardProps {
  content: ContentItem;
  showProgress?: boolean;
  tabIndex?: number;
  onFocus?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  showProgress = false,
  tabIndex = 0,
  onFocus,
}) => {
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites, setCurrentContentId, setPlayerOpen } = useApp();
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fav = isFavorite(content.id);

  const handleClick = () => navigate(`/content/${content.id}`);
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentContentId(content.id);
    setPlayerOpen(true);
  };
  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fav) removeFromFavorites(content.id);
    else addToFavorites(content.id);
  };
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleClick();
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-lg overflow-hidden cursor-pointer shrink-0 group"
      style={{ width: 'clamp(160px, 14vw, 240px)', aspectRatio: '16/9' }}
      whileHover={{ scale: 1.05, zIndex: 20 }}
      whileFocus={{ scale: 1.05, zIndex: 20 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      onClick={handleClick}
      onKeyDown={handleKey}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => { setHovered(true); onFocus?.(); }}
      onBlur={() => setHovered(false)}
      tabIndex={tabIndex}
      role="button"
      aria-label={`${content.title} (${content.year})`}
    >
      {/* Thumbnail */}
      <div className="absolute inset-0 bg-bg-card">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-bg-card to-bg-secondary skeleton" />
        )}
        <img
          src={content.thumbnail}
          alt={content.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-2.5">
        {/* Title */}
        <p className="text-white text-xs font-semibold leading-tight line-clamp-1 mb-1">
          {content.title}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#46d369] text-xs font-semibold">{content.matchPercent}%</span>
          <span className="text-white/40 text-xs">•</span>
          <span className="text-white/60 text-xs">{content.year}</span>
          {content.is4K && <span className="text-white/40 text-xs">• 4K</span>}
        </div>

        {/* Progress bar */}
        {showProgress && content.progress && content.progress > 0 && (
          <div className="mt-1.5 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#e50914] rounded-full"
              style={{ width: `${content.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Hover controls */}
      <motion.div
        className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        aria-hidden={!hovered}
      >
        <motion.button
          onClick={handlePlay}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Play ${content.title}`}
          tabIndex={hovered ? 0 : -1}
        >
          <Play size={16} fill="black" className="text-black ml-0.5" />
        </motion.button>
        <motion.button
          onClick={handleFav}
          className="w-8 h-8 rounded-full bg-black/60 border border-white/30 flex items-center justify-center hover:bg-white/15 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={fav ? 'Remove from list' : 'Add to list'}
          tabIndex={hovered ? 0 : -1}
        >
          {fav
            ? <Check size={12} className="text-[#46d369]" />
            : <Plus size={12} className="text-white" />
          }
        </motion.button>
        <motion.button
          className="w-8 h-8 rounded-full bg-black/60 border border-white/30 flex items-center justify-center hover:bg-white/15 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Like"
          tabIndex={hovered ? 0 : -1}
        >
          <ThumbsUp size={12} className="text-white" />
        </motion.button>
      </motion.div>

      {/* NEW badge */}
      {content.isNew && (
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#46d369] text-black text-xs font-bold rounded">
          NEW
        </div>
      )}
    </motion.div>
  );
};

export default ContentCard;
