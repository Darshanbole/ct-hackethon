import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Home,
  Bell,
  Mail,
  Bookmark,
  User,
  Users,
  Settings,
  TrendingUp,
  Trophy,
  Mic,
  DollarSign,
  Brain,
  MoreHorizontal,
  Plus,
  Globe,
  Wallet,
  Twitter,
} from "lucide-react";
import PostFeed from "./feed/PostFeed";
import PostCreator from "./post/PostCreator";
import SocialMediaHub from "./SocialMediaHubNew";
import CommunityFeatures from "./CommunityFeatures";
import AboutPlatform from "./AboutPlatform";
import NotificationsPanel from "./NotificationsPanel";
import MessagesPanel from "./MessagesPanel";
import UserProfile from "./UserProfile";
import RealTimeNotifications from "./notifications/RealTimeNotifications";
import ThemeSwitcher from "./theme/ThemeSwitcher";
import EnhancedSearch from "./search/EnhancedSearch";
import AchievementSystem from "./achievements/AchievementSystem";
import PWAInstallPrompt from "./pwa/PWAInstallPrompt";
import PWAStatus from "./pwa/PWAStatus";
import VoicePostCreator from "./voice/VoicePostCreator";
import CreatorMonetization from "./monetization/CreatorMonetization";
import AIFeatures from "./ai/AIFeatures";

