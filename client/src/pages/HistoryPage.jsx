import React, { useState, useEffect } from 'react';
import { History, Trash2 } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HistoryPage = () => {
  const { user, openAuthModal } = useAuth();
  const [historyVideos, setHistoryVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await videoAPI.getHistory();
      if (res.data.success) {
        setHistoryVideos(res.data.videos);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear all watch history?')) return;
    try {
      const res = await videoAPI.clearHistory();
      if (res.data.success) {
        setHistoryVideos([]);
      }
    } catch (err) {
      alert('Failed to clear watch history');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <History className="w-16 h-16 text-yt-subtext mb-4 opacity-40" />
        <h2 className="text-xl font-bold text-white mb-2">Keep track of what you watch</h2>
        <p className="text-sm text-yt-subtext max-w-sm mb-6">
          Sign in to view your watch history across all your devices.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-yt-blue text-black font-semibold rounded-full text-sm hover:bg-yt-blue/90"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 py-6 select-none max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-yt-border mb-6">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-yt-red" />
          <h1 className="text-xl font-bold text-white">Watch History</h1>
        </div>

        {historyVideos.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear all watch history</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-yt-surface rounded-xl animate-pulse" />
          ))}
        </div>
      ) : historyVideos.length > 0 ? (
        <div className="flex flex-col gap-4">
          {historyVideos.map((video) => (
            <VideoCard key={video._id} video={video} layout="search" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-base text-white font-medium mb-1">Your watch history is empty</p>
          <p className="text-xs text-yt-subtext">Videos you watch will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
