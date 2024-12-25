'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  onError?: (error: Error) => void;
}

export default function VideoPlayer({
  src,
  poster,
  autoPlay = true,
  onError,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const initializePlayer = async () => {
      try {
        if (src.includes('.m3u8')) {
          if (Hls.isSupported()) {
            hls = new Hls({
              maxBufferLength: 30,
              maxMaxBufferLength: 600,
              maxBufferSize: 60 * 1000 * 1000,
              maxBufferHole: 0.5,
              lowLatencyMode: true,
            });

            hls.attachMedia(video);
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
              hls?.loadSource(src);
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.error('Network error, attempting to recover...');
                    hls?.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.error('Media error, attempting to recover...');
                    hls?.recoverMediaError();
                    break;
                  default:
                    console.error('Fatal error:', data);
                    setError('Failed to load video stream');
                    onError?.(new Error('Failed to load video stream'));
                    break;
                }
              }
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
          } else {
            setError('HLS is not supported in this browser');
            onError?.(new Error('HLS is not supported in this browser'));
          }
        } else {
          video.src = src;
        }

        if (autoPlay) {
          try {
            await video.play();
            setIsPlaying(true);
          } catch (error) {
            console.error('Autoplay failed:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing player:', error);
        setError('Failed to initialize video player');
        onError?.(error instanceof Error ? error : new Error('Failed to initialize video player'));
      }
    };

    initializePlayer();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, autoPlay, onError]);

  const togglePlay = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        await videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play state:', error);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black">
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={poster}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-red-500 text-center p-4">
            <p className="text-lg font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity"
        >
          {isPlaying ? (
            <PauseIcon className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          ) : (
            <PlayIcon className="w-16 h-16 text-white" />
          )}
        </button>
      )}
    </div>
  );
}
