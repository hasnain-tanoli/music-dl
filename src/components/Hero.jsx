import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiMusic, FiDisc, FiList } = FiIcons;

const Hero = () => {
  const features = [
    { icon: FiMusic, title: 'Individual Songs', desc: 'Download single tracks' },
    { icon: FiDisc, title: 'Full Albums', desc: 'Complete album downloads' },
    { icon: FiList, title: 'Playlists', desc: 'Entire playlist support' },
    { icon: FiDownload, title: 'High Quality', desc: '320kbps MP3 files' }
  ];

  return (
    <div className="text-center py-12 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-spotify-green via-green-400 to-emerald-400 bg-clip-text text-transparent">
          Download Spotify Music
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
          Paste any Spotify link and download high-quality MP3 files instantly. 
          Support for songs, albums, and playlists with real-time progress tracking.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-spotify-light/30 backdrop-blur-sm rounded-xl p-6 border border-spotify-light/20"
          >
            <SafeIcon 
              icon={feature.icon} 
              className="text-3xl text-spotify-green mx-auto mb-3" 
            />
            <h3 className="font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Hero;