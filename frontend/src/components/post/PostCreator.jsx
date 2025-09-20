import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Image,
  Smile,
  Calendar,
  MapPin,
  X,
  FileImage,
  BarChart3,
  Mic,
  Video,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const PostCreator = ({
  onSubmit = () => {},
  onPostCreated = () => {},
  maxCharacterCount = 280,
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=user123",
  userName = "User",
}) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const emojis = ["😀", "😂", "😍", "🤔", "👍", "❤️", "🔥", "💯", "🚀", "🎉", "💪", "🙌"];

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= maxCharacterCount) {
      setContent(newContent);
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newImages = [...images, ...newFiles].slice(0, 4); // Limit to 4 images
      setImages(newImages);

      // Create preview URLs for the images
      const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls(newPreviewUrls);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviewUrls = [...imagePreviewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]); // Clean up the URL
    newPreviewUrls.splice(index, 1);
    setImagePreviewUrls(newPreviewUrls);
  };

  const addEmoji = (emoji) => {
    if (content.length + emoji.length <= maxCharacterCount) {
      setContent(prev => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleSubmit = async () => {
    if (content.trim() || images.length > 0) {
      setIsPosting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPost = {
        id: `post-${Date.now()}`,
        author: {
          name: userName,
          username: userName.toLowerCase().replace(/\s+/g, ''),
          avatar: userAvatar,
        },
        content: content,
        image: imagePreviewUrls[0] || undefined,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
      };
      
      // Call the callbacks
      onSubmit(content, images);
      onPostCreated(newPost);
      
      // Reset form
      setContent("");
      setImages([]);
      setImagePreviewUrls([]);
      setIsExpanded(false);
      setIsPosting(false);
      setSelectedLocation("");
      setScheduledDate("");
      
      // Show success message
      alert("Post created successfully! 🎉");
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleScheduleClick = () => {
    const date = prompt("Schedule your post (YYYY-MM-DD HH:MM):");
    if (date) {
      setScheduledDate(date);
      alert(`Post scheduled for ${date}! ⏰`);
    }
  };

  const handleLocationClick = () => {
    const location = prompt("Add your location:");
    if (location) {
      setSelectedLocation(location);
      alert(`Location set to: ${location} 📍`);
    }
  };

  // Calculate character count progress
  const characterPercentage = (content.length / maxCharacterCount) * 100;
  const characterCountColor = content.length > maxCharacterCount * 0.9 
    ? "text-red-500" 
    : content.length > maxCharacterCount * 0.8 
    ? "text-yellow-500" 
    : "text-gray-500";

  return (
    <Card className="w-full bg-card border border-border mb-4">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-blue-500 text-white">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={handleContentChange}
              onFocus={handleFocus}
              className="min-h-[60px] resize-none border-none p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              maxLength={maxCharacterCount}
            />
            
            {/* Image previews */}
            <AnimatePresence>
              {imagePreviewUrls.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 grid grid-cols-2 gap-2"
                >
                  {imagePreviewUrls.map((url, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-border"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Emoji picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-3 p-3 bg-background border border-border rounded-lg shadow-lg"
                >
                  <div className="grid grid-cols-6 gap-2">
                    {emojis.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => addEmoji(emoji)}
                        className="h-8 w-8 text-lg hover:bg-accent"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected location */}
            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-blue-500 flex items-center gap-1"
              >
                <MapPin className="h-4 w-4" />
                {selectedLocation}
              </motion.div>
            )}

            {/* Scheduled date */}
            {scheduledDate && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-green-500 flex items-center gap-1"
              >
                <Calendar className="h-4 w-4" />
                Scheduled for {scheduledDate}
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Expanded footer with controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CardFooter className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  disabled={isPosting}
                >
                  <Image className="h-5 w-5 text-blue-500" />
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEmojiClick}
                  className="p-2 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                  disabled={isPosting}
                >
                  <Smile className="h-5 w-5 text-yellow-500" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleScheduleClick}
                  className="p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  disabled={isPosting}
                >
                  <Calendar className="h-5 w-5 text-green-500" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLocationClick}
                  className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  disabled={isPosting}
                >
                  <MapPin className="h-5 w-5 text-red-500" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => alert("GIF picker coming soon! 🎬")}
                  className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  disabled={isPosting}
                >
                  <FileImage className="h-5 w-5 text-purple-500" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => alert("Poll feature coming soon! 📊")}
                  className="p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  disabled={isPosting}
                >
                  <BarChart3 className="h-5 w-5 text-indigo-500" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                {content.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={characterPercentage} 
                      className="w-8 h-2"
                    />
                    <span className={`text-xs ${characterCountColor}`}>
                      {maxCharacterCount - content.length}
                    </span>
                  </div>
                )}
                
                <Button
                  onClick={handleSubmit}
                  disabled={(content.trim().length === 0 && images.length === 0) || isPosting}
                  className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-6 disabled:opacity-50"
                >
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              </div>
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default PostCreator;