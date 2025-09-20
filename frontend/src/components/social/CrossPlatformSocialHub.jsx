import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Image, 
  Video, 
  Smile, 
  Hash, 
  AtSign,
  Globe,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Check,
  X,
  Loader,
  Wallet,
  Coins
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SOCIAL_PLATFORMS = [
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-500', enabled: true },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500', enabled: true },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600', enabled: true },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-500', enabled: true }
];

const CrossPlatformSocialHub = ({ userWallet }) => {
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter', 'instagram', 'facebook', 'youtube']);
  const [isPosting, setIsPosting] = useState(false);
  const [postHistory, setPostHistory] = useState([]);
  const [enableBlockchain, setEnableBlockchain] = useState(true);
  const [gasEstimate, setGasEstimate] = useState('0.002');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [postStatus, setPostStatus] = useState(null);

  // Load post history on component mount
  useEffect(() => {
    loadPostHistory();
  }, []);

  const loadPostHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts/feed');
      if (response.ok) {
        const data = await response.json();
        setPostHistory(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to load post history:', error);
    }
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const fileUrls = files.map(file => URL.createObjectURL(file));
    setMediaFiles(prev => [...prev, ...fileUrls]);
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const createCrossPlatformPost = async () => {
    if (!postContent.trim()) return;

    setIsPosting(true);
    setPostStatus({ type: 'info', message: 'Creating cross-platform post...' });

    try {
      // Step 1: Create post in database with cross-platform publishing
      const postResponse = await fetch('http://localhost:5000/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: postContent,
          user_wallet: userWallet,
          media_urls: mediaFiles,
          post_type: mediaFiles.length > 0 ? 'media' : 'text',
          cross_post: true,
          platforms: selectedPlatforms
        })
      });

      if (!postResponse.ok) {
        throw new Error('Failed to create post');
      }

      const postData = await postResponse.json();
      
      // Step 2: Record blockchain transaction if enabled
      if (enableBlockchain && userWallet) {
        setPostStatus({ type: 'info', message: 'Recording on blockchain...' });
        
        try {
          // Send a small transaction to record the post on blockchain
          const transactionHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: userWallet,
              to: userWallet, // Send to self as a record
              value: '0x0', // 0 ETH
              data: `0x${Buffer.from(JSON.stringify({
                type: 'social_post',
                content: postContent.substring(0, 100),
                platforms: selectedPlatforms,
                timestamp: Date.now()
              })).toString('hex')}`
            }]
          });

          // Record the blockchain transaction
          await fetch('http://localhost:5000/api/transactions/record', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from_wallet: userWallet,
              to_wallet: userWallet,
              amount: 0,
              transaction_hash: transactionHash,
              transaction_type: 'social_post',
              related_post_id: postData.post_id,
              status: 'confirmed'
            })
          });

          setPostStatus({ 
            type: 'success', 
            message: `Post published to ${selectedPlatforms.length} platforms and recorded on blockchain!` 
          });
        } catch (blockchainError) {
          console.error('Blockchain recording failed:', blockchainError);
          setPostStatus({ 
            type: 'warning', 
            message: `Post published to ${selectedPlatforms.length} platforms (blockchain recording failed)` 
          });
        }
      } else {
        setPostStatus({ 
          type: 'success', 
          message: `Post published to ${selectedPlatforms.length} platforms!` 
        });
      }

      // Reset form
      setPostContent('');
      setMediaFiles([]);
      await loadPostHistory();

    } catch (error) {
      console.error('Failed to create post:', error);
      setPostStatus({ type: 'error', message: 'Failed to create post. Please try again.' });
    } finally {
      setIsPosting(false);
      setTimeout(() => setPostStatus(null), 5000);
    }
  };

  const getPlatformStatus = (crossPlatformStatus, platformId) => {
    if (!crossPlatformStatus) return 'pending';
    const platformData = crossPlatformStatus[platformId];
    return platformData?.status || 'pending';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Cross-Platform Social Hub
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Post once, publish everywhere. Connect all your social platforms with blockchain verification.
          </p>
        </motion.div>

        {/* Status Alert */}
        <AnimatePresence>
          {postStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert className={`border ${
                postStatus.type === 'success' ? 'border-green-200 bg-green-50' :
                postStatus.type === 'error' ? 'border-red-200 bg-red-50' :
                postStatus.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                'border-blue-200 bg-blue-50'
              }`}>
                <AlertDescription className={
                  postStatus.type === 'success' ? 'text-green-700' :
                  postStatus.type === 'error' ? 'text-red-700' :
                  postStatus.type === 'warning' ? 'text-yellow-700' :
                  'text-blue-700'
                }>
                  {postStatus.message}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Post Creation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Create Cross-Platform Post
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Post Content */}
                <div>
                  <Textarea
                    placeholder="What's happening across all your social platforms?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="min-h-[120px] text-lg resize-none border-0 bg-gray-50 focus:bg-white transition-colors"
                    maxLength={280}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-500">
                      {postContent.length}/280 characters
                    </div>
                    <div className="text-sm text-gray-500">
                      Publishing to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Media Upload */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                      id="media-upload"
                    />
                    <label htmlFor="media-upload">
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <Image className="w-4 h-4 mr-2" />
                        Add Media
                      </Button>
                    </label>
                  </div>
                  
                  {/* Media Preview */}
                  {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {mediaFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={file}
                            alt={`Media ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeMedia(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Platform Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Publish To:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {SOCIAL_PLATFORMS.map((platform) => {
                      const Icon = platform.icon;
                      const isSelected = selectedPlatforms.includes(platform.id);
                      
                      return (
                        <div
                          key={platform.id}
                          onClick={() => togglePlatform(platform.id)}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-purple-300 bg-purple-50' 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${platform.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{platform.name}</p>
                          </div>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Blockchain Options */}
                {userWallet && (
                  <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-purple-600" />
                        <Label className="text-sm font-medium">Blockchain Verification</Label>
                      </div>
                      <Switch
                        checked={enableBlockchain}
                        onCheckedChange={setEnableBlockchain}
                      />
                    </div>
                    {enableBlockchain && (
                      <div className="text-xs text-gray-600 flex items-center gap-2">
                        <Coins className="w-3 h-3" />
                        Estimated gas fee: ~{gasEstimate} ETH
                      </div>
                    )}
                  </div>
                )}

                {/* Post Button */}
                <Button
                  onClick={createCrossPlatformPost}
                  disabled={!postContent.trim() || selectedPlatforms.length === 0 || isPosting}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 h-12"
                >
                  {isPosting ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publish to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Post History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Recent Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto space-y-3">
                {postHistory.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No posts yet</p>
                ) : (
                  postHistory.slice(0, 10).map((post) => (
                    <div key={post.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm mb-2 line-clamp-2">{post.content}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {SOCIAL_PLATFORMS.map((platform) => {
                          const status = getPlatformStatus(post.cross_platform_status, platform.id);
                          const Icon = platform.icon;
                          
                          return (
                            <div
                              key={platform.id}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                status === 'success' ? 'bg-green-100 text-green-700' :
                                status === 'error' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <Icon className="w-3 h-3" />
                              {status === 'success' ? '✓' : status === 'error' ? '✗' : '○'}
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimestamp(post.created_at)}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CrossPlatformSocialHub;