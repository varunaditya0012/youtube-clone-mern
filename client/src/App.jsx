import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import UploadModal from './components/UploadModal';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import SearchPage from './pages/SearchPage';
import ChannelPage from './pages/ChannelPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import HistoryPage from './pages/HistoryPage';
import LikedVideosPage from './pages/LikedVideosPage';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const isWatchPage = location.pathname.startsWith('/watch/');

  // Handle responsive window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(!isWatchPage);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isWatchPage]);

  // When navigating to WatchPage on desktop, auto-collapse sidebar to maximize player viewing area
  useEffect(() => {
    if (isWatchPage && !isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isWatchPage, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-yt-bg text-yt-text flex flex-col font-['Roboto',sans-serif]">
      {/* Top Navigation Bar */}
      <Navbar onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 relative">
        {/* Sidebar (Full / Mini / Mobile Overlay) */}
        <Sidebar
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watch/:id" element={<WatchPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/channel/:username" element={<ChannelPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/liked" element={<LikedVideosPage />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals */}
      <UploadModal />
      <AuthModal />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
