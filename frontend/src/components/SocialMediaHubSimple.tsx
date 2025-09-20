import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// -----------------------------
// Types
// -----------------------------
interface Author {
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
}

interface Engagement {
  liked: boolean;
  shared: boolean;
  bookmarked: boolean;
}

interface Media {
  type: "image" | "video";
  url: string;
  duration?: string;
}

interface Post {
  id: string;
  platform: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  author: Author;
  engagement: Engagement;
  media?: Media;
}

// -----------------------------
// Constants
// -----------------------------
const STORAGE_KEY = "smhub_posts_v1";

const SOCIAL_PLATFORMS: Record<string, { name: string; icon: string }> = {
  twitter: { name: "Twitter", icon: "🐦" },
  instagram: { name: "Instagram", icon: "📸" },
  linkedin: { name: "LinkedIn", icon: "💼" },
  facebook: { name: "Facebook", icon: "📘" },
};

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    platform: "twitter",
    content:
      "Just shipped a new Web3 feature that allows seamless cross-chain transactions! The future of DeFi is here 🚀 #Web3 #DeFi",
    likes: 1234,
    comments: 56,
    shares: 89,
    timestamp: "2024-01-15T10:30:00Z",
    author: {
      name: "Alex Chen",
      username: "@alexchen_dev",
      avatar: "https://i.pravatar.cc/100?img=12",
      verified: true,
    },
    engagement: { liked: false, shared: false, bookmarked: false },
    media: { type: "image", url: "https://picsum.photos/800/450?random=1" },
  },
  {
    id: "2",
    platform: "instagram",
    content:
      "Beautiful sunset from my hike today! Nature never fails to inspire 🌅 #nature #hiking #sunset",
    likes: 2567,
    comments: 123,
    shares: 234,
    timestamp: "2024-01-15T09:15:00Z",
    author: {
      name: "Sarah Johnson",
      username: "@sarahjohnson",
      avatar: "https://i.pravatar.cc/100?img=47",
      verified: false,
    },
    engagement: { liked: true, shared: false, bookmarked: true },
    media: { type: "image", url: "https://picsum.photos/800/800?random=2" },
  },
  {
    id: "3",
    platform: "linkedin",
    content: "How to build a resilient engineering culture — writeups and templates inside.",
    likes: 432,
    comments: 34,
    shares: 45,
    timestamp: "2024-01-14T08:45:00Z",
    author: {
      name: "Tech Tutorials Pro",
      username: "@techtutorials",
      avatar: "https://i.pravatar.cc/100?img=5",
      verified: true,
    },
    engagement: { liked: false, shared: true, bookmarked: false },
    media: { type: "video", url: "https://picsum.photos/800/450?random=3", duration: "12:03" },
  },
];

// -----------------------------
// Helpers
// -----------------------------
const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.max(0, now.getTime() - date.getTime());
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
};

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

