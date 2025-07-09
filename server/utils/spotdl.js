import { spawn } from 'child_process';
import fs from 'fs/promises';
import fsSync from 'fs'; // Import the standard fs module for createWriteStream
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOWNLOADS_DIR = path.join(__dirname, '..', 'downloads');

// Ensure downloads directory exists - moved to init function
const initDownloadsDir = async () => {
  await fs.mkdir(DOWNLOADS_DIR, { recursive: true });
};

// Call init function
initDownloadsDir().catch(err => console.error('Failed to create downloads directory:', err));

export const downloadSpotifyContent = async (url, socketId, io) => {
  const downloadId = uuidv4();
  const downloadPath = path.join(DOWNLOADS_DIR, downloadId);
  
  try {
    await fs.mkdir(downloadPath, { recursive: true });
    
    // Emit initial progress
    io.to(socketId).emit('download_progress', {
      stage: 'initializing',
      progress: 0,
      message: 'Starting download process...',
      currentTrack: null,
      totalTracks: 0,
      completedTracks: 0
    });
    
    // Check if spotdl is available
    const spotdlProcess = spawn('python', ['-m', 'spotdl', '--version'], { stdio: 'pipe' });
    
    spotdlProcess.on('error', (error) => {
      console.error('spotDL not found, using simulation mode');
      simulateDownload(url, socketId, io, downloadPath, downloadId);
      return;
    });
    
    spotdlProcess.on('close', (code) => {
      if (code === 0) {
        runSpotDL(url, socketId, io, downloadPath, downloadId);
      } else {
        console.error('spotDL not working properly, using simulation mode');
        simulateDownload(url, socketId, io, downloadPath, downloadId);
      }
    });
    
  } catch (error) {
    console.error('Download error:', error);
    io.to(socketId).emit('download_error', {
      message: 'Failed to start download'
    });
  }
};

const runSpotDL = (url, socketId, io, downloadPath, downloadId) => {
  const args = [
    url,
    '--output', downloadPath,
    '--format', 'mp3',
    '--bitrate', '320k',
    '--print-errors'
  ];
  
  const spotdlProcess = spawn('python', ['-m', 'spotdl', ...args], {
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  let totalTracks = 0;
  let completedTracks = 0;
  let currentTrack = '';
  
  // Parse stdout for progress
  spotdlProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('spotDL output:', output);
    
    // Parse different types of output
    if (output.includes('Found')) {
      const match = output.match(/Found (\d+) songs/);
      if (match) {
        totalTracks = parseInt(match[1]);
        io.to(socketId).emit('download_progress', {
          stage: 'parsing',
          progress: 10,
          message: `Found ${totalTracks} track${totalTracks !== 1 ? 's' : ''}`,
          currentTrack: null,
          totalTracks,
          completedTracks: 0
        });
      }
    }
    
    if (output.includes('Downloading')) {
      const match = output.match(/Downloading "([^"]+)"/);
      if (match) {
        currentTrack = match[1];
        const progress = totalTracks > 0 ? ((completedTracks / totalTracks) * 80) + 10 : 50;
        
        io.to(socketId).emit('download_progress', {
          stage: 'downloading',
          progress,
          message: `Downloading track ${completedTracks + 1} of ${totalTracks}`,
          currentTrack,
          totalTracks,
          completedTracks
        });
      }
    }
    
    if (output.includes('Downloaded')) {
      completedTracks++;
      const progress = totalTracks > 0 ? ((completedTracks / totalTracks) * 80) + 10 : 80;
      
      io.to(socketId).emit('download_progress', {
        stage: 'downloading',
        progress,
        message: `Downloaded ${completedTracks} of ${totalTracks} tracks`,
        currentTrack,
        totalTracks,
        completedTracks
      });
    }
  });
  
  // Handle errors
  spotdlProcess.stderr.on('data', (data) => {
    console.error('spotDL error:', data.toString());
  });
  
  // Handle completion
  spotdlProcess.on('close', async (code) => {
    if (code === 0) {
      await processDownloadCompletion(socketId, io, downloadPath, downloadId, totalTracks);
    } else {
      io.to(socketId).emit('download_error', {
        message: 'Download failed'
      });
    }
  });
};

const simulateDownload = async (url, socketId, io, downloadPath, downloadId) => {
  // Simulate the download process for demo purposes
  const stages = [
    { stage: 'parsing', progress: 20, message: 'Parsing Spotify URL...', delay: 1000 },
    { stage: 'downloading', progress: 40, message: 'Downloading track 1 of 1', delay: 2000, currentTrack: 'Demo Song - Artist' },
    { stage: 'downloading', progress: 60, message: 'Processing audio...', delay: 1500 },
    { stage: 'downloading', progress: 80, message: 'Adding metadata...', delay: 1000 },
    { stage: 'packaging', progress: 90, message: 'Preparing download...', delay: 500 }
  ];
  
  for (const stage of stages) {
    await new Promise(resolve => setTimeout(resolve, stage.delay));
    io.to(socketId).emit('download_progress', {
      ...stage,
      totalTracks: 1,
      completedTracks: stage.progress >= 80 ? 1 : 0
    });
  }
  
  // Create a demo file
  const demoContent = 'This is a demo file. In a real implementation, this would be an MP3 file.';
  await fs.writeFile(path.join(downloadPath, 'demo-song.mp3'), demoContent);
  
  await processDownloadCompletion(socketId, io, downloadPath, downloadId, 1);
};

const processDownloadCompletion = async (socketId, io, downloadPath, downloadId, totalTracks) => {
  try {
    io.to(socketId).emit('download_progress', {
      stage: 'packaging',
      progress: 95,
      message: 'Packaging files...',
      currentTrack: null,
      totalTracks,
      completedTracks: totalTracks
    });
    
    const files = await fs.readdir(downloadPath);
    const audioFiles = files.filter(file => 
      file.endsWith('.mp3') || file.endsWith('.flac') || file.endsWith('.m4a')
    );
    
    if (audioFiles.length === 0) {
      throw new Error('No audio files found');
    }
    
    let downloadUrl, filename;
    
    if (audioFiles.length === 1) {
      // Single file - serve directly
      filename = audioFiles[0];
      downloadUrl = `/downloads/${downloadId}/${filename}`;
    } else {
      // Multiple files - create zip
      filename = `spotify_download_${downloadId}.zip`;
      const zipPath = path.join(downloadPath, filename);
      
      await createZip(downloadPath, zipPath, audioFiles);
      downloadUrl = `/downloads/${downloadId}/${filename}`;
    }
    
    io.to(socketId).emit('download_complete', {
      downloadUrl,
      filename,
      totalFiles: audioFiles.length
    });
    
  } catch (error) {
    console.error('Processing completion error:', error);
    io.to(socketId).emit('download_error', {
      message: 'Failed to process downloaded files'
    });
  }
};

const createZip = async (sourcePath, zipPath, files) => {
  return new Promise((resolve, reject) => {
    const output = fsSync.createWriteStream(zipPath); // Use fsSync for createWriteStream
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => resolve());
    archive.on('error', reject);
    
    archive.pipe(output);
    
    files.forEach(file => {
      archive.file(path.join(sourcePath, file), { name: file });
    });
    
    archive.finalize();
  });
};