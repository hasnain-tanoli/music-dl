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
      className={`backdrop-blur-md border-b transition-all duration-300 ${
        darkMode 
          ? 'bg-spotify-dark/80 border-spotify-light/20' 
          : 'bg-white/80 border-gray-200'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center">
              <SafeIcon icon={FiMusic} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-spotify-green to-green-400 bg-clip-text text-transparent">
                MusicDL
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                Download your favorite music
              </p>
            </div>
          </motion.div>
          
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-spotify-light hover:bg-spotify-light/80 text-yellow-400' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            <SafeIcon 
              icon={darkMode ? FiSun : FiMoon} 
              className="text-xl"
            />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;