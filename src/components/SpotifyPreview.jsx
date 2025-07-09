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
      className={`rounded-xl p-6 border transition-all duration-300 ${
        darkMode 
          ? 'bg-spotify-dark/40 border-spotify-light/20' 
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className="relative group">
          <img
            src={metadata.image}
            alt={metadata.title}
            className="w-20 h-20 rounded-lg object-cover shadow-lg"
          />
          <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <SafeIcon 
              icon={getTypeIcon()} 
              className="text-spotify-green text-sm" 
            />
            <span className={`text-sm font-medium ${
              darkMode ? 'text-spotify-green' : 'text-green-600'
            }`}>
              {getTypeLabel()}
            </span>
          </div>
          
          <h3 className="font-bold text-lg mb-1 truncate" title={metadata.title}>
            {metadata.title}
          </h3>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <SafeIcon icon={FiUser} className="text-xs" />
            <span className="truncate">{metadata.artist}</span>
          </div>
          
          {metadata.trackCount && (
            <div className="mt-2 text-sm text-gray-400">
              {metadata.trackCount} track{metadata.trackCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SpotifyPreview;