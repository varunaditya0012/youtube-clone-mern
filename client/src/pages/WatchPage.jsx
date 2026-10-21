import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  CheckCircle2,
  Bell,
  Trash2,
  Sparkles
} from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import CommentSection from '../components/CommentSection';
import VideoCard, { formatViews, formatTimeAgo } from '../components/VideoCard';
import ShareModal from '../components/ShareModal';
import { videoAPI, userAPI, recommendationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const WatchPage = () => {
  const { id } = useParams();
  const { user, openAuthModal } = useAuth();

  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVideoData();
  }, [id]);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      const res = await videoAPI.getById(id);
      if (res.data.success) {
        const v = res.data.video;
        setVideo(v);
        setChannel(v.channel || {});
        setLikesCount(v.likes ? v.likes.length : 0);

        if (res.data.userInteraction) {
          setIsLiked(res.data.userInteraction.isLiked);
          setIsDisliked(res.data.userInteraction.isDisliked);
          setIsSubscribed(res.data.userInteraction.isSubscribed);
        }
        setSubscribersCount(v.channel?.subscribersCount || 0);

        // Record view in background
        videoAPI.recordView(id).catch(() => {});

        // Fetch contextually related recommendations
        const recRes = await recommendationAPI.getRecommendations({
          currentVideoId: id,
          limit: 12
        });
        if (recRes.data.success) {
          setRecommendations(recRes.data.videos);
        }
      }
    } catch (err) {
      console.error('Failed to load video', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    try {
      const res = await videoAPI.toggleLike(id);
      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setIsDisliked(res.data.isDisliked);
        setLikesCount(res.data.likesCount);
      }
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    try {
      const res = await videoAPI.toggleDislike(id);
      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setIsDisliked(res.data.isDisliked);
        setLikesCount(res.data.likesCount);
      }
    } catch (err) {
      console.error('Failed to toggle dislike', err);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    const channelId = channel?._id;
    if (!channelId) return;

    try {
      const res = await userAPI.toggleSubscribe(channelId);
      if (res.data.success) {
        setIsSubscribed(res.data.isSubscribed);
        setSubscribersCount(res.data.subscribersCount);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update subscription');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-yt-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-xl font-bold text-white mb-2">Video not found</h2>
        <p className="text-sm text-yt-subtext mb-4">This video may have been removed or is unavailable.</p>
        <Link to="/" className="px-5 py-2 bg-yt-blue text-black font-semibold rounded-full text-sm">
          Go to Home
        </Link>
      </div>
    );
  }

  const isOwner = user && (String(user._id) === String(channel?._id));

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-4 max-w-[1750px] mx-auto select-none">
      {/* Primary Video & Details Section (Left) */}
      <div className="flex-1 min-w-0">
        {/* Video Player */}
        <VideoPlayer
          src={video.videoUrl}
          poster={video.thumbnailUrl}
        />

        {/* Video Title */}
        <h1 className="text-lg sm:text-xl font-bold text-white mt-4 leading-tight">
          {video.title}
        </h1>

        {/* Channel & Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-yt-border">
          {/* Channel info */}
          <div className="flex items-center gap-3">
            <Link to={`/channel/${channel?.username || channel?._id}`} className="shrink-0">
              <img
                src={channel?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={channel?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>

            <div className="flex flex-col">
              <Link
                to={`/channel/${channel?.username || channel?._id}`}
                className="text-sm font-semibold text-white hover:text-yt-blue flex items-center gap-1"
              >
                <span>{channel?.name || 'Creator'}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-yt-subtext" />
              </Link>
              <span className="text-xs text-yt-subtext">
                {formatViews(subscribersCount)} subscribers
              </span>
            </div>

            {/* Subscribe button */}
            {!isOwner && (
              <button
                onClick={handleSubscribe}
                className={`ml-3 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isSubscribed
                    ? 'bg-yt-surface hover:bg-yt-surfaceHover text-white border border-yt-border flex items-center gap-1.5'
                    : 'bg-white hover:bg-white/90 text-black font-semibold'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Bell className="w-4 h-4 fill-white" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            )}
          </div>

          {/* Video Actions (Like, Dislike, Share) */}
          <div className="flex items-center gap-2">
            {/* Like & Dislike pill */}
            <div className="flex items-center bg-yt-surface rounded-full border border-yt-border overflow-hidden">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-yt-surfaceHover transition-colors ${
                  isLiked ? 'text-yt-blue font-bold' : 'text-yt-text'
                }`}
                title="I like this"
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-yt-blue' : ''}`} />
                <span>{formatViews(likesCount)}</span>
              </button>
              <div className="w-[1px] h-6 bg-yt-border" />
              <button
                onClick={handleDislike}
                className={`px-3 py-2 text-sm hover:bg-yt-surfaceHover transition-colors ${
                  isDisliked ? 'text-yt-blue' : 'text-yt-text'
                }`}
                title="I dislike this"
              >
                <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-yt-blue' : ''}`} />
              </button>
            </div>

            {/* Share */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yt-surface hover:bg-yt-surfaceHover border border-yt-border rounded-full text-sm font-medium text-yt-text transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Expandable Description Box */}
        <div
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="mt-4 p-3.5 bg-yt-surface/60 hover:bg-yt-surface/80 rounded-2xl cursor-pointer transition-colors text-sm"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-white mb-2">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
            {video.category && (
              <>
                <span>•</span>
                <span className="text-yt-blue">#{video.category}</span>
              </>
            )}
          </div>

          <p className={`text-yt-text whitespace-pre-line leading-relaxed ${
            isDescriptionExpanded ? '' : 'line-clamp-3'
          }`}>
            {video.description || 'No description provided.'}
          </p>

          {video.tags && video.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              {video.tags.map(t => (
                <span key={t} className="text-xs text-yt-blue hover:underline">
                  #{t}
                </span>
              ))}
            </div>
          )}

          <button className="text-xs font-semibold text-white mt-2 hover:underline">
            {isDescriptionExpanded ? 'Show less' : '...more'}
          </button>
        </div>

        {/* Comments Section */}
        <CommentSection videoId={video._id} />
      </div>

      {/* Up Next & Contextual Recommendations (Right) */}
      <div className="w-full lg:w-96 xl:w-[420px] shrink-0 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-yt-red" />
          <h2 className="text-sm font-bold text-white tracking-wide">
            Up Next / Related Videos
          </h2>
        </div>

        {recommendations.length > 0 ? (
          recommendations.map((recVideo) => (
            <VideoCard
              key={recVideo._id}
              video={recVideo}
              layout="horizontal"
              showRecommendation={true}
            />
          ))
        ) : (
          <p className="text-xs text-yt-subtext">No additional recommendations found.</p>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        video={video}
      />
    </div>
  );
};

export default WatchPage;
