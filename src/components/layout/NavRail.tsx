import React, { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, Tv, Film, Settings, User, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'search', label: 'Search', icon: Search, path: '/search' },
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'series', label: 'Series', icon: Tv, path: '/series' },
  { id: 'movies', label: 'Movies', icon: Film, path: '/movies' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

const NavRail: React.FC = () => {
  const { isNavOpen, setNavOpen, activeProfile } = useApp();
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  }, [navigate]);

  return (
    <motion.nav
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-black/90 backdrop-blur-md border-r border-white/5"
      animate={{ width: isNavOpen ? 220 : 72 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setNavOpen(true)}
      onMouseLeave={() => setNavOpen(false)}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-5 overflow-hidden shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent-green flex items-center justify-center shrink-0 font-black text-black text-sm">
          C
        </div>
        <AnimatePresence>
          {isNavOpen && (
            <motion.span
              className="ml-3 font-bold text-white text-lg whitespace-nowrap"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              Nexora
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <div className="flex-1 flex flex-col py-4 gap-1 overflow-hidden">
        {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              `flex items-center h-12 px-5 rounded-none transition-all duration-200 group relative
               ${isActive
                 ? 'text-white bg-white/15 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-accent-green before:rounded-r'
                 : 'text-text-secondary hover:text-white hover:bg-white/8'
               }
               focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-0`
            }
            onKeyDown={(e) => handleKeyDown(e, path)}
            tabIndex={0}
            aria-label={label}
          >
            <Icon size={22} className="shrink-0" strokeWidth={1.5} />
            <AnimatePresence>
              {isNavOpen && (
                <motion.span
                  className="ml-4 text-sm font-medium whitespace-nowrap"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </div>

      {/* Profile avatar at bottom */}
      {activeProfile && (
        <div
          className="flex items-center h-16 px-4 border-t border-white/5 overflow-hidden cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => navigate('/profile')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/profile')}
          aria-label="View profile"
        >
          <img
            src={activeProfile.avatar}
            alt={activeProfile.name}
            className="w-8 h-8 rounded-full shrink-0"
            style={{ outline: `2px solid ${activeProfile.color}`, outlineOffset: '1px' }}
          />
          <AnimatePresence>
            {isNavOpen && (
              <motion.div
                className="ml-3 flex-1 min-w-0 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <span className="text-sm font-medium text-white truncate">{activeProfile.name}</span>
                <ChevronRight size={14} className="text-text-muted shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.nav>
  );
};

export default NavRail;
