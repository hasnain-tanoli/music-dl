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
      className={`mt-20 border-t transition-all duration-300 ${
        darkMode 
          ? 'border-spotify-light/20 bg-spotify-dark/50' 
          : 'border-gray-200 bg-gray-50/50'
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <SafeIcon icon={FiMusic} className="text-spotify-green text-xl" />
            <span className="font-semibold">Spotify Downloader</span>
          </div>
          
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Made with <SafeIcon icon={FiHeart} className="inline text-red-400 mx-1" /> for music lovers
          </p>
          
          <div className="flex items-center justify-center space-x-6">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className={`flex items-center space-x-2 text-sm transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={FiGithub} />
              <span>Source Code</span>
            </motion.a>
          </div>
          
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            © 2024 Spotify Downloader. Educational use only.
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;