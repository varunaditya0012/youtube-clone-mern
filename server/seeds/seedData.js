const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Video = require('../models/Video');
const Comment = require('../models/Comment');
const Subscription = require('../models/Subscription');

const initialUsers = [
  {
    name: 'TechNova',
    username: 'technova',
    email: 'technova@youtube.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    description: 'Deep dives into cutting-edge AI, modern web frameworks, gadgets and software engineering.',
    subscribersCount: 245000
  },
  {
    name: 'Code Samurai',
    username: 'codesamurai',
    email: 'samurai@youtube.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    description: 'Master React, Node.js, TypeScript, and full-stack architecture with clean code tutorials.',
    subscribersCount: 180000
  },
  {
    name: 'Chill Vibes & Lo-Fi',
    username: 'chillvibes',
    email: 'lofi@youtube.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    description: 'Relaxing ambient beats, study beats, and peaceful melodies for coding and chilling.',
    subscribersCount: 420000
  },
  {
    name: 'Apex Gaming Pro',
    username: 'apexgaming',
    email: 'gamer@youtube.com',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    description: 'Next-gen console reviews, esports tournaments, competitive gaming, and cinematic gameplay.',
    subscribersCount: 310000
  },
  {
    name: 'Curiosity Cosmos',
    username: 'curiositycosmos',
    email: 'cosmos@youtube.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: 'Unlocking the secrets of the Universe, James Webb Space Telescope discoveries, and quantum physics.',
    subscribersCount: 560000
  }
];

// High quality reliable web video streams (Creative Commons / Open Media)
const videoSources = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
];

