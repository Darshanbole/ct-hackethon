import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Smartphone,
  X,
  Check,
  Wifi,
  Bell,
  Zap,
  Share,
  Settings
} from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check for iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt after a delay if not already dismissed
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const showManualInstallInstructions = () => {
    setShowInstallPrompt(true);
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Floating Install Button */}
      {!showInstallPrompt && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Button
            onClick={showManualInstallInstructions}
            className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700"
            size="icon"
          >
            <Download className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      {/* Install Prompt Modal */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <Card className="border-0 shadow-2xl">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Smartphone className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Install Web3 Social</h3>
                          <p className="text-white/80 text-sm">Get the full app experience</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDismiss}
                        className="text-white hover:bg-white/20"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <Badge className="bg-white/20 text-white border-white/30">
                      Progressive Web App
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Zap className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Lightning Fast</p>
                          <p className="text-sm text-muted-foreground">Instant loading and smooth performance</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Wifi className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Works Offline</p>
                          <p className="text-sm text-muted-foreground">Access your content even without internet</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Bell className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">Never miss important updates</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Share className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">Native Experience</p>
                          <p className="text-sm text-muted-foreground">App-like interface on your device</p>
                        </div>
                      </div>
                    </div>

                    {/* Install Instructions */}
                    {isIOS ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            iOS Installation
                          </h4>
                          <ol className="text-sm space-y-1 text-muted-foreground">
                            <li>1. Tap the Share button in Safari</li>
                            <li>2. Scroll down and tap "Add to Home Screen"</li>
                            <li>3. Tap "Add" to install the app</li>
                          </ol>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          onClick={handleInstallClick}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          disabled={!deferredPrompt}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Install App
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleDismiss}
                          className="flex-1"
                        >
                          Maybe Later
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAInstallPrompt;