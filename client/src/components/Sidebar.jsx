import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Flame,
  Tv,
  History,
  ThumbsUp,
  Clock,
  Compass,
  Music2,
  Gamepad2,
  Cpu,
  GraduationCap,
  Newspaper,
  Radio,
  UserCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Sidebar = ({ isOpen, isMobile, onCloseMobile }) => {
  const { user, openAuthModal } = useAuth();
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchSubs = async () => {
      if (user) {
        try {
          const res = await userAPI.getSubscriptions();
          if (res.data.success) {
            setSubscribedChannels(res.data.channels);
          }
        } catch (e) {
          console.error('Failed to load subscriptions', e);
        }
      } else {
        setSubscribedChannels([]);
      }
    };
    fetchSubs();
  }, [user]);

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-5 px-3 py-2.5 rounded-xl text-sm font-normal transition-colors ${
      isActive
        ? 'bg-yt-surface font-medium text-white'
        : 'text-yt-text hover:bg-yt-surfaceHover'
    }`;

  // Mini sidebar for desktop when sidebar is collapsed
  if (!isOpen && !isMobile) {
    return (
      <aside className="w-18 flex flex-col items-center py-3 bg-yt-bg border-r border-yt-border h-[calc(100vh-3.5rem)] sticky top-14 select-none shrink-0 z-30">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-16 py-3 rounded-lg text-[10px] gap-1 transition-colors ${
              isActive ? 'text-white' : 'text-yt-subtext hover:bg-yt-surfaceHover'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/subscriptions"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-16 py-3 rounded-lg text-[10px] gap-1 transition-colors ${
              isActive ? 'text-white' : 'text-yt-subtext hover:bg-yt-surfaceHover'
            }`
          }
        >
          <Tv className="w-5 h-5" />
          <span>Subscriptions</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-16 py-3 rounded-lg text-[10px] gap-1 transition-colors ${
              isActive ? 'text-white' : 'text-yt-subtext hover:bg-yt-surfaceHover'
            }`
          }
        >
          <History className="w-5 h-5" />
          <span>History</span>
        </NavLink>

        <NavLink
          to="/liked"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-16 py-3 rounded-lg text-[10px] gap-1 transition-colors ${
              isActive ? 'text-white' : 'text-yt-subtext hover:bg-yt-surfaceHover'
            }`
          }
        >
          <ThumbsUp className="w-5 h-5" />
          <span>Liked</span>
        </NavLink>
      </aside>
    );
  }

  const content = (
    <div className="w-60 h-[calc(100vh-3.5rem)] bg-yt-bg overflow-y-auto px-3 py-3 select-none flex flex-col gap-4 text-yt-text text-sm">
      {/* Primary Links */}
      <div className="flex flex-col gap-0.5 border-b border-yt-border pb-3">
        <NavLink to="/" end className={navItemClass} onClick={onCloseMobile}>
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/subscriptions" className={navItemClass} onClick={onCloseMobile}>
          <Tv className="w-5 h-5" />
          <span>Subscriptions</span>
        </NavLink>
      </div>

      {/* You Section */}
      <div className="flex flex-col gap-0.5 border-b border-yt-border pb-3">
        <div className="px-3 py-1 flex items-center justify-between text-base font-semibold text-white">
          <span>You</span>
          <ChevronRight className="w-4 h-4 text-yt-subtext" />
        </div>

        {user && (
          <NavLink to={`/channel/${user.username}`} className={navItemClass} onClick={onCloseMobile}>
            <UserCheck className="w-5 h-5" />
            <span>Your Channel</span>
          </NavLink>
        )}

        <NavLink to="/history" className={navItemClass} onClick={onCloseMobile}>
          <History className="w-5 h-5" />
          <span>History</span>
        </NavLink>

        <NavLink to="/liked" className={navItemClass} onClick={onCloseMobile}>
          <ThumbsUp className="w-5 h-5" />
          <span>Liked Videos</span>
        </NavLink>
      </div>

      {/* Subscriptions Channels list */}
      <div className="flex flex-col gap-1 border-b border-yt-border pb-3">
        <span className="px-3 text-sm font-semibold text-white mb-1">Subscriptions</span>
        {user ? (
          subscribedChannels.length > 0 ? (
            subscribedChannels.map((ch) => (
              <NavLink
                key={ch._id}
                to={`/channel/${ch.username || ch._id}`}
                className={navItemClass}
                onClick={onCloseMobile}
              >
                <img
                  src={ch.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={ch.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
                <span className="truncate">{ch.name}</span>
              </NavLink>
            ))
          ) : (
            <p className="px-3 text-xs text-yt-subtext">No subscriptions yet. Follow channels to see them here!</p>
          )
        ) : (
          <div className="px-3 py-2 bg-yt-surface/40 rounded-xl">
            <p className="text-xs text-yt-subtext mb-2">Sign in to subscribe to channels, like videos, and leave comments.</p>
            <button
              onClick={() => openAuthModal('login')}
              className="px-3 py-1 text-xs text-yt-blue border border-yt-border rounded-full hover:bg-yt-blue/10"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Explore Categories */}
      <div className="flex flex-col gap-0.5 border-b border-yt-border pb-3">
        <span className="px-3 text-sm font-semibold text-white mb-1">Explore</span>
        <NavLink to="/?category=Tech" className={navItemClass} onClick={onCloseMobile}>
          <Cpu className="w-5 h-5" />
          <span>Tech & AI</span>
        </NavLink>
        <NavLink to="/?category=Gaming" className={navItemClass} onClick={onCloseMobile}>
          <Gamepad2 className="w-5 h-5" />
          <span>Gaming</span>
        </NavLink>
        <NavLink to="/?category=Music" className={navItemClass} onClick={onCloseMobile}>
          <Music2 className="w-5 h-5" />
          <span>Music</span>
        </NavLink>
        <NavLink to="/?category=Education" className={navItemClass} onClick={onCloseMobile}>
          <GraduationCap className="w-5 h-5" />
          <span>Education</span>
        </NavLink>
      </div>

      {/* Footer info */}
      <div className="px-3 text-[11px] text-yt-subtext flex flex-col gap-1 pb-6">
        <p>© 2026 YouTube Clone MERN Stack</p>
        <p className="text-[10px] opacity-75">Built with React, Express, Node & MongoDB</p>
      </div>
    </div>
  );

  if (isMobile) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCloseMobile} />
        <div className="relative z-10">{content}</div>
      </div>
    );
  }

  return (
    <aside className="sticky top-14 h-[calc(100vh-3.5rem)] border-r border-yt-border shrink-0 z-30">
      {content}
    </aside>
  );
};

export default Sidebar;
