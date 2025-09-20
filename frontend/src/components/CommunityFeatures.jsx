import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  MessageCircle,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  ExternalLink,
  Heart,
  Share2,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Star,
} from "lucide-react";

const CommunityFeatures = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [newPost, setNewPost] = useState("");

  // Mock community data
  const communityStats = {
    totalMembers: 12847,
    activeToday: 2341,
    postsToday: 567,
    onlineNow: 892,
  };

  const communityGroups = [
    {
      id: 1,
      name: "Blockchain Developers",
      members: 3247,
      description: "Connect with fellow blockchain developers, share code, and collaborate on Web3 projects.",
      image: "https://api.dicebear.com/7.x/identicon/svg?seed=blockchain",
      tags: ["Development", "Blockchain", "Web3"],
      isJoined: true,
    },
    {
      id: 2,
      name: "NFT Creators",
      members: 1856,
      description: "A space for NFT artists and creators to showcase work and discuss trends.",
      image: "https://api.dicebear.com/7.x/identicon/svg?seed=nft",
      tags: ["NFT", "Art", "Creative"],
      isJoined: false,
    },
    {
      id: 3,
      name: "DeFi Enthusiasts",
      members: 2943,
      description: "Discuss yield farming, liquidity pools, and the latest DeFi protocols.",
      image: "https://api.dicebear.com/7.x/identicon/svg?seed=defi",
      tags: ["DeFi", "Finance", "Investment"],
      isJoined: true,
    },
    {
      id: 4,
      name: "Metaverse Builders",
      members: 1234,
      description: "Building the virtual worlds of tomorrow with AR/VR and blockchain technology.",
      image: "https://api.dicebear.com/7.x/identicon/svg?seed=metaverse",
      tags: ["Metaverse", "VR", "Gaming"],
      isJoined: false,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Web3 Developer Meetup",
      date: "2025-09-25",
      time: "18:00",
      location: "Virtual Event",
      attendees: 156,
      type: "Meetup",
    },
    {
      id: 2,
      title: "NFT Art Exhibition",
      date: "2025-09-28",
      time: "15:00",
      location: "Metaverse Gallery",
      attendees: 89,
      type: "Exhibition",
    },
    {
      id: 3,
      title: "DeFi Protocol Launch",
      date: "2025-10-02",
      time: "14:00",
      location: "Online",
      attendees: 234,
      type: "Launch",
    },
  ];

  const topContributors = [
    {
      id: 1,
      name: "Alice Chen",
      username: "@alicechen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      contributions: 145,
      badges: ["Top Contributor", "Web3 Expert"],
    },
    {
      id: 2,
      name: "Bob Wilson",
      username: "@bobwilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      contributions: 132,
      badges: ["NFT Pioneer", "Community Helper"],
    },
    {
      id: 3,
      name: "Carol Davis",
      username: "@caroldavis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
      contributions: 98,
      badges: ["DeFi Specialist", "Active Member"],
    },
  ];

  const discussions = [
    {
      id: 1,
      title: "What's the future of Layer 2 scaling solutions?",
      author: "techguru42",
      replies: 23,
      lastActivity: "2 hours ago",
      tags: ["Layer2", "Scaling", "Ethereum"],
      isHot: true,
    },
    {
      id: 2,
      title: "Best practices for NFT smart contract security",
      author: "securityexpert",
      replies: 15,
      lastActivity: "4 hours ago",
      tags: ["Security", "Smart Contracts", "NFT"],
      isHot: false,
    },
    {
      id: 3,
      title: "DeFi yield farming strategies for 2025",
      author: "yieldmaster",
      replies: 31,
      lastActivity: "6 hours ago",
      tags: ["DeFi", "Yield Farming", "Strategy"],
      isHot: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                ← Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Community Hub</h1>
                <p className="text-muted-foreground">
                  Connect, collaborate, and grow with the Web3 community
                </p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{communityStats.totalMembers.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{communityStats.activeToday.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{communityStats.postsToday}</p>
                  <p className="text-sm text-muted-foreground">Posts Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-2xl font-bold">{communityStats.onlineNow}</p>
                  <p className="text-sm text-muted-foreground">Online Now</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="contributors">Contributors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Featured Groups */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Featured Communities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {communityGroups.slice(0, 3).map((group) => (
                      <div key={group.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={group.image} alt={group.name} />
                          <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{group.name}</h3>
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-sm text-muted-foreground">
                              {group.members.toLocaleString()} members
                            </span>
                            <div className="flex space-x-1">
                              {group.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={group.isJoined ? "secondary" : "default"}
                        >
                          {group.isJoined ? "Joined" : "Join"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="ghost">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Discussion
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      <Calendar className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      <Users className="h-4 w-4 mr-2" />
                      Find Communities
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      <Award className="h-4 w-4 mr-2" />
                      View Leaderboard
                    </Button>
                  </CardContent>
                </Card>

                {/* Top Contributors Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Contributors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topContributors.slice(0, 3).map((contributor, index) => (
                        <div key={contributor.id} className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contributor.avatar} alt={contributor.name} />
                            <AvatarFallback>{contributor.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{contributor.name}</p>
                            <p className="text-xs text-muted-foreground">{contributor.contributions} contributions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search communities..." className="pl-10 w-80" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={group.image} alt={group.name} />
                        <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.members.toLocaleString()} members</p>
                      </div>
                    </div>
                    <p className="text-sm mb-4">{group.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {group.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      className="w-full"
                      variant={group.isJoined ? "secondary" : "default"}
                    >
                      {group.isJoined ? "Joined" : "Join Community"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <Button size="sm">RSVP</Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{event.date} at {event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discussions" className="space-y-6">
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <Card key={discussion.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{discussion.title}</h3>
                          {discussion.isHot && (
                            <Badge variant="destructive" className="text-xs">
                              🔥 Hot
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          by @{discussion.author} • {discussion.lastActivity}
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{discussion.replies} replies</span>
                          </div>
                          <div className="flex space-x-1">
                            {discussion.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Join Discussion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contributors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topContributors.map((contributor, index) => (
                <Card key={contributor.id}>
                  <CardContent className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={contributor.avatar} alt={contributor.name} />
                        <AvatarFallback>{contributor.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg">{contributor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{contributor.username}</p>
                    <p className="text-sm mb-4">{contributor.contributions} contributions</p>
                    <div className="flex flex-wrap justify-center gap-1 mb-4">
                      {contributor.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" className="w-full">
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityFeatures;