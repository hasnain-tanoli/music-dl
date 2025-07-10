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
        className={`rounded-3xl p-8 backdrop-blur-xl border transition-all duration-500 shadow-premium ${
          darkMode
            ? 'bg-gray-800/50 border-gray-700/50 shadow-premium-lg'
            : 'bg-white/80 border-gray-200/50 shadow-premium-xl'
        }`}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Download Progress</h3>
            <div className={`flex items-center space-x-3 ${getStageColor()}`}>
              <div className={`w-3 h-3 rounded-full ${getStageColor().replace('text-', 'bg-')} animate-pulse`}></div>
              <SafeIcon 
                icon={getStageIcon()} 
                className={`text-2xl ${progress?.stage === 'initializing' || !progress ? 'animate-spin' : ''}`}
              />
              <span className="font-bold text-lg">
                {progress?.stage ? progress.stage.charAt(0).toUpperCase() + progress.stage.slice(1) : 'Starting...'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="text-lg font-bold text-spotify-green">{Math.round(progressPercentage)}%</span>
            </div>
            
            <div className={`w-full h-4 rounded-full overflow-hidden ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-spotify-green via-emerald-500 to-teal-500 rounded-full shadow-glow"
              />
            </div>
          </div>

          {progress?.message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
              {progress.message}
            </motion.div>
          )}

          {progress?.currentTrack && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-900/50 border-gray-600/50' 
                  : 'bg-gray-50/80 border-gray-200/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-spotify-green rounded-full animate-pulse shadow-glow"></div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">Currently downloading:</span>
              </div>
              <div className="mt-3 text-spotify-green font-semibold text-lg">{progress.currentTrack}</div>
              
              {progress.totalTracks > 0 && (
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Downloaded {progress.completedTracks} of {progress.totalTracks} tracks
                  </span>
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(progress.totalTracks, 10) }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < progress.completedTracks ? 'bg-spotify-green' : 'bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
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