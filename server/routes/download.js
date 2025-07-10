import express from 'express';
import rateLimit from 'express-rate-limit'; // Import rate-limit
import { addDownloadToQueue } from '../utils/downloadQueue.js';
import { validateSpotifyUrl } from '../utils/validation.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Rate limiting to prevent abuse
const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many download requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.use('/download', downloadLimiter); // Apply rate limiting to the download route

router.post('/download', async (req, res) => {
  try {
    const { url, socketId, title } = req.body;
    
    if (!url || !socketId || !title) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL, socket ID, and title are required' 
      });
    }
    
    if (!validateSpotifyUrl(url)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid Spotify URL' 
      });
    }
    
    // Start download process
    res.json({ 
      success: true, 
      message: 'Download started',
      socketId 
    });
    
    // Process download asynchronously
    // Add to download queue instead of direct processing
    addDownloadToQueue({ url, title, socketId });
    
  } catch (error) {
    logger.error('Download route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
