import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  Settings,
  Volume2,
  VolumeX,
  CheckCircle,
  Trash2,
  Filter,
  MoreHorizontal,
} from "lucide-react";

const NotificationsPanel = ({ onBack }) => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      user: {
        name: "Alice Chen",
        username: "@alicechen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      },
      message: "liked your post about DeFi protocols",
      timestamp: "2 minutes ago",
      isRead: false,
      postPreview: "The future of DeFi is looking bright with new innovations...",
    },
    {
      id: 2,
      type: "comment",
      user: {
        name: "Bob Wilson",
        username: "@bobwilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      },
      message: "commented on your post",
      timestamp: "15 minutes ago",
      isRead: false,
      comment: "Great insights! I've been following similar trends in the market.",
    },
    {
      id: 3,
      type: "follow",
      user: {
        name: "Carol Davis",
        username: "@caroldavis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
      },
      message: "started following you",
      timestamp: "1 hour ago",
      isRead: true,
    },
    {
      id: 4,
      type: "share",
      user: {
        name: "David Kim",
        username: "@davidkim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      },
      message: "shared your post about Web3 development",
      timestamp: "3 hours ago",
      isRead: true,
    },
    {
      id: 5,
      type: "mention",
      user: {
        name: "Eva Rodriguez",
        username: "@evarodriguez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=eva",
      },
      message: "mentioned you in a post",
      timestamp: "5 hours ago",
      isRead: true,
      postPreview: "Thanks to @yourusername for the amazing tutorial on smart contracts!",
    },
  ]);

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "comment":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case "share":
        return <Share2 className="h-5 w-5 text-purple-500" />;
      case "mention":
        return <Bell className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="like">Likes</TabsTrigger>
            <TabsTrigger value="comment">Comments</TabsTrigger>
            <TabsTrigger value="follow">Follows</TabsTrigger>
            <TabsTrigger value="share">Shares</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  {filter === "unread" 
                    ? "All notifications have been read" 
                    : "You're all caught up! Check back later for new notifications."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/50" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                      <AvatarFallback>
                        {notification.user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getIcon(notification.type)}
                          <div>
                            <p className="text-sm">
                              <span className="font-semibold">{notification.user.name}</span>{" "}
                              <span className="text-muted-foreground">{notification.message}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notification.timestamp}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {(notification.postPreview || notification.comment) && (
                        <div className="mt-2 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            {notification.postPreview || notification.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;