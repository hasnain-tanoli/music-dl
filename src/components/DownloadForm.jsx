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
    if (!isValid || !url.trim()) {
      toast.error('Please enter a valid Spotify URL');
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

      await downloadSpotifyContent(url, (progress) => {
        setDownloadProgress(progress);
      });

      toast.success('Download completed successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(error.message || 'Download failed. Please try again. Ensure the URL is correct and the server is running.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null); // Reset progress bar
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
      className={`rounded-2xl p-8 backdrop-blur-sm border transition-all duration-300 ${
        darkMode 
          ? 'bg-spotify-light/30 border-spotify-light/20' 
          : 'bg-white/60 border-gray-200'
      }`}
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="spotify-url" className="block text-lg font-semibold mb-3">
            Spotify URL
          </label>
          <div className="relative">
            <input
              id="spotify-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Spotify track, album, or playlist link here..."
              disabled={isDownloading}
              aria-label="Spotify URL input"
              className={`w-full px-4 py-4 pr-12 rounded-xl border-2 transition-all duration-300 text-lg ${
                darkMode
                  ? 'bg-spotify-dark/50 border-spotify-light/30 text-white placeholder-gray-400 focus:border-spotify-green'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-spotify-green'
              } focus:outline-none focus:ring-2 focus:ring-spotify-green/20 ${
                isValid === false ? 'border-red-400' : ''
              } ${isValid === true ? 'border-green-400' : ''}`}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <SafeIcon 
                icon={getValidationIcon()} 
                className={`text-xl ${getValidationColor()}`}
              />
            </div>
          </div>
          
          <AnimatePresence>
            {isValid === false && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-400 text-sm mt-2"
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
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
            isValid && !isDownloading
              ? 'bg-spotify-green hover:bg-spotify-green/90 text-white shadow-lg shadow-spotify-green/25'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          }`}
        >
          {isDownloading ? (
            <>
              <SafeIcon icon={FiLoader} className="text-xl animate-spin" />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <SafeIcon icon={FiDownload} className="text-xl" />
              <span>Download</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DownloadForm;