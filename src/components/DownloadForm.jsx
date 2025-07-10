import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SpotifyPreview from './SpotifyPreview';
import { validateSpotifyUrl, getSpotifyMetadata } from '../utils/spotify';
import { downloadSpotifyContent } from '../utils/api';

const { FiLink, FiDownload, FiCheck, FiX, FiLoader } = FiIcons;

const DownloadForm = ({ darkMode, setDownloadProgress, setIsDownloading, isDownloading }) => {
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (url.trim()) {
        setIsValidating(true);
        const valid = validateSpotifyUrl(url);
        setIsValid(valid);
        
        if (valid) {
          try {
            const meta = await getSpotifyMetadata(url);
            setMetadata(meta);
          } catch (error) {
            console.error('Failed to fetch metadata:', error);
            toast.error('Failed to fetch Spotify metadata. Please check the URL or try again later.');
            setMetadata(null);
          }
        } else {
          setMetadata(null);
        }
        setIsValidating(false);
      } else {
        setIsValid(null);
        setMetadata(null);
        setIsValidating(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [url]);

  const handleDownload = async () => {
    if (!isValid || !url.trim() || !metadata) {
      toast.error('Please enter a valid Spotify URL and wait for it to be verified.');
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadProgress({
        stage: 'initializing',
        progress: 0,
        message: 'Preparing download...',
        currentTrack: null,
        totalTracks: 0,
        completedTracks: 0
      });

      await downloadSpotifyContent(url, metadata, (progress) => {
        setDownloadProgress(progress);
      });

      toast.success('Download completed successfully!');
      setUrl(''); // Clear input field on success
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(error.message || 'An unknown error occurred.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null); // Reset download progress on completion or error
    }
  };

  const getValidationIcon = () => {
    if (isValidating) return FiLoader;
    if (isValid === true) return FiCheck;
    if (isValid === false) return FiX;
    return FiLink;
  };

  const getValidationColor = () => {
    if (isValidating) return 'text-yellow-400 animate-spin';
    if (isValid === true) return 'text-green-400';
    if (isValid === false) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl p-8 backdrop-blur-xl border transition-all duration-500 shadow-premium ${
        darkMode 
          ? 'bg-gray-800/50 border-gray-700/50 shadow-premium-lg' 
          : 'bg-white/80 border-gray-200/50 shadow-premium-xl'
      }`}
    >
      <div className="space-y-8">
        <div>
          <label htmlFor="spotify-url" className="block text-xl font-bold mb-4 text-gray-900 dark:text-white">
            <span className="flex items-center space-x-2">
              <span>Spotify URL</span>
              <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse"></div>
            </span>
          </label>
          <div className="relative group">
            <input
              id="spotify-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Spotify track, album, or playlist link here..."
              disabled={isDownloading}
              aria-label="Spotify URL input"
              className={`w-full px-6 py-5 pr-14 rounded-2xl border-2 transition-all duration-500 text-lg font-medium backdrop-blur-sm ${
                darkMode
                  ? 'bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-spotify-green hover:border-gray-600'
                  : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-spotify-green hover:border-gray-400'
              } focus:outline-none focus:ring-4 focus:ring-spotify-green/20 focus:shadow-glow ${
                isValid === false ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
              } ${isValid === true ? 'border-green-400 focus:border-green-400 focus:ring-green-400/20' : ''}`}
            />
            <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
              <SafeIcon 
                icon={getValidationIcon()} 
                className={`text-2xl ${getValidationColor()}`}
              />
            </div>
            <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
              isValid === true ? 'bg-green-400/5 ring-2 ring-green-400/20' : 
              isValid === false ? 'bg-red-400/5 ring-2 ring-red-400/20' : ''
            }`}></div>
          </div>
          
          <AnimatePresence>
            {isValid === false && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-400 text-sm mt-3 font-medium"
              >
                Please enter a valid Spotify URL (track, album, or playlist)
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {metadata && (
            <SpotifyPreview metadata={metadata} darkMode={darkMode} />
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleDownload}
          disabled={!isValid || isDownloading || isValidating}
          whileHover={{ scale: isValid && !isDownloading ? 1.02 : 1 }}
          whileTap={{ scale: isValid && !isDownloading ? 0.98 : 1 }}
          aria-label="Download Spotify content"
          className={`w-full py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center justify-center space-x-3 shadow-lg ${
            isValid && !isDownloading
              ? 'bg-gradient-to-r from-spotify-green to-emerald-500 hover:from-spotify-green/90 hover:to-emerald-500/90 text-white shadow-glow hover:shadow-glow-lg transform hover:-translate-y-0.5'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          }`}
        >
          {isDownloading ? (
            <>
              <SafeIcon icon={FiLoader} className="text-2xl animate-spin" />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <SafeIcon icon={FiDownload} className="text-2xl" />
              <span>Download Music</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DownloadForm;
