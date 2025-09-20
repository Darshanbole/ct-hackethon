import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Coins, 
  Plus, 
  TrendingUp,
  Calendar,
  PiggyBank,
  ArrowUpRight,
  UserPlus,
  Crown,
  Gift
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const POOL_TYPES = [
  { value: 'goal_based', label: 'Goal-Based', icon: Target, desc: 'Save towards a specific amount' },
  { value: 'time_based', label: 'Time-Based', icon: Calendar, desc: 'Save for a set duration' },
  { value: 'rotating', label: 'Rotating Fund', icon: Users, desc: 'Members take turns receiving funds' }
];

const GroupSavingsPools = ({ userWallet }) => {
  const [pools, setPools] = useState([]);
  const [myPools, setMyPools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  
  // Create pool form state
  const [poolForm, setPoolForm] = useState({
    name: '',
    description: '',
    targetAmount: '',
    endDate: '',
    poolType: 'goal_based',
    minContribution: ''
  });

  const [joinAmount, setJoinAmount] = useState('');

  useEffect(() => {
    loadPools();
    if (userWallet) {
      loadMyPools();
    }
  }, [userWallet]);

  const loadPools = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/savings-pools/list');
      if (response.ok) {
        const data = await response.json();
        setPools(data.pools || []);
      }
    } catch (error) {
      console.error('Failed to load pools:', error);
    }
  };

  const loadMyPools = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/savings-pools/my-pools?wallet=${userWallet}`);
      if (response.ok) {
        const data = await response.json();
        setMyPools(data.pools || []);
      }
    } catch (error) {
      console.error('Failed to load my pools:', error);
    }
  };

  const createPool = async () => {
    if (!poolForm.name || !poolForm.targetAmount) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/savings-pools/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pool_name: poolForm.name,
          description: poolForm.description,
          target_amount: parseFloat(poolForm.targetAmount),
          creator_wallet: userWallet,
          end_date: poolForm.endDate,
          pool_type: poolForm.poolType,
          min_contribution: parseFloat(poolForm.minContribution) || 0
        })
      });

      if (response.ok) {
        setShowCreateDialog(false);
        setPoolForm({
          name: '',
          description: '',
          targetAmount: '',
          endDate: '',
          poolType: 'goal_based',
          minContribution: ''
        });
        await loadPools();
        await loadMyPools();
        alert('Savings pool created successfully!');
      }
    } catch (error) {
      console.error('Failed to create pool:', error);
      alert('Failed to create pool. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const joinPool = async (poolId) => {
    if (!joinAmount || !userWallet) return;

    setIsLoading(true);
    try {
      // Send contribution transaction
      const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: userWallet,
          to: '0x742d35Cc6b3c8D21C04A7b7D7A4DA1E5CF1A9D2E', // Pool contract or platform wallet
          value: (parseFloat(joinAmount) * Math.pow(10, 18)).toString(16), // Convert to wei
          gas: '21000'
        }]
      });

      // Record pool participation
      const response = await fetch('http://localhost:5000/api/savings-pools/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pool_id: poolId,
          participant_wallet: userWallet,
          contribution_amount: parseFloat(joinAmount),
          transaction_hash: transactionHash
        })
      });

      if (response.ok) {
        setShowJoinDialog(false);
        setJoinAmount('');
        setSelectedPool(null);
        await loadPools();
        await loadMyPools();
        alert('Successfully joined the savings pool!');
      }
    } catch (error) {
      console.error('Failed to join pool:', error);
      alert('Failed to join pool. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawFromPool = async (poolId) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/savings-pools/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pool_id: poolId,
          participant_wallet: userWallet
        })
      });

      if (response.ok) {
        await loadPools();
        await loadMyPools();
        alert('Withdrawal initiated successfully!');
      }
    } catch (error) {
      console.error('Failed to withdraw:', error);
      alert('Failed to withdraw. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isParticipant = (pool) => {
    try {
      const participants = JSON.parse(pool.participants || '[]');
      return participants.includes(userWallet);
    } catch {
      return false;
    }
  };

  const getParticipantCount = (pool) => {
    try {
      const participants = JSON.parse(pool.participants || '[]');
      return participants.length;
    } catch {
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Group Savings Pools
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Save together, achieve more. Join collaborative savings pools or create your own with smart contract security.
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
              <PiggyBank className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">{pools.length}</div>
              <div className="text-sm text-gray-600">Active Pools</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {pools.reduce((sum, pool) => sum + getParticipantCount(pool), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Savers</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Coins className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {pools.reduce((sum, pool) => sum + (pool.current_amount || 0), 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total ETH Saved</div>
            </CardContent>
          </Card>
          
          {userWallet && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Crown className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-purple-600">{myPools.length}</div>
                <div className="text-sm text-gray-600">My Pools</div>
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
              <Target className="w-4 h-4 mr-2" />
              {pools.filter(p => p.pool_type === 'goal_based').length} Goal-Based
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              {pools.filter(p => p.pool_type === 'time_based').length} Time-Based
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {pools.filter(p => p.pool_type === 'rotating').length} Rotating
            </Badge>
          </div>
          
          {userWallet && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Pool
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Savings Pool</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <Label>Pool Name</Label>
                    <Input
                      value={poolForm.name}
                      onChange={(e) => setPoolForm({...poolForm, name: e.target.value})}
                      placeholder="Group Vacation Fund"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={poolForm.description}
                      onChange={(e) => setPoolForm({...poolForm, description: e.target.value})}
                      placeholder="What are you saving for?"
                      className="resize-none"
                    />
                  </div>
                  <div>
                    <Label>Pool Type</Label>
                    <Select value={poolForm.poolType} onValueChange={(value) => setPoolForm({...poolForm, poolType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {POOL_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label} - {type.desc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Target Amount (ETH)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={poolForm.targetAmount}
                        onChange={(e) => setPoolForm({...poolForm, targetAmount: e.target.value})}
                        placeholder="10.0"
                      />
                    </div>
                    <div>
                      <Label>Min Contribution (ETH)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={poolForm.minContribution}
                        onChange={(e) => setPoolForm({...poolForm, minContribution: e.target.value})}
                        placeholder="0.1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>End Date (Optional)</Label>
                    <Input
                      type="date"
                      value={poolForm.endDate}
                      onChange={(e) => setPoolForm({...poolForm, endDate: e.target.value})}
                    />
                  </div>
                  <Button
                    onClick={createPool}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500"
                  >
                    {isLoading ? 'Creating...' : 'Create Pool'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool, index) => {
            const progressPercent = getProgressPercentage(pool.current_amount || 0, pool.target_amount);
            const poolTypeData = POOL_TYPES.find(t => t.value === pool.pool_type);
            const TypeIcon = poolTypeData?.icon || Target;
            const isUserParticipant = isParticipant(pool);
            const participantCount = getParticipantCount(pool);
            
            return (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 h-full">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {poolTypeData?.label}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {participantCount}
                      </div>
                    </div>
                    <CardTitle className="text-xl leading-tight">
                      {pool.pool_name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {pool.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {pool.description}
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">
                          {(pool.current_amount || 0).toFixed(2)} / {pool.target_amount} ETH
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                      <div className="text-center text-sm text-gray-600">
                        {progressPercent.toFixed(1)}% Complete
                      </div>
                    </div>

                    {pool.end_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Ends: {formatDate(pool.end_date)}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      {isUserParticipant ? (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700">
                            <Gift className="w-3 h-3 mr-1" />
                            Participating
                          </Badge>
                        </div>
                      ) : (
                        <Button
                          onClick={() => {
                            setSelectedPool(pool);
                            setShowJoinDialog(true);
                          }}
                          disabled={isLoading || !userWallet || progressPercent >= 100}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          size="sm"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Join Pool
                        </Button>
                      )}

                      {pool.creator_wallet === userWallet && (
                        <Badge className="bg-purple-100 text-purple-700">
                          <Crown className="w-3 h-3 mr-1" />
                          Creator
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {pools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <PiggyBank className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Savings Pools Yet</h3>
            <p className="text-gray-500">Be the first to create a collaborative savings pool!</p>
          </motion.div>
        )}

        {/* Join Pool Dialog */}
        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join {selectedPool?.pool_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Pool Details:</p>
                <p className="font-medium">{selectedPool?.description}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Target: {selectedPool?.target_amount} ETH
                </p>
                {selectedPool?.min_contribution > 0 && (
                  <p className="text-sm text-gray-600">
                    Minimum contribution: {selectedPool.min_contribution} ETH
                  </p>
                )}
              </div>
              <div>
                <Label>Contribution Amount (ETH)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={joinAmount}
                  onChange={(e) => setJoinAmount(e.target.value)}
                  placeholder={selectedPool?.min_contribution ? selectedPool.min_contribution.toString() : "0.1"}
                />
              </div>
              <Button
                onClick={() => joinPool(selectedPool?.id)}
                disabled={isLoading || !joinAmount}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500"
              >
                {isLoading ? 'Joining...' : `Contribute ${joinAmount} ETH`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GroupSavingsPools;