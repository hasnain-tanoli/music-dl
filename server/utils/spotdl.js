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

export const downloadSpotifyContent = async (url, title, socketId, io) => { // io is now passed from downloadQueue
  const downloadId = uuidv4();
  const downloadPath = path.join(DOWNLOADS_DIR, downloadId);

  try {
    await fs.mkdir(downloadPath, { recursive: true });

    io.to(socketId).emit('download_progress', {
      stage: 'initializing',
      progress: 0,
      message: 'Verifying download utility...',
      currentTrack: null,
      totalTracks: 0,
      completedTracks: 0,
    });

    // Check if spotdl is available and working
    const spotdlCheck = spawn('python', ['-m', 'spotdl', '--version']);
    let checkError = '';
    spotdlCheck.stderr.on('data', (data) => {
      checkError += data.toString();
    });

    spotdlCheck.on('error', (err) => {
      console.error('Spawn error for spotdl check:', err);
      io.to(socketId).emit('download_error', {
        message: 'Server-side error: Download utility is not configured correctly.',
      });
    });

    spotdlCheck.on('close', (code) => {
      if (code !== 0) {
        console.error(`spotdl --version check failed with code ${code}:`, checkError);
        io.to(socketId).emit('download_error', {
          message: 'Server-side error: Download utility is not configured correctly.',
        });
        return;
      }
      // If check is successful, proceed with the actual download
      runSpotDL(url, title, socketId, io, downloadPath, downloadId);
    });

  } catch (error) {
    console.error('Download error:', error);
    io.to(socketId).emit('download_error', {
      message: 'Failed to start download. Please check server logs.',
    });
    // Cleanup in case of early failure
    await fs.rm(downloadPath, { recursive: true, force: true }).catch(err => console.error(`Failed to clean up directory ${downloadPath}:`, err));
  }
};

const runSpotDL = (url, title, socketId, io, downloadPath, downloadId) => {
  const args = [
    url,
    '--output', downloadPath,
    '--format', 'mp3',
    '--bitrate', '320k',
    '--threads', '4', // Potentially speed up downloads
    '--print-errors'
  ];

  const spotdlProcess = spawn('python', ['-m', 'spotdl', ...args], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let totalTracks = 0;
  let completedTracks = 0;
  let currentTrack = '';
  let stderrOutput = '';

  spotdlProcess.stderr.on('data', (data) => {
    stderrOutput += data.toString();
    console.error('spotDL stderr:', data.toString());
  });

  spotdlProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('spotDL stdout:', output);

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
        const progress = totalTracks > 0 ? 10 + (completedTracks / totalTracks) * 80 : 50;
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
      // Ensure completedTracks does not exceed totalTracks for display and calculation
      const displayCompletedTracks = Math.min(completedTracks, totalTracks > 0 ? totalTracks : completedTracks);
      const progress = totalTracks > 0 ? 10 + (displayCompletedTracks / totalTracks) * 80 : 80;
      io.to(socketId).emit('download_progress', {
        stage: 'downloading',
        progress: Math.min(progress, 100), // Cap progress at 100%
        message: `Downloaded ${displayCompletedTracks} of ${totalTracks} tracks`,
        currentTrack,
        totalTracks,
        completedTracks: displayCompletedTracks // Send capped value
      });
    }
  });

  spotdlProcess.on('close', async (code) => {
    if (code === 0 && !stderrOutput.includes('Error:')) {
      await processDownloadCompletion(title, socketId, io, downloadPath, downloadId, totalTracks);
    } else {
      console.error(`spotDL process exited with code ${code}. Stderr: ${stderrOutput}`);
      io.to(socketId).emit('download_error', {
        message: `Download failed: ${stderrOutput || 'An unknown error occurred.'}`
      });
      // Cleanup failed download directory
      await fs.rm(downloadPath, { recursive: true, force: true }).catch(err => console.error(`Failed to clean up directory ${downloadPath}:`, err));
    }
  });
};

const processDownloadCompletion = async (title, socketId, io, downloadPath, downloadId, totalTracks) => {
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
      throw new Error('No audio files found after download process.');
    }

    let downloadUrl, filename;
    // Sanitize title for filesystem
    const safeTitle = title.replace(/[^a-z0-9_ -]/gi, '_').replace(/\s+/g, '-');

    if (audioFiles.length === 1) {
      // Single file - serve directly with a clean name
      const originalFilename = audioFiles[0];
      const newFilename = `${safeTitle}.mp3`;
      await fs.rename(path.join(downloadPath, originalFilename), path.join(downloadPath, newFilename));
      
      filename = newFilename;
      downloadUrl = `/downloads/${downloadId}/${filename}`;
    } else {
      // Multiple files - create a named zip
      filename = `spotify-download-${safeTitle}.zip`;
      const zipPath = path.join(DOWNLOADS_DIR, downloadId, filename); // Corrected zip path
      
      await createZip(downloadPath, zipPath, audioFiles);
      downloadUrl = `/downloads/${downloadId}/${filename}`;
    }

    io.to(socketId).emit('download_progress', {
      stage: 'completed',
      progress: 100,
      message: 'Download complete!',
      currentTrack: null,
      totalTracks,
      completedTracks: totalTracks
    });

    io.to(socketId).emit('download_complete', {
      downloadUrl,
      filename,
      totalFiles: audioFiles.length
    });

  } catch (error) {
    console.error('Processing completion error:', error);
    io.to(socketId).emit('download_error', {
      message: 'Failed to process downloaded files.'
    });
    // Cleanup directory on processing error
    await fs.rm(downloadPath, { recursive: true, force: true }).catch(err => console.error(`Failed to clean up directory ${downloadPath}:`, err));
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
