import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import NFTProfilePictures from "./nft/NFTProfilePictures";
import {
  Edit,
  Camera,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Users,
  Heart,
  MessageSquare,
  Share2,
  Settings,
  Wallet,
  Award,
  TrendingUp,
  Star,
  BookOpen,
  Code,
  Briefcase,
  Globe,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

const UserProfile = ({ onBack, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [showNFTSelector, setShowNFTSelector] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  
  // Mock user data - in real app this would come from props or API
  const currentUser = user || {
    name: "Darshan Bole",
    username: "@darshanbole",
    email: "darshanbole69@gmail.com",
    bio: "Web3 developer and blockchain enthusiast. Building the future of decentralized social media. Always learning, always coding.",
    location: "Mumbai, India",
    website: "https://darshanbole.dev",
    joinedDate: "September 2023",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=darshan",
    coverImage: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&q=80",
    followers: 1247,
    following: 892,
    posts: 156,
    walletAddress: "0x742d35Cc6473C12E48Aa0742",
    verificationLevel: "Gold",
    badges: ["Early Adopter", "Top Contributor", "Web3 Expert"],
    interests: ["Blockchain", "DeFi", "NFTs", "Smart Contracts", "Web3 Development"],
  };

  const [editData, setEditData] = useState({
    name: currentUser.name,
    bio: currentUser.bio,
    location: currentUser.location,
    website: currentUser.website,
  });

  const stats = [
    { label: "Posts", value: currentUser.posts || 0, icon: <MessageSquare className="h-4 w-4" /> },
    { label: "Followers", value: (currentUser.followers || 0).toLocaleString(), icon: <Users className="h-4 w-4" /> },
    { label: "Following", value: (currentUser.following || 0).toLocaleString(), icon: <Heart className="h-4 w-4" /> },
    { label: "Reputation", value: "4.8", icon: <Star className="h-4 w-4" /> },
  ];

  const achievements = [
    {
      title: "Early Adopter",
      description: "Joined during the platform's beta phase",
      icon: <Award className="h-6 w-6 text-purple-500" />,
      date: "Sep 2023",
    },
    {
      title: "Top Contributor",
      description: "Posted 100+ high-quality posts",
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      date: "Nov 2023",
    },
    {
      title: "Web3 Expert",
      description: "Verified expertise in blockchain technology",
      icon: <Code className="h-6 w-6 text-blue-500" />,
      date: "Dec 2023",
    },
  ];

  const recentPosts = [
    {
      id: 1,
      content: "Just deployed my first smart contract on Shardeum! The transaction fees are incredibly low compared to Ethereum. #Web3 #Blockchain",
      timestamp: "2 hours ago",
      likes: 23,
      comments: 5,
      shares: 3,
    },
    {
      id: 2,
      content: "Building decentralized social media platforms requires a different mindset. User ownership and privacy should be the core principles.",
      timestamp: "1 day ago",
      likes: 45,
      comments: 12,
      shares: 8,
    },
    {
      id: 3,
      content: "Excited to share my latest blog post about DeFi yield farming strategies for 2025. Link in comments!",
      timestamp: "3 days ago",
      likes: 67,
      comments: 18,
      shares: 15,
    },
  ];

  const handleSave = () => {
    // In real app, this would update the user profile via API
    console.log("Saving profile data:", editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: currentUser.name,
      bio: currentUser.bio,
      location: currentUser.location,
      website: currentUser.website,
    });
    setIsEditing(false);
  };

  const handleNFTSelect = (nft) => {
    setSelectedNFT(nft);
    console.log('Selected NFT as profile picture:', nft);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg overflow-hidden">
          <img
            src={currentUser.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <Button
            variant="ghost"
            className="absolute top-4 left-4 text-white hover:bg-white/20"
            onClick={onBack}
          >
            ← Back
          </Button>
          <Button
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            <Camera className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        </div>

        {/* Profile Header */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4 sm:mb-0">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage 
                  src={selectedNFT?.image || currentUser.avatar} 
                  alt={currentUser.name} 
                />
                <AvatarFallback className="text-2xl">
                  {currentUser.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {selectedNFT && (
                <Badge className="absolute top-0 right-0 bg-purple-500 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  NFT
                </Badge>
              )}
              <div className="absolute bottom-0 right-0 flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full w-8 h-8"
                  onClick={() => setShowNFTSelector(true)}
                  title="Choose NFT Avatar"
                >
                  <Sparkles className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full w-8 h-8"
                  title="Upload Photo"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {!isEditing ? (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold">{currentUser.name}</h1>
                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {currentUser.verificationLevel}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">{currentUser.username}</p>
                  <p className="mb-3">{currentUser.bio}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{currentUser.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <LinkIcon className="h-4 w-4" />
                      <a href={currentUser.website} className="text-blue-600 hover:underline">
                        {currentUser.website}
                      </a>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {currentUser.joinedDate}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={editData.website}
                        onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {!isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2 text-purple-500">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs Content */}
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="interests">Interests</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {recentPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <p className="mb-4">{post.content}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{post.timestamp}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="h-4 w-4" />
                          <span>{post.shares}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              {achievements.map((achievement, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-muted rounded-lg">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{achievement.title}</h3>
                        <p className="text-muted-foreground mb-2">{achievement.description}</p>
                        <p className="text-sm text-muted-foreground">Earned {achievement.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="wallet" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5" />
                    <span>Wallet Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Wallet Address</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="bg-muted px-3 py-2 rounded text-sm font-mono">
                        {currentUser.walletAddress}...
                      </code>
                      <Button size="sm" variant="outline">Copy</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">156</div>
                        <div className="text-sm text-muted-foreground">Total Transactions</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">0.45 ETH</div>
                        <div className="text-sm text-muted-foreground">Total Earned</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Interests & Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* NFT Profile Picture Selector */}
      <NFTProfilePictures
        user={currentUser}
        isOpen={showNFTSelector}
        onClose={() => setShowNFTSelector(false)}
        onNFTSelect={handleNFTSelect}
      />
    </div>
  );
};

export default UserProfile;