import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Vote, 
  Plus, 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  BarChart3,
  Shield,
  Calendar,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

const CommunityVoting = ({ userWallet }) => {
  const [polls, setPolls] = useState([]);
  const [myPolls, setMyPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Create poll form state
  const [pollForm, setPollForm] = useState({
    title: '',
    description: '',
    options: ['', ''],
    startDate: '',
    endDate: '',
    isBlockchainVerified: false,
    eligibleVoters: []
  });

  const [selectedVotes, setSelectedVotes] = useState({});

  useEffect(() => {
    loadPolls();
    if (userWallet) {
      loadMyPolls();
    }
  }, [userWallet]);

  const loadPolls = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/voting/list');
      if (response.ok) {
        const data = await response.json();
        setPolls(data.polls || []);
      }
    } catch (error) {
      console.error('Failed to load polls:', error);
    }
  };

  const loadMyPolls = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/voting/my-polls?wallet=${userWallet}`);
      if (response.ok) {
        const data = await response.json();
        setMyPolls(data.polls || []);
      }
    } catch (error) {
      console.error('Failed to load my polls:', error);
    }
  };

  const addOption = () => {
    setPollForm({
      ...pollForm,
      options: [...pollForm.options, '']
    });
  };

  const removeOption = (index) => {
    if (pollForm.options.length > 2) {
      setPollForm({
        ...pollForm,
        options: pollForm.options.filter((_, i) => i !== index)
      });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...pollForm.options];
    newOptions[index] = value;
    setPollForm({
      ...pollForm,
      options: newOptions
    });
  };

  const createPoll = async () => {
    if (!pollForm.title || !pollForm.endDate || pollForm.options.some(opt => !opt.trim())) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/voting/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pollForm.title,
          description: pollForm.description,
          options: pollForm.options.filter(opt => opt.trim()),
          creator_wallet: userWallet,
          start_date: pollForm.startDate || new Date().toISOString(),
          end_date: new Date(pollForm.endDate).toISOString(),
          is_blockchain_verified: pollForm.isBlockchainVerified,
          eligible_voters: pollForm.eligibleVoters
        })
      });

      if (response.ok) {
        setShowCreateDialog(false);
        setPollForm({
          title: '',
          description: '',
          options: ['', ''],
          startDate: '',
          endDate: '',
          isBlockchainVerified: false,
          eligibleVoters: []
        });
        await loadPolls();
        await loadMyPolls();
        alert('Poll created successfully!');
      }
    } catch (error) {
      console.error('Failed to create poll:', error);
      alert('Failed to create poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitVote = async (pollId, selectedOption) => {
    if (!userWallet) {
      alert('Please connect your wallet to vote');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/voting/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_wallet: userWallet,
          vote_option: selectedOption
        })
      });

      if (response.ok) {
        await loadPolls();
        alert('Vote submitted successfully!');
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getVoteResults = (poll) => {
    try {
      const votes = JSON.parse(poll.votes || '{}');
      const options = JSON.parse(poll.options || '[]');
      const results = {};
      
      options.forEach(option => {
        results[option] = 0;
      });
      
      Object.values(votes).forEach(vote => {
        if (results[vote] !== undefined) {
          results[vote]++;
        }
      });
      
      return results;
    } catch {
      return {};
    }
  };

  const getTotalVotes = (poll) => {
    try {
      const votes = JSON.parse(poll.votes || '{}');
      return Object.keys(votes).length;
    } catch {
      return 0;
    }
  };

  const hasUserVoted = (poll) => {
    try {
      const votes = JSON.parse(poll.votes || '{}');
      return votes[userWallet] !== undefined;
    } catch {
      return false;
    }
  };

  const isPollActive = (poll) => {
    const now = new Date();
    const endDate = new Date(poll.end_date);
    return now < endDate;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWinningOption = (poll) => {
    const results = getVoteResults(poll);
    const maxVotes = Math.max(...Object.values(results));
    return Object.keys(results).find(option => results[option] === maxVotes);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Community Voting
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Participate in decentralized governance. Create polls, cast votes, and shape community decisions with blockchain transparency.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Vote className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">{polls.length}</div>
              <div className="text-sm text-gray-600">Active Polls</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {polls.reduce((sum, poll) => sum + getTotalVotes(poll), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {polls.filter(p => isPollActive(p)).length}
              </div>
              <div className="text-sm text-gray-600">Active Now</div>
            </CardContent>
          </Card>
          
          {userWallet && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{myPolls.length}</div>
                <div className="text-sm text-gray-600">My Polls</div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              {polls.filter(p => isPollActive(p)).length} Active
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <XCircle className="w-4 h-4 mr-2" />
              {polls.filter(p => !isPollActive(p)).length} Ended
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              {polls.filter(p => p.is_blockchain_verified).length} Blockchain Verified
            </Badge>
          </div>
          
          {userWallet && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Poll
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Community Poll</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <Label>Poll Title</Label>
                    <Input
                      value={pollForm.title}
                      onChange={(e) => setPollForm({...pollForm, title: e.target.value})}
                      placeholder="What should we decide on?"
                    />
                  </div>
                  <div>
                    <Label>Description (Optional)</Label>
                    <Textarea
                      value={pollForm.description}
                      onChange={(e) => setPollForm({...pollForm, description: e.target.value})}
                      placeholder="Provide more details about this decision"
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Voting Options</Label>
                    {pollForm.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        {pollForm.options.length > 2 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(index)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Start Date (Optional)</Label>
                      <Input
                        type="datetime-local"
                        value={pollForm.startDate}
                        onChange={(e) => setPollForm({...pollForm, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="datetime-local"
                        value={pollForm.endDate}
                        onChange={(e) => setPollForm({...pollForm, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <Label className="text-sm">Blockchain Verification</Label>
                    </div>
                    <Switch
                      checked={pollForm.isBlockchainVerified}
                      onCheckedChange={(checked) => setPollForm({...pollForm, isBlockchainVerified: checked})}
                    />
                  </div>

                  <Button
                    onClick={createPoll}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    {isLoading ? 'Creating...' : 'Create Poll'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        {/* Polls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {polls.map((poll, index) => {
            const options = JSON.parse(poll.options || '[]');
            const voteResults = getVoteResults(poll);
            const totalVotes = getTotalVotes(poll);
            const hasVoted = hasUserVoted(poll);
            const isActive = isPollActive(poll);
            const winningOption = getWinningOption(poll);
            
            return (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm h-full">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={`${isActive ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                        {isActive ? 'Active' : 'Ended'}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {poll.is_blockchain_verified && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {totalVotes}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl leading-tight">
                      {poll.title}
                    </CardTitle>
                    {poll.description && (
                      <p className="text-gray-600 text-sm">{poll.description}</p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Ends: {formatDate(poll.end_date)}
                    </div>

                    {/* Voting Options or Results */}
                    <div className="space-y-3">
                      {hasVoted || !isActive ? (
                        // Show results
                        options.map((option, optIndex) => {
                          const votes = voteResults[option] || 0;
                          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                          const isWinning = option === winningOption && !isActive;
                          
                          return (
                            <div key={optIndex} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className={`text-sm ${isWinning ? 'font-bold text-blue-600' : ''}`}>
                                  {option} {isWinning && '🏆'}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {votes} vote{votes !== 1 ? 's' : ''} ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <Progress 
                                value={percentage} 
                                className={`h-2 ${isWinning ? 'bg-blue-100' : ''}`}
                              />
                            </div>
                          );
                        })
                      ) : (
                        // Show voting interface
                        <RadioGroup
                          value={selectedVotes[poll.id] || ''}
                          onValueChange={(value) => setSelectedVotes({...selectedVotes, [poll.id]: value})}
                        >
                          {options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${poll.id}-${optIndex}`} />
                              <Label htmlFor={`${poll.id}-${optIndex}`} className="cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </div>

                    {/* Vote Button */}
                    {isActive && !hasVoted && userWallet && (
                      <Button
                        onClick={() => submitVote(poll.id, selectedVotes[poll.id])}
                        disabled={!selectedVotes[poll.id] || isLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        <Vote className="w-4 h-4 mr-2" />
                        Cast Vote
                      </Button>
                    )}

                    {hasVoted && (
                      <Badge variant="outline" className="w-full justify-center py-2 bg-green-50 text-green-700 border-green-300">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        You have voted
                      </Badge>
                    )}

                    {poll.creator_wallet === userWallet && (
                      <Badge variant="outline" className="w-full justify-center py-2 bg-blue-50 text-blue-700 border-blue-300">
                        <Eye className="w-4 h-4 mr-2" />
                        Your Poll
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {polls.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Vote className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Polls Yet</h3>
            <p className="text-gray-500">Be the first to create a community poll!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommunityVoting;