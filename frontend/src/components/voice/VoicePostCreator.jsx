import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Send,
  Upload,
  Volume2,
  Download,
  Trash2,
  Clock,
  BarChart3,
  X
} from 'lucide-react';

const VoicePostCreator = ({ onClose, onSubmit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([1]);
  const [caption, setCaption] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [waveformData, setWaveformData] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const generateWaveform = (audioData) => {
    // Simulate waveform data - in real implementation, analyze audio buffer
    const points = 50;
    const data = [];
    for (let i = 0; i < points; i++) {
      data.push(Math.random() * 100);
    }
    setWaveformData(data);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Generate waveform visualization
        generateWaveform(blob);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        clearInterval(intervalRef.current);
      }
      setIsPaused(!isPaused);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
    setPlaybackTime(0);
    setDuration(0);
    setWaveformData([]);
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setPlaybackTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const handleSeek = (value) => {
    if (audioRef.current && duration > 0) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setPlaybackTime(newTime);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value[0];
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-post-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const voicePost = {
        type: 'voice',
        audioBlob,
        audioUrl,
        duration: formatTime(duration),
        caption: caption.trim(),
        waveform: waveformData,
        timestamp: new Date().toISOString()
      };

      onSubmit?.(voicePost);
      onClose?.();
    } catch (error) {
      console.error('Error creating voice post:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Mic className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold">Voice Post</h1>
              <p className="text-muted-foreground">Record and share your voice</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>

        <div className="space-y-6">
          {/* Recording Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Audio Recording
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Waveform Visualization */}
              <div className="h-24 bg-muted rounded-lg flex items-end justify-center gap-1 p-4">
                {waveformData.length > 0 ? (
                  waveformData.map((height, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 bg-blue-500 rounded-full ${
                        isRecording ? 'animate-pulse' : ''
                      }`}
                      style={{ height: `${Math.max(height / 3, 4)}px` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height / 3, 4)}px` }}
                      transition={{ delay: index * 0.05 }}
                    />
                  ))
                ) : (
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {isRecording ? 'Recording in progress...' : 'No audio recorded yet'}
                    </p>
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">
                    {formatTime(recordingTime)}
                  </span>
                </div>

                {!isRecording && !audioBlob && (
                  <Button
                    onClick={startRecording}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full h-16 w-16"
                    size="icon"
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                )}

                {isRecording && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={pauseRecording}
                      variant="outline"
                      className="rounded-full h-12 w-12"
                      size="icon"
                    >
                      {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                    </Button>
                    <Button
                      onClick={stopRecording}
                      className="bg-gray-500 hover:bg-gray-600 text-white rounded-full h-16 w-16"
                      size="icon"
                    >
                      <Square className="h-6 w-6" />
                    </Button>
                  </div>
                )}

                {audioBlob && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={playAudio}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full h-12 w-12"
                      size="icon"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button
                      onClick={resetRecording}
                      variant="outline"
                      className="rounded-full h-12 w-12"
                      size="icon"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Recording Status */}
              {isRecording && (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="h-3 w-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-red-500">
                    {isPaused ? 'Recording paused' : 'Recording...'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Playback Interface */}
          {audioBlob && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Playback Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Audio Element */}
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={handleAudioTimeUpdate}
                  onEnded={handleAudioEnded}
                  onLoadedMetadata={handleAudioTimeUpdate}
                />

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(playbackTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <Slider
                    value={[duration > 0 ? (playbackTime / duration) * 100 : 0]}
                    onValueChange={handleSeek}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3">
                  <Volume2 className="h-4 w-4" />
                  <Slider
                    value={volume}
                    onValueChange={handleVolumeChange}
                    max={1}
                    step={0.1}
                    className="flex-1"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={downloadAudio} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={resetRecording} className="flex-1">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Caption and Submit */}
          {audioBlob && (
            <Card>
              <CardHeader>
                <CardTitle>Add Caption</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add a caption to your voice post..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                />

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Share Voice Post
                      </>
                    )}
                  </Button>
                </div>

                {/* Audio Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Duration: {formatTime(duration)}
                  </div>
                  <Badge variant="secondary">High Quality</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoicePostCreator;