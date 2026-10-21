import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, Trash2, ArrowUpDown } from 'lucide-react';
import { commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatTimeAgo } from './VideoCard';

const CommentSection = ({ videoId }) => {
  const { user, openAuthModal } = useAuth();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'top'

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await commentAPI.getByVideo(videoId);
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!newCommentText.trim()) return;

    try {
      setSubmitting(true);
      const res = await commentAPI.add(videoId, newCommentText.trim());
      if (res.data.success) {
        setComments([res.data.comment, ...comments]);
        setNewCommentText('');
        setIsFocused(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    try {
      const res = await commentAPI.toggleLike(commentId);
      if (res.data.success) {
        setComments(prev =>
          prev.map(c => {
            if (c._id === commentId) {
              const currentLikes = Array.isArray(c.likes) ? [...c.likes] : [];
              const uIdStr = String(user._id);
              let updatedLikes;
              if (res.data.isLiked) {
                updatedLikes = [...currentLikes, user._id];
              } else {
                updatedLikes = currentLikes.filter(id => String(id) !== uIdStr);
              }
              return { ...c, likes: updatedLikes };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error('Failed to like comment', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await commentAPI.delete(commentId);
      if (res.data.success) {
        setComments(prev => prev.filter(c => c._id !== commentId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'top') {
      const likesA = Array.isArray(a.likes) ? a.likes.length : 0;
      const likesB = Array.isArray(b.likes) ? b.likes.length : 0;
      return likesB - likesA;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="flex flex-col gap-6 mt-6 select-none">
      {/* Header */}
      <div className="flex items-center gap-8">
        <h2 className="text-xl font-bold text-white">
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy(sortBy === 'newest' ? 'top' : 'newest')}
            className="flex items-center gap-2 text-sm font-medium text-yt-text hover:text-white"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Sort by {sortBy === 'newest' ? 'Top comments' : 'Newest first'}</span>
          </button>
        </div>
      </div>

      {/* Add Comment Input */}
      <div className="flex gap-4 items-start">
        <img
          src={user ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
        />

        <form onSubmit={handleSubmitComment} className="flex-1 flex flex-col gap-2">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onFocus={() => {
              if (!user) {
                openAuthModal('login');
              } else {
                setIsFocused(true);
              }
            }}
            placeholder={user ? 'Add a comment...' : 'Sign in to add a comment...'}
            rows={isFocused ? 2 : 1}
            className="w-full bg-transparent border-b border-yt-border focus:border-white focus:outline-none text-sm text-yt-text placeholder:text-yt-subtext py-1 resize-none transition-colors"
          />

          {isFocused && (
            <div className="flex justify-end gap-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  setIsFocused(false);
                  setNewCommentText('');
                }}
                className="px-4 py-2 text-sm font-medium text-yt-text hover:bg-yt-surfaceHover rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newCommentText.trim() || submitting}
                className="px-4 py-2 text-sm font-medium bg-yt-blue text-black hover:bg-yt-blue/90 disabled:bg-yt-surface disabled:text-yt-subtext rounded-full transition-colors"
              >
                {submitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-5 mt-2">
        {loading ? (
          <p className="text-sm text-yt-subtext">Loading comments...</p>
        ) : sortedComments.length > 0 ? (
          sortedComments.map((comment) => {
            const author = comment.user || {};
            const likesCount = Array.isArray(comment.likes) ? comment.likes.length : 0;
            const hasLiked = user && Array.isArray(comment.likes) && comment.likes.some(id => String(id) === String(user._id));
            const isAuthor = user && (String(user._id) === String(author._id || author));

            return (
              <div key={comment._id} className="flex gap-4 group">
                <Link to={`/channel/${author.username || author._id}`} className="shrink-0">
                  <img
                    src={author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/channel/${author.username || author._id}`}
                      className="text-xs font-semibold text-white hover:underline"
                    >
                      @{author.username || author.name}
                    </Link>
                    <span className="text-xs text-yt-subtext">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-yt-text mt-1 whitespace-pre-line leading-relaxed">
                    {comment.text}
                  </p>

                  {/* Comment actions */}
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleToggleLike(comment._id)}
                      className={`flex items-center gap-1.5 text-xs ${
                        hasLiked ? 'text-yt-blue font-bold' : 'text-yt-subtext hover:text-white'
                      } transition-colors`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-yt-blue' : ''}`} />
                      {likesCount > 0 && <span>{likesCount}</span>}
                    </button>

                    {isAuthor && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-opacity"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-yt-subtext">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
