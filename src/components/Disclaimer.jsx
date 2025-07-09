import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiAlertTriangle, FiInfo } = FiIcons;

const Disclaimer = ({ darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="mt-16 max-w-4xl mx-auto"
    >
      <div className={`rounded-xl p-6 border ${
        darkMode 
          ? 'bg-yellow-900/20 border-yellow-600/30 text-yellow-200' 
          : 'bg-yellow-50 border-yellow-300 text-yellow-800'
      }`}>
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiAlertTriangle} className="text-xl mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="font-semibold">Legal Disclaimer</h4>
            <p className="text-sm leading-relaxed">
              This tool is for educational and personal use only. Users are responsible for ensuring 
              they have the right to download and use the content. The developers are not responsible 
              for any misuse or copyright infringement. Please respect artists' rights and support them 
              through official channels.
            </p>
          </div>
        </div>
      </div>
      
      <div className={`mt-4 rounded-xl p-6 border ${
        darkMode 
          ? 'bg-blue-900/20 border-blue-600/30 text-blue-200' 
          : 'bg-blue-50 border-blue-300 text-blue-800'
      }`}>
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiInfo} className="text-xl mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="font-semibold">How it works</h4>
            <p className="text-sm leading-relaxed">
              This application uses the spotDL tool to search for tracks on YouTube and download them
              with metadata from Spotify. No content is downloaded directly from Spotify's servers.
              <br /><br />
              The download takes time so be patient.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Disclaimer;