import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MessageSquare, Heart, Share2, MoreHorizontal, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PostCard = ({
  post,
  onLike = () => {},
  onComment = () => {},
  onShare = () => {},
  onClickPost = () => {},
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);

  // Default post data
  const defaultPost = {
    id: "1",
    content: "This is a sample post content. #blockchain #web3 🚀\n\nBuilding the future of decentralized social media where users truly own their data!",
    imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=80",
    createdAt: "2023-06-15T14:30:00Z",
    likes: 42,
    comments: 7,
    shares: 3,
    user: {
      name: "John Doe",
      username: "johndoe",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    tags: ["blockchain", "web3"],
  };

  // Use provided post or default
  const currentPost = post || defaultPost;
  
  // Initialize counts from post data
  React.useEffect(() => {
    // Handle different API data structures
    setLikeCount(currentPost.likes_count || currentPost.likes || 0);
    setCommentCount(currentPost.comments_count || currentPost.comments || 0);
    setShareCount(currentPost.shares_count || currentPost.shares || 0);
  }, [currentPost]);
  
  // Safely extract user/author data with multiple fallbacks
  const userData = currentPost?.user || currentPost?.author;
  const user = {
    name: userData?.name || currentPost?.username || "Anonymous",
    username: userData?.username || currentPost?.username || "anonymous",
    avatarUrl: userData?.avatarUrl || userData?.avatar || currentPost?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
  };
  
  const imageUrl = currentPost?.imageUrl || currentPost?.image;
  const timestamp = currentPost?.createdAt || currentPost?.created_at || currentPost?.timestamp || new Date().toISOString();

  // Format date to be more readable
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      
      if (hours < 1) return "now";
      if (hours < 24) return `${hours}h`;
      return `${Math.floor(hours / 24)}d`;
    } catch {
      return "Just now";
    }
  };

  // Extract hashtags from content
  const extractHashtags = (content) => {
    const regex = /#(\w+)/g;
    return content.match(regex) || [];
  };

  const hashtags = currentPost?.tags || extractHashtags(currentPost?.content || "");

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(currentPost.id);
  };

  const handleComment = (e) => {
    e.stopPropagation();
    setCommentCount(prev => prev + 1);
    onComment(currentPost.id);
    // Simulate opening comment dialog
    alert("Comment feature activated! 💬");
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShareCount(prev => prev + 1);
    onShare(currentPost.id);
    // Copy link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/post/${currentPost.id}`);
    alert("Link copied to clipboard! 🔗");
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    alert(isBookmarked ? "Removed from bookmarks! 📖" : "Saved to bookmarks! 🔖");
  };

  const handlePostClick = () => {
    onClickPost(currentPost.id);
  };

  const handleMenuAction = (action) => {
    switch (action) {
      case "copy":
        navigator.clipboard.writeText(currentPost.content);
        alert("Content copied to clipboard! 📋");
        break;
      case "report":
        alert("Post reported! Our team will review it. 🚨");
        break;
      case "hide":
        alert("Post hidden from your feed! 👁️");
        break;
      default:
        break;
    }
  };

  // Format numbers for display
  const formatNumber = (num) => {
    // Handle undefined, null, or non-numeric values
    if (num === undefined || num === null || isNaN(num)) return '0';
    const number = Number(num);
    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
    return number.toString();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card
        className="w-full bg-card hover:bg-card/80 border border-border transition-colors duration-200 cursor-pointer"
        onClick={handlePostClick}
      >
        <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.avatarUrl}
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-500 text-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground hover:underline">
                  {user.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  @{user.username}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(timestamp)}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-accent"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleMenuAction("copy")}>
                Copy content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMenuAction("hide")}>
                Hide this post
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleMenuAction("report")}
                className="text-red-600 focus:text-red-600"
              >
                Report post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {currentPost.content}
          </p>
          {imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Post content"
                className="w-full h-auto object-cover max-h-96 rounded-lg border border-border hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
          {hashtags && hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {hashtags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Searching for ${tag}... 🔍`);
                  }}
                >
                  {typeof tag === "string" && tag.startsWith("#")
                    ? tag
                    : `#${tag}`}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`text-gray-600 dark:text-gray-300 flex items-center gap-1 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
                isLiked ? "text-red-500" : ""
              }`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{formatNumber(likeCount)}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-300 flex items-center gap-1 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              onClick={handleComment}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{formatNumber(commentCount)}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-300 flex items-center gap-1 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span>{formatNumber(shareCount)}</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors ${
              isBookmarked ? "text-yellow-500" : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={handleBookmark}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PostCard;