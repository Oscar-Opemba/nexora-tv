import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, Check, ThumbsUp, ThumbsDown, Share2, ArrowLeft, Clock } from 'lucide-react';
import { getContentById, getRelatedContent } from '../data/content';
import { useApp } from '../context/AppContext';
import ContentCard from '../components/cards/ContentCard';

const DetailsBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="px-2.5 py-1 bg-white/10 rounded text-white/80 text-xs font-medium border border-white/10">
    {children}
  </span>
);

const ContentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites, setCurrentContentId, setPlayerOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'episodes' | 'more' | 'details'>('more');

  const content = id ? getContentById(id) : null;

  if (!content) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
        <div className="text-center">
          <p className="text-white/60 text-lg mb-4">Content not found</p>
          <button onClick={() => navigate('/')} className="text-[#46d369] hover:underline">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const fav = isFavorite(content.id);
  const related = getRelatedContent(content.similar || []);

  const handlePlay = () => {
    setCurrentContentId(content.id);
    setPlayerOpen(true);
  };

  const handleFav = () => {
    if (fav) removeFromFavorites(content.id);
    else addToFavorites(content.id);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Backdrop hero */}
      <div className="relative w-full" style={{ height: 'min(55vw, 640px)' }}>
        <img
          src={content.backdrop}
          alt={content.title}
          className="w-full h-full object-cover object-top"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent" />
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#0a0a0f]/80 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-[calc(72px+1rem)] flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Content info overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 pb-8"
          style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title */}
            <h1
              className="font-black text-white leading-none tracking-tight mb-4"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
            >
              {content.title.toUpperCase()}
            </h1>

            {/* Metadata */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="text-[#46d369] font-bold text-sm">{content.matchPercent}% Match</span>
              <span className="text-white/30">•</span>
              <span className="text-white/70 text-sm">{content.year}</span>
              {content.duration && (
                <>
                  <span className="text-white/30">•</span>
                  <span className="text-white/70 text-sm flex items-center gap-1">
                    <Clock size={12} /> {content.duration}
                  </span>
                </>
              )}
              {content.seasons && (
                <>
                  <span className="text-white/30">•</span>
                  <span className="text-white/70 text-sm">{content.seasons} Seasons</span>
                </>
              )}
              {content.is4K && <DetailsBadge>4K</DetailsBadge>}
              {content.isHDR && <DetailsBadge>HDR</DetailsBadge>}
              {content.audio && <DetailsBadge>{content.audio}</DetailsBadge>}
              <DetailsBadge>{content.rating}</DetailsBadge>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2.5 px-7 py-3 bg-white text-black font-bold rounded-md hover:bg-white/90 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-white"
              >
                <Play size={18} fill="currentColor" />
                {content.progress && content.progress > 0 ? 'Resume' : 'Play'}
              </button>

              <button
                onClick={handleFav}
                className="flex items-center gap-2.5 px-7 py-3 bg-white/15 text-white font-semibold rounded-md hover:bg-white/25 active:scale-95 transition-all border border-white/20 backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-white"
              >
                {fav ? <Check size={18} className="text-[#46d369]" /> : <Plus size={18} />}
                {fav ? 'In Watchlist' : 'Add to List'}
              </button>

              <div className="flex items-center gap-2 ml-2">
                {[
                  { Icon: ThumbsUp, label: 'Like' },
                  { Icon: ThumbsDown, label: 'Dislike' },
                  { Icon: Share2, label: 'Share' },
                ].map(({ Icon, label }) => (
                  <button
                    key={label}
                    className="w-10 h-10 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 flex items-center justify-center transition-all focus-visible:outline-2 focus-visible:outline-white"
                    aria-label={label}
                  >
                    <Icon size={16} className="text-white" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Details section */}
      <div
        className="py-8"
        style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))', paddingRight: '2rem' }}
      >
        <div className="grid grid-cols-3 gap-10">
          {/* Left column — synopsis + cast */}
          <div className="col-span-2">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {content.genres.map(g => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full text-xs font-medium text-white/70 border border-white/15 hover:border-white/30 cursor-pointer transition-colors"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-white/80 text-base leading-relaxed mb-8 max-w-2xl">
              {content.synopsis}
            </p>

            {/* Tabs */}
            {(content.episodes || related.length > 0) && (
              <div className="mb-6">
                <div className="flex items-center gap-1 border-b border-white/10 mb-6">
                  {content.episodes && (
                    <button
                      onClick={() => setActiveTab('episodes')}
                      className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                        activeTab === 'episodes'
                          ? 'border-white text-white'
                          : 'border-transparent text-white/40 hover:text-white/70'
                      }`}
                    >
                      Episodes
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('more')}
                    className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                      activeTab === 'more'
                        ? 'border-white text-white'
                        : 'border-transparent text-white/40 hover:text-white/70'
                    }`}
                  >
                    More Like This
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                      activeTab === 'details'
                        ? 'border-white text-white'
                        : 'border-transparent text-white/40 hover:text-white/70'
                    }`}
                  >
                    Details
                  </button>
                </div>

                {/* Tab content */}
                {activeTab === 'episodes' && content.episodes && (
                  <div className="space-y-3">
                    {content.episodes.map(ep => (
                      <motion.div
                        key={ep.id}
                        className="flex gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
                        whileHover={{ x: 4 }}
                        onClick={handlePlay}
                      >
                        <div className="relative rounded-md overflow-hidden shrink-0" style={{ width: 160, height: 90 }}>
                          <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play size={24} fill="white" className="text-white" />
                          </div>
                          {ep.progress !== undefined && ep.progress > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                              <div className="h-full bg-[#e50914]" style={{ width: `${ep.progress}%` }} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-white font-semibold text-sm">
                              {ep.season}×{ep.number.toString().padStart(2, '0')} — {ep.title}
                            </p>
                            <span className="text-white/40 text-xs shrink-0 ml-2">{ep.duration}</span>
                          </div>
                          <p className="text-white/55 text-xs leading-relaxed line-clamp-2">{ep.synopsis}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'more' && (
                  <div className="grid grid-cols-3 gap-3">
                    {related.map(item => (
                      <ContentCard key={item.id} content={item} />
                    ))}
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-4 text-sm">
                    {[
                      { label: 'Type', value: content.type.charAt(0).toUpperCase() + content.type.slice(1) },
                      { label: 'Year', value: content.year.toString() },
                      { label: 'Rating', value: content.rating },
                      { label: 'Audio', value: content.audio || 'Stereo' },
                      { label: 'Video', value: content.is4K ? '4K Ultra HD' : 'Full HD' },
                      { label: 'HDR', value: content.isHDR ? 'Dolby Vision, HDR10' : 'SDR' },
                      { label: 'Genres', value: content.genres.join(', ') },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-4">
                        <span className="text-white/40 w-20 shrink-0">{label}</span>
                        <span className="text-white/80">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column — cast */}
          <div>
            {content.cast.length > 0 && (
              <div>
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Cast</h3>
                <div className="space-y-3">
                  {content.cast.map(member => (
                    <div key={member.name} className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <p className="text-white text-sm font-medium">{member.name}</p>
                        <p className="text-white/45 text-xs">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
};

export default ContentDetailsPage;
