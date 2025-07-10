import fs from 'fs/promises';
import path from 'path';
import cron from 'node-cron';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOWNLOADS_DIR = path.join(__dirname, '..', 'downloads');
const CLEANUP_INTERVAL_MINUTES = 5; // Clean up files older than 5 minutes

export const startCleanupJob = () => {
  // Run cleanup every minute
  cron.schedule('* * * * *', async () => {
    try {
      await cleanupOldFiles();
    } catch (error) {
      console.error('Cleanup job error:', error);
    }
  });
  
  console.log('Cleanup job started - will remove files older than', CLEANUP_INTERVAL_MINUTES, 'minutes');
};

const cleanupOldFiles = async () => {
  try {
    // First, check if the directory exists.
    try {
      await fs.access(DOWNLOADS_DIR);
    } catch (e) {
      // If it doesn't exist, there's nothing to clean up.
      console.log('Downloads directory does not exist, skipping cleanup.');
      return;
    }

    const now = Date.now();
    const cutoffTime = now - (CLEANUP_INTERVAL_MINUTES * 60 * 1000);
    
    const items = await fs.readdir(DOWNLOADS_DIR);
    
    for (const item of items) {
      const itemPath = path.join(DOWNLOADS_DIR, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.mtime.getTime() < cutoffTime) {
        if (stats.isDirectory()) {
          await fs.rm(itemPath, { recursive: true });
          console.log(`Cleaned up directory: ${item}`);
        } else {
          await fs.unlink(itemPath);
          console.log(`Cleaned up file: ${item}`);
        }
      }
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};
