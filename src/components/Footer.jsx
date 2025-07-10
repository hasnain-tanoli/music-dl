import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart, FiGithub, FiMusic } = FiIcons;

const Footer = ({ darkMode }) => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className={`mt-24 border-t transition-all duration-500 ${
        darkMode 
          ? 'border-gray-700/50 bg-gray-900/50 backdrop-blur-xl' 
          : 'border-gray-200/50 bg-white/50 backdrop-blur-xl'
      }`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-spotify-green to-emerald-500 rounded-2xl flex items-center justify-center shadow-glow">
              <SafeIcon icon={FiMusic} className="text-white text-xl" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-spotify-green to-emerald-500 bg-clip-text text-transparent">
              Spotify Downloader
            </span>
          </div>
          
          <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Made with <SafeIcon icon={FiHeart} className="inline text-red-500 mx-1 animate-pulse" /> for music lovers worldwide
          </p>
          
          <div className="flex items-center justify-center space-x-8">
            <motion.a
              href="#"
              whileHover={{ scale: 1.05, y: -2 }}
              className={`flex items-center space-x-2 text-base font-medium transition-all duration-300 ${
                darkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={FiGithub} className="text-xl" />
              <span>Source Code</span>
            </motion.a>
          </div>
          
          <div className="pt-6 border-t border-gray-200/20 dark:border-gray-700/20">
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              © 2024 Spotify Downloader. Educational use only.
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;