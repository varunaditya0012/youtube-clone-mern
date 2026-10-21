import React, { useState, useEffect } from 'react';
import { Tv, Sparkles } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SubscriptionsPage = () => {
  const { user, openAuthModal } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscribedVideos();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscribedVideos = async () => {
    try {
      setLoading(true);
      const res = await videoAPI.getSubscriptionsFeed();
      if (res.data.success) {
        setVideos(res.data.videos);
      }
    } catch (err) {
      console.error('Failed to load subscriptions feed', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Tv className="w-16 h-16 text-yt-subtext mb-4 opacity-40" />
        <h2 className="text-xl font-bold text-white mb-2">Don't miss new videos</h2>
        <p className="text-sm text-yt-subtext max-w-sm mb-6">
          Sign in to see updates and videos from your favorite YouTube creators.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-yt-blue text-black font-semibold rounded-full text-sm hover:bg-yt-blue/90 transition-all shadow-md"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 py-6 select-none max-w-7xl mx-auto">
      <div className="flex items-center gap-3 pb-4 border-b border-yt-border mb-6">
        <Tv className="w-6 h-6 text-yt-red" />
        <h1 className="text-xl font-bold text-white">Subscriptions</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-video bg-yt-surface rounded-2xl" />
              <div className="h-4 bg-yt-surface rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-base text-white font-medium mb-1">No videos yet</p>
          <p className="text-xs text-yt-subtext max-w-xs mb-4">
            Subscribe to channels from the Home feed to see their latest uploads here.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
