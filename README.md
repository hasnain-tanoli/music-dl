# 🎵 MusicDL: Spotify Downloader

A robust, full-stack web application designed to simplify the process of downloading Spotify tracks, albums, and playlists. MusicDL offers real-time progress tracking and a user-friendly interface, making music acquisition straightforward and efficient.

## ✨ Features

*   **Versatile Downloads:** Download individual tracks, complete albums, or entire playlists from Spotify.
*   **Real-time Progress:** Monitor download status with live updates via WebSocket communication.
*   **Intuitive UI:** Enjoy a modern, responsive user interface with support for both dark and light themes.
*   **High Performance:** Leverages `spotDL` for fast and reliable music downloads.
*   **Smart Packaging:** Automatically packages single tracks as MP3s and multiple files (albums/playlists) into convenient ZIP archives.
*   **Automated Cleanup:** Ensures efficient disk usage by automatically removing temporary download files.
*   **Modern Stack:** Built with cutting-edge web technologies including React, Node.js, and Express.

## 🛠️ Tech Stack

### Frontend

*   **React 18 with Vite:** A fast and efficient development environment for building dynamic user interfaces.
*   **TailwindCSS:** A utility-first CSS framework for rapid and consistent styling.
*   **Framer Motion:** For smooth and engaging UI animations.
*   **Socket.io-client:** Enables real-time communication with the backend for live progress updates.
*   **React Hot Toast:** Provides elegant and responsive notifications.

### Backend

*   **Node.js with Express:** A powerful and flexible framework for building robust server-side applications.
*   **Socket.io:** Facilitates WebSocket communication for real-time data exchange.
*   **spotDL:** The core engine for downloading music from Spotify.
*   **Archiver:** Used for creating ZIP archives of multiple downloaded files.
*   **Cron Jobs:** Implemented for automated cleanup of temporary files.

## 🚀 Getting Started

Follow these steps to set up and run MusicDL on your local machine.

### Prerequisites

Ensure you have the following installed:

1.  **Node.js:** Version 16 or higher.
2.  **Python:** Version 3.7 or higher.
3.  **spotDL:** Install globally using pip:
    ```bash
    pip install spotdl
    ```

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd MusicDL
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
3.  **Install backend dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```

### Running the Application

#### Development Mode (Recommended)

To start both the frontend and backend servers concurrently:

```bash
npm start
```

This command will launch:
*   The frontend development server on `http://localhost:5173`
*   The backend server on `http://localhost:3001`

#### Manual Start

If you prefer to run the servers independently:

*   **Frontend:**
    ```bash
    npm run dev
    ```
*   **Backend:**
    ```bash
    npm run dev:server
    ```

## 💡 Usage

1.  **Access the Application:** Open your web browser and navigate to `http://localhost:5173` (or your configured frontend URL).
2.  **Paste Spotify URL:** In the input field, paste a valid Spotify URL for a track, album, or playlist.
3.  **Preview Metadata:** The application will validate the URL and display a preview of the music metadata.
4.  **Initiate Download:** Click the "Download" button to begin the process.
5.  **Monitor Progress:** Observe the real-time progress updates on the screen.
6.  **Automatic Download:** Once the download is complete, the file(s) will automatically begin downloading to your device.

### Supported Spotify URLs

*   **Tracks:** `https://open.spotify.com/track/[id]`
*   **Albums:** `https://open.spotify.com/album/[id]`
*   **Playlists:** `https://open.spotify.com/playlist/[id]`

## ⚙️ Configuration

### Backend Environment Variables

The backend server can be configured using the following environment variables:

*   `PORT`: Specifies the server's listening port (default: `3001`).
*   `CLEANUP_INTERVAL`: Sets the interval (in minutes) for temporary file cleanup (default: `5`).

### Frontend API Base URL

The base URL for the frontend API calls can be modified in [`src/utils/api.js`](src/utils/api.js).

## 📂 Project Structure

```
├── src/                    # Frontend source code (React application)
│   ├── components/         # Reusable React components
│   ├── utils/              # Frontend utility functions (e.g., API calls)
│   └── common/             # Shared components or assets
├── server/                 # Backend source code (Node.js/Express application)
│   ├── routes/             # Express API routes
│   ├── utils/              # Backend utility functions (e.g., spotDL integration, logging)
│   └── downloads/          # Temporary directory for downloaded music files
└── public/                 # Static assets served by the frontend
```

## ⚠️ Legal Notice

This tool is provided for educational and personal use only. Users are solely responsible for ensuring they have the legal right to download and use the content obtained through this application. The developers of MusicDL are not responsible for any misuse or copyright infringement that may occur.

## 🤝 Contributing

We welcome contributions to MusicDL! To contribute:

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/YourFeature`).
3.  Implement your changes and ensure they are thoroughly tested.
4.  Commit your changes (`git commit -m 'feat: Add Your Feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for more details.

## ❓ Troubleshooting

### `spotDL` Not Found Error

If you encounter errors indicating `spotDL` is not found:

1.  Verify that Python is correctly installed on your system.
2.  Ensure `spotDL` is installed globally: `pip install spotdl`.
3.  Confirm `spotDL` installation by running: `spotdl --version`.

### Download Failures

If downloads are failing:

*   Check your internet connection.
*   Ensure the Spotify URL is valid and publicly accessible.
*   Verify that `spotDL` is properly installed and configured.
*   Review the server logs for more detailed error messages.

### Performance Issues with Large Playlists

For very large playlists:

*   Downloads are processed sequentially to prevent system overload.
*   Temporary file cleanup runs automatically at regular intervals.
*   Consider allocating more server resources if you anticipate heavy usage.