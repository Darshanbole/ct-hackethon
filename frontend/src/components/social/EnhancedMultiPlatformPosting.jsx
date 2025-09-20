import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Wallet, 
  DollarSign, 
  Check, 
  X, 
  AlertCircle,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Zap,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

const SOCIAL_PLATFORMS = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-blue-500',
    charge: 0.001,
    description: 'Post to Twitter/X'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    charge: 0.001,
    description: 'Post to Facebook'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    charge: 0.0015,
    description: 'Post to Instagram'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700',
    charge: 0.002,
    description: 'Post to LinkedIn'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: 'bg-red-600',
    charge: 0.003,
    description: 'Post to YouTube Community'
  }
];

const EnhancedMultiPlatformPosting = ({ userWallet }) => {
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState({});
  const [isPosting, setIsPosting] = useState(false);
  const [postingProgress, setPostingProgress] = useState({});
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [ethBalance, setEthBalance] = useState(0);
  const [transactionHash, setTransactionHash] = useState('');
  const [postResults, setPostResults] = useState({});
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    checkWalletConnection();
    if (userWallet) {
      setWalletAddress(userWallet);
      setWalletConnected(true);
      loadWalletBalance();
    }
  }, [userWallet]);

  useEffect(() => {
    calculateTotalCost();
  }, [selectedPlatforms]);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
          loadWalletBalance();
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        loadWalletBalance();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this feature!');
    }
  };

  const loadWalletBalance = async () => {
    if (typeof window.ethereum !== 'undefined' && walletAddress) {
      try {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [walletAddress, 'latest']
        });
        const ethBalance = parseInt(balance, 16) / Math.pow(10, 18);
        setEthBalance(ethBalance);
      } catch (error) {
        console.error('Error loading balance:', error);
      }
    }
  };

  const calculateTotalCost = () => {
    const cost = SOCIAL_PLATFORMS.reduce((total, platform) => {
      if (selectedPlatforms[platform.id]) {
        return total + platform.charge;
      }
      return total;
    }, 0);
    setTotalCost(cost);
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platformId]: !prev[platformId]
    }));
  };

  const selectAllPlatforms = () => {
    const allSelected = SOCIAL_PLATFORMS.reduce((acc, platform) => {
      acc[platform.id] = true;
      return acc;
    }, {});
    setSelectedPlatforms(allSelected);
  };

  const processPayment = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return false;
    }

    if (ethBalance < totalCost) {
      alert(`Insufficient balance. You need ${totalCost.toFixed(4)} ETH`);
      return false;
    }

    try {
      const transactionParameters = {
        to: '0x742d35Cc6b3c8D21C04A7b7D7A4DA1E5CF1A9D2E', // Your receiving address
        from: walletAddress,
        value: '0x' + Math.floor(totalCost * Math.pow(10, 18)).toString(16),
        gas: '0x5208', // 21000 in hex
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      setTransactionHash(txHash);
      
      // Record transaction in backend
      await fetch('http://localhost:5000/api/transactions/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          transaction_hash: txHash,
          amount: totalCost,
          platforms: Object.keys(selectedPlatforms).filter(key => selectedPlatforms[key]),
          content: postContent
        })
      });

      return true;
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed: ' + error.message);
      return false;
    }
  };

  const postToSocialPlatforms = async () => {
    if (!postContent.trim()) {
      alert('Please enter some content to post');
      return;
    }

    if (Object.keys(selectedPlatforms).filter(key => selectedPlatforms[key]).length === 0) {
      alert('Please select at least one platform');
      return;
    }

    setShowPaymentDialog(true);
  };

  const confirmPostWithPayment = async () => {
    setShowPaymentDialog(false);
    setIsPosting(true);
    setPostingProgress({});
    setPostResults({});

    // Process payment first
    const paymentSuccess = await processPayment();
    if (!paymentSuccess) {
      setIsPosting(false);
      return;
    }

    // Post to selected platforms
    const selectedPlatformIds = Object.keys(selectedPlatforms).filter(key => selectedPlatforms[key]);
    
    for (const platformId of selectedPlatformIds) {
      setPostingProgress(prev => ({ ...prev, [platformId]: 'posting' }));
      
      try {
        const response = await fetch('http://localhost:5000/api/social/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            platform: platformId,
            content: postContent,
            wallet_address: walletAddress,
            transaction_hash: transactionHash
          })
        });

        const result = await response.json();
        
        if (result.success) {
          setPostingProgress(prev => ({ ...prev, [platformId]: 'success' }));
          setPostResults(prev => ({ ...prev, [platformId]: result }));
        } else {
          setPostingProgress(prev => ({ ...prev, [platformId]: 'error' }));
          setPostResults(prev => ({ ...prev, [platformId]: { error: result.error } }));
        }
      } catch (error) {
        setPostingProgress(prev => ({ ...prev, [platformId]: 'error' }));
        setPostResults(prev => ({ ...prev, [platformId]: { error: error.message } }));
      }

      // Add delay between posts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsPosting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'posting': return <Clock className="w-4 h-4 animate-spin" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 Multi-Platform Social Posting
          </h1>
          <p className="text-gray-300 text-lg">
            Post to all your social platforms with a single click using Web3 payments
          </p>
        </motion.div>

        {/* Wallet Connection */}
        <Card className="mb-6 bg-black/30 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {walletConnected ? (
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Connected
                  </Badge>
                  <p className="text-gray-300 text-sm mt-1">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Balance: {ethBalance.toFixed(4)} ETH
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">darshanbole69@gmail.com</p>
                  <p className="text-gray-400 text-sm">Authenticated User</p>
                </div>
              </div>
            ) : (
              <Button onClick={connectWallet} className="w-full">
                Connect MetaMask Wallet
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Post Content */}
        <Card className="mb-6 bg-black/30 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Create Your Post</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What would you like to share across all platforms?"
              className="min-h-[120px] bg-black/40 border-gray-600 text-white placeholder-gray-400"
              maxLength={280}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-400 text-sm">
                {postContent.length}/280 characters
              </span>
              <Button
                onClick={selectAllPlatforms}
                variant="outline"
                size="sm"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
              >
                Select All Platforms
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Platform Selection */}
        <Card className="mb-6 bg-black/30 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Select Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SOCIAL_PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms[platform.id];
                
                return (
                  <motion.div
                    key={platform.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400' 
                          : 'bg-black/40 border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${platform.color}`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{platform.name}</h3>
                              <p className="text-gray-400 text-sm">{platform.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Switch 
                              checked={isSelected} 
                              onCheckedChange={() => togglePlatform(platform.id)}
                            />
                            <p className="text-gray-400 text-xs mt-1">
                              {platform.charge} ETH
                            </p>
                            {postingProgress[platform.id] && (
                              <div className="mt-1">
                                {getStatusIcon(postingProgress[platform.id])}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Cost Summary */}
        {Object.keys(selectedPlatforms).some(key => selectedPlatforms[key]) && (
          <Card className="mb-6 bg-black/30 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Total Cost</span>
                </div>
                <div className="text-right">
                  <span className="text-yellow-400 font-bold text-lg">
                    {totalCost.toFixed(4)} ETH
                  </span>
                  <p className="text-gray-400 text-sm">
                    ≈ ${(totalCost * 3200).toFixed(2)} USD
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Post Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={postToSocialPlatforms}
            disabled={!walletConnected || isPosting || !postContent.trim()}
            className="w-full h-12 text-lg font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50"
          >
            {isPosting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Posting to Platforms...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Post to Selected Platforms
              </div>
            )}
          </Button>
        </motion.div>

        {/* Payment Confirmation Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="bg-black/90 border-purple-500/30">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Confirm Payment & Post
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Alert className="bg-yellow-500/20 border-yellow-500/30">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-100">
                  You will be charged {totalCost.toFixed(4)} ETH to post to {Object.keys(selectedPlatforms).filter(key => selectedPlatforms[key]).length} platform(s)
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <p className="text-gray-300 font-medium">Selected Platforms:</p>
                {SOCIAL_PLATFORMS.filter(p => selectedPlatforms[p.id]).map(platform => (
                  <div key={platform.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{platform.name}</span>
                    <span className="text-white">{platform.charge} ETH</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowPaymentDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmPostWithPayment}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500"
                >
                  Confirm & Pay
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Transaction Hash Display */}
        {transactionHash && (
          <Card className="mt-6 bg-black/30 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Payment Successful</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transaction Hash: {transactionHash}
              </p>
              <a 
                href={`https://etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View on Etherscan →
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedMultiPlatformPosting;