import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiMusic, FiPackage, FiCheck, FiLoader } = FiIcons;

const ProgressPanel = ({ progress, darkMode, isDownloading }) => {
  if (!progress && !isDownloading) return null;

  const getStageIcon = () => {
    if (!progress) return FiLoader;
    
    switch (progress.stage) {
      case 'initializing': return FiLoader;
      case 'parsing': return FiMusic;
      case 'downloading': return FiDownload;
      case 'packaging': return FiPackage;
      case 'completed': return FiCheck;
      default: return FiLoader;
    }
  };

  const getStageColor = () => {
    if (!progress) return 'text-yellow-400';
    
    switch (progress.stage) {
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-spotify-green';
    }
  };

  const progressPercentage = progress?.progress || 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`rounded-2xl p-8 backdrop-blur-sm border transition-all duration-300 ${
          darkMode
            ? 'bg-spotify-light/30 border-spotify-light/20'
            : 'bg-white border-gray-300 shadow-md'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Download Progress</h3>
            <div className={`flex items-center space-x-2 ${getStageColor()}`}>
              <SafeIcon 
                icon={getStageIcon()} 
                className={`text-xl ${progress?.stage === 'initializing' || !progress ? 'animate-spin' : ''}`}
              />
              <span className="font-medium">
                {progress?.stage ? progress.stage.charAt(0).toUpperCase() + progress.stage.slice(1) : 'Starting...'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-800">Overall Progress</span>
              <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            
            <div className={`w-full h-3 rounded-full overflow-hidden ${
              darkMode ? 'bg-spotify-dark/50' : 'bg-gray-200'
            }`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-spotify-green to-green-400 rounded-full"
              />
            </div>
          </div>

          {progress?.message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              {progress.message}
            </motion.div>
          )}

          {progress?.currentTrack && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                darkMode 
                  ? 'bg-spotify-dark/30 border-spotify-light/10' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse" />
                <span className="font-medium">Currently downloading:</span>
                <span className="text-spotify-green">{progress.currentTrack}</span>
              </div>
              
              {progress.totalTracks > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Track {progress.completedTracks + 1} of {progress.totalTracks}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProgressPanel;