# Spotify Downloader

A full-stack web application that allows users to download Spotify tracks, albums, and playlists with real-time progress tracking.

## Features

- 🎵 Download individual tracks, full albums, or entire playlists
- 📊 Real-time download progress with WebSocket communication
- 🎨 Beautiful, responsive UI with dark/light mode
- 🚀 Fast and reliable downloads using spotDL
- 📦 Automatic file packaging (single MP3 or ZIP for multiple files)
- 🧹 Automatic cleanup of temporary files
- ⚡ Built with React, Node.js, and modern web technologies

## Tech Stack

**Frontend:**
- React 18 with Vite
- TailwindCSS for styling
- Framer Motion for animations
- Socket.io-client for real-time updates
- React Hot Toast for notifications

**Backend:**
- Node.js with Express
- Socket.io for WebSocket communication
- spotDL for downloading music
- Archiver for ZIP file creation
- Automatic file cleanup with cron jobs

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v16 or higher)
2. **Python** (v3.7 or higher)
3. **spotDL** installed globally:
   ```bash
   pip install spotdl
   ```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd spotify-downloader
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

## Running the Application

### Development Mode

To run both frontend and backend simultaneously:

```bash
npm start
```

This will start:
- Frontend dev server on `http://localhost:5173`
- Backend server on `http://localhost:3001`

### Manual Start

If you prefer to start servers separately:

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
npm run dev:server
```

## Usage

1. Open the application in your browser
2. Paste a Spotify URL (track, album, or playlist)
3. Wait for validation and metadata preview
4. Click "Download" to start the process
5. Monitor real-time progress
6. Download will start automatically when complete

## Supported URLs

- **Tracks:** `https://open.spotify.com/track/[id]`
- **Albums:** `https://open.spotify.com/album/[id]`
- **Playlists:** `https://open.spotify.com/playlist/[id]`

## Configuration

### Backend Configuration

The server can be configured with environment variables:

- `PORT` - Server port (default: 3001)
- `CLEANUP_INTERVAL` - File cleanup interval in minutes (default: 5)

### Frontend Configuration

The frontend API base URL can be modified in `src/utils/api.js`.

## File Structure

```
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── utils/             # Utility functions
│   └── common/            # Shared components
├── server/                # Backend source code
│   ├── routes/            # Express routes
│   ├── utils/             # Server utilities
│   └── downloads/         # Temporary download storage
└── public/                # Static assets
```

## Legal Notice

This tool is for educational and personal use only. Users are responsible for ensuring they have the right to download and use the content. The developers are not responsible for any misuse or copyright infringement.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### spotDL Not Found

If you get errors about spotDL not being found:

1. Make sure Python is installed
2. Install spotDL: `pip install spotdl`
3. Verify installation: `spotdl --version`

### Download Failures

- Check your internet connection
- Verify the Spotify URL is valid and public
- Ensure spotDL is properly installed
- Check server logs for detailed error messages

### Performance Issues

For large playlists:
- Downloads are processed sequentially to avoid overwhelming the system
- File cleanup runs automatically every minute
- Consider increasing server resources for heavy usage