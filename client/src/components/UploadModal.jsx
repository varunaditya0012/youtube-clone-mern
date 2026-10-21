import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Film, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const samplePresets = [
  {
    title: 'Modern Web Architecture in 2026: Fast, Reactive & Scalable',
    category: 'Tech',
    duration: '6:30',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    tags: 'webdev, tech, architecture, javascript',
    description: 'An architectural exploration of microfrontends, serverless APIs, edge caching, and responsive frontend systems.'
  },
  {
    title: 'Top 5 Coding Setups & Productivity Desk Tours',
    category: 'Tech',
    duration: '8:15',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
    tags: 'workspace, desk, setup, productivity, coding',
    description: 'Check out the most ergonomic and inspiring developer desk setups featuring mechanical keyboards and 4K displays.'
  },
  {
    title: 'Lofi Coffee Shop Vibes - Relaxing Beats to Chill & Relax',
    category: 'Music',
    duration: '14:20',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    tags: 'lofi, beats, chill, coffee, relax',
    description: 'Cozy background acoustic and lo-fi tracks recorded for late night focus sessions.'
  }
];

const UploadModal = () => {
  const { isUploadModalOpen, closeUploadModal, user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('file'); // 'file' | 'url'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tech');
  const [tags, setTags] = useState('');
  const [duration, setDuration] = useState('4:15');

  // File states
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  // Direct URL states
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isUploadModalOpen) return null;

  const handleApplyPreset = (preset) => {
    setMode('url');
    setTitle(preset.title);
    setDescription(preset.description);
    setCategory(preset.category);
    setTags(preset.tags);
    setDuration(preset.duration);
    setVideoUrl(preset.videoUrl);
    setThumbnailUrl(preset.thumbnailUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Video title is required');
      return;
    }

    try {
      setLoading(true);

      let res;
      if (mode === 'file') {
        if (!videoFile) {
          setError('Please select a video file (.mp4, .webm, .mov)');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('category', category);
        formData.append('tags', tags);
        formData.append('duration', duration || '3:30');
        formData.append('video', videoFile);
        if (thumbnailFile) {
          formData.append('thumbnail', thumbnailFile);
        } else {
          formData.append('thumbnailUrl', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
        }

        res = await videoAPI.create(formData);
      } else {
        if (!videoUrl.trim()) {
          setError('Please provide a video stream URL');
          setLoading(false);
          return;
        }

        res = await videoAPI.createWithUrls({
          title: title.trim(),
          description: description.trim(),
          category,
          tags,
          duration: duration || '4:15',
          videoUrl: videoUrl.trim(),
          thumbnailUrl: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
        });
      }

      if (res.data.success) {
        closeUploadModal();
        navigate(`/watch/${res.data.video._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload video. Please check file format and sizes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-yt-surface border border-yt-border rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-yt-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yt-red/10 flex items-center justify-center text-yt-red">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload Video</h2>
              <p className="text-xs text-yt-subtext">Publish to @{user?.username || 'your channel'}</p>
            </div>
          </div>
          <button
            onClick={closeUploadModal}
            className="p-1.5 rounded-full hover:bg-yt-surfaceHover text-yt-subtext hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Presets (for 1-click test upload) */}
        <div className="my-4 p-3 bg-yt-bg/80 border border-yt-border rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-yt-blue" />
            <span className="text-xs font-semibold text-white">Quick Test Presets (Instant Upload Demo)</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 text-xs bg-yt-surface hover:bg-yt-surfaceHover border border-yt-border rounded-lg text-yt-text text-left transition-colors truncate max-w-xs"
              >
                + {preset.title.slice(0, 32)}...
              </button>
            ))}
          </div>
        </div>

        {/* Upload Mode Selector */}
        <div className="flex border-b border-yt-border mb-4">
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-all ${
              mode === 'file'
                ? 'border-yt-red text-white'
                : 'border-transparent text-yt-subtext hover:text-white'
            }`}
          >
            Upload Local File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-all ${
              mode === 'url'
                ? 'border-yt-red text-white'
                : 'border-transparent text-yt-subtext hover:text-white'
            }`}
          >
            Direct Video URL
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* File Pickers or URLs */}
          {mode === 'file' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Video File Picker */}
              <div className="border-2 border-dashed border-yt-border hover:border-yt-blue rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center bg-yt-bg/50 cursor-pointer relative">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Film className="w-8 h-8 text-yt-blue" />
                <span className="text-xs font-semibold text-white truncate max-w-full px-2">
                  {videoFile ? videoFile.name : 'Select Video File (.mp4, .webm)'}
                </span>
                <span className="text-[10px] text-yt-subtext">Click or drag & drop</span>
              </div>

              {/* Thumbnail Picker */}
              <div className="border-2 border-dashed border-yt-border hover:border-yt-blue rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center bg-yt-bg/50 cursor-pointer relative">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <ImageIcon className="w-8 h-8 text-green-400" />
                <span className="text-xs font-semibold text-white truncate max-w-full px-2">
                  {thumbnailFile ? thumbnailFile.name : 'Select Thumbnail (.jpg, .png)'}
                </span>
                <span className="text-[10px] text-yt-subtext">Optional custom thumbnail</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-yt-subtext mb-1">
                  Video Stream URL (MP4 / WebM direct stream) *
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue"
                  required={mode === 'url'}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-yt-subtext mb-1">
                  Thumbnail Image URL *
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue"
                />
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-yt-subtext">Title (required)</label>
              <span className="text-[10px] text-yt-subtext">{title.length}/100</span>
            </div>
            <input
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title that describes your video"
              className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-yt-subtext mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video"
              className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue resize-none"
            />
          </div>

          {/* Category & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-yt-subtext mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue"
              >
                {['General', 'Tech', 'Gaming', 'Music', 'Education', 'Entertainment', 'News', 'Sports', 'Podcasts'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-yt-subtext mb-1">Duration (e.g. 4:20)</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="4:15"
                className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-yt-subtext mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, tutorial, fullstack, code"
              className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-yt-border">
            <button
              type="button"
              onClick={closeUploadModal}
              className="px-5 py-2 text-sm font-medium text-yt-text hover:bg-yt-surfaceHover rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-semibold bg-yt-blue text-black hover:bg-yt-blue/90 disabled:opacity-50 rounded-full transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Publish Video</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
