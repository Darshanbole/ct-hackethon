import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
  Verified,
  Image,
  Smile,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Zap,
  Coins,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock user data
const CURRENT_USER = {
  id: 'user_1',
  name: 'Alex Chen',
  handle: '@alexchen',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  verified: true,
  followers: 15420,
  following: 892,
  bio: 'Web3 Developer | Crypto Enthusiast | Building the future of social media',
  location: 'San Francisco, CA',
  website: 'alexchen.dev',
  joinDate: 'March 2021'
};

// Mock posts data
const INITIAL_POSTS = [
  {
    id: 'post_1',
    author: {
      id: 'user_2',
      name: 'Sarah Wilson',
      handle: '@sarahw',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      verified: true
    },
    content: 'Just minted my first NFT collection! 🎨 The intersection of art and blockchain technology is absolutely fascinating. Who else is exploring the creative possibilities of Web3?',
    timestamp: Date.now() - 3600000, // 1 hour ago
    likes: 234,
    retweets: 45,
    comments: 67,
    tips: 12.5,
    liked: false,
    retweeted: false,
    images: ['https://picsum.photos/400/300?random=1']
  },
  {
    id: 'post_2',
    author: {
      id: 'user_3',
      name: 'Mike Rodriguez',
      handle: '@mikedev',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      verified: false
    },
    content: 'The future of social media is decentralized! 🚀 No more centralized control, no more censorship. Users own their data and content. This is the way forward! #Web3 #Decentralization',
    timestamp: Date.now() - 7200000, // 2 hours ago
    likes: 156,
    retweets: 89,
    comments: 43,
    tips: 8.75,
    liked: true,
    retweeted: false
  },
  {
    id: 'post_3',
    author: {
      id: 'user_4',
      name: 'Emma Thompson',
      handle: '@emmacrypto',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      verified: true
    },
    content: 'Building a DeFi protocol has been an incredible journey! The community support and collaboration in Web3 is unlike anything I\'ve experienced. Thanks to everyone who\'s been part of this adventure! 💪',
    timestamp: Date.now() - 14400000, // 4 hours ago
    likes: 512,
    retweets: 123,
    comments: 89,
    tips: 25.0,
    liked: false,
    retweeted: true
  }
];

// Mock trending topics
const TRENDING_TOPICS = [
  { tag: '#Web3', posts: '45.2K' },
  { tag: '#DeFi', posts: '32.1K' },
  { tag: '#NFTs', posts: '28.7K' },
  { tag: '#Blockchain', posts: '21.5K' },
  { tag: '#Crypto', posts: '18.9K' }
];

