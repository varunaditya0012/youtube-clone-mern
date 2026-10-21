import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const demoAccounts = [
  { name: 'TechNova', email: 'technova@youtube.com', role: 'Tech Creator' },
  { name: 'Code Samurai', email: 'samurai@youtube.com', role: 'Web Developer' },
  { name: 'Chill Vibes', email: 'lofi@youtube.com', role: 'Music Producer' },
  { name: 'Apex Gaming', email: 'gamer@youtube.com', role: 'Gaming Streamer' }
];

const AuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    login,
    register
  } = useAuth();

  const [mode, setMode] = useState(authModalMode || 'login');
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync mode from context when modal opens
  React.useEffect(() => {
    setMode(authModalMode);
    setError('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!credential || !password) {
      setError('Please provide email/username and password');
      return;
    }

    try {
      setLoading(true);
      await login(credential, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !username || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await register({ name, username, email, password });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Username or email may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (emailToUse) => {
    setError('');
    try {
      setLoading(true);
      await login(emailToUse, 'password123');
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-md bg-yt-surface border border-yt-border rounded-2xl p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-yt-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-yt-red rounded flex items-center justify-center">
              <div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[5px] border-l-white ml-0.5" />
            </div>
            <span className="font-bold text-base text-white">YouTube Account</span>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full hover:bg-yt-surfaceHover text-yt-subtext hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Demo Accounts */}
        <div className="my-4 p-3 bg-yt-bg border border-yt-border rounded-xl">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yt-blue" />
            <span className="text-xs font-semibold text-white">Quick Demo Logins (1-Click)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleDemoLogin(acc.email)}
                disabled={loading}
                className="text-left px-2.5 py-1.5 bg-yt-surface hover:bg-yt-surfaceHover border border-yt-border rounded-lg transition-colors group"
              >
                <p className="text-xs font-medium text-white group-hover:text-yt-blue truncate">{acc.name}</p>
                <p className="text-[10px] text-yt-subtext truncate">{acc.role}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-yt-border mb-4">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-all ${
              mode === 'login'
                ? 'border-yt-red text-white'
                : 'border-transparent text-yt-subtext hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-all ${
              mode === 'register'
                ? 'border-yt-red text-white'
                : 'border-transparent text-yt-subtext hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-yt-subtext mb-1">
                Email or Username
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  placeholder="technova@youtube.com"
                  className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-yt-subtext mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 bg-yt-blue text-black font-semibold text-sm rounded-full hover:bg-yt-blue/90 disabled:opacity-50 transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-yt-subtext mb-1">Channel Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Tech Vlogs"
                className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-yt-subtext mb-1">Username / Handle</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. alextech"
                className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-yt-subtext mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-yt-subtext mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 bg-yt-bg border border-yt-border rounded-xl text-sm text-yt-text focus:outline-none focus:border-yt-blue"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 bg-yt-blue text-black font-semibold text-sm rounded-full hover:bg-yt-blue/90 disabled:opacity-50 transition-all"
            >
              {loading ? 'Creating Account...' : 'Register Channel'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
