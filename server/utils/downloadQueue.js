import { logger } from './logger.js';
import { downloadSpotifyContent } from './spotdl.js';

const downloadQueue = [];
const activeWorkers = new Set();
const MAX_CONCURRENT_DOWNLOADS = 2; // Limit concurrent spotdl processes

let ioInstance = null; // To store the socket.io instance

export const setIoInstance = (io) => {
  ioInstance = io;
};

export const addDownloadToQueue = ({ url, title, socketId }) => {
  downloadQueue.push({ url, title, socketId });
  logger.info(`Added download to queue. Queue size: ${downloadQueue.length}`);
  processQueue();
};

const processQueue = async () => {
  if (downloadQueue.length === 0 || activeWorkers.size >= MAX_CONCURRENT_DOWNLOADS) {
    return;
  }

  const job = downloadQueue.shift();
  if (!job) return; // Should not happen if queue.length > 0

  const { url, title, socketId } = job;
  const workerId = socketId; // Using socketId as a unique identifier for the worker for now

  activeWorkers.add(workerId);
  logger.info(`Starting download for socket ${socketId}. Active workers: ${activeWorkers.size}`);

  try {
    // Pass the ioInstance to downloadSpotifyContent
    await downloadSpotifyContent(url, title, socketId, ioInstance);
  } catch (error) {
    logger.error(`Error processing download for socket ${socketId}:`, error);
    if (ioInstance) {
      ioInstance.to(socketId).emit('download_error', {
        message: 'Server-side error during download processing. Please try again.',
      });
    }
  } finally {
    activeWorkers.delete(workerId);
    logger.info(`Finished download for socket ${socketId}. Active workers: ${activeWorkers.size}`);
    processQueue(); // Try to process next item in queue
  }
};