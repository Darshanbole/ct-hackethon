import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Wifi,
  WifiOff,
  Download,
  Check,
  Clock,
  Smartphone
} from 'lucide-react';

const PWAStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    // Check if PWA is installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Network status listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service Worker update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
        setShowUpdatePrompt(true);
      });

      // Check for updates periodically
      const checkForUpdates = async () => {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            registration.update();
          }
        } catch (error) {
          console.error('Failed to check for updates:', error);
        }
      };

      // Check for updates every 30 minutes
      const updateInterval = setInterval(checkForUpdates, 30 * 60 * 1000);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        clearInterval(updateInterval);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdateApp = () => {
    window.location.reload();
  };

  const dismissUpdate = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <>
      {/* Status Indicators */}
      <div className="flex items-center gap-2">
        {/* Online/Offline Status */}
        <Badge 
          variant={isOnline ? "default" : "destructive"}
          className="text-xs"
        >
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </>
          )}
        </Badge>

        {/* PWA Installation Status */}
        {isInstalled && (
          <Badge variant="secondary" className="text-xs">
            <Smartphone className="h-3 w-3 mr-1" />
            PWA
          </Badge>
        )}

        {/* Update Available Indicator */}
        {updateAvailable && !showUpdatePrompt && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer animate-pulse"
            onClick={() => setShowUpdatePrompt(true)}
          >
            <Download className="h-3 w-3 mr-1" />
            Update
          </Badge>
        )}
      </div>

      {/* Update Prompt */}
      <AnimatePresence>
        {showUpdatePrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Update Available</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    A new version of Web3 Social is ready to install.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      onClick={handleUpdateApp}
                      className="text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Update Now
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={dismissUpdate}
                      className="text-xs"
                    >
                      Later
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Notification */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 z-50"
          >
            <div className="bg-orange-100 dark:bg-orange-900 border border-orange-200 dark:border-orange-800 rounded-lg p-3 max-w-sm">
              <div className="flex items-center gap-2">
                <WifiOff className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    You're offline
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    Some features may be limited. Changes will sync when you're back online.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAStatus;