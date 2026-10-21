import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Bell, Video, Calendar, Upload } from 'lucide-react';
import VideoCard, { formatViews } from '../components/VideoCard';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChannelPage = () => {
  const { username } = useParams();
  const { user, openAuthModal, openUploadModal } = useAuth();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' | 'about'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannel();
  }, [username, user]);

  const fetchChannel = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getChannel(username);
      if (res.data.success) {
        setChannel(res.data.channel);
        setVideos(res.data.videos);
        setIsSubscribed(res.data.isSubscribed);
        setSubscribersCount(res.data.channel.subscribersCount || 0);
      }
    } catch (err) {
      console.error('Failed to load channel', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!channel) return;

    try {
      const res = await userAPI.toggleSubscribe(channel._id);
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

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-xl font-bold text-white mb-2">Channel not found</h2>
        <p className="text-sm text-yt-subtext">The requested channel does not exist.</p>
      </div>
    );
  }

  const isOwner = user && (String(user._id) === String(channel._id));

  return (
    <div className="flex flex-col w-full pb-16 select-none">
      {/* Banner */}
      <div className="w-full h-36 sm:h-52 md:h-64 bg-yt-surface relative overflow-hidden">
        <img
          src={channel.banner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
          alt="Channel Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        {/* Channel Details Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-b border-yt-border">
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={channel.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={channel.name}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover ring-2 ring-yt-border shadow-xl -mt-10 sm:-mt-14 bg-yt-bg"
            />

            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>{channel.name}</span>
                <CheckCircle2 className="w-4 h-4 text-yt-subtext" />
              </h1>
              <p className="text-xs text-yt-subtext mt-0.5">
                @{channel.username} • {formatViews(subscribersCount)} subscribers • {videos.length} videos
              </p>
              <p className="text-xs text-yt-subtext line-clamp-1 mt-1 max-w-lg">
                {channel.description || 'Welcome to my channel!'}
              </p>
            </div>
          </div>

          {/* Action button */}
          <div>
            {isOwner ? (
              <button
                onClick={openUploadModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-yt-blue text-black font-semibold rounded-full text-sm hover:bg-yt-blue/90 transition-all shadow-md"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Video</span>
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md ${
                  isSubscribed
                    ? 'bg-yt-surface hover:bg-yt-surfaceHover text-white border border-yt-border flex items-center gap-2'
                    : 'bg-white hover:bg-white/90 text-black'
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
        </div>

        {/* Tabs */}
        <div className="flex border-b border-yt-border mt-2">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'videos'
                ? 'border-white text-white'
                : 'border-transparent text-yt-subtext hover:text-white'
            }`}
          >
            Videos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'about'
                ? 'border-white text-white'
                : 'border-transparent text-yt-subtext hover:text-white'
            }`}
          >
            About
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'videos' ? (
            videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                {videos.map((v) => (
                  <VideoCard key={v._id} video={v} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Video className="w-12 h-12 text-yt-subtext mb-2 opacity-50" />
                <p className="text-sm text-yt-subtext">No videos uploaded by this channel yet.</p>
              </div>
            )
          ) : (
            <div className="max-w-2xl flex flex-col gap-4 text-sm text-yt-text bg-yt-surface/40 p-6 rounded-2xl border border-yt-border">
              <h3 className="text-base font-bold text-white">Description</h3>
              <p className="whitespace-pre-line leading-relaxed text-yt-subtext">
                {channel.description || 'No description provided.'}
              </p>

              <div className="border-t border-yt-border pt-4 flex flex-col gap-2 text-xs text-yt-subtext">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-yt-subtext" />
                  <span>Joined {new Date(channel.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <p>{formatViews(subscribersCount)} subscribers</p>
                <p>{videos.length} videos uploaded</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
