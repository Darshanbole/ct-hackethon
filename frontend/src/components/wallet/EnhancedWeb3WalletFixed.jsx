import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Send, 
  QrCode, 
  History, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy, 
  ArrowUp, 
  ArrowDown,
  Settings,
  Shield,
  Globe,
  Heart,
  MessageCircle,
  Share,
  Gift,
  Users,
  Vote,
  Ticket,
  ExternalLink,
  Zap,
  Star,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Enhanced crypto data with real-world styling
const CRYPTO_CURRENCIES = [
  { 
    symbol: 'ETH', 
    name: 'Ethereum', 
    price: 3200, 
    balance: 2.45, 
    icon: '⟠',
    color: 'from-blue-500 to-purple-600',
    change: '+2.4%'
  },
  { 
    symbol: 'MATIC', 
    name: 'Polygon', 
    price: 0.85, 
    balance: 1200, 
    icon: '⬡',
    color: 'from-purple-500 to-pink-500',
    change: '+5.1%'
  },
  { 
    symbol: 'BNB', 
    name: 'BNB Smart Chain', 
    price: 320, 
    balance: 5.2, 
    icon: '💎',
    color: 'from-yellow-400 to-orange-500',
    change: '-1.2%'
  },
  { 
    symbol: 'USDC', 
    name: 'USD Coin', 
    price: 1, 
    balance: 850, 
    icon: '$',
    color: 'from-green-400 to-blue-500',
    change: '+0.0%'
  }
];

