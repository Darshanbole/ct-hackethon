import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Zap,
  Globe,
  Coins,
  Users,
  Lock,
  TrendingUp,
  Smartphone,
  Database,
  Network,
  Rocket,
  Star,
  CheckCircle,
  ArrowRight,
  Github,
  Twitter,
  MessageCircle,
  ExternalLink,
  Heart,
  Code,
  Award,
  Target,
} from "lucide-react";

const AboutPlatform = ({ onBack }) => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Decentralized Security",
      description: "Your data is secured by blockchain technology, ensuring complete privacy and ownership.",
      benefits: ["End-to-end encryption", "No central authority", "User-controlled data"],
    },
    {
      icon: <Globe className="h-8 w-8 text-green-500" />,
      title: "Cross-Platform Posting",
      description: "Post to multiple social platforms simultaneously with a single click and payment.",
      benefits: ["Multi-platform integration", "One-click publishing", "Cost-effective sharing"],
    },
    {
      icon: <Coins className="h-8 w-8 text-yellow-500" />,
      title: "Web3 Payments",
      description: "Integrated MetaMask wallet for seamless cryptocurrency transactions and rewards.",
      benefits: ["MetaMask integration", "Crypto rewards", "Low transaction fees"],
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Community Driven",
      description: "Connect with like-minded Web3 enthusiasts and builders in our vibrant community.",
      benefits: ["Global community", "Expert networking", "Collaborative projects"],
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "Lightning Fast",
      description: "Built on high-performance blockchain infrastructure for instant transactions.",
      benefits: ["Sub-second transactions", "Scalable architecture", "Real-time updates"],
    },
    {
      icon: <Lock className="h-8 w-8 text-red-500" />,
      title: "Privacy First",
      description: "Your privacy is paramount. No tracking, no ads, just pure social interaction.",
      benefits: ["Zero tracking", "Ad-free experience", "Complete anonymity option"],
    },
  ];

  const platformStats = [
    { label: "Active Users", value: "50K+", icon: <Users className="h-5 w-5" /> },
    { label: "Posts Created", value: "1M+", icon: <MessageCircle className="h-5 w-5" /> },
    { label: "Transactions", value: "100K+", icon: <Coins className="h-5 w-5" /> },
    { label: "Communities", value: "500+", icon: <Globe className="h-5 w-5" /> },
  ];

  const roadmapItems = [
    {
      phase: "Phase 1",
      title: "Core Platform Launch",
      status: "completed",
      items: ["Multi-platform posting", "Web3 wallet integration", "Basic community features"],
    },
    {
      phase: "Phase 2",
      title: "Advanced Features",
      status: "in-progress",
      items: ["NFT marketplace", "DAO governance", "Advanced analytics"],
    },
    {
      phase: "Phase 3",
      title: "Global Expansion",
      status: "planned",
      items: ["Mobile apps", "Multi-language support", "Enterprise solutions"],
    },
    {
      phase: "Phase 4",
      title: "Web3 Innovation",
      status: "planned",
      items: ["AI-powered content", "Metaverse integration", "Cross-chain compatibility"],
    },
  ];

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Co-Founder & CEO",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      bio: "Former blockchain engineer at major tech company, passionate about decentralized social media.",
    },
    {
      name: "Sarah Chen",
      role: "Co-Founder & CTO",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      bio: "Full-stack developer with 8+ years in Web3, expert in smart contract development.",
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Community",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      bio: "Community building expert who grew several Web3 communities from 0 to 10K+ members.",
    },
  ];

  const partnerships = [
    { name: "Shardeum", logo: "🔗", description: "High-performance blockchain partner" },
    { name: "MetaMask", logo: "🦊", description: "Web3 wallet integration" },
    { name: "IPFS", logo: "🌐", description: "Decentralized storage solution" },
    { name: "Polygon", logo: "⬡", description: "Layer 2 scaling solution" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={onBack}>
              ← Back to Home
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Web3 Social dApps Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
              The future of social media is here. Decentralized, secure, and community-owned.
              Connect with the world while maintaining complete control over your data and digital identity.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Rocket className="h-5 w-5 mr-2" />
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                <ExternalLink className="h-5 w-5 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {platformStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2 text-purple-500">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="features" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="mission">Mission</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="partnerships">Partners</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      {feature.icon}
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mission" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-6 w-6 text-purple-500" />
                    <span>Our Mission</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">
                    To revolutionize social media by creating a decentralized platform where users 
                    truly own their data, content, and digital identity.
                  </p>
                  <p>
                    We believe in a future where social interactions are not controlled by 
                    centralized entities, where privacy is respected, and where communities 
                    can govern themselves through transparent, democratic processes.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold">User Ownership</h4>
                        <p className="text-sm text-muted-foreground">
                          Complete control over personal data and content
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold">Community Governance</h4>
                        <p className="text-sm text-muted-foreground">
                          Democratic decision-making through DAO mechanisms
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold">Economic Empowerment</h4>
                        <p className="text-sm text-muted-foreground">
                          Direct monetization and reward mechanisms for creators
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-6 w-6 text-red-500" />
                    <span>Our Values</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-purple-600">Transparency</h4>
                      <p className="text-sm text-muted-foreground">
                        All platform operations are transparent and verifiable on the blockchain.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-green-600">Privacy</h4>
                      <p className="text-sm text-muted-foreground">
                        User privacy is fundamental - no tracking, no data mining, no surveillance.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-blue-600">Innovation</h4>
                      <p className="text-sm text-muted-foreground">
                        Continuous innovation in Web3 technologies and user experience.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-orange-600">Community</h4>
                      <p className="text-sm text-muted-foreground">
                        Building strong, supportive communities around shared interests and values.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-8">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>
              <div className="space-y-8">
                {roadmapItems.map((item, index) => (
                  <div key={index} className="relative pl-12">
                    <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      item.status === 'completed' ? 'bg-green-500' : 
                      item.status === 'in-progress' ? 'bg-purple-500' : 'bg-gray-400'
                    }`}>
                      {item.status === 'completed' ? 
                        <CheckCircle className="h-5 w-5 text-white" /> :
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      }
                    </div>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                              {item.phase}
                            </Badge>
                            <CardTitle className="mt-2">{item.title}</CardTitle>
                          </div>
                          <Badge variant={
                            item.status === 'completed' ? 'default' :
                            item.status === 'in-progress' ? 'secondary' : 'outline'
                          }>
                            {item.status === 'completed' ? 'Completed' :
                             item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {item.items.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className={`h-4 w-4 ${
                                item.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-purple-200">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                    <div className="flex justify-center space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Github className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="partnerships" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {partnerships.map((partner, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3">{partner.logo}</div>
                    <h3 className="font-semibold text-lg mb-2">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground">{partner.description}</p>
                    <Button size="sm" variant="outline" className="mt-4">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Become a Partner</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join our ecosystem of innovative partners building the future of decentralized social media.
                  We're always looking for strategic partnerships that align with our mission.
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Partner With Us
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AboutPlatform;