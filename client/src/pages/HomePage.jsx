import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, TrendingUp } from 'lucide-react';
import CategoryPills from '../components/CategoryPills';
import VideoCard from '../components/VideoCard';
import { videoAPI, recommendationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const [videos, setVideos] = useState([]);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [activeCategory, user]);

  const fetchVideos = async () => {
    try {
      setLoading(true);

      // Fetch primary feed
      const params = {};
      if (activeCategory !== 'All') {
        params.category = activeCategory;
      }
      const res = await videoAPI.getAll(params);
      if (res.data.success) {
        setVideos(res.data.videos);
      }

      // Fetch personalized recommendations if on 'All' category
      if (activeCategory === 'All') {
        const recRes = await recommendationAPI.getRecommendations({ limit: 8 });
        if (recRes.data.success) {
          setRecommendedVideos(recRes.data.videos);
        }
      } else {
        setRecommendedVideos([]);
      }
    } catch (err) {
      console.error('Failed to load videos', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 pb-12">
      {/* Category Filter Pills */}
      <CategoryPills
        selectedCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-video bg-yt-surface rounded-2xl" />
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-yt-surface shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 bg-yt-surface rounded w-5/6" />
                  <div className="h-3 bg-yt-surface rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Personalized Section if available and user is on 'All' */}
          {activeCategory === 'All' && user && recommendedVideos.length > 0 && (
            <div className="mb-8 mt-2">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yt-red" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Recommended For You ({user.name})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {recommendedVideos.slice(0, 4).map((video) => (
                  <VideoCard
                    key={`rec-${video._id}`}
                    video={video}
                    showRecommendation={true}
                  />
                ))}
              </div>
              <div className="border-b border-yt-border mt-8" />
            </div>
          )}

          {/* Main Video Feed */}
          <div className="mt-2">
            {activeCategory === 'All' && (
              <h2 className="text-base font-semibold text-yt-subtext mb-4">
                {user ? 'Latest & Trending Videos' : 'Explore Videos'}
              </h2>
            )}

            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-base text-yt-subtext mb-2">No videos found in this category.</p>
                <button
                  onClick={() => handleSelectCategory('All')}
                  className="px-4 py-2 text-sm bg-yt-surface hover:bg-yt-surfaceHover text-white rounded-full"
                >
                  View All Videos
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
