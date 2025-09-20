import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  Zap,
  Heart,
  Coffee,
  Gift,
  Crown,
  Coins,
  TrendingUp,
  Wallet,
  Send,
  Star,
  Users,
  Target,
  Calendar,
  X,
  Check,
  ArrowRight
} from 'lucide-react';

const CreatorMonetization = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tipAmount, setTipAmount] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  const [selectedTipType, setSelectedTipType] = useState('coffee');
  const [isConnectedWallet, setIsConnectedWallet] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [earnings, setEarnings] = useState({
    total: 2.45,
    thisMonth: 0.89,
    tips: 156,
    supporters: 23
  });

  const tipTypes = [
    { id: 'coffee', icon: Coffee, label: 'Buy a Coffee', amount: 0.01, color: 'bg-amber-500' },
    { id: 'support', icon: Heart, label: 'Show Support', amount: 0.05, color: 'bg-red-500' },
    { id: 'premium', icon: Crown, label: 'Premium Tip', amount: 0.1, color: 'bg-purple-500' },
    { id: 'custom', icon: Gift, label: 'Custom Amount', amount: 0, color: 'bg-blue-500' }
  ];

  const cryptoOptions = [
    { symbol: 'ETH', name: 'Ethereum', icon: '💎', rate: 3200 },
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', rate: 65000 },
    { symbol: 'SHM', name: 'Shardeum', icon: '⚡', rate: 0.25 },
    { symbol: 'USDC', name: 'USD Coin', icon: '💵', rate: 1 }
  ];

  const recentTips = [
    {
      id: 1,
      from: { name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
      amount: 0.05,
      crypto: 'ETH',
      message: 'Great content! Keep it up!',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      from: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
      amount: 0.01,
      crypto: 'SHM',
      message: 'Thanks for the insights!',
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      from: { name: 'Dev Mike', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
      amount: 0.1,
      crypto: 'ETH',
      message: 'Amazing work on the tutorial series!',
      timestamp: '1 day ago'
    }
  ];

  const supporterTiers = [
    {
      id: 1,
      name: 'Coffee Supporter',
      minAmount: 0.01,
      benefits: ['Thank you message', 'Supporter badge'],
      supporters: 89,
      color: 'bg-amber-100 text-amber-800'
    },
    {
      id: 2,
      name: 'Premium Supporter',
      minAmount: 0.05,
      benefits: ['Early access to content', 'Direct messages', 'Premium badge'],
      supporters: 34,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      name: 'Elite Supporter',
      minAmount: 0.1,
      benefits: ['All premium benefits', '1-on-1 calls', 'Elite badge', 'Priority support'],
      supporters: 12,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  useEffect(() => {
    // Check if wallet is connected
    const checkWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsConnectedWallet(true);
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet:', error);
        }
      }
    };

    checkWallet();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnectedWallet(true);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask to use this feature.');
    }
  };

  const sendTip = async () => {
    if (!isConnectedWallet) {
      await connectWallet();
      return;
    }

    const amount = selectedTipType === 'custom' ? parseFloat(tipAmount) : 
                   tipTypes.find(t => t.id === selectedTipType)?.amount || 0;

    if (amount <= 0) {
      alert('Please enter a valid tip amount');
      return;
    }

    try {
      // Simulate tip transaction
      console.log('Sending tip:', { amount, message: tipMessage, type: selectedTipType });
      
      // In real implementation, this would interact with smart contracts
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully tipped ${amount} ETH!`);
      setTipAmount('');
      setTipMessage('');
    } catch (error) {
      console.error('Error sending tip:', error);
      alert('Failed to send tip. Please try again.');
    }
  };

  const formatCrypto = (amount, symbol) => {
    return `${amount.toFixed(symbol === 'SHM' ? 2 : 4)} ${symbol}`;
  };

  const formatUSD = (amount, rate) => {
    return `$${(amount * rate).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold">Creator Monetization</h1>
              <p className="text-muted-foreground">Support creators and earn from your content</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>

        {/* Wallet Connection */}
        {!isConnectedWallet && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Wallet className="h-12 w-12 text-amber-600" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
                  <p className="text-muted-foreground">Connect your crypto wallet to send and receive tips</p>
                </div>
                <Button onClick={connectWallet} className="bg-amber-600 hover:bg-amber-700">
                  Connect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="send-tip">Send Tip</TabsTrigger>
            <TabsTrigger value="earnings">My Earnings</TabsTrigger>
            <TabsTrigger value="supporters">Supporters</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Earned</p>
                        <p className="text-lg font-bold">{earnings.total} ETH</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">This Month</p>
                        <p className="text-lg font-bold">{earnings.thisMonth} ETH</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Tips</p>
                        <p className="text-lg font-bold">{earnings.tips}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Users className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Supporters</p>
                        <p className="text-lg font-bold">{earnings.supporters}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* How It Works */}
              <Card>
                <CardHeader>
                  <CardTitle>How Creator Monetization Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Wallet className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Connect Wallet</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your crypto wallet to send and receive tips seamlessly
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Coins className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Send Tips</h3>
                      <p className="text-sm text-muted-foreground">
                        Support your favorite creators with crypto tips and messages
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Crown className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Earn Rewards</h3>
                      <p className="text-sm text-muted-foreground">
                        Get special badges and perks based on your support level
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="send-tip" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tip Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Tip Type</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tipTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div
                          key={type.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedTipType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedTipType(type.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 ${type.color} text-white rounded-lg`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{type.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {type.amount > 0 ? `${type.amount} ETH` : 'Choose your amount'}
                              </p>
                            </div>
                            {selectedTipType === type.id && (
                              <Check className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {selectedTipType === 'custom' && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Custom Amount (ETH)</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step="0.001"
                          value={tipAmount}
                          onChange={(e) => setTipAmount(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Message (Optional)</label>
                      <Textarea
                        placeholder="Add a message to your tip..."
                        value={tipMessage}
                        onChange={(e) => setTipMessage(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={sendTip}
                      className="w-full"
                      disabled={!isConnectedWallet}
                    >
                      {!isConnectedWallet ? (
                        <>
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect Wallet to Tip
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Tip
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Crypto Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Supported Cryptocurrencies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {cryptoOptions.map((crypto) => (
                      <div key={crypto.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{crypto.icon}</span>
                          <div>
                            <p className="font-medium">{crypto.name}</p>
                            <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${crypto.rate.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Current rate</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Earnings Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>This Month</span>
                        <span className="font-bold">{earnings.thisMonth} ETH</span>
                      </div>
                      <Progress value={60} />
                      
                      <div className="flex justify-between items-center">
                        <span>Goal: 1.5 ETH</span>
                        <span className="text-sm text-muted-foreground">
                          {((earnings.thisMonth / 1.5) * 100).toFixed(0)}% complete
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Tips Received</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentTips.map((tip) => (
                      <div key={tip.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={tip.from.avatar} />
                          <AvatarFallback>{tip.from.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{tip.from.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {formatCrypto(tip.amount, tip.crypto)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{tip.message}</p>
                          <p className="text-xs text-muted-foreground">{tip.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="supporters" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {supporterTiers.map((tier) => (
                  <Card key={tier.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5" />
                        {tier.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{tier.supporters}</p>
                        <p className="text-sm text-muted-foreground">supporters</p>
                      </div>

                      <div className="space-y-2">
                        <p className="font-medium">Minimum: {tier.minAmount} ETH</p>
                        <div className="space-y-1">
                          {tier.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" />
                              <span className="text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Badge className={tier.color}>
                        {tier.name} Tier
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorMonetization;