import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import {
  Brain,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Heart,
  Share2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  BarChart3,
  Zap,
  Star,
  Filter,
  RefreshCw,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clock,
  Users
} from 'lucide-react';

const AIFeatures = () => {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [contentInput, setContentInput] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [smartFeed, setSmartFeed] = useState([]);
  const [contentSuggestions, setContentSuggestions] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [sentimentData, setSentimentData] = useState({});

  // Simulated AI content suggestions
  const generateContentSuggestions = () => {
    const suggestions = [
      {
        id: 1,
        type: 'trending',
        title: 'Share your thoughts on Web3 adoption',
        description: 'Web3 and decentralization are trending. Share your perspective!',
        hashtags: ['#Web3', '#Blockchain', '#DeFi'],
        engagement_potential: 92,
        optimal_time: '2:00 PM - 4:00 PM'
      },
      {
        id: 2,
        type: 'personal',
        title: 'Behind the scenes content performs well',
        description: 'Your audience engages 3x more with behind-the-scenes content',
        hashtags: ['#BehindTheScenes', '#WorkLife'],
        engagement_potential: 87,
        optimal_time: '9:00 AM - 11:00 AM'
      },
      {
        id: 3,
        type: 'interactive',
        title: 'Ask your community a question',
        description: 'Questions generate 5x more comments. Try asking about their goals!',
        hashtags: ['#Community', '#Goals', '#Discussion'],
        engagement_potential: 94,
        optimal_time: '6:00 PM - 8:00 PM'
      },
      {
        id: 4,
        type: 'educational',
        title: 'Share a quick tip or tutorial',
        description: 'Educational content has high save rates in your niche',
        hashtags: ['#Tips', '#Tutorial', '#Learning'],
        engagement_potential: 89,
        optimal_time: '12:00 PM - 2:00 PM'
      }
    ];
    setContentSuggestions(suggestions);
  };

  // Simulated sentiment analysis
  const analyzeSentiment = (text) => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const positiveWords = ['great', 'awesome', 'amazing', 'love', 'excellent', 'wonderful', 'fantastic', 'good', 'best', 'perfect'];
      const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing', 'sad', 'angry', 'frustrated'];
      
      const words = text.toLowerCase().split(/\s+/);
      const positiveCount = words.filter(word => positiveWords.some(pw => word.includes(pw))).length;
      const negativeCount = words.filter(word => negativeWords.some(nw => word.includes(nw))).length;
      
      let sentiment = 'neutral';
      let score = 0.5;
      let confidence = 0.7;
      
      if (positiveCount > negativeCount) {
        sentiment = 'positive';
        score = Math.min(0.9, 0.6 + (positiveCount * 0.1));
      } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
        score = Math.max(0.1, 0.4 - (negativeCount * 0.1));
      }
      
      const engagement_prediction = Math.floor(Math.random() * 40) + 60;
      const viral_potential = sentiment === 'positive' ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 50) + 30;
      
      const suggestions = [];
      if (sentiment === 'negative') {
        suggestions.push('Consider adding more positive language');
        suggestions.push('Try including solution-oriented content');
      }
      if (text.length < 50) {
        suggestions.push('Consider expanding your content for better engagement');
      }
      if (!text.includes('#')) {
        suggestions.push('Add relevant hashtags to increase discoverability');
      }
      
      setAiAnalysis({
        sentiment,
        score,
        confidence,
        engagement_prediction,
        viral_potential,
        word_count: words.length,
        suggestions,
        topics: extractTopics(text),
        reading_time: Math.ceil(words.length / 200)
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const extractTopics = (text) => {
    const topics = ['Technology', 'Business', 'Lifestyle', 'Education', 'Entertainment', 'Health', 'Travel'];
    return topics.filter(() => Math.random() > 0.7).slice(0, 3);
  };

  // Generate trending topics
  const generateTrendingTopics = () => {
    const topics = [
      { topic: 'AI Revolution', growth: '+234%', posts: '12.5K', sentiment: 'positive' },
      { topic: 'Sustainable Tech', growth: '+189%', posts: '8.3K', sentiment: 'positive' },
      { topic: 'Remote Work', growth: '+156%', posts: '15.7K', sentiment: 'neutral' },
      { topic: 'Crypto Market', growth: '+98%', posts: '22.1K', sentiment: 'mixed' },
      { topic: 'Climate Change', growth: '+87%', posts: '9.4K', sentiment: 'serious' },
      { topic: 'Mental Health', growth: '+76%', posts: '6.8K', sentiment: 'supportive' }
    ];
    setTrendingTopics(topics);
  };

  // Generate smart feed recommendations
  const generateSmartFeed = () => {
    const feedItems = [
      {
        id: 1,
        type: 'high_engagement',
        reason: 'Similar to your most liked posts',
        title: 'The Future of Decentralized Social Media',
        author: 'TechVisionary',
        engagement: '94% match',
        time: '2h ago'
      },
      {
        id: 2,
        type: 'trending',
        reason: 'Trending in your network',
        title: 'Building in Public: My Startup Journey',
        author: 'BuilderMike',
        engagement: '87% match',
        time: '4h ago'
      },
      {
        id: 3,
        type: 'connection',
        reason: 'From someone you recently followed',
        title: 'Quick Tips for Better Code Reviews',
        author: 'DevMaster',
        engagement: '91% match',
        time: '6h ago'
      }
    ];
    setSmartFeed(feedItems);
  };

  useEffect(() => {
    generateContentSuggestions();
    generateTrendingTopics();
    generateSmartFeed();
  }, []);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'mixed': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="h-4 w-4" />;
      case 'negative': return <ThumbsDown className="h-4 w-4" />;
      case 'mixed': return <BarChart3 className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI-Powered Social Intelligence
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Leverage cutting-edge AI to create better content, understand your audience, and optimize your social media strategy
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { id: 'suggestions', label: 'Content Suggestions', icon: Lightbulb },
          { id: 'analysis', label: 'Content Analysis', icon: BarChart3 },
          { id: 'trending', label: 'Trending Topics', icon: TrendingUp },
          { id: 'smart-feed', label: 'Smart Feed', icon: Zap },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            className="flex items-center space-x-2"
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Content Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {contentSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {suggestion.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {suggestion.hashtags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engagement Potential</span>
                        <span className="font-medium">{suggestion.engagement_potential}%</span>
                      </div>
                      <Progress value={suggestion.engagement_potential} className="h-2" />
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Best time: {suggestion.optimal_time}
                    </div>
                    
                    <Button className="w-full" size="sm">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Use This Suggestion
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button variant="outline" onClick={generateContentSuggestions}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Get New Suggestions
              </Button>
            </div>
          </motion.div>
        )}

        {/* Content Analysis Tab */}
        {activeTab === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Content Analyzer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your content here for AI analysis..."
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button 
                  onClick={() => analyzeSentiment(contentInput)}
                  disabled={!contentInput.trim() || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {aiAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sentiment Analysis */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center space-y-2">
                      <div className={`text-2xl font-bold ${getSentimentColor(aiAnalysis.sentiment)}`}>
                        {(aiAnalysis.score * 100).toFixed(0)}%
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        {getSentimentIcon(aiAnalysis.sentiment)}
                        <span className="capitalize">{aiAnalysis.sentiment}</span>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-blue-600">
                        {aiAnalysis.engagement_prediction}%
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>Engagement</span>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-purple-600">
                        {aiAnalysis.viral_potential}%
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <Zap className="h-4 w-4" />
                        <span>Viral Potential</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Content Metrics */}
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Word Count:</span>
                      <span className="font-medium">{aiAnalysis.word_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reading Time:</span>
                      <span className="font-medium">{aiAnalysis.reading_time} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span className="font-medium">{(aiAnalysis.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  {/* Topics */}
                  {aiAnalysis.topics.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Detected Topics:</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.topics.map((topic) => (
                          <Badge key={topic} variant="outline">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Suggestions */}
                  {aiAnalysis.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">AI Recommendations:</h4>
                      <div className="space-y-2">
                        {aiAnalysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start space-x-2 p-2 bg-muted rounded">
                            <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                            <span className="text-sm">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Trending Topics Tab */}
        {activeTab === 'trending' && (
          <motion.div
            key="trending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>AI-Detected Trending Topics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-muted-foreground">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{topic.topic}</h3>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{topic.posts} posts</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              {getSentimentIcon(topic.sentiment)}
                              <span className="capitalize">{topic.sentiment}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-medium">
                          {topic.growth}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          growth
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Smart Feed Tab */}
        {activeTab === 'smart-feed' && (
          <motion.div
            key="smart-feed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>AI-Curated Smart Feed</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Personalized content recommendations based on your interests and engagement patterns
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {smartFeed.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">by {item.author}</p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {item.engagement}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Target className="h-3 w-3" />
                          <span>{item.reason}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-2 w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Post
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" onClick={generateSmartFeed}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Feed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIFeatures;