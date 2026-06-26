import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Bell, Shield, Wifi, Volume2, Globe, Moon, ChevronRight } from 'lucide-react';

interface ToggleProps { value: boolean; onChange: (v: boolean) => void; }
const Toggle: React.FC<ToggleProps> = ({ value, onChange }) => (
  <button
    role="switch"
    aria-checked={value}
    onClick={() => onChange(!value)}
    className={`relative w-11 h-6 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-white ${value ? 'bg-[#46d369]' : 'bg-white/15'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}
const SettingRow: React.FC<SettingRowProps> = ({ icon, label, description, right, onClick }) => (
  <div
    className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-colors ${onClick ? 'hover:bg-white/5 cursor-pointer' : ''}`}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center shrink-0 text-white/60">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-white text-sm font-medium">{label}</p>
      {description && <p className="text-white/40 text-xs mt-0.5">{description}</p>}
    </div>
    {right && <div className="shrink-0">{right}</div>}
    {onClick && !right && <ChevronRight size={16} className="text-white/25 shrink-0" />}
  </div>
);

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-white/35 text-xs font-semibold uppercase tracking-widest px-5 pt-6 pb-2">{children}</h2>
);

const SettingsPage: React.FC = () => {
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [hdr, setHdr] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [quality, setQuality] = useState('Auto');
  const [language] = useState('English');

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] pt-10 pb-16"
      style={{ paddingLeft: 'max(88px, calc(72px + 1.5rem))', paddingRight: '2rem' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl"
      >
        <h1 className="text-white font-black text-3xl mb-8 px-5">Settings</h1>

        <div className="bg-[#111118] border border-white/8 rounded-2xl overflow-hidden divide-y divide-white/5">
          {/* Playback */}
          <SectionHeader>Playback</SectionHeader>

          <SettingRow
            icon={<Monitor size={17} />}
            label="Video Quality"
            description="Streaming resolution preference"
            right={
              <div className="flex gap-1">
                {['Auto', '4K', '1080p', '720p'].map(q => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${quality === q ? 'bg-white text-black' : 'bg-white/8 text-white/50 hover:bg-white/14'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            }
          />

          <SettingRow
            icon={<Moon size={17} />}
            label="Autoplay Next Episode"
            description="Automatically play the next episode"
            right={<Toggle value={autoplay} onChange={setAutoplay} />}
          />

          <SettingRow
            icon={<Monitor size={17} />}
            label="HDR Playback"
            description="Enable HDR when available"
            right={<Toggle value={hdr} onChange={setHdr} />}
          />

          <SettingRow
            icon={<Volume2 size={17} />}
            label="Audio Language"
            description="Default audio track language"
            right={<span className="text-white/50 text-sm">{language}</span>}
            onClick={() => {}}
          />

          {/* Notifications */}
          <SectionHeader>Notifications</SectionHeader>

          <SettingRow
            icon={<Bell size={17} />}
            label="New Releases"
            description="Get notified about new content"
            right={<Toggle value={notifications} onChange={setNotifications} />}
          />

          {/* Data */}
          <SectionHeader>Data & Storage</SectionHeader>

          <SettingRow
            icon={<Wifi size={17} />}
            label="Data Saver"
            description="Reduce streaming quality to save data"
            right={<Toggle value={false} onChange={() => {}} />}
          />

          <SettingRow
            icon={<Globe size={17} />}
            label="Auto-Download on WiFi"
            description="Download new episodes automatically"
            right={<Toggle value={autoDownload} onChange={setAutoDownload} />}
          />

          {/* Privacy */}
          <SectionHeader>Privacy & Security</SectionHeader>

          <SettingRow
            icon={<Shield size={17} />}
            label="Viewing History"
            description="Manage your watch history"
            onClick={() => {}}
          />

          <SettingRow
            icon={<Shield size={17} />}
            label="Parental Controls"
            description="Set content rating restrictions"
            onClick={() => {}}
          />

          {/* About */}
          <SectionHeader>About</SectionHeader>

          <SettingRow
            icon={<Monitor size={17} />}
            label="App Version"
            right={<span className="text-white/30 text-xs font-mono">1.0.0-beta</span>}
          />

          <SettingRow
            icon={<Globe size={17} />}
            label="Terms of Service"
            onClick={() => {}}
          />

          <SettingRow
            icon={<Globe size={17} />}
            label="Privacy Policy"
            onClick={() => {}}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