const HomePage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("for-you");
  const [currentView, setCurrentView] = useState("home"); // home, social-hub, community, about, notifications, messages, profile, search, bookmarks, achievements, voice-post, monetization, ai-features
  const [posts, setPosts] = useState([]); // State to manage posts
  const [showRealTimeNotifications, setShowRealTimeNotifications] = useState(false);

  // Mock user data - use passed user or fallback
  const currentUser = user || {
    name: "John Doe",
    display_name: "John Doe",
    handle: "@johndoe",
    username: "johndoe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  };

  // Mock trending topics
  const trendingTopics = [
    { id: 1, category: "Technology", title: "#Blockchain", posts: "25.4K" },
    { id: 2, category: "Crypto", title: "#Shardeum", posts: "18.2K" },
    { id: 3, category: "Web3", title: "#dApps", posts: "12.7K" },
    { id: 4, category: "NFT", title: "#DigitalArt", posts: "9.3K" },
    { id: 5, category: "Finance", title: "#DeFi", posts: "7.8K" },
  ];

  // Mock who to follow
  const whoToFollow = [
    {
      id: 1,
      name: "Alice Smith",
      handle: "@alicesmith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      bio: "Blockchain developer and crypto enthusiast",
    },
    {
      id: 2,
      name: "Bob Johnson",
      handle: "@bobjohnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      bio: "NFT artist and digital creator",
    },
    {
      id: 3,
      name: "Carol Davis",
      handle: "@caroldavis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
      bio: "DeFi researcher and Web3 advocate",
    },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleHomeClick = () => {
    console.log("Home clicked");
    setActiveTab("for-you");
    setCurrentView("home");
  };

  const handleSocialHubClick = () => {
    console.log("Social Hub clicked");
    setCurrentView("social-hub");
  };

  const handleCommunityClick = () => {
    console.log("Community clicked");
    setCurrentView("community");
  };

  const handleAboutClick = () => {
    console.log("About clicked");
    setCurrentView("about");
  };

  const handleSearchClick = () => {
    console.log("Search clicked");
    setCurrentView("search");
  };

  const handleNotificationsClick = () => {
    console.log("Notifications clicked");
    setShowRealTimeNotifications(true);
    setCurrentView("notifications");
  };

  const handleMessagesClick = () => {
    console.log("Messages clicked");
    setCurrentView("messages");
  };

  const handleBookmarksClick = () => {
    console.log("Bookmarks clicked");
    setCurrentView("bookmarks");
  };

  const handleAchievementsClick = () => {
    console.log("Achievements clicked");
    setCurrentView("achievements");
  };

  const handleVoicePostClick = () => {
    console.log("Voice Post clicked");
    setCurrentView("voice-post");
  };

  const handleMonetizationClick = () => {
    console.log("Monetization clicked");
    setCurrentView("monetization");
  };

  const handleAIFeaturesClick = () => {
    console.log("AI Features clicked");
    setCurrentView("ai-features");
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
    setCurrentView("profile");
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
    setCurrentView("settings");
  };

  const handleWalletClick = () => {
    navigate("/wallet");
  };

  const handleTwitterClick = () => {
    navigate("/social/twitter");
  };

  const handleFollowClick = (userId) => {
    console.log(`Follow user ${userId}`);
    // Add follow functionality here
  };

  const handlePostClick = () => {
    console.log("Create post clicked");
    // Add create post functionality here
  };

  const handleNewPost = (newPost) => {
    // Add new post to the beginning of the posts array
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Social Hub</h1>
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant={activeTab === "for-you" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTabChange("for-you")}
                >
                  For You
                </Button>
                <Button
                  variant={activeTab === "following" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTabChange("following")}
                >
                  Following
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <PWAStatus />
              <ThemeSwitcher variant="compact" />
              <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar */}
          <div className="hidden md:block w-64 p-4 space-y-4">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleHomeClick}
              >
                <Home className="h-5 w-5 mr-3" />
                Home
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleSocialHubClick}
              >
                <Globe className="h-5 w-5 mr-3" />
                Social Hub
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleCommunityClick}
              >
                <Users className="h-5 w-5 mr-3" />
                Community
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleAboutClick}
              >
                <TrendingUp className="h-5 w-5 mr-3" />
                About Platform
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleWalletClick}
              >
                <Wallet className="h-5 w-5 mr-3" />
                Web3 Wallet
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleTwitterClick}
              >
                <Twitter className="h-5 w-5 mr-3" />
                DecentralTwitter
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleSearchClick}
              >
                <Search className="h-5 w-5 mr-3" />
                Search
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleNotificationsClick}
              >
                <Bell className="h-5 w-5 mr-3" />
                Notifications
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleMessagesClick}
              >
                <Mail className="h-5 w-5 mr-3" />
                Messages
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleBookmarksClick}
              >
                <Bookmark className="h-5 w-5 mr-3" />
                Bookmarks
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleAchievementsClick}
              >
                <Trophy className="h-5 w-5 mr-3" />
                Achievements
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleVoicePostClick}
              >
                <Mic className="h-5 w-5 mr-3" />
                Voice Post
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleMonetizationClick}
              >
                <DollarSign className="h-5 w-5 mr-3" />
                Monetization
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleAIFeaturesClick}
              >
                <Brain className="h-5 w-5 mr-3" />
                AI Features
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleProfileClick}
              >
                <User className="h-5 w-5 mr-3" />
                Profile
              </Button>
            </nav>

            <Button className="w-full" onClick={handlePostClick}>
              Post
            </Button>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={currentUser.avatar || currentUser.avatar_url} alt={currentUser.display_name || currentUser.name || 'User'} />
                    <AvatarFallback>
                      {(currentUser.display_name || currentUser.name || 'User')
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{currentUser.display_name || currentUser.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      @{currentUser.username || currentUser.handle?.replace('@', '') || 'user'}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onLogout}
                    className="text-xs"
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl mx-auto">
            {currentView === "home" ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 md:hidden">
                  <TabsTrigger value="for-you">For You</TabsTrigger>
                  <TabsTrigger value="following">Following</TabsTrigger>
                </TabsList>

                <TabsContent value="for-you" className="mt-0">
                  <PostCreator 
                    onPostCreated={handleNewPost}
                    userAvatar={currentUser.avatar}
                    userName={currentUser.display_name || currentUser.name}
                  />
                  <PostFeed posts={posts} />
                </TabsContent>

                <TabsContent value="following" className="mt-0">
                  <PostCreator 
                    onPostCreated={handleNewPost}
                    userAvatar={currentUser.avatar}
                    userName={currentUser.display_name || currentUser.name}
                  />
                  <PostFeed posts={posts} />
                </TabsContent>
              </Tabs>
            ) : currentView === "social-hub" ? (
              <SocialMediaHub />
            ) : currentView === "community" ? (
              <CommunityFeatures onBack={() => setCurrentView("home")} />
            ) : currentView === "about" ? (
              <AboutPlatform onBack={() => setCurrentView("home")} />
            ) : currentView === "notifications" ? (
              <NotificationsPanel onBack={() => setCurrentView("home")} />
            ) : currentView === "messages" ? (
              <MessagesPanel onBack={() => setCurrentView("home")} />
            ) : currentView === "profile" ? (
              <UserProfile onBack={() => setCurrentView("home")} user={currentUser} />
            ) : currentView === "search" ? (
              <EnhancedSearch onClose={() => setCurrentView("home")} />
            ) : currentView === "bookmarks" ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Bookmarks</h2>
                  <p className="text-muted-foreground">Your saved posts will appear here</p>
                </div>
              </div>
            ) : currentView === "achievements" ? (
              <AchievementSystem onClose={() => setCurrentView("home")} />
            ) : currentView === "voice-post" ? (
              <VoicePostCreator 
                onClose={() => setCurrentView("home")} 
                onSubmit={(voicePost) => {
                  console.log('Voice post created:', voicePost);
                  setCurrentView("home");
                }}
              />
            ) : currentView === "monetization" ? (
              <CreatorMonetization />
            ) : currentView === "ai-features" ? (
              <AIFeatures />
            ) : currentView === "settings" ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Settings</h2>
                  <p className="text-muted-foreground">Manage your account and preferences</p>
                  
                  <div className="mt-6 space-y-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Appearance</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose your preferred theme and color scheme
                      </p>
                      <ThemeSwitcher />
                    </Card>
                    
                    <Button className="mt-4" onClick={() => setCurrentView("profile")}>
                      Go to Profile
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <SocialMediaHub />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-80 p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics, people..."
                className="pl-10"
                onFocus={handleSearchClick}
              />
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-5 w-5" />
                  <h3 className="font-semibold">Trending</h3>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic) => (
                    <div key={topic.id} className="cursor-pointer hover:bg-accent/50 p-2 rounded-md transition-colors">
                      <p className="text-xs text-muted-foreground">
                        {topic.category}
                      </p>
                      <p className="font-medium">{topic.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {topic.posts} posts
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Who to follow</h3>
                <div className="space-y-3">
                  {whoToFollow.map((person) => (
                    <div key={person.id} className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={person.avatar} alt={person.name} />
                        <AvatarFallback>
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {person.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {person.handle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {person.bio}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleFollowClick(person.id)}
                      >
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 text-xs text-muted-foreground">
              <div className="flex flex-wrap gap-2">
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
                <a href="#" className="hover:underline">
                  Cookie Policy
                </a>
                <a href="#" className="hover:underline">
                  Accessibility
                </a>
                <a href="#" className="hover:underline">
                  Ads info
                </a>
                <a href="#" className="hover:underline">
                  More
                </a>
              </div>
              <p className="mt-2">© 2023 Decentralized, Inc.</p>
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around p-2 z-20">
            <Button variant="ghost" size="icon" onClick={handleHomeClick}>
              <Home className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSearchClick}>
              <Search className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNotificationsClick}>
              <Bell className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleMessagesClick}>
              <Mail className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleProfileClick}>
              <User className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile Post Button */}
          <Button 
            className="md:hidden fixed bottom-16 right-4 rounded-full w-14 h-14 shadow-lg z-20 p-0"
            onClick={handlePostClick}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Real-Time Notifications Overlay */}
        <RealTimeNotifications
          user={currentUser}
          isOpen={showRealTimeNotifications}
          onClose={() => setShowRealTimeNotifications(false)}
        />
      </div>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default HomePage;