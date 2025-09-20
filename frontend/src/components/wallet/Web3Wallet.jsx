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
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock crypto data
const CRYPTO_CURRENCIES = [
  { symbol: 'ETH', name: 'Ethereum', price: 3200, balance: 2.45, icon: '⟠' },
  { symbol: 'BTC', name: 'Bitcoin', price: 65000, balance: 0.15, icon: '₿' },
  { symbol: 'USDC', name: 'USD Coin', price: 1, balance: 850, icon: '$' },
  { symbol: 'MATIC', name: 'Polygon', price: 0.85, balance: 1200, icon: '⬡' }
];

const TRANSACTION_HISTORY = [
  { id: 1, type: 'send', amount: 0.5, currency: 'ETH', to: '0x1234...5678', date: '2024-01-15', status: 'completed' },
  { id: 2, type: 'receive', amount: 100, currency: 'USDC', from: '0x9876...4321', date: '2024-01-14', status: 'completed' },
  { id: 3, type: 'send', amount: 0.02, currency: 'BTC', to: '0x5555...7777', date: '2024-01-13', status: 'pending' },
  { id: 4, type: 'receive', amount: 200, currency: 'MATIC', from: '0x3333...9999', date: '2024-01-12', status: 'completed' }
];

const Web3Wallet = () => {
  const [walletAddress] = useState('0x742d35Cc6b3c8D21C04A7b7D7A4DA1E5CF1A9D2E');
  const [isConnected, setIsConnected] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(CRYPTO_CURRENCIES[0]);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);

  const totalBalance = CRYPTO_CURRENCIES.reduce((sum, crypto) => 
    sum + (crypto.balance * crypto.price), 0
  );

  const connectWallet = () => {
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(walletAddress);
    // You could add a toast notification here
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : undefined,
      minimumFractionDigits: currency === 'USD' ? 2 : 4
    }).format(amount);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Web3 Wallet</CardTitle>
              <p className="text-white/70">Connect your wallet to access decentralized apps</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
              <div className="text-center text-white/60 text-sm">
                <p>Secure • Decentralized • Your Keys, Your Crypto</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">My Wallet</h1>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/70">{formatAddress(walletAddress)}</span>
                      <button onClick={copyAddress} className="text-white/50 hover:text-white">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Connected
                  </Badge>
                  <Button 
                    onClick={disconnectWallet}
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Balance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Total Balance</h2>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white/70 hover:text-white"
                >
                  {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              <div className="text-3xl font-bold text-white mb-6">
                {showBalance ? formatCurrency(totalBalance) : '••••••'}
              </div>
              <div className="flex space-x-4">
                <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                      <ArrowUp className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Send Crypto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="recipient" className="text-white">Recipient Address</Label>
                        <Input
                          id="recipient"
                          placeholder="0x..."
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount" className="text-white">Amount</Label>
                        <Input
                          id="amount"
                          placeholder="0.00"
                          type="number"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                      <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500">
                        Send {selectedCurrency.symbol}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                      <ArrowDown className="w-4 h-4 mr-2" />
                      Receive
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Receive Crypto</DialogTitle>
                    </DialogHeader>
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-48 h-48 bg-white p-4 rounded-lg">
                        <QrCode className="w-full h-full text-gray-800" />
                      </div>
                      <div>
                        <Label className="text-white">Your Address</Label>
                        <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                          <code className="text-green-400 text-sm break-all">{walletAddress}</code>
                        </div>
                      </div>
                      <Button onClick={copyAddress} variant="outline" className="border-gray-600 text-white">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Address
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <Tabs defaultValue="assets" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/10">
                  <TabsTrigger value="assets" className="data-[state=active]:bg-white/20">Assets</TabsTrigger>
                  <TabsTrigger value="transactions" className="data-[state=active]:bg-white/20">Transactions</TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-white/20">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="assets" className="space-y-4">
                  {CRYPTO_CURRENCIES.map((crypto, index) => (
                    <motion.div
                      key={crypto.symbol}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => setSelectedCurrency(crypto)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{crypto.icon}</div>
                        <div>
                          <div className="font-semibold text-white">{crypto.name}</div>
                          <div className="text-white/70 text-sm">{crypto.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">
                          {showBalance ? `${crypto.balance} ${crypto.symbol}` : '••••••'}
                        </div>
                        <div className="text-white/70 text-sm">
                          {showBalance ? formatCurrency(crypto.balance * crypto.price) : '••••••'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                  {TRANSACTION_HISTORY.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          tx.type === 'send' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {tx.type === 'send' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-white capitalize">{tx.type}</div>
                          <div className="text-white/70 text-sm">
                            {tx.type === 'send' ? `To: ${formatAddress(tx.to)}` : `From: ${formatAddress(tx.from)}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          tx.type === 'send' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.currency}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white/70 text-sm">{tx.date}</span>
                          <Badge 
                            variant={tx.status === 'completed' ? 'default' : 'secondary'}
                            className={tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
                          >
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Security</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Two-Factor Authentication</span>
                        <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Network</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Current Network</span>
                        <Badge className="bg-blue-500/20 text-blue-400">Ethereum Mainnet</Badge>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Privacy</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Analytics</span>
                        <Badge className="bg-red-500/20 text-red-400">Disabled</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Web3Wallet;