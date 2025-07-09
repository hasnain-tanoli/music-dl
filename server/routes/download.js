import express from 'express';
import { downloadSpotifyContent } from '../utils/spotdl.js';
import { validateSpotifyUrl } from '../utils/validation.js';

const router = express.Router();

router.post('/download', async (req, res) => {
  try {
    const { url, socketId } = req.body;
    
    if (!url || !socketId) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL and socket ID are required' 
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
    downloadSpotifyContent(url, socketId, req.io);
    
  } catch (error) {
    console.error('Download route error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

export default router;