const EnhancedWeb3Wallet = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(CRYPTO_CURRENCIES[0]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Social transaction states
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [tipRecipient, setTipRecipient] = useState('');
  
  // Savings pool states
  const [showPoolDialog, setShowPoolDialog] = useState(false);
  const [poolName, setPoolName] = useState('');
  const [poolTarget, setPoolTarget] = useState('');
  const [poolDescription, setPoolDescription] = useState('');
  
  // NFT ticket states
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [eventName, setEventName] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketSupply, setTicketSupply] = useState('');

  // Mock transactions for demo
  const mockTransactions = [
    {
      id: '1',
      type: 'received',
      amount: 0.5,
      currency: 'ETH',
      from: '0x742d...35Dd',
      to: walletAddress,
      timestamp: '2024-01-15T10:30:00Z',
      status: 'confirmed'
    },
    {
      id: '2',
      type: 'sent',
      amount: 100,
      currency: 'USDC',
      from: walletAddress,
      to: '0x123a...45Bc',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'confirmed'
    }
  ];

  // Connect to MetaMask
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        setTransactions(mockTransactions);
        
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please install MetaMask to use this feature!');
    }
  };

  // Load transactions
  const loadTransactions = async (wallet) => {
    try {
      // Mock API call - replace with actual backend call
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  // Send tip to content creator
  const sendTip = async () => {
    if (!tipAmount || !tipRecipient) return;
    
    try {
      setIsLoading(true);
      
      // Mock transaction for demo
      const newTransaction = {
        id: Date.now().toString(),
        type: 'tip',
        amount: parseFloat(tipAmount),
        currency: selectedCurrency.symbol,
        from: walletAddress,
        to: tipRecipient,
        timestamp: new Date().toISOString(),
        status: 'confirmed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setShowTipDialog(false);
      setTipAmount('');
      setTipRecipient('');
      
    } catch (error) {
      console.error('Failed to send tip:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create savings pool
  const createSavingsPool = async () => {
    if (!poolName || !poolTarget || !poolDescription) return;
    
    try {
      setIsLoading(true);
      
      // Mock pool creation
      const newTransaction = {
        id: Date.now().toString(),
        type: 'pool_creation',
        amount: 0,
        currency: selectedCurrency.symbol,
        from: walletAddress,
        to: 'Savings Pool',
        timestamp: new Date().toISOString(),
        status: 'confirmed',
        metadata: { poolName, poolTarget, poolDescription }
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setShowPoolDialog(false);
      setPoolName('');
      setPoolTarget('');
      setPoolDescription('');
      
    } catch (error) {
      console.error('Failed to create savings pool:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create NFT ticket
  const createNFTTicket = async () => {
    if (!eventName || !ticketPrice || !ticketSupply) return;
    
    try {
      setIsLoading(true);
      
      // Mock NFT ticket creation
      const newTransaction = {
        id: Date.now().toString(),
        type: 'nft_creation',
        amount: parseFloat(ticketPrice),
        currency: selectedCurrency.symbol,
        from: walletAddress,
        to: 'NFT Marketplace',
        timestamp: new Date().toISOString(),
        status: 'confirmed',
        metadata: { eventName, ticketPrice, ticketSupply }
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setShowTicketDialog(false);
      setEventName('');
      setTicketPrice('');
      setTicketSupply('');
      
    } catch (error) {
      console.error('Failed to create NFT ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "now";
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getTotalBalance = () => {
    return CRYPTO_CURRENCIES.reduce((total, currency) => {
      return total + (currency.balance * currency.price);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOWZhZmIiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Social Web3 Wallet
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of social finance with integrated DeFi, NFTs, and community features
          </p>
        </motion.div>

        {!isConnected ? (
          // Connection Screen
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-gray-600 mb-8">
                  Connect your MetaMask wallet to access social Web3 features
                </p>
                <Button 
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Connect MetaMask
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          // Main Wallet Interface
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Portfolio Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="xl:col-span-3 space-y-6"
            >
              {/* Balance Card */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold">Portfolio Overview</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowBalance(!showBalance)}
                      className="h-10 w-10"
                    >
                      {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-4xl font-bold mb-2">
                      {showBalance ? `$${formatNumber(getTotalBalance())}` : '••••••'}
                    </div>
                    <div className="text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +$1,234 (3.2%) today
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">{walletAddress}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(walletAddress)}
                      className="h-6 w-6 ml-auto"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Asset Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CRYPTO_CURRENCIES.map((currency) => (
                      <motion.div
                        key={currency.symbol}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl bg-gradient-to-r ${currency.color} text-white cursor-pointer`}
                        onClick={() => setSelectedCurrency(currency)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{currency.icon}</span>
                            <div>
                              <div className="font-semibold">{currency.symbol}</div>
                              <div className="text-xs opacity-80">{currency.name}</div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-white/20 text-white border-0">
                            {currency.change}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {showBalance ? formatNumber(currency.balance) : '••••'}
                          </div>
                          <div className="text-sm opacity-80">
                            {showBalance ? `$${formatNumber(currency.balance * currency.price)}` : '••••'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Transaction History */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No transactions yet
                      </div>
                    ) : (
                      transactions.map((tx) => (
                        <motion.div
                          key={tx.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === 'received' || tx.type === 'tip' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {tx.type === 'received' || tx.type === 'tip' ? (
                                <ArrowDown className={`w-5 h-5 ${tx.type === 'tip' ? 'text-pink-600' : 'text-green-600'}`} />
                              ) : (
                                <ArrowUp className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold capitalize">
                                {tx.type.replace('_', ' ')}
                              </div>
                              <div className="text-sm text-gray-600">
                                {tx.type === 'received' ? `From ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : 
                                 tx.type === 'sent' ? `To ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` :
                                 tx.metadata?.poolName || tx.metadata?.eventName || tx.to}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${
                              tx.type === 'received' ? 'text-green-600' : 'text-gray-900'
                            }`}>
                              {tx.type === 'received' ? '+' : '-'}{tx.amount} {tx.currency}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatTime(tx.timestamp)}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Actions Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Quick Actions */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send Crypto
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                    <QrCode className="w-4 h-4 mr-2" />
                    Receive
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    Stake Assets
                  </Button>
                </CardContent>
              </Card>

              {/* Social Features */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Social Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Dialog open={showTipDialog} onOpenChange={setShowTipDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Gift className="w-4 h-4 mr-2" />
                        Tip Creator
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Tip to Creator</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="tipRecipient">Recipient Address</Label>
                          <Input
                            id="tipRecipient"
                            value={tipRecipient}
                            onChange={(e) => setTipRecipient(e.target.value)}
                            placeholder="0x..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="tipAmount">Amount ({selectedCurrency.symbol})</Label>
                          <Input
                            id="tipAmount"
                            type="number"
                            value={tipAmount}
                            onChange={(e) => setTipAmount(e.target.value)}
                            placeholder="0.0"
                          />
                        </div>
                        <Button onClick={sendTip} disabled={isLoading} className="w-full">
                          Send Tip
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showPoolDialog} onOpenChange={setShowPoolDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Create Pool
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Savings Pool</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="poolName">Pool Name</Label>
                          <Input
                            id="poolName"
                            value={poolName}
                            onChange={(e) => setPoolName(e.target.value)}
                            placeholder="Emergency Fund Pool"
                          />
                        </div>
                        <div>
                          <Label htmlFor="poolTarget">Target Amount ({selectedCurrency.symbol})</Label>
                          <Input
                            id="poolTarget"
                            type="number"
                            value={poolTarget}
                            onChange={(e) => setPoolTarget(e.target.value)}
                            placeholder="100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="poolDescription">Description</Label>
                          <Input
                            id="poolDescription"
                            value={poolDescription}
                            onChange={(e) => setPoolDescription(e.target.value)}
                            placeholder="Saving for emergencies..."
                          />
                        </div>
                        <Button onClick={createSavingsPool} disabled={isLoading} className="w-full">
                          Create Pool
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Ticket className="w-4 h-4 mr-2" />
                        NFT Tickets
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create NFT Event Tickets</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="eventName">Event Name</Label>
                          <Input
                            id="eventName"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder="Web3 Conference 2024"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ticketPrice">Ticket Price ({selectedCurrency.symbol})</Label>
                          <Input
                            id="ticketPrice"
                            type="number"
                            value={ticketPrice}
                            onChange={(e) => setTicketPrice(e.target.value)}
                            placeholder="0.1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ticketSupply">Total Supply</Label>
                          <Input
                            id="ticketSupply"
                            type="number"
                            value={ticketSupply}
                            onChange={(e) => setTicketSupply(e.target.value)}
                            placeholder="100"
                          />
                        </div>
                        <Button onClick={createNFTTicket} disabled={isLoading} className="w-full">
                          Create NFT Tickets
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full justify-start">
                    <Vote className="w-4 h-4 mr-2" />
                    Community Vote
                  </Button>
                </CardContent>
              </Card>

              {/* Network Status */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Ethereum Mainnet</p>
                      <p className="text-sm text-gray-600">Connected</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedWeb3Wallet;