import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Trophy,
  Star,
  Crown,
  Medal,
  Target,
  Zap,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Calendar,
  Clock,
  Gift,
  Sparkles,
  Award,
  CheckCircle,
  Lock,
  X
} from 'lucide-react';

const AchievementSystem = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    level: 12,
    xp: 8750,
    xpToNext: 1250,
    totalXp: 10000,
    reputation: 4.8,
    rank: 234,
    totalUsers: 15420,
    achievements: 23,
    totalAchievements: 45
  });

  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [milestones, setMilestones] = useState([]);

  // Mock achievements data
  const mockAchievements = [
    {
      id: 1,
      title: "First Post",
      description: "Create your very first post",
      icon: "🎯",
      category: "Getting Started",
      rarity: "common",
      xpReward: 100,
      unlocked: true,
      unlockedAt: "2024-01-15",
      progress: 100,
      maxProgress: 1
    },
    {
      id: 2,
      title: "Social Butterfly",
      description: "Follow 50 users",
      icon: "🦋",
      category: "Social",
      rarity: "common",
      xpReward: 250,
      unlocked: true,
      unlockedAt: "2024-02-03",
      progress: 100,
      maxProgress: 50
    },
    {
      id: 3,
      title: "Content Creator",
      description: "Create 100 posts",
      icon: "📝",
      category: "Content",
      rarity: "uncommon",
      xpReward: 500,
      unlocked: true,
      unlockedAt: "2024-03-12",
      progress: 100,
      maxProgress: 100
    },
    {
      id: 4,
      title: "Engagement Master",
      description: "Get 1000 likes on your posts",
      icon: "❤️",
      category: "Engagement",
      rarity: "rare",
      xpReward: 750,
      unlocked: true,
      unlockedAt: "2024-04-20",
      progress: 100,
      maxProgress: 1000
    },
    {
      id: 5,
      title: "NFT Collector",
      description: "Set an NFT as your profile picture",
      icon: "🖼️",
      category: "Web3",
      rarity: "uncommon",
      xpReward: 300,
      unlocked: true,
      unlockedAt: "2024-05-08",
      progress: 100,
      maxProgress: 1
    },
    {
      id: 6,
      title: "Community Builder",
      description: "Create a community with 100+ members",
      icon: "🏗️",
      category: "Community",
      rarity: "epic",
      xpReward: 1000,
      unlocked: false,
      progress: 67,
      maxProgress: 100
    },
    {
      id: 7,
      title: "Viral Post",
      description: "Create a post with 10,000+ likes",
      icon: "🚀",
      category: "Engagement",
      rarity: "legendary",
      xpReward: 2000,
      unlocked: false,
      progress: 3420,
      maxProgress: 10000
    },
    {
      id: 8,
      title: "Early Adopter",
      description: "Join in the first 1000 users",
      icon: "🌟",
      category: "Platform",
      rarity: "legendary",
      xpReward: 1500,
      unlocked: true,
      unlockedAt: "2024-01-01",
      progress: 100,
      maxProgress: 1
    },
    {
      id: 9,
      title: "Theme Explorer",
      description: "Try all available themes",
      icon: "🎨",
      category: "Customization",
      rarity: "uncommon",
      xpReward: 200,
      unlocked: true,
      unlockedAt: "2024-06-15",
      progress: 100,
      maxProgress: 6
    },
    {
      id: 10,
      title: "Crypto Tipper",
      description: "Send 10 crypto tips to creators",
      icon: "💰",
      category: "Web3",
      rarity: "rare",
      xpReward: 600,
      unlocked: false,
      progress: 3,
      maxProgress: 10
    }
  ];

  // Mock leaderboard data
  const mockLeaderboard = [
    {
      id: 1,
      rank: 1,
      name: "Alex Johnson",
      username: "@alexj",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      level: 25,
      xp: 45000,
      achievements: 42,
      reputation: 4.9,
      badges: ["🏆", "👑", "⭐"]
    },
    {
      id: 2,
      rank: 2,
      name: "Sarah Chen",
      username: "@sarahc",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      level: 23,
      xp: 38750,
      achievements: 38,
      reputation: 4.8,
      badges: ["🥈", "🦋", "📝"]
    },
    {
      id: 3,
      rank: 3,
      name: "Dev Mike",
      username: "@devmike",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      level: 22,
      xp: 35200,
      achievements: 36,
      reputation: 4.7,
      badges: ["🥉", "💻", "🚀"]
    },
    {
      id: 234,
      rank: 234,
      name: "You",
      username: "@you",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
      level: 12,
      xp: 8750,
      achievements: 23,
      reputation: 4.8,
      badges: ["🌟", "🎯", "📝"],
      isCurrentUser: true
    }
  ];

  // Mock milestones data
  const mockMilestones = [
    {
      id: 1,
      title: "Level 15 Pioneer",
      description: "Reach level 15 to unlock exclusive features",
      currentValue: 12,
      targetValue: 15,
      reward: "Exclusive Pioneer badge + 500 XP",
      category: "Level",
      icon: "🏴"
    },
    {
      id: 2,
      title: "10K XP Master",
      description: "Accumulate 10,000 total experience points",
      currentValue: 8750,
      targetValue: 10000,
      reward: "XP Master title + Profile border",
      category: "Experience",
      icon: "⚡"
    },
    {
      id: 3,
      title: "50 Achievement Hunter",
      description: "Unlock 50% of all available achievements",
      currentValue: 23,
      targetValue: 23,
      reward: "Achievement Hunter badge",
      category: "Achievements",
      icon: "🏹",
      completed: true
    },
    {
      id: 4,
      title: "Top 100 Elite",
      description: "Reach top 100 in the global leaderboard",
      currentValue: 234,
      targetValue: 100,
      reward: "Elite status + Leaderboard badge",
      category: "Ranking",
      icon: "👑"
    }
  ];

  useEffect(() => {
    setAchievements(mockAchievements);
    setLeaderboard(mockLeaderboard);
    setMilestones(mockMilestones);
  }, []);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'uncommon': return 'text-green-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getRarityBg = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100';
      case 'uncommon': return 'bg-green-100';
      case 'rare': return 'bg-blue-100';
      case 'epic': return 'bg-purple-100';
      case 'legendary': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  const calculateProgress = (current, total) => {
    return Math.min((current / total) * 100, 100);
  };

  const formatXP = (xp) => {
    if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}K`;
    }
    return xp.toString();
  };

  const renderAchievementCard = (achievement) => (
    <Card 
      key={achievement.id} 
      className={`transition-all hover:shadow-md ${
        achievement.unlocked ? 'border-green-200' : 'border-gray-200 opacity-75'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`text-2xl p-2 rounded-lg ${getRarityBg(achievement.rarity)}`}>
            {achievement.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold ${achievement.unlocked ? '' : 'text-muted-foreground'}`}>
                {achievement.title}
              </h3>
              <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                {achievement.rarity}
              </Badge>
              {achievement.unlocked && <CheckCircle className="h-4 w-4 text-green-500" />}
              {!achievement.unlocked && <Lock className="h-4 w-4 text-gray-400" />}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
            
            {!achievement.unlocked && (
              <div className="mb-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                </div>
                <Progress value={calculateProgress(achievement.progress, achievement.maxProgress)} className="h-2" />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                +{achievement.xpReward} XP
              </Badge>
              {achievement.unlocked && (
                <span className="text-xs text-muted-foreground">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLeaderboardItem = (user, index) => (
    <Card 
      key={user.id} 
      className={`transition-all hover:shadow-md ${
        user.isCurrentUser ? 'border-blue-200 bg-blue-50/50' : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`font-bold text-lg ${
              user.rank === 1 ? 'text-yellow-600' : 
              user.rank === 2 ? 'text-gray-600' : 
              user.rank === 3 ? 'text-amber-600' : 
              'text-muted-foreground'
            }`}>
              #{user.rank}
            </span>
            {user.rank <= 3 && (
              <div className="text-lg">
                {user.rank === 1 ? '👑' : user.rank === 2 ? '🥈' : '🥉'}
              </div>
            )}
          </div>
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{user.name}</span>
              <span className="text-sm text-muted-foreground">{user.username}</span>
              {user.isCurrentUser && <Badge variant="outline">You</Badge>}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Level {user.level}</span>
              <span>{formatXP(user.xp)} XP</span>
              <span>{user.achievements} achievements</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {user.reputation}
              </div>
            </div>
          </div>
          
          <div className="flex gap-1">
            {user.badges.map((badge, index) => (
              <span key={index} className="text-lg">{badge}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMilestone = (milestone) => (
    <Card key={milestone.id} className={`transition-all hover:shadow-md ${
      milestone.completed ? 'border-green-200 bg-green-50/50' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`text-2xl p-2 rounded-lg ${
            milestone.completed ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {milestone.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{milestone.title}</h3>
              <Badge variant="outline">{milestone.category}</Badge>
              {milestone.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
            
            {!milestone.completed && (
              <div className="mb-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{milestone.currentValue}/{milestone.targetValue}</span>
                </div>
                <Progress 
                  value={calculateProgress(milestone.currentValue, milestone.targetValue)} 
                  className="h-2" 
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                <Gift className="h-3 w-3 mr-1" />
                {milestone.reward}
              </Badge>
              {milestone.completed && (
                <span className="text-xs text-green-600 font-medium">Completed!</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <div>
              <h1 className="text-2xl font-bold">Achievement Center</h1>
              <p className="text-muted-foreground">Track your progress and compete with others</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>

        {/* User Stats Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <span className="text-2xl font-bold">Level {userStats.level}</span>
                </div>
                <div className="mb-2">
                  <Progress value={(userStats.xp / userStats.totalXp) * 100} className="h-3" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {userStats.xp} / {userStats.totalXp} XP
                </p>
                <p className="text-xs text-muted-foreground">
                  {userStats.xpToNext} XP to next level
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold">{userStats.reputation}</span>
                </div>
                <p className="text-sm text-muted-foreground">Reputation Score</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold">#{userStats.rank}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Global Rank
                </p>
                <p className="text-xs text-muted-foreground">
                  of {userStats.totalUsers.toLocaleString()} users
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span className="text-2xl font-bold">{userStats.achievements}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Achievements Unlocked
                </p>
                <p className="text-xs text-muted-foreground">
                  of {userStats.totalAchievements} total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[600px] mt-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {achievements.filter(a => a.unlocked).slice(0, 3).map(achievement => (
                      <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <span className="text-lg">{achievement.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          +{achievement.xpReward} XP
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Progress Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Progress Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Achievements</span>
                        <span>{userStats.achievements}/{userStats.totalAchievements}</span>
                      </div>
                      <Progress value={(userStats.achievements / userStats.totalAchievements) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Level Progress</span>
                        <span>{userStats.level}/25</span>
                      </div>
                      <Progress value={(userStats.level / 25) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Rank Progress</span>
                        <span>Top {((userStats.rank / userStats.totalUsers) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={100 - ((userStats.rank / userStats.totalUsers) * 100)} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">All Achievements</h3>
                  <p className="text-sm text-muted-foreground">
                    {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">All Categories</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {achievements.map(achievement => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      {renderAchievementCard(achievement)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Global Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Top performers across the platform
                  </p>
                </div>
                <Badge variant="outline">This Week</Badge>
              </div>
              
              <AnimatePresence>
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {renderLeaderboardItem(user, index)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Upcoming Milestones</h3>
                <p className="text-sm text-muted-foreground">
                  Major goals to unlock exclusive rewards
                </p>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {milestones.map(milestone => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      {renderMilestone(milestone)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default AchievementSystem;