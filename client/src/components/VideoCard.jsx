import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles } from 'lucide-react';

export const formatViews = (views = 0) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return views;
};

export const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

const VideoCard = ({ video, layout = 'grid', showRecommendation = false }) => {
  if (!video) return null;

  const channel = video.channel || {};
  const channelName = channel.name || 'Channel';
  const channelUsername = channel.username || 'creator';
  const channelAvatar = channel.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  // Fix local upload paths to full URL if needed
  let thumbSrc = video.thumbnailUrl;
  if (thumbSrc && thumbSrc.startsWith('/uploads/')) {
    thumbSrc = `http://localhost:5000${thumbSrc}`;
  }

  // Horizontal list layout (for search results or watch page sidebar)
  if (layout === 'horizontal') {
    return (
      <div className="flex gap-3 group cursor-pointer w-full">
        <Link to={`/watch/${video._id}`} className="relative shrink-0 w-40 sm:w-44 aspect-video rounded-xl overflow-hidden bg-yt-surface">
          <img
            src={thumbSrc}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-[11px] font-semibold text-white rounded">
            {video.duration || '3:45'}
          </span>
        </Link>

        <div className="flex flex-col flex-1 min-w-0 pr-1">
          <Link to={`/watch/${video._id}`}>
            <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug group-hover:text-yt-blue transition-colors">
              {video.title}
            </h3>
          </Link>

          <Link
            to={`/channel/${channelUsername}`}
            className="text-xs text-yt-subtext hover:text-white mt-1 flex items-center gap-1 truncate"
          >
            <span>{channelName}</span>
            <CheckCircle2 className="w-3 h-3 text-yt-subtext" />
          </Link>

          <div className="text-xs text-yt-subtext flex items-center gap-1 mt-0.5">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>

          {video.category && (
            <span className="mt-1.5 self-start px-2 py-0.5 rounded bg-yt-surface text-[10px] text-yt-subtext font-medium">
              {video.category}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Search Results Layout (wider with description)
  if (layout === 'search') {
    return (
      <div className="flex flex-col sm:flex-row gap-4 group cursor-pointer w-full py-2">
        <Link to={`/watch/${video._id}`} className="relative shrink-0 w-full sm:w-80 md:w-96 aspect-video rounded-2xl overflow-hidden bg-yt-surface">
          <img
            src={thumbSrc}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-xs font-semibold text-white rounded">
            {video.duration || '4:15'}
          </span>
        </Link>

        <div className="flex flex-col flex-1 min-w-0">
          <Link to={`/watch/${video._id}`}>
            <h3 className="text-base sm:text-lg font-medium text-white line-clamp-2 leading-snug group-hover:text-yt-blue transition-colors">
              {video.title}
            </h3>
          </Link>

          <div className="text-xs text-yt-subtext flex items-center gap-1.5 mt-1">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>

          <Link
            to={`/channel/${channelUsername}`}
            className="flex items-center gap-2 mt-3 hover:opacity-80"
          >
            <img
              src={channelAvatar}
              alt={channelName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-yt-subtext flex items-center gap-1">
              {channelName}
              <CheckCircle2 className="w-3.5 h-3.5 text-yt-subtext" />
            </span>
          </Link>

          <p className="text-xs text-yt-subtext line-clamp-2 mt-2 leading-relaxed">
            {video.description || 'No description provided.'}
          </p>

          {video.tags && video.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-2">
              {video.tags.slice(0, 3).map((t) => (
                <span key={t} className="text-[11px] text-yt-blue">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Standard Grid Layout (Home Feed)
  return (
    <div className="flex flex-col gap-3 group cursor-pointer">
      {/* Thumbnail */}
      <Link to={`/watch/${video._id}`} className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-yt-surface shadow-sm">
        <img
          src={thumbSrc}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 text-[11px] font-semibold text-white rounded">
          {video.duration || '3:45'}
        </span>

        {showRecommendation && video.recommendationScore > 20 && (
          <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-yt-red/90 text-[10px] font-bold text-white rounded-full shadow">
            <Sparkles className="w-3 h-3" />
            Recommended
          </span>
        )}
      </Link>

      {/* Info Section */}
      <div className="flex gap-3 items-start px-0.5">
        <Link to={`/channel/${channelUsername}`} className="shrink-0 mt-0.5">
          <img
            src={channelAvatar}
            alt={channelName}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-yt-border"
          />
        </Link>

        <div className="flex flex-col flex-1 min-w-0">
          <Link to={`/watch/${video._id}`}>
            <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-yt-blue transition-colors">
              {video.title}
            </h3>
          </Link>

          <Link
            to={`/channel/${channelUsername}`}
            className="text-xs text-yt-subtext hover:text-white mt-1 flex items-center gap-1 truncate"
          >
            <span>{channelName}</span>
            <CheckCircle2 className="w-3 h-3 text-yt-subtext" />
          </Link>

          <div className="text-xs text-yt-subtext flex items-center gap-1 mt-0.5">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
