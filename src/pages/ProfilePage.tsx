import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Plus, LogOut, Check, ChevronRight, Heart, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CONTENT } from '../data/content';

const ProfilePage: React.FC = () => {
  const { user, activeProfile, selectProfile, logout, isFavorite } = useApp();
  const navigate = useNavigate();
  const [showSwitcher, setShowSwitcher] = useState(false);

  if (!user || !activeProfile) {
    navigate('/auth');
    return null;
  }

  const favorites = CONTENT.filter(c => isFavorite(c.id));
  const watchHistory = user.watchHistory
    .slice()
    .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
    .slice(0, 6);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] pt-10 pb-16"
      style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))', paddingRight: '2rem' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-white font-black text-3xl mb-1">My Profile</h1>
            <p className="text-white/40 text-sm">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/8 border border-white/10 text-white/60 hover:text-white hover:bg-white/15 transition-all text-sm"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>

        {/* Active profile card */}
        <div className="flex items-center gap-6 p-6 bg-white/5 border border-white/8 rounded-2xl mb-8 max-w-md">
          <div className="relative">
            <img
              src={activeProfile.avatar}
              alt={activeProfile.name}
              className="w-20 h-20 rounded-full object-cover"
              style={{ outline: `4px solid ${activeProfile.color}`, outlineOffset: '2px' }}
            />
            <div
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: activeProfile.color }}
            >
              <Check size={12} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-xl mb-1">{activeProfile.name}</p>
            <p className="text-white/40 text-sm mb-3">Active profile</p>
            <button
              onClick={() => setShowSwitcher(true)}
              className="text-[#46d369] text-sm font-medium hover:underline flex items-center gap-1"
            >
              Switch profile <ChevronRight size={14} />
            </button>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors">
            <Edit2 size={15} className="text-white/60" />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg">
          {[
            { label: 'Watchlist', value: favorites.length.toString(), icon: Heart },
            { label: 'Watched', value: watchHistory.length.toString(), icon: Clock },
            { label: 'Profiles', value: user.profiles.length.toString(), icon: Plus },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-4 bg-white/5 rounded-xl border border-white/8 text-center">
              <Icon size={18} className="text-white/40 mx-auto mb-2" />
              <p className="text-white font-bold text-2xl mb-0.5">{value}</p>
              <p className="text-white/40 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Heart size={16} className="text-[#e50914]" />
              <h2 className="text-white font-bold text-lg">My Watchlist</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {favorites.map(item => (
                <motion.div
                  key={item.id}
                  className="relative rounded-lg overflow-hidden cursor-pointer group"
                  style={{ width: 160, height: 90 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/content/${item.id}`)}
                >
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ChevronRight size={24} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Watch history */}
        {watchHistory.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-white/50" />
              <h2 className="text-white font-bold text-lg">Watch History</h2>
            </div>
            <div className="space-y-2 max-w-xl">
              {watchHistory.map(entry => {
                const item = CONTENT.find(c => c.id === entry.contentId);
                if (!item) return null;
                return (
                  <motion.div
                    key={entry.contentId}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                    onClick={() => navigate(`/content/${item.id}`)}
                    whileHover={{ x: 4 }}
                  >
                    <img src={item.thumbnail} alt={item.title} className="w-16 h-9 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-0.5 bg-white/10 rounded-full max-w-32">
                          <div className="h-full bg-[#e50914] rounded-full" style={{ width: `${entry.progress}%` }} />
                        </div>
                        <span className="text-white/30 text-xs">{entry.progress}%</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-white/20 group-hover:text-white/50 transition-colors" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Profile switcher modal */}
      <AnimatePresence>
        {showSwitcher && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSwitcher(false)}
          >
            <motion.div
              className="bg-[#111118] border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-white font-bold text-xl text-center mb-6">Who's watching?</h2>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                {user.profiles.map(profile => (
                  <button
                    key={profile.id}
                    onClick={() => { selectProfile(profile.id); setShowSwitcher(false); }}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="relative">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-20 h-20 rounded-xl object-cover transition-all group-hover:ring-4 group-hover:ring-white"
                        style={activeProfile.id === profile.id ? { outline: `4px solid ${profile.color}` } : {}}
                      />
                      {activeProfile.id === profile.id && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#46d369] flex items-center justify-center">
                          <Check size={12} className="text-black" />
                        </div>
                      )}
                    </div>
                    <span className="text-white/70 text-sm group-hover:text-white transition-colors">{profile.name}</span>
                  </button>
                ))}
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors">
                    <Plus size={24} className="text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                  <span className="text-white/40 text-sm group-hover:text-white/70 transition-colors">Add Profile</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
