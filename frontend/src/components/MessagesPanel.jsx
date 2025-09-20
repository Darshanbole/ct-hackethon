import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Star,
  Archive,
  Trash2,
  Circle,
} from "lucide-react";

const MessagesPanel = ({ onBack }) => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [conversations] = useState([
    {
      id: 1,
      user: {
        name: "Alice Chen",
        username: "@alicechen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        status: "online",
      },
      lastMessage: "Hey! How's the new DeFi project coming along?",
      timestamp: "2m ago",
      unreadCount: 2,
      isActive: true,
    },
    {
      id: 2,
      user: {
        name: "Bob Wilson",
        username: "@bobwilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        status: "away",
      },
      lastMessage: "Thanks for sharing that article about NFTs!",
      timestamp: "1h ago",
      unreadCount: 0,
      isActive: false,
    },
    {
      id: 3,
      user: {
        name: "Carol Davis",
        username: "@caroldavis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
        status: "offline",
      },
      lastMessage: "Let's schedule a call to discuss the partnership",
      timestamp: "3h ago",
      unreadCount: 1,
      isActive: false,
    },
    {
      id: 4,
      user: {
        name: "David Kim",
        username: "@davidkim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
        status: "online",
      },
      lastMessage: "The smart contract audit results look good",
      timestamp: "1d ago",
      unreadCount: 0,
      isActive: false,
    },
  ]);

  const [messages] = useState({
    1: [
      {
        id: 1,
        senderId: 2,
        content: "Hey! How's the new DeFi project coming along?",
        timestamp: "10:30 AM",
        isOwn: false,
      },
      {
        id: 2,
        senderId: 2,
        content: "I saw your latest post about yield farming strategies",
        timestamp: "10:31 AM",
        isOwn: false,
      },
      {
        id: 3,
        senderId: 1,
        content: "It's going really well! We just completed the first phase of testing",
        timestamp: "10:35 AM",
        isOwn: true,
      },
      {
        id: 4,
        senderId: 1,
        content: "The yield optimization algorithm is showing 15% better performance than expected",
        timestamp: "10:35 AM",
        isOwn: true,
      },
      {
        id: 5,
        senderId: 2,
        content: "That's amazing! Would love to learn more about the technical details",
        timestamp: "10:40 AM",
        isOwn: false,
      },
    ],
    2: [
      {
        id: 1,
        senderId: 3,
        content: "Thanks for sharing that article about NFTs!",
        timestamp: "9:15 AM",
        isOwn: false,
      },
      {
        id: 2,
        senderId: 1,
        content: "You're welcome! Thought you'd find it interesting",
        timestamp: "9:20 AM",
        isOwn: true,
      },
    ],
    3: [
      {
        id: 1,
        senderId: 4,
        content: "Let's schedule a call to discuss the partnership",
        timestamp: "7:30 AM",
        isOwn: false,
      },
    ],
    4: [
      {
        id: 1,
        senderId: 5,
        content: "The smart contract audit results look good",
        timestamp: "Yesterday",
        isOwn: false,
      },
    ],
  });

  const selectedConversation = conversations.find(c => c.id === selectedChat);
  const chatMessages = messages[selectedChat] || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl h-screen flex">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-border bg-card">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={onBack}>
                  ← Back
                </Button>
                <h2 className="text-lg font-semibold">Messages</h2>
              </div>
              <Button size="sm" variant="outline">
                New Chat
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                    selectedChat === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedChat(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                        <AvatarFallback>
                          {conversation.user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(conversation.user.status)} rounded-full border-2 border-background`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conversation.user.name}</h3>
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.user.avatar} alt={selectedConversation.user.name} />
                        <AvatarFallback>
                          {selectedConversation.user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(selectedConversation.user.status)} rounded-full border-2 border-background`}></div>
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedConversation.user.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{selectedConversation.user.status}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isOwn
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                  </div>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPanel;