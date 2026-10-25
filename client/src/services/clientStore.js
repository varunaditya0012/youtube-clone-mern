// Client-side fallback storage engine for standalone/permanent GitHub Pages deployment

const initialUsers = [
  {
    _id: 'u1',
    name: 'TechNova',
    username: 'technova',
    email: 'technova@youtube.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    description: 'Deep dives into cutting-edge AI, modern web frameworks, gadgets and software engineering.',
    subscribersCount: 245000
  },
  {
    _id: 'u2',
    name: 'Code Samurai',
    username: 'codesamurai',
    email: 'samurai@youtube.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    description: 'Master React, Node.js, TypeScript, and full-stack architecture with clean code tutorials.',
    subscribersCount: 180000
  },
  {
    _id: 'u3',
    name: 'Chill Vibes & Lo-Fi',
    username: 'chillvibes',
    email: 'lofi@youtube.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    description: 'Relaxing ambient beats, study beats, and peaceful melodies for coding and chilling.',
    subscribersCount: 420000
  },
  {
    _id: 'u4',
    name: 'Apex Gaming Pro',
    username: 'apexgaming',
    email: 'gamer@youtube.com',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    description: 'Next-gen console reviews, esports tournaments, competitive gaming, and cinematic gameplay.',
    subscribersCount: 310000
  },
  {
    _id: 'u5',
    name: 'Curiosity Cosmos',
    username: 'curiositycosmos',
    email: 'cosmos@youtube.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: 'Unlocking the secrets of the Universe, James Webb Space Telescope discoveries, and quantum physics.',
    subscribersCount: 560000
  }
];

const initialVideos = [
  {
    _id: 'v1',
    title: 'Building a Full-Stack MERN Application from Scratch (Complete 2026 Guide)',
    description: 'In this complete masterclass, we dive deep into building modern reactive applications using MongoDB, Express, React, and Node.js. We cover JWT authentication, file uploads, responsive design, and state management.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    duration: '9:56',
    category: 'Tech',
    tags: ['react', 'nodejs', 'mern', 'javascript', 'coding', 'webdev'],
    channel: initialUsers[1],
    views: 142850,
    likes: ['u1', 'u3'],
    dislikes: [],
    sharesCount: 124,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'v2',
    title: 'Next-Gen Artificial Intelligence: What to Expect in 2026 & Beyond',
    description: 'Explore the newest breakthroughs in multimodal reasoning models, autonomous agents, neuromorphic computing, and how AI agents are transforming everyday developer workflows.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    duration: '10:53',
    category: 'Tech',
    tags: ['ai', 'future', 'tech', 'machinelearning', 'agents'],
    channel: initialUsers[0],
    views: 295400,
    likes: ['u2', 'u3'],
    dislikes: [],
    sharesCount: 310,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'v3',
    title: 'Chill Lo-Fi Hip Hop Beats - 24/7 Coding & Study Sessions',
    description: 'Smooth, nostalgic lo-fi study beats to help you concentrate, code, relax, or sleep. Grab a cup of warm coffee and enjoy these peaceful melodies.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
    duration: '15:12',
    category: 'Music',
    tags: ['lofi', 'chill', 'music', 'study', 'focus', 'beats'],
    channel: initialUsers[2],
    views: 684200,
    likes: ['u1', 'u4'],
    dislikes: [],
    sharesCount: 890,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'v4',
    title: 'Cyberpunk 2077 Ultra Ray Tracing Overdrive Benchmark 4K 120FPS',
    description: 'Pushing graphics hardware to the absolute edge with full path tracing, ultra dynamic lighting, and DLSS 3 frame generation on the highest settings.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    duration: '12:05',
    category: 'Gaming',
    tags: ['gaming', 'cyberpunk', 'raytracing', 'graphics', 'pcgaming'],
    channel: initialUsers[3],
    views: 218900,
    likes: ['u1'],
    dislikes: [],
    sharesCount: 420,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'v5',
    title: 'James Webb Telescope Makes Groundbreaking Deep Space Discovery',
    description: 'New spectroscopic data reveals organic molecules and potential biosignatures in an exoplanet atmosphere 120 light years away in the habitable zone.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    duration: '14:20',
    category: 'Education',
    tags: ['space', 'science', 'jwst', 'astronomy', 'universe'],
    channel: initialUsers[4],
    views: 521400,
    likes: ['u1', 'u2'],
    dislikes: [],
    sharesCount: 750,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'v6',
    title: '10 Clean Code Practices Every Software Engineer Should Follow',
    description: 'Write maintainable, robust, and elegant code with these 10 architectural principles. Avoid spaghetti code and make your codebase a joy to work on.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    duration: '8:45',
    category: 'Tech',
    tags: ['coding', 'cleancode', 'software', 'programming', 'architecture'],
    channel: initialUsers[1],
    views: 89300,
    likes: ['u1', 'u3'],
    dislikes: [],
    sharesCount: 160,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'v7',
    title: 'Synthwave Night Drive - 80s Retro Electronic Mix',
    description: 'Cruise down neon highways under the midnight stars with this nostalgic collection of outrun synthwave and retro electronic tracks.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    duration: '18:30',
    category: 'Music',
    tags: ['synthwave', 'retrowave', 'nightdrive', 'electronic', 'music'],
    channel: initialUsers[2],
    views: 312000,
    likes: ['u4'],
    dislikes: [],
    sharesCount: 390,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'v8',
    title: 'Top 10 Most Anticipated Games Coming This Year',
    description: 'From sprawling open-world RPGs to breathtaking action adventures, here are the absolute biggest game launches you need to add to your wishlist.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    duration: '11:15',
    category: 'Gaming',
    tags: ['gaming', 'top10', 'upcoming', 'games', 'playstation', 'pc'],
    channel: initialUsers[3],
    views: 450120,
    likes: ['u1', 'u2'],
    dislikes: [],
    sharesCount: 520,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'v9',
    title: 'Quantum Computing Explained Simply in 10 Minutes',
    description: 'What are Qubits? How does quantum superposition and entanglement really work? We demystify quantum supremacy with clear visual illustrations.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    duration: '10:02',
    category: 'Education',
    tags: ['quantum', 'physics', 'computing', 'science', 'education'],
    channel: initialUsers[4],
    views: 189400,
    likes: ['u1'],
    dislikes: [],
    sharesCount: 280,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'v10',
    title: 'Modern CSS Masterclass: Grid, Flexbox & Container Queries',
    description: 'Stop struggling with layout styling! Master modern responsive CSS techniques that adapt smoothly to every device screen without messy hacks.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    duration: '7:40',
    category: 'Tech',
    tags: ['css', 'frontend', 'webdev', 'responsive', 'html'],
    channel: initialUsers[1],
    views: 94200,
    likes: ['u3'],
    dislikes: [],
    sharesCount: 110,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const initialComments = {
  v1: [
    {
      _id: 'c1',
      video: 'v1',
      user: initialUsers[0],
      text: 'Phenomenal tutorial! The explanation of JWT token verification and custom middleware was crystal clear. Thank you!',
      likes: ['u2'],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'c2',
      video: 'v1',
      user: initialUsers[2],
      text: 'Bookmarked this immediately. The architecture structure is super scalable.',
      likes: [],
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
  ]
};

class ClientStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('yt_videos')) {
      localStorage.setItem('yt_videos', JSON.stringify(initialVideos));
    }
    if (!localStorage.getItem('yt_users')) {
      localStorage.setItem('yt_users', JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem('yt_comments')) {
      localStorage.setItem('yt_comments', JSON.stringify(initialComments));
    }
    if (!localStorage.getItem('yt_subs')) {
      localStorage.setItem('yt_subs', JSON.stringify({}));
    }
    if (!localStorage.getItem('yt_history')) {
      localStorage.setItem('yt_history', JSON.stringify([]));
    }
    if (!localStorage.getItem('yt_liked')) {
      localStorage.setItem('yt_liked', JSON.stringify([]));
    }
  }

  getVideos() {
    try {
      return JSON.parse(localStorage.getItem('yt_videos')) || initialVideos;
    } catch {
      return initialVideos;
    }
  }

  saveVideos(videos) {
    localStorage.setItem('yt_videos', JSON.stringify(videos));
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('yt_current_user')) || null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('yt_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('yt_current_user');
    }
  }

  login(credential) {
    const users = JSON.parse(localStorage.getItem('yt_users')) || initialUsers;
    const lower = (credential || '').toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === lower || u.username.toLowerCase() === lower) || users[0];
    this.setCurrentUser(user);
    return { success: true, token: 'demo-jwt-token-' + user._id, user };
  }

  register(data) {
    const users = JSON.parse(localStorage.getItem('yt_users')) || initialUsers;
    const newUser = {
      _id: 'u_' + Date.now(),
      name: data.name,
      username: (data.username || 'user').toLowerCase(),
      email: (data.email || 'user@example.com').toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${data.username}`,
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      description: 'Welcome to my channel!',
      subscribersCount: 0
    };
    users.push(newUser);
    localStorage.setItem('yt_users', JSON.stringify(users));
    this.setCurrentUser(newUser);
    return { success: true, token: 'demo-jwt-token-' + newUser._id, user: newUser };
  }

  getVideoById(id) {
    const videos = this.getVideos();
    const video = videos.find(v => String(v._id) === String(id));
    if (!video) return null;

    const user = this.getCurrentUser();
    const isLiked = user && Array.isArray(video.likes) && video.likes.includes(user._id);
    const isDisliked = user && Array.isArray(video.dislikes) && video.dislikes.includes(user._id);
    const subs = JSON.parse(localStorage.getItem('yt_subs')) || {};
    const isSubscribed = user && subs[user._id]?.includes(video.channel?._id);

    return {
      video,
      userInteraction: {
        isLiked,
        isDisliked,
        isSubscribed
      }
    };
  }

  recordView(id) {
    const videos = this.getVideos();
    const v = videos.find(item => String(item._id) === String(id));
    if (v) {
      v.views = (v.views || 0) + 1;
      this.saveVideos(videos);

      // Save to watch history
      const history = JSON.parse(localStorage.getItem('yt_history')) || [];
      const filtered = history.filter(h => String(h._id) !== String(id));
      filtered.unshift({ ...v, watchedAt: new Date().toISOString() });
      localStorage.setItem('yt_history', JSON.stringify(filtered.slice(0, 50)));
    }
  }

  toggleLike(id) {
    const user = this.getCurrentUser() || initialUsers[0];
    const videos = this.getVideos();
    const v = videos.find(item => String(item._id) === String(id));
    if (!v) return { success: false };

    v.likes = v.likes || [];
    v.dislikes = v.dislikes || [];

    const hasLiked = v.likes.includes(user._id);
    if (hasLiked) {
      v.likes = v.likes.filter(uid => uid !== user._id);
    } else {
      v.likes.push(user._id);
      v.dislikes = v.dislikes.filter(uid => uid !== user._id);
    }
    this.saveVideos(videos);

    // Update liked storage
    const liked = JSON.parse(localStorage.getItem('yt_liked')) || [];
    const filtered = liked.filter(item => String(item._id) !== String(id));
    if (!hasLiked) filtered.unshift(v);
    localStorage.setItem('yt_liked', JSON.stringify(filtered));

    return {
      success: true,
      likesCount: v.likes.length,
      dislikesCount: v.dislikes.length,
      isLiked: !hasLiked,
      isDisliked: false
    };
  }

  toggleDislike(id) {
    const user = this.getCurrentUser() || initialUsers[0];
    const videos = this.getVideos();
    const v = videos.find(item => String(item._id) === String(id));
    if (!v) return { success: false };

    v.likes = v.likes || [];
    v.dislikes = v.dislikes || [];

    const hasDisliked = v.dislikes.includes(user._id);
    if (hasDisliked) {
      v.dislikes = v.dislikes.filter(uid => uid !== user._id);
    } else {
      v.dislikes.push(user._id);
      v.likes = v.likes.filter(uid => uid !== user._id);
    }
    this.saveVideos(videos);

    return {
      success: true,
      likesCount: v.likes.length,
      dislikesCount: v.dislikes.length,
      isLiked: false,
      isDisliked: !hasDisliked
    };
  }

  createVideo(data) {
    const user = this.getCurrentUser() || initialUsers[0];
    const videos = this.getVideos();
    const newVideo = {
      _id: 'v_' + Date.now(),
      title: data.title,
      description: data.description || '',
      videoUrl: data.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      duration: data.duration || '4:15',
      category: data.category || 'Tech',
      tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim().toLowerCase()) : (data.tags || []),
      channel: user,
      views: 1,
      likes: [],
      dislikes: [],
      sharesCount: 0,
      createdAt: new Date().toISOString()
    };
    videos.unshift(newVideo);
    this.saveVideos(videos);
    return { success: true, video: newVideo };
  }

  getComments(videoId) {
    const all = JSON.parse(localStorage.getItem('yt_comments')) || initialComments;
    return all[videoId] || [];
  }

  addComment(videoId, text) {
    const user = this.getCurrentUser() || initialUsers[0];
    const all = JSON.parse(localStorage.getItem('yt_comments')) || initialComments;
    all[videoId] = all[videoId] || [];
    const newComment = {
      _id: 'c_' + Date.now(),
      video: videoId,
      user,
      text,
      likes: [],
      createdAt: new Date().toISOString()
    };
    all[videoId].unshift(newComment);
    localStorage.setItem('yt_comments', JSON.stringify(all));
    return { success: true, comment: newComment };
  }

  toggleSubscribe(channelId) {
    const user = this.getCurrentUser() || initialUsers[0];
    const subs = JSON.parse(localStorage.getItem('yt_subs')) || {};
    subs[user._id] = subs[user._id] || [];

    const isSubbed = subs[user._id].includes(channelId);
    if (isSubbed) {
      subs[user._id] = subs[user._id].filter(id => id !== channelId);
    } else {
      subs[user._id].push(channelId);
    }
    localStorage.setItem('yt_subs', JSON.stringify(subs));

    const users = JSON.parse(localStorage.getItem('yt_users')) || initialUsers;
    const target = users.find(u => u._id === channelId);
    if (target) {
      target.subscribersCount = Math.max(0, (target.subscribersCount || 0) + (isSubbed ? -1 : 1));
      localStorage.setItem('yt_users', JSON.stringify(users));
    }

    return {
      success: true,
      isSubscribed: !isSubbed,
      subscribersCount: target ? target.subscribersCount : 100
    };
  }

  getRecommendations(currentVideoId) {
    const videos = this.getVideos();
    let curr = null;
    if (currentVideoId) {
      curr = videos.find(v => String(v._id) === String(currentVideoId));
    }

    const scored = videos
      .filter(v => !currentVideoId || String(v._id) !== String(currentVideoId))
      .map(v => {
        let score = (v.views || 0) * 0.05 + ((v.likes?.length || 0) * 5);
        if (curr && v.category === curr.category) score += 25;
        if (curr && v.channel?._id === curr.channel?._id) score += 20;
        return { ...v, recommendationScore: Math.round(score) };
      });

    scored.sort((a, b) => b.recommendationScore - a.recommendationScore);
    return scored;
  }
}

export const clientStore = new ClientStore();
