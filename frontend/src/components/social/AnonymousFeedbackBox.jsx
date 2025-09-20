import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Shield, 
  Eye, 
  EyeOff,
  Hash,
  Filter,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FEEDBACK_CATEGORIES = [
  'General', 'Bug Report', 'Feature Request', 'UI/UX', 'Performance', 'Security', 'Other'
];

const AnonymousFeedbackBox = ({ userWallet }) => {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('General');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/feedback/list');
      if (response.ok) {
        const data = await response.json();
        setFeedbackList(data.feedback || []);
      }
    } catch (error) {
      console.error('Failed to load feedback:', error);
    }
  };

  const submitFeedback = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: feedback,
          category,
          is_anonymous: isAnonymous,
          user_wallet: isAnonymous ? null : userWallet
        })
      });

      if (response.ok) {
        setFeedback('');
        setCategory('General');
        await loadFeedback();
        alert('Feedback submitted successfully!');
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const voteFeedback = async (feedbackId, voteType) => {
    try {
      await fetch(`http://localhost:5000/api/feedback/${feedbackId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vote_type: voteType,
          user_wallet: userWallet
        })
      });
      await loadFeedback();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const filteredFeedback = feedbackList.filter(item => 
    filter === 'all' || item.category.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Anonymous Feedback Box
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your thoughts, report issues, and suggest improvements. Optional blockchain verification for authenticity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Feedback Submission */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Submit Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEEDBACK_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Feedback Content */}
                <div className="space-y-2">
                  <Label>Your Feedback</Label>
                  <Textarea
                    placeholder="Share your thoughts, report bugs, or suggest features..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <div className="text-sm text-gray-500">
                    {feedback.length}/1000 characters
                  </div>
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <Label>Anonymous Submission</Label>
                  </div>
                  <Switch
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                </div>

                {!isAnonymous && userWallet && (
                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-700">
                      Your feedback will be linked to your wallet for verification
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={submitFeedback}
                  disabled={!feedback.trim() || isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  {isSubmitting ? 'Submitting...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit {isAnonymous ? 'Anonymous' : 'Verified'} Feedback
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feedback Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Feedback Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{feedbackList.length}</div>
                  <div className="text-sm text-gray-600">Total Submissions</div>
                </div>
                <div className="space-y-2">
                  {FEEDBACK_CATEGORIES.map(cat => {
                    const count = feedbackList.filter(f => f.category === cat).length;
                    return (
                      <div key={cat} className="flex justify-between items-center">
                        <span className="text-sm">{cat}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Filter */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {FEEDBACK_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Feedback List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Community Feedback ({filteredFeedback.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredFeedback.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No feedback in this category yet</p>
                ) : (
                  filteredFeedback.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {item.is_anonymous ? (
                            <div className="flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              Anonymous
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Verified
                            </div>
                          )}
                          {item.verification_hash && (
                            <div className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {item.verification_hash.slice(0, 8)}...
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{item.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => voteFeedback(item.id, 'upvote')}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {item.upvotes || 0}
                          </button>
                          <button
                            onClick={() => voteFeedback(item.id, 'downvote')}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            {item.downvotes || 0}
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnonymousFeedbackBox;