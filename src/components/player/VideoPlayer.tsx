import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipForward, SkipBack, X, Subtitles, Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getContentById } from '../../data/content';

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const VideoPlayer: React.FC = () => {
  const { currentContentId, isPlayerOpen, setPlayerOpen, updateProgress } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0);

  const content = currentContentId ? getContentById(currentContentId) : null;

  // Demo video — Big Buck Bunny
  const DEMO_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const resetHideTimer = useCallback(() => {
    clearTimeout(hideTimerRef.current);
    setShowControls(true);
    if (isPlaying) {
      hideTimerRef.current = window.setTimeout(() => setShowControls(false), 3000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isPlayerOpen) {
      resetHideTimer();
      const vid = videoRef.current;
      if (vid) vid.play().catch(() => {});
    }
    return () => clearTimeout(hideTimerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerOpen]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(vid.currentTime);
      setProgress(vid.duration ? (vid.currentTime / vid.duration) * 100 : 0);
      if (content && vid.duration) {
        updateProgress(content.id, Math.round((vid.currentTime / vid.duration) * 100));
      }
    };
    const onDurationChange = () => setDuration(vid.duration);
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);

    vid.addEventListener('play', onPlay);
    vid.addEventListener('pause', onPause);
    vid.addEventListener('timeupdate', onTimeUpdate);
    vid.addEventListener('durationchange', onDurationChange);
    vid.addEventListener('waiting', onWaiting);
    vid.addEventListener('canplay', onCanPlay);

    return () => {
      vid.removeEventListener('play', onPlay);
      vid.removeEventListener('pause', onPause);
      vid.removeEventListener('timeupdate', onTimeUpdate);
      vid.removeEventListener('durationchange', onDurationChange);
      vid.removeEventListener('waiting', onWaiting);
      vid.removeEventListener('canplay', onCanPlay);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) vid.play();
    else vid.pause();
    resetHideTimer();
  }, [resetHideTimer]);

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    vid.currentTime = ratio * vid.duration;
    resetHideTimer();
  };

  const skip = (seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
    resetHideTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case ' ': case 'k': togglePlay(); e.preventDefault(); break;
      case 'ArrowRight': skip(10); e.preventDefault(); break;
      case 'ArrowLeft': skip(-10); e.preventDefault(); break;
      case 'm': toggleMute(); break;
      case 'f': toggleFullscreen(); break;
      case 'Escape': if (!isFullscreen) setPlayerOpen(false); break;
    }
  };

  if (!isPlayerOpen || !content) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          ref={containerRef}
          className="relative w-full h-full"
          onMouseMove={resetHideTimer}
          onKeyDown={handleKeyDown}
          onClick={togglePlay}
          tabIndex={0}
          style={{ cursor: showControls ? 'default' : 'none' }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            src={DEMO_VIDEO}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
          />

          {/* Buffering spinner */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* Controls overlay */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute inset-0 flex flex-col justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top bar */}
                <div className="flex items-center justify-between px-6 pt-5 bg-gradient-to-b from-black/80 to-transparent">
                  <div>
                    <p className="text-white/60 text-sm mb-0.5">Now Playing</p>
                    <h3 className="text-white font-bold text-lg">{content.title}</h3>
                  </div>
                  <button
                    onClick={() => setPlayerOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                    aria-label="Close player"
                  >
                    <X size={18} className="text-white" />
                  </button>
                </div>

                {/* Center play/pause indicator */}
                <div className="flex items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all active:scale-90"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying
                      ? <Pause size={28} className="text-white" fill="white" />
                      : <Play size={28} className="text-white ml-1" fill="white" />
                    }
                  </button>
                </div>

                {/* Bottom controls */}
                <div className="px-6 pb-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16">
                  {/* Progress bar */}
                  <div
                    className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group/progress mb-4"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-[#e50914] rounded-full relative transition-all"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg scale-0 group-hover/progress:scale-100 transition-transform -translate-x-1/2" />
                    </div>
                  </div>

                  {/* Controls row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={() => skip(-10)} className="text-white/80 hover:text-white transition-colors" aria-label="Rewind 10s">
                        <SkipBack size={22} />
                      </button>
                      <button onClick={togglePlay} className="text-white hover:text-white/80 transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
                        {isPlaying ? <Pause size={26} fill="white" /> : <Play size={26} fill="white" className="ml-0.5" />}
                      </button>
                      <button onClick={() => skip(10)} className="text-white/80 hover:text-white transition-colors" aria-label="Forward 10s">
                        <SkipForward size={22} />
                      </button>

                      {/* Volume */}
                      <div className="flex items-center gap-2 group/vol">
                        <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                          {isMuted || volume === 0
                            ? <VolumeX size={20} />
                            : <Volume2 size={20} />
                          }
                        </button>
                        <input
                          type="range"
                          min={0} max={1} step={0.01}
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-0 group-hover/vol:w-20 transition-all duration-200 accent-white"
                          aria-label="Volume"
                        />
                      </div>

                      {/* Time */}
                      <span className="text-white/70 text-sm font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="text-white/70 hover:text-white transition-colors" aria-label="Subtitles">
                        <Subtitles size={20} />
                      </button>
                      <button className="text-white/70 hover:text-white transition-colors" aria-label="Settings">
                        <Settings size={20} />
                      </button>
                      <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors" aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoPlayer;