// -----------------------------
// Component
// -----------------------------
const SocialMediaHub: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Post[];
        return parsed;
      }
    } catch (e) {
      // ignore parse errors and fall back
    }
    return INITIAL_POSTS;
  });

  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Persist posts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (_) {
      // ignore storage errors
    }
  }, [posts]);

  // Handle engagement actions
  const handleEngagement = (postId: string, action: "like" | "share" | "bookmark") => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const updated = { ...post };

        switch (action) {
          case "like":
            updated.engagement = { ...updated.engagement, liked: !updated.engagement.liked };
            updated.likes = Math.max(0, updated.likes + (updated.engagement.liked ? 1 : -1));
            break;
          case "share":
            updated.engagement = { ...updated.engagement, shared: !updated.engagement.shared };
            updated.shares = Math.max(0, updated.shares + (updated.engagement.shared ? 1 : -1));
            break;
          case "bookmark":
            updated.engagement = { ...updated.engagement, bookmarked: !updated.engagement.bookmarked };
            break;
        }

        return updated;
      })
    );
  };

  // Memoized filtered posts
  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return posts
      .filter((p) => selectedPlatform === "all" || p.platform === selectedPlatform)
      .filter(
        (p) =>
          q === "" ||
          p.content.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          p.author.username.toLowerCase().includes(q)
      );
  }, [posts, selectedPlatform, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* decorative background - does not intercept pointer events */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOWZhZmIiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')]"
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/80 backdrop-blur-sm rounded-full shadow mb-4">
            <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            Social Media Hub
          </h1>
          <p className="text-gray-600 mt-2">Manage your posts and engagements from one place</p>
        </motion.header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="xl:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm shadow rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-3">Platforms</h3>
              <div className="space-y-2">
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedPlatform === "all" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedPlatform("all")}
                  aria-pressed={selectedPlatform === "all"}
                >
                  🌐 All Platforms
                </button>

                {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => (
                  <button
                    key={key}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedPlatform === key ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedPlatform(key)}
                    aria-pressed={selectedPlatform === key}
                  >
                    <span className="mr-2">{platform.icon}</span>
                    {platform.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm shadow rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-3">Trending</h3>
              <div className="space-y-2">
                {["#Web3", "#AI", "#React", "#Design"].map((tag, i) => (
                  <div key={tag} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">#</span>
                      <span className="text-sm font-medium">{tag}</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{(i + 1) * 1.1}K</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Feed */}
          <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="xl:col-span-3 space-y-6">
            {/* Search box */}
            <div className="bg-white/80 backdrop-blur-sm shadow rounded-lg p-4">
              <div className="relative">
                <input
                  aria-label="Search posts"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search posts, users, or topics..."
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" />
                </svg>
              </div>
            </div>

            {/* Posts list */}
            <div className="space-y-6">
              <AnimatePresence>
                {filteredPosts.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/80 backdrop-blur-sm shadow rounded-lg p-12 text-center">
                    <p className="text-lg text-gray-500">No posts found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search or platform filter</p>
                  </motion.div>
                ) : (
                  filteredPosts.map((post) => (
                    <motion.article
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white/80 backdrop-blur-sm shadow rounded-lg p-6 hover:shadow-2xl transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{post.author.name}</h3>
                            {post.author.verified && (
                              <span title="Verified" className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5L6.2 11 9 13.8 17.8 5 20 7.2z" /></svg>
                              </span>
                            )}
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {SOCIAL_PLATFORMS[post.platform]?.icon ?? "🔗"} {SOCIAL_PLATFORMS[post.platform]?.name ?? post.platform}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{post.author.username} • {formatTime(post.timestamp)}</p>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-gray-800 mb-4 whitespace-pre-line">{post.content}</p>

                      {/* Media */}
                      {post.media && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          {post.media.type === "image" ? (
                            <img src={post.media.url} alt="Post media" className="w-full h-64 object-cover rounded-lg" />
                          ) : (
                            <div className="relative w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-600">🎥 Video</span>
                              {post.media.duration && <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{post.media.duration}</span>}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between border-t pt-4">
                        <div className="flex items-center gap-4">
                          <button
                            aria-label="Like"
                            onClick={() => handleEngagement(post.id, "like")}
                            className={`flex items-center gap-2 px-3 py-1 rounded ${post.engagement.liked ? "text-red-500 bg-red-50" : "text-gray-600 hover:bg-gray-50"}`}
                          >
                            <span>{post.engagement.liked ? "❤️" : "🤍"}</span>
                            <span className="text-sm">{formatNumber(post.likes)}</span>
                          </button>

                          <button className="flex items-center gap-2 px-3 py-1 rounded text-gray-600 hover:bg-gray-50">
                            <span>💬</span>
                            <span className="text-sm">{formatNumber(post.comments)}</span>
                          </button>

                          <button
                            aria-label="Share"
                            onClick={() => handleEngagement(post.id, "share")}
                            className={`flex items-center gap-2 px-3 py-1 rounded ${post.engagement.shared ? "text-green-600 bg-green-50" : "text-gray-600 hover:bg-gray-50"}`}
                          >
                            <span>🔄</span>
                            <span className="text-sm">{formatNumber(post.shares)}</span>
                          </button>
                        </div>

                        <button
                          aria-label="Bookmark"
                          onClick={() => handleEngagement(post.id, "bookmark")}
                          className={`p-2 rounded ${post.engagement.bookmarked ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                          {post.engagement.bookmarked ? "🔖" : "📄"}
                        </button>
                      </div>
                    </motion.article>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaHub;
