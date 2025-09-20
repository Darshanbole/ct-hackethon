import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  Hash,
  Search,
  Eye,
  MessageSquare,
  Heart,
  Share2,
  Clock,
  Users,
  Filter,
  Star,
  Zap,
  Fire
} from 'lucide-react';

const HashtagSystem = ({ onHashtagClick, onHashtagFollow }) => {
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHashtags, setFilteredHashtags] = useState([]);
  const [followedHashtags, setFollowedHashtags] = useState(new Set());
  const [timeframe, setTimeframe] = useState('today'); // today, week, month, all

  // Mock trending hashtags data
  const mockHashtags = [
    {
      id: 1,
      tag: 'Web3',
      posts: 1247,
      trend: '+32%',
      category: 'Technology',
      description: 'The next generation of the internet built on blockchain technology',
      recent_posts: [
        { author: 'Alex Smith', content: 'Just launched my first Web3 app!' },
        { author: 'Sarah Johnson', content: 'Web3 is revolutionizing digital ownership' }
      ],
      engagement: {
        likes: 5420,
        comments: 892,
        shares: 324
      },
      trending_score: 95,
      related: ['Blockchain', 'DeFi', 'NFT']
    },
    {
      id: 2,
      tag: 'Blockchain',
      posts: 2156,
      trend: '+28%',
      category: 'Technology',
      description: 'Distributed ledger technology powering cryptocurrencies and dApps',
      recent_posts: [
        { author: 'Mike Chen', content: 'Blockchain scalability solutions are evolving rapidly' },
        { author: 'Lisa Wong', content: 'Learning blockchain development fundamentals' }
      ],
      engagement: {
        likes: 8934,
        comments: 1456,
        shares: 612
      },
      trending_score: 92,
      related: ['Web3', 'Cryptocurrency', 'Smart Contracts']
    },
    {
      id: 3,
      tag: 'DeFi',
      posts: 987,
      trend: '+45%',
      category: 'Finance',
      description: 'Decentralized Finance protocols and applications',
      recent_posts: [
        { author: 'John Davis', content: 'DeFi yields are looking attractive this week' },
        { author: 'Emma Taylor', content: 'Exploring new DeFi protocols for yield farming' }
      ],
      engagement: {
        likes: 3241,
        comments: 567,
        shares: 289
      },
      trending_score: 88,
      related: ['Yield Farming', 'Liquidity Mining', 'AMM']
    },
    {
      id: 4,
      tag: 'NFT',
      posts: 1543,
      trend: '+15%',
      category: 'Art',
      description: 'Non-Fungible Tokens and digital collectibles',
      recent_posts: [
        { author: 'Artist Joe', content: 'Dropped my latest NFT collection!' },
        { author: 'Collector Sam', content: 'NFT market trends for 2025' }
      ],
      engagement: {
        likes: 4567,
        comments: 789,
        shares: 345
      },
      trending_score: 85,
      related: ['Digital Art', 'Collectibles', 'Marketplace']
    },
    {
      id: 5,
      tag: 'Shardeum',
      posts: 432,
      trend: '+67%',
      category: 'Technology',
      description: 'EVM-based sharded blockchain for scalable dApps',
      recent_posts: [
        { author: 'Dev Builder', content: 'Building on Shardeum is incredibly fast!' },
        { author: 'Tech Enthusiast', content: 'Shardeum solves the blockchain trilemma' }
      ],
      engagement: {
        likes: 1876,
        comments: 312,
        shares: 156
      },
      trending_score: 82,
      related: ['Scaling', 'EVM', 'Layer 1']
    },
    {
      id: 6,
      tag: 'AI',
      posts: 3421,
      trend: '+38%',
      category: 'Technology',
      description: 'Artificial Intelligence and machine learning developments',
      recent_posts: [
        { author: 'AI Researcher', content: 'GPT models are getting more powerful' },
        { author: 'ML Engineer', content: 'AI + Blockchain = Future of automation' }
      ],
      engagement: {
        likes: 7821,
        comments: 1234,
        shares: 567
      },
      trending_score: 90,
      related: ['Machine Learning', 'GPT', 'Automation']
    },
    {
      id: 7,
      tag: 'Crypto',
      posts: 5672,
      trend: '+22%',
      category: 'Finance',
      description: 'Cryptocurrency news, trading, and market analysis',
      recent_posts: [
        { author: 'Crypto Trader', content: 'Bitcoin hitting new resistance levels' },
        { author: 'Market Analyst', content: 'Altcoin season might be starting' }
      ],
      engagement: {
        likes: 12456,
        comments: 2341,
        shares: 891
      },
      trending_score: 94,
      related: ['Bitcoin', 'Ethereum', 'Trading']
    },
    {
      id: 8,
      tag: 'dApps',
      posts: 823,
      trend: '+56%',
      category: 'Technology',
      description: 'Decentralized applications and their development',
      recent_posts: [
        { author: 'dApp Developer', content: 'Launched my first DeFi dApp!' },
        { author: 'User Experience', content: 'dApp UX is improving rapidly' }
      ],
      engagement: {
        likes: 2134,
        comments: 445,
        shares: 223
      },
      trending_score: 79,
      related: ['Smart Contracts', 'Web3', 'Ethereum']
    }
  ];

  useEffect(() => {
    setTrendingHashtags(mockHashtags);
    setFilteredHashtags(mockHashtags);
    
    // Load followed hashtags from localStorage
    const saved = localStorage.getItem('followedHashtags');
    if (saved) {
      setFollowedHashtags(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = trendingHashtags.filter(hashtag =>
        hashtag.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hashtag.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hashtag.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHashtags(filtered);
    } else {
      setFilteredHashtags(trendingHashtags);
    }
  }, [searchQuery, trendingHashtags]);

  const handleHashtagFollow = (hashtagId, tag) => {
    const newFollowed = new Set(followedHashtags);
    if (newFollowed.has(hashtagId)) {
      newFollowed.delete(hashtagId);
    } else {
      newFollowed.add(hashtagId);
    }
    setFollowedHashtags(newFollowed);
    localStorage.setItem('followedHashtags', JSON.stringify([...newFollowed]));
    
    if (onHashtagFollow) {
      onHashtagFollow(hashtagId, tag, !followedHashtags.has(hashtagId));
    }
  };

  const getTrendIcon = (trend) => {
    const percentage = parseInt(trend.replace('%', '').replace('+', ''));
    if (percentage > 50) return <Fire className="h-4 w-4 text-red-500" />;
    if (percentage > 25) return <TrendingUp className="h-4 w-4 text-orange-500" />;
    return <Zap className="h-4 w-4 text-yellow-500" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-blue-500',
      'Finance': 'bg-green-500',
      'Art': 'bg-purple-500',
      'Social': 'bg-pink-500',
      'Gaming': 'bg-red-500',
      'Education': 'bg-indigo-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const sortHashtags = (hashtags, sortBy) => {
    return [...hashtags].sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return b.trending_score - a.trending_score;
        case 'posts':
          return b.posts - a.posts;
        case 'engagement':
          return (b.engagement.likes + b.engagement.comments + b.engagement.shares) - 
                 (a.engagement.likes + a.engagement.comments + a.engagement.shares);
        case 'alphabetical':
          return a.tag.localeCompare(b.tag);
        default:
          return b.trending_score - a.trending_score;
      }
    });
  };

  const getTopHashtags = (count = 5) => {
    return sortHashtags(trendingHashtags, 'trending').slice(0, count);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          <h2 className="text-xl font-bold">Trending Hashtags</h2>
        </div>
        <div className="flex gap-2">
          {['today', 'week', 'month'].map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe(period)}
              className="capitalize"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search hashtags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{trendingHashtags.length}</div>
            <div className="text-sm text-muted-foreground">Trending Now</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Hash className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{followedHashtags.size}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">
              {trendingHashtags.reduce((acc, h) => acc + h.posts, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">
              {Math.floor(Math.random() * 50000 + 100000).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Trending (Compact View) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fire className="h-5 w-5 text-red-500" />
            Top Trending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {getTopHashtags().map((hashtag, index) => (
              <motion.div
                key={hashtag.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onHashtagClick && onHashtagClick(hashtag.tag)}
                  className="gap-2"
                >
                  <span className="font-mono">#{hashtag.tag}</span>
                  <Badge variant="secondary" className="text-xs">
                    {hashtag.posts}
                  </Badge>
                  {getTrendIcon(hashtag.trend)}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hashtags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredHashtags.map((hashtag, index) => (
            <motion.div
              key={hashtag.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold font-mono">#{hashtag.tag}</span>
                      <Badge className={`${getCategoryColor(hashtag.category)} text-white`}>
                        {hashtag.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(hashtag.trend)}
                      <span className="text-sm font-medium text-green-600">{hashtag.trend}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{hashtag.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">{hashtag.posts.toLocaleString()}</div>
                      <div className="text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{hashtag.engagement.likes.toLocaleString()}</div>
                      <div className="text-muted-foreground">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{hashtag.engagement.comments.toLocaleString()}</div>
                      <div className="text-muted-foreground">Comments</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Recent Posts Preview */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Posts</h4>
                    <div className="space-y-2">
                      {hashtag.recent_posts.slice(0, 2).map((post, idx) => (
                        <div key={idx} className="text-xs p-2 bg-muted rounded">
                          <span className="font-medium">{post.author}:</span>
                          <span className="ml-1">{post.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Tags */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Related</h4>
                    <div className="flex flex-wrap gap-1">
                      {hashtag.related.map((related, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          #{related}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onHashtagClick && onHashtagClick(hashtag.tag)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Posts
                    </Button>
                    <Button
                      variant={followedHashtags.has(hashtag.id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleHashtagFollow(hashtag.id, hashtag.tag)}
                    >
                      <Star className={`h-3 w-3 mr-1 ${followedHashtags.has(hashtag.id) ? 'fill-current' : ''}`} />
                      {followedHashtags.has(hashtag.id) ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredHashtags.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hashtags found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default HashtagSystem;