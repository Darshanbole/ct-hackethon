import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  MessageSquare,
  TrendingUp,
  Users,
  Globe,
  Zap,
  Camera,
  Video,
  Music,
  Share2,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Plus,
  Send,
  Link,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SocialMediaHub = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState({});
  const [isPosting, setIsPosting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const socialPlatforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram className="h-6 w-6" />,
      color: "from-purple-400 to-pink-400",
      description: "Share photos and stories",
      features: ["Photos", "Stories", "Reels", "IGTV"],
      connected: false,
      stats: { followers: "1.2K", posts: 45, engagement: "3.2%" }
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
      description: "Connect with friends and family",
      features: ["Posts", "Stories", "Pages", "Groups"],
      connected: false,
      stats: { followers: "856", posts: 23, engagement: "2.8%" }
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: <Twitter className="h-6 w-6" />,
      color: "from-sky-400 to-blue-500",
      description: "Share thoughts and engage in conversations",
      features: ["Tweets", "Threads", "Spaces", "Lists"],
      connected: false,
      stats: { followers: "2.1K", posts: 156, engagement: "4.1%" }
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: <Youtube className="h-6 w-6" />,
      color: "from-red-500 to-red-600",
      description: "Create and share videos",
      features: ["Videos", "Shorts", "Live", "Community"],
      connected: false,
      stats: { subscribers: "578", videos: 12, views: "15.3K" }
    },
    {
      id: "threads",
      name: "Threads",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "from-gray-800 to-black",
      description: "Text-based conversations",
      features: ["Threads", "Replies", "Mentions", "Following"],
      connected: false,
      stats: { followers: "432", posts: 67, engagement: "5.2%" }
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: <Music className="h-6 w-6" />,
      color: "from-pink-500 to-purple-600",
      description: "Short-form video content",
      features: ["Videos", "Effects", "Sounds", "Duets"],
      connected: false,
      stats: { followers: "3.4K", videos: 89, likes: "45.2K" }
    }
  ];

  const [platforms, setPlatforms] = useState(socialPlatforms);

  useEffect(() => {
    // Simulate loading connected accounts
    setTimeout(() => {
      setLoading(false);
      // Simulate some connected accounts
      const updatedPlatforms = platforms.map(platform => ({
        ...platform,
        connected: Math.random() > 0.7 // Randomly connect some platforms
      }));
      setPlatforms(updatedPlatforms);
      
      const connected = updatedPlatforms.filter(p => p.connected);
      setConnectedAccounts(connected);
      
      // Initialize selectedPlatforms state
      const initialSelected = {};
      connected.forEach(platform => {
        initialSelected[platform.id] = true;
      });
      setSelectedPlatforms(initialSelected);
    }, 1500);
  }, []);

  const handleConnectPlatform = async (platformId) => {
    try {
      // Simulate connecting to platform
      alert(`Connecting to ${platformId}... This would open OAuth flow in a real app.`);
      
      // Update platform connection status
      const updatedPlatforms = platforms.map(platform => 
        platform.id === platformId 
          ? { ...platform, connected: true }
          : platform
      );
      setPlatforms(updatedPlatforms);
      
      const connected = updatedPlatforms.filter(p => p.connected);
      setConnectedAccounts(connected);
      
      // Add to selected platforms
      setSelectedPlatforms(prev => ({
        ...prev,
        [platformId]: true
      }));
      
    } catch (error) {
      alert("Failed to connect platform. Please try again.");
    }
  };

  const handleDisconnectPlatform = async (platformId) => {
    try {
      // Update platform connection status
      const updatedPlatforms = platforms.map(platform => 
        platform.id === platformId 
          ? { ...platform, connected: false }
          : platform
      );
      setPlatforms(updatedPlatforms);
      
      const connected = updatedPlatforms.filter(p => p.connected);
      setConnectedAccounts(connected);
      
      // Remove from selected platforms
      setSelectedPlatforms(prev => {
        const updated = { ...prev };
        delete updated[platformId];
        return updated;
      });
      
    } catch (error) {
      alert("Failed to disconnect platform. Please try again.");
    }
  };

  const handlePostToSocial = async () => {
    if (!postContent.trim()) {
      alert("Please enter some content to post!");
      return;
    }

    const selectedPlatformsList = Object.keys(selectedPlatforms).filter(
      key => selectedPlatforms[key]
    );

    if (selectedPlatformsList.length === 0) {
      alert("Please select at least one platform to post to!");
      return;
    }

    setIsPosting(true);

    try {
      // Simulate API call to post to multiple platforms
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a new post entry
      const newPost = {
        id: Date.now(),
        content: postContent,
        platforms: selectedPlatformsList,
        timestamp: new Date(),
        status: "published",
        interactions: {
          likes: 0,
          comments: 0,
          shares: 0
        }
      };
      
      setPosts(prev => [newPost, ...prev]);
      setPostContent("");
      
      alert(`Successfully posted to ${selectedPlatformsList.length} platform(s)!`);
      
    } catch (error) {
      alert("Failed to post to social media. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPlatformIcon = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.icon : <Globe className="h-4 w-4" />;
  };

  const getPlatformColor = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.color : "from-gray-400 to-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Social Media Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Social Media Hub
          </h1>
          <p className="text-muted-foreground">
            Manage all your social media accounts from one place
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Connected Accounts
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{connectedAccounts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +{connectedAccounts.length > 0 ? 1 : 0} from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Posts
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +{posts.length} this session
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Engagement Rate
                  </CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.7%</div>
                  <p className="text-xs text-muted-foreground">
                    +0.3% from last week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No posts yet. Create your first post!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-foreground">{post.content}</p>
                          <Badge variant="secondary" className="ml-2">
                            {post.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <span>Posted to:</span>
                            <div className="flex space-x-1">
                              {post.platforms.map((platformId) => (
                                <div
                                  key={platformId}
                                  className={`p-1 rounded bg-gradient-to-r ${getPlatformColor(platformId)}`}
                                >
                                  {getPlatformIcon(platformId)}
                                </div>
                              ))}
                            </div>
                          </div>
                          <span>{formatDate(post.timestamp)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compose" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What's on your mind?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[120px]"
                />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Select Platforms:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {connectedAccounts.map((platform) => (
                      <div
                        key={platform.id}
                        className="flex items-center space-x-2 p-3 border border-border rounded-lg"
                      >
                        <Switch
                          checked={selectedPlatforms[platform.id] || false}
                          onCheckedChange={(checked) =>
                            setSelectedPlatforms(prev => ({
                              ...prev,
                              [platform.id]: checked
                            }))
                          }
                        />
                        <div className={`p-2 rounded bg-gradient-to-r ${platform.color}`}>
                          {platform.icon}
                        </div>
                        <span className="text-sm font-medium">{platform.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {connectedAccounts.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You need to connect at least one social media account to post.
                      Go to the Accounts tab to connect your accounts.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handlePostToSocial}
                  disabled={isPosting || connectedAccounts.length === 0}
                  className="w-full"
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Post to Selected Platforms
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {platforms.map((platform) => (
                <motion.div
                  key={platform.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-5`} />
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${platform.color}`}>
                            {platform.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{platform.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {platform.description}
                            </p>
                          </div>
                        </div>
                        {platform.connected && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {platform.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {platform.connected && (
                        <div className="grid grid-cols-3 gap-2 text-center">
                          {Object.entries(platform.stats).map(([key, value]) => (
                            <div key={key} className="p-2 bg-muted rounded-lg">
                              <div className="text-sm font-semibold">{value}</div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {key}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        variant={platform.connected ? "outline" : "default"}
                        className="w-full"
                        onClick={() =>
                          platform.connected
                            ? handleDisconnectPlatform(platform.id)
                            : handleConnectPlatform(platform.id)
                        }
                      >
                        {platform.connected ? (
                          <>
                            <Link className="mr-2 h-4 w-4" />
                            Disconnect
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Connect
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {connectedAccounts.map((platform) => (
                      <div key={platform.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded bg-gradient-to-r ${platform.color}`}>
                            {platform.icon}
                          </div>
                          <span className="font-medium">{platform.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {platform.stats.followers || platform.stats.subscribers} followers
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {platform.stats.engagement || '3.2%'} engagement
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics data will appear here</p>
                    <p className="text-sm">Connect more accounts to see insights</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocialMediaHub;