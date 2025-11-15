'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, audioUrl: string) => void;
  onDelete?: () => void;
  existingAudioUrl?: string;
  maxDuration?: number; // in seconds
}

export default function AudioRecorder({
  onRecordingComplete,
  onDelete,
  existingAudioUrl,
  maxDuration = 300 // 5 minutes default
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [duration, setDuration] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        stream.getTracks().forEach(track => track.stop());

        if (onRecordingComplete) {
          onRecordingComplete(audioBlob, url);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please grant permission.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setRecordingTime(0);
    setDuration(0);
    onDelete?.();
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-sm">Voice Instructions</span>
          </div>

          {(isRecording || isPaused) && (
            <Badge variant="destructive" className="animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              {formatTime(recordingTime)}
            </Badge>
          )}
        </div>

        {/* Recording Controls */}
        {!audioUrl && (
          <div className="flex gap-2">
            {!isRecording && !isPaused && (
              <Button
                size="sm"
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            )}

            {isRecording && !isPaused && (
              <>
                <Button
                  size="sm"
                  onClick={pauseRecording}
                  variant="outline"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button
                  size="sm"
                  onClick={stopRecording}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </>
            )}

            {isPaused && (
              <>
                <Button
                  size="sm"
                  onClick={resumeRecording}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Resume
                </Button>
                <Button
                  size="sm"
                  onClick={stopRecording}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </>
            )}
          </div>
        )}

        {/* Playback Controls */}
        {audioUrl && (
          <div className="space-y-2">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onLoadedMetadata={(e) => {
                setDuration(Math.floor((e.target as HTMLAudioElement).duration));
              }}
              className="hidden"
            />

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Button
                size="sm"
                variant="ghost"
                onClick={isPlaying ? pauseAudio : playAudio}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              <div className="flex-1">
                <div className="text-sm text-muted-foreground">
                  Audio recording • {formatTime(duration || recordingTime)}
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={deleteRecording}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Recording saved. Click play to preview before submitting.
            </p>
          </div>
        )}

        {!isRecording && !audioUrl && (
          <p className="text-xs text-muted-foreground">
            Record voice instructions for this ticket (max {maxDuration / 60} minutes)
          </p>
        )}
      </CardContent>
    </Card>
  );
}