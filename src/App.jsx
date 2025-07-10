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
    <div className={`min-h-screen transition-all duration-700 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900'
    }`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: darkMode 
            ? 'bg-gray-800 text-white border border-gray-700' 
            : 'bg-white text-gray-900 border border-gray-200 shadow-lg'
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