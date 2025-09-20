import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Coffee,
  Heart,
  Crown,
  Gift,
  Send,
  X,
  Wallet,
  Zap
} from 'lucide-react';

const TipButton = ({ creator, postId }) => {
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const tipPresets = [
    { id: 'coffee', icon: Coffee, label: 'Coffee', amount: 0.01, color: 'bg-amber-500' },
    { id: 'support', icon: Heart, label: 'Support', amount: 0.05, color: 'bg-red-500' },
    { id: 'premium', icon: Crown, label: 'Premium', amount: 0.1, color: 'bg-purple-500' }
  ];

  const handleTip = async () => {
    const amount = selectedAmount?.amount || parseFloat(customAmount) || 0;
    
    if (amount <= 0) {
      alert('Please select or enter a valid tip amount');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate tip transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Tip sent:', {
        creator: creator.name,
        amount,
        message: tipMessage,
        postId
      });

      // Show success notification
      alert(`Successfully tipped ${amount} ETH to ${creator.name}!`);
      
      setShowTipModal(false);
      setSelectedAmount(null);
      setCustomAmount('');
      setTipMessage('');
    } catch (error) {
      console.error('Error sending tip:', error);
      alert('Failed to send tip. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowTipModal(true)}
        className="gap-1 hover:bg-green-50 hover:border-green-200"
      >
        <DollarSign className="h-3 w-3" />
        Tip
      </Button>

      <AnimatePresence>
        {showTipModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Tip {creator.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowTipModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Quick Tip Options */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Quick Tip</label>
                    <div className="grid grid-cols-3 gap-2">
                      {tipPresets.map((preset) => {
                        const Icon = preset.icon;
                        return (
                          <Button
                            key={preset.id}
                            variant={selectedAmount?.id === preset.id ? "default" : "outline"}
                            className="h-16 flex-col gap-1"
                            onClick={() => {
                              setSelectedAmount(preset);
                              setCustomAmount('');
                            }}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-xs">{preset.label}</span>
                            <span className="text-xs font-bold">{preset.amount} ETH</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Custom Amount (ETH)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.001"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message (Optional)</label>
                    <Textarea
                      placeholder="Say something nice..."
                      value={tipMessage}
                      onChange={(e) => setTipMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Tip Summary */}
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Amount:</span>
                      <span className="font-medium">
                        {(selectedAmount?.amount || parseFloat(customAmount) || 0).toFixed(4)} ETH
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">USD Value:</span>
                      <span className="text-sm text-muted-foreground">
                        ~${((selectedAmount?.amount || parseFloat(customAmount) || 0) * 3200).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Send Tip Button */}
                  <Button
                    onClick={handleTip}
                    disabled={isProcessing || (!selectedAmount && !customAmount)}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending Tip...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Tip
                      </>
                    )}
                  </Button>

                  {/* Info */}
                  <div className="text-xs text-muted-foreground text-center">
                    Tips are sent directly to the creator's wallet
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TipButton;