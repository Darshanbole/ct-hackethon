import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  Award,
  Zap,
  Gift,
  TrendingUp,
  X,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

const RealTimeNotifications = ({ user, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState('all'); // all, mentions, likes, follows, achievements
  const wsRef = useRef(null);
  const audioRef = useRef(null);

  // Mock real-time notifications
  const mockNotifications = [
    {
      id: '1',
      type: 'like',
      user: {
        name: 'Alice Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        username: 'alicesmith'
      },
      message: 'liked your post',
      content: 'Just deployed my first smart contract...',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
      actionUrl: '/post/123'
    },
    {
      id: '2',
      type: 'comment',
      user: {
        name: 'Bob Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
        username: 'bobjohnson'
      },
      message: 'commented on your post',
      content: 'Great work! Could you share the contract address?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionUrl: '/post/123'
    },
    {
      id: '3',
      type: 'follow',
      user: {
        name: 'Carol Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
        username: 'caroldavis'
      },
      message: 'started following you',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: true,
      actionUrl: '/profile/caroldavis'
    },
    {
      id: '4',
      type: 'achievement',
      message: 'earned the "Early Adopter" badge',
      content: 'For being one of the first 100 users!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      badge: {
        name: 'Early Adopter',
        icon: '🚀',
        color: 'bg-purple-500'
      }
    },
    {
      id: '5',
      type: 'mention',
      user: {
        name: 'David Kim',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
        username: 'davidk'
      },
      message: 'mentioned you in a post',
      content: '@johndoe check out this amazing DeFi project!',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: false,
      actionUrl: '/post/456'
    },
    {
      id: '6',
      type: 'share',
      user: {
        name: 'Eva Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eva',
        username: 'evawilson'
      },
      message: 'shared your post',
      content: 'Just deployed my first smart contract...',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      actionUrl: '/post/123'
    }
  ];

  useEffect(() => {
    // Initialize notifications
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    // Simulate WebSocket connection
    const connectWebSocket = () => {
      // In a real app, you'd connect to your WebSocket server
      // wsRef.current = new WebSocket('ws://localhost:8080');
      
      // Simulate receiving real-time notifications
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every 10 seconds
          const newNotification = generateRandomNotification();
          addNotification(newNotification);
        }
      }, 10000);

      return () => {
        clearInterval(interval);
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    };

    const cleanup = connectWebSocket();
    return cleanup;
  }, []);

  const generateRandomNotification = () => {
    const types = ['like', 'comment', 'follow', 'mention', 'share'];
    const users = [
      { name: 'Frank Miller', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank', username: 'frank' },
      { name: 'Grace Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace', username: 'grace' },
      { name: 'Henry Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=henry', username: 'henry' }
    ];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    return {
      id: `new-${Date.now()}`,
      type,
      user: randomUser,
      message: getMessageForType(type),
      content: type === 'comment' ? 'This is really interesting!' : 'Your latest post about Web3...',
      timestamp: new Date(),
      read: false,
      actionUrl: '/post/new'
    };
  };

  const getMessageForType = (type) => {
    const messages = {
      like: 'liked your post',
      comment: 'commented on your post',
      follow: 'started following you',
      mention: 'mentioned you in a post',
      share: 'shared your post'
    };
    return messages[type] || 'interacted with your content';
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Play notification sound
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification('New Social Notification', {
        body: `${notification.user?.name || 'Someone'} ${notification.message}`,
        icon: notification.user?.avatar || '/favicon.ico',
        tag: notification.id
      });
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      like: Heart,
      comment: MessageCircle,
      follow: UserPlus,
      mention: Bell,
      share: Share2,
      achievement: Award
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      like: 'text-red-500',
      comment: 'text-blue-500',
      follow: 'text-green-500',
      mention: 'text-purple-500',
      share: 'text-orange-500',
      achievement: 'text-yellow-500'
    };
    return colors[type] || 'text-gray-500';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'mentions') return notification.type === 'mention';
    if (filter === 'likes') return notification.type === 'like';
    if (filter === 'follows') return notification.type === 'follow';
    if (filter === 'achievements') return notification.type === 'achievement';
    return true;
  });

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Audio element for notification sounds */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification-sound.mp3" type="audio/mpeg" />
        <source src="/notification-sound.ogg" type="audio/ogg" />
      </audio>

      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed top-0 right-0 h-full w-96 bg-background/95 backdrop-blur-lg border-l border-border shadow-2xl z-50"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <h2 className="font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={requestNotificationPermission}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
            {['all', 'mentions', 'likes', 'follows', 'achievements'].map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(filterOption)}
                className="whitespace-nowrap"
              >
                {filterOption === 'all' ? 'All' : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Button>
            ))}
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="p-2 border-b border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="w-full"
              >
                Mark all as read
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              <AnimatePresence>
                {filteredNotifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  const iconColor = getNotificationColor(notification.type);

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`relative group ${!notification.read ? 'bg-primary/5' : ''}`}
                    >
                      <Card className={`cursor-pointer transition-all hover:shadow-md ${!notification.read ? 'ring-1 ring-primary/20' : ''}`}>
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            {notification.type === 'achievement' ? (
                              <div className={`w-10 h-10 rounded-full ${notification.badge?.color} flex items-center justify-center text-white font-bold`}>
                                {notification.badge?.icon}
                              </div>
                            ) : (
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={notification.user?.avatar} />
                                <AvatarFallback>{notification.user?.name?.[0]}</AvatarFallback>
                              </Avatar>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2">
                                <IconComponent className={`h-4 w-4 mt-0.5 ${iconColor}`} />
                                <div className="flex-1">
                                  <p className="text-sm">
                                    {notification.type === 'achievement' ? (
                                      <span>You {notification.message}</span>
                                    ) : (
                                      <>
                                        <span className="font-medium">{notification.user?.name}</span>
                                        <span className="text-muted-foreground"> {notification.message}</span>
                                      </>
                                    )}
                                  </p>
                                  {notification.content && (
                                    <p className="text-xs text-muted-foreground mt-1 truncate">
                                      {notification.content}
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatTimestamp(notification.timestamp)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                            )}
                          </div>

                          {/* Action buttons on hover */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  ✓
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredNotifications.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
                  <p className="text-sm">We'll notify you when something happens!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </motion.div>
    </>
  );
};

export default RealTimeNotifications;