import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSun, FiMoon, FiMusic } = FiIcons;

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`backdrop-blur-xl border-b transition-all duration-500 ${
        darkMode 
          ? 'bg-gray-900/80 border-gray-700/50 shadow-2xl' 
          : 'bg-white/80 border-gray-200/50 shadow-lg'
      }`}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-spotify-green to-emerald-500 rounded-2xl flex items-center justify-center shadow-glow">
                <SafeIcon icon={FiMusic} className="text-white text-xl" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-premium-gold to-yellow-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
            </div>
            <div>
              <h1 className={`text-2xl font-bold transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-spotify-green via-emerald-400 to-teal-400 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-spotify-green via-emerald-600 to-teal-600 bg-clip-text text-transparent'
              }`}>
                MusicDL
              </h1>
              <p className={`text-sm transition-all duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Premium Music Downloader
              </p>
            </div>
          </motion.div>
          
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-2xl transition-all duration-500 shadow-lg ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700' 
                : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 shadow-premium'
            }`}
          >
            <SafeIcon 
              icon={darkMode ? FiSun : FiMoon} 
              className="text-xl transition-transform duration-300"
            />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;