import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Twitter, Facebook, Share2, Code } from 'lucide-react';
import { videoAPI } from '../services/api';

const ShareModal = ({ isOpen, onClose, video }) => {
  if (!isOpen || !video) return null;

  const [copied, setCopied] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  const videoUrl = window.location.href;
  const embedCode = `<iframe width="560" height="315" src="${videoUrl}" title="${video.title}" frameborder="0" allowfullscreen></iframe>`;

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      videoAPI.recordShare(video._id).catch(() => {});
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      color: 'bg-[#25D366]',
      icon: MessageSquare,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this video: ${video.title} ${videoUrl}`)}`
    },
    {
      name: 'X (Twitter)',
      color: 'bg-black border border-yt-border',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Watching ${video.title}`)}&url=${encodeURIComponent(videoUrl)}`
    },
    {
      name: 'Facebook',
      color: 'bg-[#1877F2]',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`
    },
    {
      name: 'Reddit',
      color: 'bg-[#FF4500]',
      icon: Share2,
      url: `https://reddit.com/submit?url=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(video.title)}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-lg bg-yt-surface border border-yt-border rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-yt-border">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-yt-red" />
            <span>Share Video</span>
          </h3>
          <button
            onClick={onClose}
            aria-label="Close share dialog"
            className="p-1 rounded-full hover:bg-yt-surfaceHover text-yt-subtext hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Social Platforms */}
        <div className="flex items-center justify-around gap-2 overflow-x-auto py-2">
          {shareOptions.map((opt) => (
            <a
              key={opt.name}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => videoAPI.recordShare(video._id).catch(() => {})}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full ${opt.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 active:scale-95 transition-transform`}>
                <opt.icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-yt-subtext group-hover:text-white">
                {opt.name}
              </span>
            </a>
          ))}

          <button
            onClick={() => setShowEmbed(!showEmbed)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-yt-surfaceHover border border-yt-border flex items-center justify-center text-white shadow-lg group-hover:scale-110 active:scale-95 transition-transform">
              <Code className="w-5 h-5 text-yt-blue" />
            </div>
            <span className="text-[11px] text-yt-subtext group-hover:text-white">
              Embed
            </span>
          </button>
        </div>

        {/* Embed code section */}
        {showEmbed && (
          <div className="flex flex-col gap-2 p-3 bg-black/40 rounded-xl border border-yt-border">
            <span className="text-xs text-yt-subtext font-medium">Embed Code</span>
            <code className="text-xs text-yt-blue font-mono break-all select-all">
              {embedCode}
            </code>
            <button
              onClick={() => copyToClipboard(embedCode)}
              className="self-end mt-1 px-3 py-1 bg-yt-surfaceHover text-xs text-white rounded-lg hover:bg-yt-border"
            >
              Copy Embed Code
            </button>
          </div>
        )}

        {/* Copy Link Input */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-yt-subtext">Video Link</span>
          <div className="flex items-center gap-2 p-1.5 pl-3 bg-black/50 border border-yt-border rounded-xl">
            <input
              type="text"
              readOnly
              value={videoUrl}
              className="w-full bg-transparent text-xs text-yt-text focus:outline-none select-all truncate"
            />
            <button
              onClick={() => copyToClipboard(videoUrl)}
              className="flex items-center gap-1.5 px-4 py-2 bg-yt-blue text-black font-semibold text-xs rounded-lg hover:bg-yt-blue/90 active:scale-95 transition-all shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
