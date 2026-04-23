import React from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Gamepad2, Headphones, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-neon-cyan font-terminal relative overflow-hidden selection:bg-neon-magenta selection:text-black">
      {/* Visual Artifacts */}
      <div className="scanlines" />
      <div className="static-noise" />
      <div className="screen-tear" />

      {/* Header / Command Center */}
      <header className="relative z-20 border-b-4 border-neon-cyan p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-black">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-neon-magenta flex items-center justify-center brutal-border animate-pulse">
            <Activity className="w-8 h-8 text-black" />
          </div>
          <div className="flex flex-col">
            <h1 
              className="text-4xl font-pixel text-neon-cyan glitch-hard leading-none"
              data-text="PROTO_LINK_V.01"
            >
              PROTO_LINK_V.01
            </h1>
            <span className="text-[10px] text-neon-magenta tracking-[0.5em] font-pixel mt-1">STATUS::STABLE_CONNECTION</span>
          </div>
        </div>

        <div className="flex items-center gap-8 text-[10px] font-pixel uppercase">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-lime rounded-full" />
            <span>SYNC_LEVEL: 98%</span>
          </div>
          <button className="hover:text-neon-magenta transition-colors line-through decoration-neon-magenta">DIR_ACCESS</button>
          <button className="hover:text-neon-magenta transition-colors">DECRYPT_STREAM</button>
        </div>
      </header>

      {/* Main Grid Interface */}
      <main className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
          
          {/* Central Processing Node (Game) */}
          <section className="flex flex-col items-center">
            <div className="w-full flex items-center gap-4 mb-8">
              <div className="h-0.5 flex-1 bg-neon-cyan/30" />
              <div className="flex items-center gap-2 font-pixel text-xs text-neon-magenta">
                <Gamepad2 className="w-4 h-4" />
                <span>::CORE_SIM_001::</span>
              </div>
              <div className="h-0.5 flex-1 bg-neon-cyan/30" />
            </div>

            <SnakeGame />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {[
                { label: 'INPUT_VECTORS', value: 'WASD_KEYS' },
                { label: 'LATENCY', value: '0.002ms' },
                { label: 'NODE_ID', value: 'AIS-PRE-RUN' }
              ].map((stat, i) => (
                <div key={i} className="brutal-border p-3 bg-dark-surface flex flex-col gap-1">
                  <span className="text-[8px] font-pixel text-white/40">{stat.label}</span>
                  <span className="text-sm font-terminal text-neon-cyan tracking-widest">{stat.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Audio Interface (Player) */}
          <aside className="flex flex-col gap-8">
            <div className="flex items-center gap-2 font-pixel text-xs text-neon-cyan mb-2">
              <Headphones className="w-4 h-4" />
              <span>::AUDIO_FEED_01::</span>
            </div>
            
            <div className="h-[600px] border-4 border-neon-magenta">
              <MusicPlayer />
            </div>

            <div className="brutal-border p-4 bg-neon-magenta/5 border-dashed border-neon-magenta">
              <h4 className="text-[10px] font-pixel mb-2">::DIAGNOSTIC_MSG::</h4>
              <p className="text-xs font-terminal text-white/60 leading-tight">
                WARNING: FREQUENCY_OSCILLATION detected in sub-sector 7. Neural link integrity is currently holding at nominal levels. Do not attempt to disconnect during active data syphon.
              </p>
            </div>
          </aside>

        </div>
      </main>

      {/* Hardware Interface Footer */}
      <footer className="relative z-10 mt-12 border-t-4 border-neon-cyan p-4 bg-black flex flex-col md:flex-row justify-between items-center text-[10px] font-pixel text-white/30 tracking-widest gap-4">
        <span>ENCRYPTED_SIGNAL_END_POINT</span>
        <div className="flex gap-4">
          <div className="w-2 h-2 bg-neon-cyan animate-ping" />
          <span>PORT_3000_LISTENING</span>
        </div>
        <span className="text-neon-magenta">SYS_UPTIME::9999:59:59</span>
      </footer>
    </div>
  );
}
