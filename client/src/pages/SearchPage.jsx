import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { videoAPI } from '../services/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    fetchResults();
  }, [query, sortBy]);

  const fetchResults = async () => {
    if (!query.trim()) {
      setVideos([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await videoAPI.search({ q: query, sort: sortBy });
      if (res.data.success) {
        setVideos(res.data.videos);
      }
    } catch (err) {
      console.error('Failed to search videos', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 select-none">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-yt-border mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-yt-red" />
            <span>Search results for "{query}"</span>
          </h1>
          <p className="text-xs text-yt-subtext mt-0.5">
            {videos.length} video{videos.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-2 text-xs">
          <SlidersHorizontal className="w-4 h-4 text-yt-subtext" />
          <span className="text-yt-subtext">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-yt-surface border border-yt-border rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none"
          >
            <option value="relevance">Relevance</option>
            <option value="views">Most Viewed</option>
            <option value="date">Upload Date</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4 animate-pulse">
              <div className="w-full sm:w-80 aspect-video bg-yt-surface rounded-2xl shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-yt-surface rounded w-3/4" />
                <div className="h-3 bg-yt-surface rounded w-1/4" />
                <div className="h-3 bg-yt-surface rounded w-1/2 mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="flex flex-col gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} layout="search" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="w-12 h-12 text-yt-subtext mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-white mb-1">No videos found</h3>
          <p className="text-xs text-yt-subtext">Try different keywords or check spelling.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
