import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMusic, FiUser, FiDisc, FiList } = FiIcons;

const SpotifyPreview = ({ metadata, darkMode }) => {
  const getTypeIcon = () => {
    switch (metadata.type) {
      case 'track': return FiMusic;
      case 'album': return FiDisc;
      case 'playlist': return FiList;
      default: return FiMusic;
    }
  };

  const getTypeLabel = () => {
    switch (metadata.type) {
      case 'track': return 'Track';
      case 'album': return 'Album';
      case 'playlist': return 'Playlist';
      default: return 'Content';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-2xl p-6 border transition-all duration-500 shadow-premium ${
        darkMode 
          ? 'bg-gray-800/60 border-gray-700/50 shadow-premium-lg' 
          : 'bg-white/80 border-gray-200/50 shadow-premium-xl'
      }`}
    >
      <div className="flex items-start space-x-6">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-spotify-green to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-300"></div>
          <img
            src={metadata.image}
            alt={metadata.title}
            className="relative w-24 h-24 rounded-xl object-cover shadow-premium"
          />
          <div className="absolute inset-0 bg-black/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              darkMode 
                ? 'bg-spotify-green/20 text-spotify-green' 
                : 'bg-spotify-green/10 text-green-600'
            }`}>
              <SafeIcon 
                icon={getTypeIcon()} 
                className="text-lg" 
              />
            </div>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${
              darkMode 
                ? 'bg-spotify-green/20 text-spotify-green' 
                : 'bg-green-100 text-green-700'
            }`}>
              {getTypeLabel()}
            </span>
          </div>
          
          <h3 className="font-bold text-xl mb-2 truncate text-gray-900 dark:text-white" title={metadata.title}>
            {metadata.title}
          </h3>
          
          <div className="flex items-center space-x-2 text-base text-gray-600 dark:text-gray-300 mb-3">
            <SafeIcon icon={FiUser} className="text-sm" />
            <span className="truncate font-medium">{metadata.artist}</span>
          </div>
          
          {metadata.trackCount && (
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              darkMode 
                ? 'bg-gray-700 text-gray-300' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {metadata.trackCount} track{metadata.trackCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SpotifyPreview;