const DecentralizedTwitter = () => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPost, setNewPost] = useState('');
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [tipAmount, setTipAmount] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleRetweet = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          retweeted: !post.retweeted,
          retweets: post.retweeted ? post.retweets - 1 : post.retweets + 1
        };
      }
      return post;
    }));
  };

  const handleComment = (postId) => {
    console.log('Comment on post:', postId);
    // Add comment functionality here
  };

  const handleShare = (postId) => {
    console.log('Share post:', postId);
    // Add share functionality here
  };

  const handleTip = (post) => {
    setSelectedPost(post);
    setShowTipDialog(true);
  };

  const sendTip = () => {
    if (selectedPost && tipAmount) {
      setPosts(posts.map(post => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            tips: post.tips + parseFloat(tipAmount)
          };
        }
        return post;
      }));
      setShowTipDialog(false);
      setTipAmount('');
      setSelectedPost(null);
    }
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post = {
        id: `post_${Date.now()}`,
        author: CURRENT_USER,
        content: newPost,
        timestamp: Date.now(),
        likes: 0,
        retweets: 0,
        comments: 0,
        tips: 0,
        liked: false,
        retweeted: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DecentralTwitter
              </h1>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Web3 Social
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-green-500 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Decentralized
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-6 p-4">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 space-y-6"
          >
            {/* User Profile Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                    <AvatarFallback>{CURRENT_USER.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-lg">{CURRENT_USER.name}</h3>
                      {CURRENT_USER.verified && (
                        <Verified className="w-5 h-5 text-blue-500" fill="currentColor" />
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{CURRENT_USER.handle}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{CURRENT_USER.bio}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span><strong>{formatNumber(CURRENT_USER.following)}</strong> Following</span>
                  <span><strong>{formatNumber(CURRENT_USER.followers)}</strong> Followers</span>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700">
              <CardHeader>
                <h3 className="font-bold text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {TRENDING_TOPICS.map((topic, index) => (
                  <motion.div
                    key={topic.tag}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">{topic.tag}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{topic.posts} posts</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl space-y-6">
            {/* Post Creator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                      <AvatarFallback>{CURRENT_USER.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="What's happening in Web3?"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[100px] border-0 text-lg placeholder:text-gray-500 resize-none focus-visible:ring-0"
                      />
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm">
                            <Image className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Smile className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Calendar className="w-5 h-5" />
                          </Button>
                        </div>
                        <Button 
                          onClick={handleCreatePost}
                          disabled={!newPost.trim()}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Posts Feed */}
            <div className="space-y-4">
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold">{post.author.name}</h4>
                              {post.author.verified && (
                                <Verified className="w-4 h-4 text-blue-500" fill="currentColor" />
                              )}
                              <span className="text-gray-600 dark:text-gray-400">{post.author.handle}</span>
                              <span className="text-gray-500">·</span>
                              <span className="text-gray-500">{formatTimestamp(post.timestamp)}</span>
                            </div>
                            
                            {/* Post Content */}
                            <p className="mt-2 text-gray-800 dark:text-gray-200 leading-relaxed">
                              {post.content}
                            </p>
                            
                            {/* Post Images */}
                            {post.images && (
                              <div className="mt-3 rounded-2xl overflow-hidden">
                                <img 
                                  src={post.images[0]} 
                                  alt="Post content" 
                                  className="w-full h-64 object-cover"
                                />
                              </div>
                            )}
                            
                            {/* Post Actions */}
                            <div className="flex items-center justify-between mt-4 pt-2">
                              <div className="flex items-center space-x-6">
                                <button
                                  onClick={() => handleComment(post.id)}
                                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                  <span className="text-sm">{formatNumber(post.comments)}</span>
                                </button>
                                
                                <button
                                  onClick={() => handleRetweet(post.id)}
                                  className={`flex items-center space-x-2 transition-colors ${
                                    post.retweeted 
                                      ? 'text-green-600' 
                                      : 'text-gray-600 hover:text-green-600'
                                  }`}
                                >
                                  <Repeat2 className="w-5 h-5" />
                                  <span className="text-sm">{formatNumber(post.retweets)}</span>
                                </button>
                                
                                <button
                                  onClick={() => handleLike(post.id)}
                                  className={`flex items-center space-x-2 transition-colors ${
                                    post.liked 
                                      ? 'text-red-600' 
                                      : 'text-gray-600 hover:text-red-600'
                                  }`}
                                >
                                  <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                                  <span className="text-sm">{formatNumber(post.likes)}</span>
                                </button>
                                
                                <button
                                  onClick={() => handleTip(post)}
                                  className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors"
                                >
                                  <Zap className="w-5 h-5" />
                                  <span className="text-sm">{post.tips.toFixed(1)} ETH</span>
                                </button>
                              </div>
                              
                              <button
                                onClick={() => handleShare(post.id)}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                              >
                                <Share className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 space-y-6"
          >
            {/* Who to Follow */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700">
              <CardHeader>
                <h3 className="font-bold text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Who to follow
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Vitalik Buterin', handle: '@VitalikButerin', verified: true },
                  { name: 'Crypto Wendy', handle: '@CryptoWendyO', verified: true },
                  { name: 'DeFi Pulse', handle: '@defipulse', verified: false }
                ].map((user, index) => (
                  <div key={user.handle} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-1">
                          <p className="font-medium text-sm">{user.name}</p>
                          {user.verified && (
                            <Verified className="w-4 h-4 text-blue-500" fill="currentColor" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.handle}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Follow</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tip Dialog */}
        <Dialog open={showTipDialog} onOpenChange={setShowTipDialog}>
          <DialogContent className="bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Send Tip
              </DialogTitle>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedPost.author.avatar} />
                      <AvatarFallback>{selectedPost.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedPost.author.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPost.author.handle}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {selectedPost.content}
                  </p>
                </div>
                <div>
                  <Label htmlFor="tip-amount">Amount (ETH)</Label>
                  <Input
                    id="tip-amount"
                    type="number"
                    step="0.001"
                    placeholder="0.001"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={sendTip} 
                  disabled={!tipAmount}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Send Tip
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DecentralizedTwitter;