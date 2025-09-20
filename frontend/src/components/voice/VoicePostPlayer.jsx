import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  Waveform
} from 'lucide-react';

const VoicePostPlayer = ({ post, isExpanded = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([1]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;

    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value) => {
    const audio = audioRef.current;
    if (!audio) return;

    setVolume(value);
    audio.volume = value[0];
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume[0];
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const WaveformVisualization = () => {
    const waveformData = post.waveform || Array(30).fill(0).map(() => Math.random() * 100);
    
    return (
      <div className="flex items-end justify-center gap-1 h-16 px-2">
        {waveformData.map((height, index) => {
          const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
          const barProgress = (index / waveformData.length) * 100;
          const isActive = barProgress <= progress;
          
          return (
            <motion.div
              key={index}
              className={`w-1 rounded-full transition-colors duration-200 ${
                isActive ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              style={{ height: `${Math.max(height / 4, 8)}px` }}
              animate={isPlaying && isActive ? {
                scaleY: [1, 1.2, 1],
              } : {}}
              transition={{ 
                duration: 0.5, 
                repeat: isPlaying && isActive ? Infinity : 0,
                delay: index * 0.1 
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author?.avatar} />
              <AvatarFallback>{post.author?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.author?.name || 'Unknown'}</span>
                <span className="text-sm text-muted-foreground">
                  {post.author?.username || '@user'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{post.timestamp || 'Just now'}</span>
                <Badge variant="secondary" className="text-xs">
                  <Waveform className="h-2 w-2 mr-1" />
                  Voice
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm mb-4">{post.caption}</p>
        )}

        {/* Audio Player */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <audio
            ref={audioRef}
            src={post.audioUrl}
            preload="metadata"
          />

          {/* Waveform or Simple Progress */}
          {showWaveform ? (
            <div className="mb-4">
              <WaveformVisualization />
            </div>
          ) : (
            <div className="mb-4">
              <Slider
                value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={togglePlay}
                className="rounded-full h-10 w-10"
                size="icon"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="h-8 w-8"
                >
                  {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </Button>
                <Slider
                  value={isMuted ? [0] : volume}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.1}
                  className="w-16"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWaveform(!showWaveform)}
                className="text-xs"
              >
                <Waveform className="h-3 w-3 mr-1" />
                {showWaveform ? 'Simple' : 'Waveform'}
              </Button>
              
              <Badge variant="outline" className="text-xs">
                {post.duration || formatTime(duration)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Engagement */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`gap-1 ${isLiked ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{(post.likes || 0) + (isLiked ? 1 : 0)}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{post.comments || 0}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              <span className="text-sm">{post.shares || 0}</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className={isBookmarked ? 'text-blue-500' : ''}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoicePostPlayer;