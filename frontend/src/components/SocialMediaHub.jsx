import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share, 
  Send, 
  Plus,
  Search,
  Filter,
  Globe,
  Video,
  Image,
  Mic,
  MoreHorizontal,
  ExternalLink,
  Bookmark,
  Flag,
  TrendingUp,
  Eye,
  Play,
  Calendar,
  MapPin,
  Star,
  Settings,
  Bell,
  Hash
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Mock data for different social platforms
const SOCIAL_PLATFORMS = {
  twitter: { name: 'Twitter', icon: '🐦', color: 'from-blue-400 to-blue-600' },
  instagram: { name: 'Instagram', icon: '📷', color: 'from-pink-400 to-purple-600' },
  facebook: { name: 'Facebook', icon: '👤', color: 'from-blue-500 to-blue-700' },
  youtube: { name: 'YouTube', icon: '📺', color: 'from-red-500 to-red-600' },
  tiktok: { name: 'TikTok', icon: '🎵', color: 'from-gray-800 to-black' },
  linkedin: { name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-800' }
};

// Mock posts data
const MOCK_POSTS = [
  {
    id: '1',
    platform: 'twitter',
    author: {
      name: 'Alex Chen',
      username: '@alexchen_dev',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    content: 'Just shipped a new Web3 feature that allows seamless cross-chain transactions! The future of DeFi is here 🚀 #Web3 #DeFi #Blockchain',
    timestamp: '2024-01-15T10:30:00Z',
    likes: 1234,
    shares: 89,
    comments: 56,
    media: {
      type: 'image',
      url: '/api/placeholder/600/400'
    },
    engagement: {
      liked: false,
      shared: false,
      bookmarked: false
    }
  },
  {
    id: '2',
    platform: 'instagram',
    author: {
      name: 'Sarah Johnson',
      username: '@sarahjohnson',
      avatar: '/api/placeholder/40/40',
      verified: false
    },
    content: 'Beautiful sunset from my hike today! Nature never fails to inspire 🌅 #nature #hiking #sunset',
    timestamp: '2024-01-15T09:15:00Z',
    likes: 2567,
    shares: 234,
    comments: 123,
    media: {
      type: 'image',
      url: '/api/placeholder/600/600'
    },
    engagement: {
      liked: true,
      shared: false,
      bookmarked: true
    }
  },
  {
    id: '3',
    platform: 'youtube',
    author: {
      name: 'Tech Tutorials Pro',
      username: '@techtutorials',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    content: 'How to Build a React App in 2024 - Complete Tutorial for Beginners',
    timestamp: '2024-01-15T08:45:00Z',
    likes: 5678,
    shares: 890,
    comments: 345,
    media: {
      type: 'video',
      url: '/api/placeholder/600/400',
      duration: '15:32'
    },
    engagement: {
      liked: false,
      shared: true,
      bookmarked: false
    }
  }
];

const SocialMediaHub = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    platform: 'twitter',
    media: null
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter posts based on selected platform
  const filteredPosts = posts.filter(post => 
    selectedPlatform === 'all' || post.platform === selectedPlatform
  ).filter(post => 
    searchQuery === '' || 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle post engagement
  const handleEngagement = (postId, action) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const updatedPost = { ...post };
          
          switch (action) {
            case 'like':
              updatedPost.engagement.liked = !post.engagement.liked;
              updatedPost.likes += updatedPost.engagement.liked ? 1 : -1;
              break;
            case 'share':
              updatedPost.engagement.shared = !post.engagement.shared;
              updatedPost.shares += updatedPost.engagement.shared ? 1 : -1;
              break;
            case 'bookmark':
              updatedPost.engagement.bookmarked = !post.engagement.bookmarked;
              break;
            default:
              break;
          }
          
          return updatedPost;
        }
        return post;
      })
    );
  };

  // Create new post
  const handleCreatePost = async () => {
    if (!newPost.content.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const post = {
        id: Date.now().toString(),
        platform: newPost.platform,
        author: {
          name: 'You',
          username: '@yourhandle',
          avatar: '/api/placeholder/40/40',
          verified: false
        },
        content: newPost.content,
        timestamp: new Date().toISOString(),
        likes: 0,
        shares: 0,
        comments: 0,
        media: newPost.media ? {
          type: 'image',
          url: '/api/placeholder/600/400'
        } : null,
        engagement: {
          liked: false,
          shared: false,
          bookmarked: false
        }
      };
      
      setPosts(prev => [post, ...prev]);
      setNewPost({ content: '', platform: 'twitter', media: null });
      setShowCreatePost(false);
      setIsLoading(false);
    }, 1000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "now";
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOWZhZmIiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Social Media Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage all your social media platforms in one unified interface
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar - Platform Filters & Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-1 space-y-6"
          >
            {/* Create Post */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="platform">Platform</Label>
                        <Select value={newPost.platform} onValueChange={(value) => setNewPost(prev => ({ ...prev, platform: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <span>{platform.icon}</span>
                                  {platform.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={newPost.content}
                          onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="What's on your mind?"
                          className="min-h-24"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Image className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mic className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button 
                        onClick={handleCreatePost} 
                        disabled={isLoading || !newPost.content.trim()}
                        className="w-full"
                      >
                        {isLoading ? 'Posting...' : 'Post'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Post
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Platform Filters */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Platforms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedPlatform === 'all' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedPlatform('all')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  All Platforms
                </Button>
                {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => (
                  <Button
                    key={key}
                    variant={selectedPlatform === key ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedPlatform(key)}
                  >
                    <span className="mr-2">{platform.icon}</span>
                    {platform.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Trending</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['#Web3', '#AI', '#React', '#Blockchain', '#DeFi'].map((tag, index) => (
                  <div key={tag} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{tag}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {(index + 1) * 1.2}K
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-3 space-y-6"
          >
            {/* Search & Filter Bar */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search posts, users, or topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-6">
              <AnimatePresence>
                {filteredPosts.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-12 text-center">
                      <div className="text-gray-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No posts found</p>
                        <p className="text-sm">Try adjusting your search or platform filter</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          {/* Post Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{post.author.name}</h3>
                                  {post.author.verified && (
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    <span className="mr-1">{SOCIAL_PLATFORMS[post.platform].icon}</span>
                                    {SOCIAL_PLATFORMS[post.platform].name}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{post.author.username} • {formatTime(post.timestamp)}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Post Content */}
                          <div className="mb-4">
                            <p className="text-gray-800 leading-relaxed">{post.content}</p>
                          </div>

                          {/* Post Media */}
                          {post.media && (
                            <div className="mb-4 rounded-lg overflow-hidden">
                              {post.media.type === 'image' ? (
                                <img 
                                  src={post.media.url} 
                                  alt="Post media"
                                  className="w-full h-64 object-cover bg-gray-200"
                                />
                              ) : (
                                <div className="relative">
                                  <img 
                                    src={post.media.url} 
                                    alt="Video thumbnail"
                                    className="w-full h-64 object-cover bg-gray-200"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                                      <Play className="w-6 h-6 text-gray-800 ml-1" />
                                    </div>
                                  </div>
                                  {post.media.duration && (
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                      {post.media.duration}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Post Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEngagement(post.id, 'like')}
                                className={`gap-2 ${post.engagement.liked ? 'text-red-500' : 'text-gray-600'}`}
                              >
                                <Heart className={`w-4 h-4 ${post.engagement.liked ? 'fill-current' : ''}`} />
                                {formatNumber(post.likes)}
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
                                <MessageCircle className="w-4 h-4" />
                                {formatNumber(post.comments)}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEngagement(post.id, 'share')}
                                className={`gap-2 ${post.engagement.shared ? 'text-green-500' : 'text-gray-600'}`}
                              >
                                <Share className="w-4 h-4" />
                                {formatNumber(post.shares)}
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEngagement(post.id, 'bookmark')}
                                className={post.engagement.bookmarked ? 'text-blue-500' : 'text-gray-600'}
                              >
                                <Bookmark className={`w-4 h-4 ${post.engagement.bookmarked ? 'fill-current' : ''}`} />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-gray-600">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaHub;
