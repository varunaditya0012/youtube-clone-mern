import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Mic,
  Video as VideoIcon,
  Bell,
  User as UserIcon,
  LogOut,
  SlidersHorizontal,
  X,
  PlaySquare,
  ThumbsUp,
  History,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, openAuthModal, openUploadModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("📱 Install YouTube App:\n\n• On Chrome/Edge (Desktop): Look for the 'Install' icon at the right end of the address bar, or click '...' > 'Install YouTube'\n• On Android: Tap Menu (⋮) > 'Install app' or 'Add to Home screen'\n• On iPhone/iPad (Safari): Tap Share (⬆) > 'Add to Home Screen'");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-yt-bg border-b border-yt-border select-none">
      {/* Left: Menu & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
          className="p-2 rounded-full hover:bg-yt-surfaceHover active:bg-yt-surface text-yt-text transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-1 group">
          <div className="relative flex items-center justify-center w-7 h-5 bg-yt-red rounded-lg group-hover:bg-yt-redHover transition-colors shadow-sm">
            <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white ml-0.5" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white font-['Roboto',sans-serif] ml-1">
            YouTube
          </span>
          <span className="text-[10px] text-yt-subtext self-start mt-0.5 font-medium">IN</span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center justify-center flex-1 max-w-2xl px-4">
        <form onSubmit={handleSearch} className="flex items-center w-full">
          <div className="relative flex items-center w-full border border-yt-border rounded-l-full bg-[#121212] focus-within:border-yt-blue focus-within:ring-1 focus-within:ring-yt-blue transition-all">
            <div className="pl-4 pr-1 text-yt-subtext">
              <Search className="w-4 h-4 opacity-70" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full py-2 px-2 bg-transparent text-yt-text text-sm focus:outline-none placeholder:text-yt-subtext"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1.5 mr-2 rounded-full hover:bg-yt-surface text-yt-subtext hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="flex items-center justify-center h-10 px-6 bg-yt-surface border border-l-0 border-yt-border rounded-r-full hover:bg-yt-surfaceHover text-yt-subtext hover:text-white transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        <button
          className="p-2.5 ml-3 rounded-full bg-yt-surface hover:bg-yt-surfaceHover text-yt-text transition-colors"
          title="Search with your voice"
          onClick={() => alert('Voice search ready! Speak to search or type query in search box.')}
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Install PWA App Button */}
        <button
          onClick={handleInstallApp}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yt-surface hover:bg-yt-surfaceHover text-yt-text text-sm font-medium border border-yt-border hover:border-yt-blue transition-colors group"
          title="Install YouTube as Desktop / Mobile App"
        >
          <Download className="w-4 h-4 text-yt-blue group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Install App</span>
        </button>

        {/* Upload Button */}
        <button
          onClick={openUploadModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yt-surface hover:bg-yt-surfaceHover text-yt-text text-sm font-medium transition-colors"
          title="Create or Upload Video"
        >
          <VideoIcon className="w-4 h-4 text-yt-red" />
          <span className="hidden sm:inline">Create</span>
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-full hover:bg-yt-surfaceHover text-yt-text transition-colors relative"
          title="Notifications"
          onClick={() => alert('No new notifications')}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yt-red rounded-full" />
        </button>

        {/* User Account */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center focus:outline-none ring-2 ring-transparent focus:ring-yt-blue rounded-full"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-yt-border"
              />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div
                className="absolute right-0 mt-2 w-64 bg-yt-surface border border-yt-border rounded-xl shadow-2xl py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowUserDropdown(false)}
              >
                <div className="flex items-center gap-3 px-4 py-3 border-b border-yt-border">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="overflow-hidden">
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-yt-subtext truncate">@{user.username}</p>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to={`/channel/${user.username}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-yt-surfaceHover text-yt-text"
                  >
                    <PlaySquare className="w-4 h-4 text-yt-subtext" />
                    <span>Your Channel</span>
                  </Link>

                  <Link
                    to="/history"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-yt-surfaceHover text-yt-text"
                  >
                    <History className="w-4 h-4 text-yt-subtext" />
                    <span>History</span>
                  </Link>

                  <Link
                    to="/liked"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-yt-surfaceHover text-yt-text"
                  >
                    <ThumbsUp className="w-4 h-4 text-yt-subtext" />
                    <span>Liked Videos</span>
                  </Link>
                </div>

                <div className="border-t border-yt-border pt-1">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-yt-surfaceHover text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="flex items-center gap-2 px-3 py-1.5 text-yt-blue border border-yt-border rounded-full hover:bg-yt-blue/10 hover:border-transparent text-sm font-medium transition-all"
          >
            <UserIcon className="w-4 h-4" />
            <span>Sign in</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
