import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  TrendingUp,
  Heart,
  Share2,
  MessageCircle,
  Play,
  Camera,
  Video,
  Music,
  Image as ImageIcon,
  Users,
  Eye,
  ThumbsUp,
  Bookmark,
  Send,
  MoreHorizontal,
  Verified,
  Crown,
  Zap,
  Gift,
  Globe2,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const MultiPlatformSocialHub = () => {
  const [activePost, setActivePost] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState(null);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      color: 'from-pink-500 via-red-500 to-yellow-500',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-100',
      posts: instagramPosts
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      posts: facebookPosts
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <Youtube className="w-5 h-5" />,
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-gradient-to-br from-red-50 to-pink-100',
      posts: youtubePosts
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-sky-50 to-blue-100',
      posts: twitterPosts
    }
  ];

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleSave = (postId) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Dynamic background with cursor interaction */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 100 }}
        />
        
        {/* Floating elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10"
            animate={{
              x: [0, 200, 0],
              y: [0, -200, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Social Universe
              </h1>
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">Live</span>
              </motion.div>
              
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Globe2 className="w-4 h-4 mr-2" />
                Go Global
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="instagram" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            {platforms.map((platform) => (
              <TabsTrigger
                key={platform.id}
                value={platform.id}
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                {platform.icon}
                <span className="hidden sm:inline">{platform.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {platforms.map((platform) => (
            <TabsContent key={platform.id} value={platform.id} className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${platform.bgColor} rounded-3xl p-6 min-h-screen`}
              >
                {/* Platform Header */}
                <div className="flex items-center justify-between mb-8">
                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${platform.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                      {platform.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">{platform.name}</h2>
                      <p className="text-gray-600">Decentralized Social Network</p>
                    </div>
                  </motion.div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-white/80 text-gray-700 px-4 py-2">
                      <Users className="w-4 h-4 mr-2" />
                      {Math.floor(Math.random() * 10)}M Users
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 px-4 py-2">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Trending
                    </Badge>
                  </div>
                </div>

                {/* Content Grid */}
                <div className={`grid gap-6 ${
                  platform.id === 'instagram' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                  platform.id === 'youtube' ? 'grid-cols-1 lg:grid-cols-2' :
                  'grid-cols-1 md:grid-cols-2'
                }`}>
                  {platform.posts.map((post, index) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      platform={platform}
                      index={index}
                      likedPosts={likedPosts}
                      savedPosts={savedPosts}
                      onLike={handleLike}
                      onSave={handleSave}
                      onHover={setHoveredElement}
                      isHovered={hoveredElement === `${platform.id}-${post.id}`}
                    />
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

const PostCard = ({ post, platform, index, likedPosts, savedPosts, onLike, onSave, onHover, isHovered }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => onHover(`${platform.id}-${post.id}`)}
      onHoverEnd={() => onHover(null)}
      className={`bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer ${
        isHovered ? 'shadow-2xl ring-2 ring-blue-500/50' : ''
      }`}
    >
      <Card className="border-0 shadow-none bg-transparent">
        {/* Post Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Avatar className="w-12 h-12 ring-2 ring-white shadow-lg">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-gray-800">{post.author.name}</h3>
                  {post.author.verified && (
                    <Verified className="w-4 h-4 text-blue-500" fill="currentColor" />
                  )}
                  {post.author.premium && (
                    <Crown className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{post.timestamp}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Post Content */}
          {post.content && (
            <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
          )}

          {/* Media Content */}
          {post.media && (
            <motion.div
              className="relative mb-4 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              {post.type === 'video' ? (
                <div className="relative">
                  <img src={post.media} alt="Video thumbnail" className="w-full h-64 object-cover" />
                  <motion.div
                    className="absolute inset-0 bg-black/30 flex items-center justify-center"
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-8 h-8 text-gray-800 ml-1" />
                    </motion.div>
                  </motion.div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {post.duration}
                  </div>
                </div>
              ) : (
                <img src={post.media} alt="Post content" className="w-full h-64 object-cover" />
              )}
            </motion.div>
          )}

          {/* Post Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {post.views}
              </span>
              <span className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                {post.likes}
              </span>
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                {post.comments}
              </span>
            </div>
            {post.earnings && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Zap className="w-3 h-3 mr-1" />
                +{post.earnings} ETH
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLike(post.id)}
                className={`p-2 rounded-full transition-colors ${
                  likedPosts.has(post.id) 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full text-gray-600 hover:text-green-500 hover:bg-green-50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSave(post.id)}
              className={`p-2 rounded-full transition-colors ${
                savedPosts.has(post.id)
                  ? 'text-blue-500 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${savedPosts.has(post.id) ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Mock data for different platforms
const instagramPosts = [
  {
    id: 'ig1',
    author: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', verified: true, premium: true },
    content: 'Exploring the beautiful landscapes of Iceland 🏔️ Nature never fails to amaze me!',
    media: 'https://picsum.photos/400/400?random=1',
    type: 'image',
    timestamp: '2 hours ago',
    likes: '12.5K',
    comments: '234',
    views: '45.2K',
    earnings: '2.3'
  },
  {
    id: 'ig2',
    author: { name: 'Alex Rodriguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', verified: false, premium: true },
    content: 'New workout routine video is live! Who\'s ready to get fit? 💪',
    media: 'https://picsum.photos/400/400?random=2',
    type: 'video',
    duration: '2:45',
    timestamp: '4 hours ago',
    likes: '8.9K',
    comments: '156',
    views: '23.1K',
    earnings: '1.8'
  },
  // Add more Instagram posts...
];

const facebookPosts = [
  {
    id: 'fb1',
    author: { name: 'TechNews Daily', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech', verified: true, premium: false },
    content: 'Breaking: Revolutionary AI breakthrough changes everything we know about machine learning. This could be the future!',
    media: 'https://picsum.photos/600/400?random=10',
    type: 'image',
    timestamp: '1 hour ago',
    likes: '2.3K',
    comments: '89',
    views: '15.7K',
    earnings: '4.1'
  },
  // Add more Facebook posts...
];

const youtubePosts = [
  {
    id: 'yt1',
    author: { name: 'CodeMaster Pro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=code', verified: true, premium: true },
    content: 'Learn React in 30 minutes - Complete beginner tutorial',
    media: 'https://picsum.photos/800/450?random=20',
    type: 'video',
    duration: '28:15',
    timestamp: '6 hours ago',
    likes: '15.2K',
    comments: '342',
    views: '125.8K',
    earnings: '12.7'
  },
  // Add more YouTube posts...
];

const twitterPosts = [
  {
    id: 'tw1',
    author: { name: 'Crypto Guru', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto', verified: true, premium: true },
    content: 'The future of finance is here! Decentralized social media platforms are changing how we interact and earn online. #Web3 #DeFi #SocialFi',
    timestamp: '30 minutes ago',
    likes: '543',
    comments: '67',
    views: '12.3K',
    earnings: '0.8'
  },
  // Add more Twitter posts...
];

export default MultiPlatformSocialHub;