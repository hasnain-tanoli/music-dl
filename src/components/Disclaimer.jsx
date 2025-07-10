import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiAlertTriangle, FiInfo } = FiIcons;

const Disclaimer = React.memo(({ darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="mt-20 max-w-6xl mx-auto space-y-6"
    >
      <div className={`rounded-2xl p-8 border backdrop-blur-xl transition-all duration-500 ${
        darkMode 
          ? 'bg-yellow-900/20 border-yellow-600/30 text-yellow-200' 
          : 'bg-yellow-50/80 border-yellow-300/50 text-yellow-800'
      }`}>
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
            <SafeIcon icon={FiAlertTriangle} className="text-white text-lg" />
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-xl">Legal Disclaimer</h4>
            <p className="text-base leading-relaxed">
              This tool is for educational and personal use only. Users are responsible for ensuring 
              they have the right to download and use the content. The developers are not responsible 
              for any misuse or copyright infringement. Please respect artists' rights and support them 
              through official channels.
            </p>
          </div>
        </div>
      </div>
      
      <div className={`rounded-2xl p-8 border backdrop-blur-xl transition-all duration-500 ${
        darkMode 
          ? 'bg-blue-900/20 border-blue-600/30 text-blue-200' 
          : 'bg-blue-50/80 border-blue-300/50 text-blue-800'
      }`}>
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <SafeIcon icon={FiInfo} className="text-white text-lg" />
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-xl">How it works</h4>
            <p className="text-base leading-relaxed">
              This application uses the spotDL tool to search for tracks on YouTube and download them
              with metadata from Spotify. No content is downloaded directly from Spotify's servers.
            </p>
            <p className="text-base leading-relaxed font-medium">
              The download takes time so be patient. Enjoy your music! 🎵
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default Disclaimer;
