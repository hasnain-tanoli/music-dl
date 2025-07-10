import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:3001';

export const downloadSpotifyContent = async (url, onProgress) => {
  return new Promise((resolve, reject) => {
    // Connect to WebSocket for real-time updates
    const socket = io(API_BASE_URL);
    
    socket.on('connect', () => {
      // console.log('Connected to server'); // Removed redundant log
    });
    
    socket.on('download_progress', (data) => {
      onProgress(data);
    });
    
    socket.on('download_complete', (data) => {
      // Trigger file download
      if (data.downloadUrl) {
        const link = document.createElement('a');
        link.href = `${API_BASE_URL}${data.downloadUrl}`;
        link.download = data.filename || 'download.zip'; // Changed default to .zip
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      socket.disconnect();
      resolve(data);
    });
    
    socket.on('download_error', (error) => {
      socket.disconnect();
      reject(new Error(error.message || 'Download failed'));
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    
    // Start download after socket connection is established
    socket.on('connect', () => {
      axios.post(`${API_BASE_URL}/api/download`, {
        url,
        socketId: socket.id
      }).catch((error) => {
        socket.disconnect();
        reject(new Error(error.response?.data?.message || 'Failed to start download'));
      });
    });
  });
};