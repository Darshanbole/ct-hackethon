import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  User,
  Hash,
  FileText,
  Users,
  Calendar,
  MapPin,
  TrendingUp,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Verified,
  X,
  History,
  Bookmark,
  Star
} from 'lucide-react';

const EnhancedSearch = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    sortBy: 'relevance',
    userType: 'all',
    contentType: 'all'
  });
  const [searchResults, setSearchResults] = useState({
    posts: [],
    users: [],
    hashtags: [],
    communities: []
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  // Mock search data
  const mockSearchResults = {
    posts: [
      {
        id: 1,
        author: {
          name: 'Alex Johnson',
          username: '@alexj',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
          verified: true
        },
        content: 'Just deployed my first Web3 social dApp! The future of decentralized communication is here. #Web3 #Blockchain #dApps',
        timestamp: '2 hours ago',
        likes: 145,
        comments: 23,
        shares: 12,
        hashtags: ['Web3', 'Blockchain', 'dApps'],
        type: 'text'
      },
      {
        id: 2,
        author: {
          name: 'Sarah Chen',
          username: '@sarahc',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          verified: false
        },
        content: 'Exploring the world of DeFi yield farming. The returns are impressive but remember to DYOR! 📈',
        timestamp: '4 hours ago',
        likes: 89,
        comments: 15,
        shares: 7,
        hashtags: ['DeFi', 'YieldFarming', 'DYOR'],
        type: 'text',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80'
      },
      {
        id: 3,
        author: {
          name: 'Dev Mike',
          username: '@devmike',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
          verified: true
        },
        content: 'Building on Shardeum has been an incredible experience. The gas fees are practically zero! ⚡',
        timestamp: '1 day ago',
        likes: 234,
        comments: 45,
        shares: 28,
        hashtags: ['Shardeum', 'LowFees', 'Building'],
        type: 'text'
      }
    ],
    users: [
      {
        id: 1,
        name: 'Blockchain Alice',
        username: '@blockchainalice',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        bio: 'Blockchain developer and Web3 enthusiast. Building the future one smart contract at a time.',
        followers: 12500,
        following: 892,
        verified: true,
        badges: ['Developer', 'Early Adopter']
      },
      {
        id: 2,
        name: 'Crypto Bob',
        username: '@cryptobob',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
        bio: 'DeFi researcher and yield farming expert. Sharing alpha and market insights.',
        followers: 8934,
        following: 456,
        verified: false,
        badges: ['Trader', 'Analyst']
      },
      {
        id: 3,
        name: 'NFT Carol',
        username: '@nftcarol',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
        bio: 'Digital artist and NFT creator. Exploring the intersection of art and technology.',
        followers: 15623,
        following: 234,
        verified: true,
        badges: ['Artist', 'Creator']
      }
    ],
    hashtags: [
      {
        id: 1,
        tag: 'Web3',
        posts: 12547,
        trend: '+32%',
        description: 'The next generation of the internet built on blockchain'
      },
      {
        id: 2,
        tag: 'DeFi',
        posts: 8934,
        trend: '+28%',
        description: 'Decentralized Finance protocols and applications'
      },
      {
        id: 3,
        tag: 'NFT',
        posts: 15623,
        trend: '+15%',
        description: 'Non-Fungible Tokens and digital collectibles'
      }
    ],
    communities: [
      {
        id: 1,
        name: 'Web3 Builders',
        description: 'A community for developers building on Web3 technologies',
        members: 5420,
        posts: 892,
        avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&q=80',
        category: 'Technology'
      },
      {
        id: 2,
        name: 'DeFi Farmers',
        description: 'Yield farming strategies and DeFi protocol discussions',
        members: 3241,
        posts: 567,
        avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&q=80',
        category: 'Finance'
      }
    ]
  };

  const mockSuggestions = [
    'Web3 development',
    'DeFi protocols',
    'NFT marketplace',
    'Blockchain scaling',
    'Smart contracts',
    'Yield farming',
    'Crypto trading',
    'dApp development'
  ];

  useEffect(() => {
    // Focus search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    // Load recent searches
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setIsSearching(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        performSearch(query);
        setIsSearching(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setSearchResults({ posts: [], users: [], hashtags: [], communities: [] });
      setSuggestions([]);
    }
  }, [query, filters]);

  useEffect(() => {
    if (query.length > 2 && !isSearching) {
      // Generate suggestions based on query
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query, isSearching]);

  const performSearch = (searchQuery) => {
    // Simulate search API call
    const results = {
      posts: mockSearchResults.posts.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
      users: mockSearchResults.users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      hashtags: mockSearchResults.hashtags.filter(hashtag =>
        hashtag.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hashtag.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      communities: mockSearchResults.communities.filter(community =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };

    setSearchResults(results);
    saveRecentSearch(searchQuery);
  };

  const saveRecentSearch = (searchQuery) => {
    const newRecentSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 10);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getTotalResults = () => {
    return searchResults.posts.length + 
           searchResults.users.length + 
           searchResults.hashtags.length + 
           searchResults.communities.length;
  };

  const renderPostResult = (post) => (
    <Card key={post.id} className="hover:shadow-md transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{post.author.name}</span>
              <span className="text-muted-foreground">{post.author.username}</span>
              {post.author.verified && <Verified className="h-4 w-4 text-blue-500" />}
              <span className="text-sm text-muted-foreground">• {post.timestamp}</span>
            </div>
            <p className="text-sm mb-2">{post.content}</p>
            {post.image && (
              <img src={post.image} alt="Post" className="rounded-md w-full max-w-md h-40 object-cover mb-2" />
            )}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {post.comments}
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                {post.shares}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {post.hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderUserResult = (user) => (
    <Card key={user.id} className="hover:shadow-md transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{user.name}</span>
              <span className="text-muted-foreground">{user.username}</span>
              {user.verified && <Verified className="h-4 w-4 text-blue-500" />}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{user.bio}</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{user.followers.toLocaleString()} followers</span>
              <span>{user.following.toLocaleString()} following</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {user.badges.map((badge, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
          <Button size="sm">Follow</Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderHashtagResult = (hashtag) => (
    <Card key={hashtag.id} className="hover:shadow-md transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hash className="h-4 w-4" />
              <span className="font-semibold">#{hashtag.tag}</span>
              <Badge className="bg-green-500 text-white text-xs">
                {hashtag.trend}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{hashtag.description}</p>
            <span className="text-sm text-muted-foreground">
              {hashtag.posts.toLocaleString()} posts
            </span>
          </div>
          <Button size="sm" variant="outline">
            <Star className="h-3 w-3 mr-1" />
            Follow
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCommunityResult = (community) => (
    <Card key={community.id} className="hover:shadow-md transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={community.avatar} />
            <AvatarFallback>{community.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{community.name}</span>
              <Badge variant="secondary" className="text-xs">
                {community.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{community.description}</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {community.members.toLocaleString()} members
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {community.posts} posts
              </span>
            </div>
          </div>
          <Button size="sm">Join</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search for posts, users, hashtags, communities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Suggestions</h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuery(suggestion)}
                    className="text-left"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Recent Searches
                </h3>
                <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(search)}
                    className="text-left"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {search}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {query && (
          <>
            {/* Filters and Results Count */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {getTotalResults()} results for "{query}"
                </span>
                {isSearching && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Searching...
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">
                  All ({getTotalResults()})
                </TabsTrigger>
                <TabsTrigger value="posts">
                  Posts ({searchResults.posts.length})
                </TabsTrigger>
                <TabsTrigger value="users">
                  People ({searchResults.users.length})
                </TabsTrigger>
                <TabsTrigger value="hashtags">
                  Hashtags ({searchResults.hashtags.length})
                </TabsTrigger>
                <TabsTrigger value="communities">
                  Communities ({searchResults.communities.length})
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[600px] mt-4">
                <TabsContent value="all" className="space-y-4">
                  {/* Mixed results */}
                  <AnimatePresence>
                    {searchResults.posts.slice(0, 3).map(post => (
                      <motion.div
                        key={`post-${post.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {renderPostResult(post)}
                      </motion.div>
                    ))}
                    {searchResults.users.slice(0, 2).map(user => (
                      <motion.div
                        key={`user-${user.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {renderUserResult(user)}
                      </motion.div>
                    ))}
                    {searchResults.hashtags.slice(0, 2).map(hashtag => (
                      <motion.div
                        key={`hashtag-${hashtag.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {renderHashtagResult(hashtag)}
                      </motion.div>
                    ))}
                    {searchResults.communities.map(community => (
                      <motion.div
                        key={`community-${community.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {renderCommunityResult(community)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="posts" className="space-y-4">
                  <AnimatePresence>
                    {searchResults.posts.map(post => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {renderPostResult(post)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                  <AnimatePresence>
                    {searchResults.users.map(user => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {renderUserResult(user)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="hashtags" className="space-y-4">
                  <AnimatePresence>
                    {searchResults.hashtags.map(hashtag => (
                      <motion.div
                        key={hashtag.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {renderHashtagResult(hashtag)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="communities" className="space-y-4">
                  <AnimatePresence>
                    {searchResults.communities.map(community => (
                      <motion.div
                        key={community.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {renderCommunityResult(community)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            {getTotalResults() === 0 && !isSearching && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedSearch;