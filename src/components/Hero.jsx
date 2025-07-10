import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiMusic, FiDisc, FiList } = FiIcons;

const Hero = () => {
  const features = [
    { 
      icon: FiMusic, 
      title: 'Individual Songs', 
      desc: 'Download single tracks',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: FiDisc, 
      title: 'Full Albums', 
      desc: 'Complete album downloads',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: FiList, 
      title: 'Playlists', 
      desc: 'Entire playlist support',
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      icon: FiDownload, 
      title: 'High Quality', 
      desc: '320kbps MP3 files',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="text-center py-16 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-spotify-green via-emerald-400 to-teal-400 bg-clip-text text-transparent leading-tight">
              Download Spotify Music
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-premium-gold to-yellow-500 rounded-full animate-bounce-slow opacity-80"></div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-500 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Paste any Spotify link and download high-quality MP3 files instantly. 
            <br />
            <span className="text-spotify-green font-semibold">Support for songs, albums, and playlists</span> with real-time progress tracking.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-premium hover:shadow-premium-lg transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <SafeIcon 
                    icon={feature.icon} 
                    className="text-2xl text-white" 
                  />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;