import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import DownloadForm from './components/DownloadForm';
import ProgressPanel from './components/ProgressPanel';
import Footer from './components/Footer';
import Disclaimer from './components/Disclaimer';

function App() {
  const [darkMode, setDarkMode] = useState(false); // Start with light mode
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-spotify-dark via-spotify-gray to-black text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: darkMode ? 'bg-spotify-light text-white' : 'bg-white text-gray-900'
        }}
      />
      
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-8">
        <Hero />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <DownloadForm 
            darkMode={darkMode}
            setDownloadProgress={setDownloadProgress}
            setIsDownloading={setIsDownloading}
            isDownloading={isDownloading}
          />
          
          {(downloadProgress || isDownloading) && (
            <ProgressPanel 
              progress={downloadProgress}
              darkMode={darkMode}
              isDownloading={isDownloading}
            />
          )}
        </div>
        
        <Disclaimer darkMode={darkMode} />
      </main>
      
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;