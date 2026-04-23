import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2, Disc } from 'lucide-react';
import { TRACKS } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    const prevIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
    }
  }, [currentTrackIndex]);

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden brutal-border">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={skipForward}
      />

      {/* Album Art Section */}
      <div className="relative flex-1 group overflow-hidden border-b-2 border-neon-magenta">
        <motion.img
          key={currentTrack.id}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={currentTrack.coverUrl}
          className="w-full h-full object-cover grayscale brightness-50 contrast-125 sepia-[.5] hue-rotate-[290deg] image-rendering-pixelated"
          alt={currentTrack.title}
        />
        <div className="absolute inset-0 bg-neon-magenta/10 mix-blend-color-dodge" />

        {/* Floating Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <motion.div
            key={currentTrack.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-1"
          >
            <h3 
              className="text-2xl font-pixel text-neon-cyan leading-none glitch-hard"
              data-text={currentTrack.title}
            >
              {currentTrack.title}
            </h3>
            <p className="text-white/40 text-[8px] font-pixel tracking-[0.4em] uppercase">SRC_FEED::{currentTrack.artist}</p>
          </motion.div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="p-4 space-y-6 bg-black">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={skipBackward}
            className="text-white hover:text-neon-cyan active:translate-y-0.5"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="brutal-button !px-8 !py-4"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <button
            onClick={skipForward}
            className="text-white hover:text-neon-cyan active:translate-y-0.5"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-pixel text-[8px] text-neon-magenta">GAIN_CTRL</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-neon-cyan/20 rounded-none appearance-none cursor-none accent-neon-magenta"
          />
        </div>

        {/* Playlist Preview */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-[8px] text-neon-lime font-pixel uppercase tracking-widest">
            AVAILABLE_STREAMS::
          </div>
          <div className="flex gap-2">
            {TRACKS.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                }}
                className={`relative w-12 h-12 border-2 transition-all ${
                  idx === currentTrackIndex ? 'border-neon-cyan bg-neon-cyan/20' : 'border-white/10 opacity-30 grayscale hover:opacity-100 hover:grayscale-0'
                }`}
              >
                <img src={track.coverUrl} className="w-full h-full object-cover image-rendering-pixelated" alt="" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