const seedDatabase = async () => {
  try {
    const existingCount = await Video.countDocuments();
    if (existingCount > 0) {
      console.log(` Database already seeded (${existingCount} videos found).`);
      return;
    }

    console.log(' Starting database seed with YouTube clone sample data...');

    // Clean existing
    await User.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});
    await Subscription.deleteMany({});

    // 1. Create Users
    const createdUsers = [];
    for (const u of initialUsers) {
      const created = await User.create({
        ...u,
        password: 'password123'
      });
      createdUsers.push(created);
    }
    console.log(` Created ${createdUsers.length} channels & users.`);

    // 2. Setup Subscriptions
    // technova is subscribed to codesamurai and cosmos
    await Subscription.create({ subscriber: createdUsers[0]._id, channel: createdUsers[1]._id });
    await Subscription.create({ subscriber: createdUsers[0]._id, channel: createdUsers[4]._id });
    // codesamurai subscribed to technova and chillvibes
    await Subscription.create({ subscriber: createdUsers[1]._id, channel: createdUsers[0]._id });
    await Subscription.create({ subscriber: createdUsers[1]._id, channel: createdUsers[2]._id });

    // 3. Create Videos
    const sampleVideos = [
      {
        title: 'Building a Full-Stack MERN Application from Scratch (Complete 2026 Guide)',
        description: 'In this complete masterclass, we dive deep into building modern reactive applications using MongoDB, Express, React, and Node.js. We cover JWT authentication, file uploads, responsive design, and state management.',
        videoUrl: videoSources[0],
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        duration: '9:56',
        category: 'Tech',
        tags: ['react', 'nodejs', 'mern', 'javascript', 'coding', 'webdev'],
        channel: createdUsers[1]._id,
        views: 142850,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Next-Gen Artificial Intelligence: What to Expect in 2026 & Beyond',
        description: 'Explore the newest breakthroughs in multimodal reasoning models, autonomous agents, neuromorphic computing, and how AI agents are transforming everyday developer workflows.',
        videoUrl: videoSources[1],
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
        duration: '10:53',
        category: 'Tech',
        tags: ['ai', 'future', 'tech', 'machinelearning', 'agents'],
        channel: createdUsers[0]._id,
        views: 295400,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Chill Lo-Fi Hip Hop Beats - 24/7 Coding & Study Sessions',
        description: 'Smooth, nostalgic lo-fi study beats to help you concentrate, code, relax, or sleep. Grab a cup of warm coffee and enjoy these peaceful melodies.',
        videoUrl: videoSources[2],
        thumbnailUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
        duration: '15:12',
        category: 'Music',
        tags: ['lofi', 'chill', 'music', 'study', 'focus', 'beats'],
        channel: createdUsers[2]._id,
        views: 684200,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Cyberpunk 2077 Ultra Ray Tracing Overdrive Benchmark 4K 120FPS',
        description: 'Pushing graphics hardware to the absolute edge with full path tracing, ultra dynamic lighting, and DLSS 3 frame generation on the highest settings.',
        videoUrl: videoSources[3],
        thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        duration: '12:05',
        category: 'Gaming',
        tags: ['gaming', 'cyberpunk', 'raytracing', 'graphics', 'pcgaming'],
        channel: createdUsers[3]._id,
        views: 218900,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'James Webb Telescope Makes Groundbreaking Deep Space Discovery',
        description: 'New spectroscopic data reveals organic molecules and potential biosignatures in an exoplanet atmosphere 120 light years away in the habitable zone.',
        videoUrl: videoSources[4],
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        duration: '14:20',
        category: 'Education',
        tags: ['space', 'science', 'jwst', 'astronomy', 'universe'],
        channel: createdUsers[4]._id,
        views: 521400,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        title: '10 Clean Code Practices Every Software Engineer Should Follow',
        description: 'Write maintainable, robust, and elegant code with these 10 architectural principles. Avoid spaghetti code and make your codebase a joy to work on.',
        videoUrl: videoSources[5],
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        duration: '8:45',
        category: 'Tech',
        tags: ['coding', 'cleancode', 'software', 'programming', 'architecture'],
        channel: createdUsers[1]._id,
        views: 89300,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Synthwave Night Drive - 80s Retro Electronic Mix',
        description: 'Cruise down neon highways under the midnight stars with this nostalgic collection of outrun synthwave and retro electronic tracks.',
        videoUrl: videoSources[6],
        thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
        duration: '18:30',
        category: 'Music',
        tags: ['synthwave', 'retrowave', 'nightdrive', 'electronic', 'music'],
        channel: createdUsers[2]._id,
        views: 312000,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Top 10 Most Anticipated Games Coming This Year',
        description: 'From sprawling open-world RPGs to breathtaking action adventures, here are the absolute biggest game launches you need to add to your wishlist.',
        videoUrl: videoSources[7],
        thumbnailUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
        duration: '11:15',
        category: 'Gaming',
        tags: ['gaming', 'top10', 'upcoming', 'games', 'playstation', 'pc'],
        channel: createdUsers[3]._id,
        views: 450120,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Quantum Computing Explained Simply in 10 Minutes',
        description: 'What are Qubits? How does quantum superposition and entanglement really work? We demystify quantum supremacy with clear visual illustrations.',
        videoUrl: videoSources[8],
        thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
        duration: '10:02',
        category: 'Education',
        tags: ['quantum', 'physics', 'computing', 'science', 'education'],
        channel: createdUsers[4]._id,
        views: 189400,
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Modern CSS Masterclass: Grid, Flexbox & Container Queries',
        description: 'Stop struggling with layout styling! Master modern responsive CSS techniques that adapt smoothly to every device screen without messy hacks.',
        videoUrl: videoSources[9],
        thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        duration: '7:40',
        category: 'Tech',
        tags: ['css', 'frontend', 'webdev', 'responsive', 'html'],
        channel: createdUsers[1]._id,
        views: 94200,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ];

    const createdVideos = [];
    for (const v of sampleVideos) {
      // Add likes from other users
      const likes = [createdUsers[0]._id, createdUsers[2]._id];
      const created = await Video.create({
        ...v,
        likes
      });
      createdVideos.push(created);
    }
    console.log(` Created ${createdVideos.length} sample videos.`);

    // 4. Create Sample Comments
    const sampleComments = [
      {
        video: createdVideos[0]._id,
        user: createdUsers[0]._id,
        text: 'Phenomenal tutorial! The explanation of JWT token verification and custom middleware was crystal clear. Thank you!'
      },
      {
        video: createdVideos[0]._id,
        user: createdUsers[2]._id,
        text: 'Bookmarked this immediately. The architecture structure is super scalable.'
      },
      {
        video: createdVideos[1]._id,
        user: createdUsers[1]._id,
        text: 'The autonomous agent workflow demonstration blew my mind. Future of software is here!'
      },
      {
        video: createdVideos[2]._id,
        user: createdUsers[3]._id,
        text: 'Listening to this while coding late at night. Super chill atmosphere!'
      },
      {
        video: createdVideos[4]._id,
        user: createdUsers[0]._id,
        text: 'Astrophysics never ceases to amaze me. Excellent breakdown of the spectrometer data.'
      }
    ];

    for (const c of sampleComments) {
      await Comment.create({
        ...c,
        likes: [createdUsers[1]._id]
      });
    }
    console.log(` Created ${sampleComments.length} sample comments.`);
    console.log(' Database seed complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
