import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LikedVideosPage = () => {
  const { user, openAuthModal } = useAuth();
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLikedVideos();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchLikedVideos = async () => {
    try {
      setLoading(true);
      const res = await videoAPI.getLiked();
      if (res.data.success) {
        setLikedVideos(res.data.videos);
      }
    } catch (err) {
      console.error('Failed to load liked videos', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ThumbsUp className="w-16 h-16 text-yt-subtext mb-4 opacity-40" />
        <h2 className="text-xl font-bold text-white mb-2">Save videos you enjoy</h2>
        <p className="text-sm text-yt-subtext max-w-sm mb-6">
          Sign in to access videos you've liked.
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
      <div className="flex items-center gap-3 pb-4 border-b border-yt-border mb-6">
        <ThumbsUp className="w-6 h-6 text-yt-red" />
        <div>
          <h1 className="text-xl font-bold text-white">Liked Videos</h1>
          <p className="text-xs text-yt-subtext">{likedVideos.length} videos</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-yt-surface rounded-xl animate-pulse" />
          ))}
        </div>
      ) : likedVideos.length > 0 ? (
        <div className="flex flex-col gap-4">
          {likedVideos.map((video) => (
            <VideoCard key={video._id} video={video} layout="search" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-base text-white font-medium mb-1">No liked videos yet</p>
          <p className="text-xs text-yt-subtext">Click the thumbs up icon on any video to add it to this list.</p>
        </div>
      )}
    </div>
  );
};

export default LikedVideosPage;
