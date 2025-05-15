"use client"

import * as React from "react"
import ReactPlayerBase from "react-player"
import { Play, Pause, Volume2, VolumeX, Maximize, RefreshCcw } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  url: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  controls?: boolean
  width?: string | number
  height?: string | number
}

export function VideoPlayer({
  url,
  className,
  autoPlay = false,
  loop = false,
  controls = true,
  width = "100%",
  height = "auto",
}: VideoPlayerProps) {
  const [playing, setPlaying] = React.useState(autoPlay)
  const [volume, setVolume] = React.useState(0.8)
  const [muted, setMuted] = React.useState(false)
  const [played, setPlayed] = React.useState(0)
  const [seeking, setSeeking] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const playerRef = React.useRef<ReactPlayerBase>(null)
  const playerContainerRef = React.useRef<HTMLDivElement>(null)

  const formatTime = (seconds: number) => {
    const pad = (value: number) => (value < 10 ? `0${value}` : value)
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return hrs > 0 
      ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` 
      : `${pad(mins)}:${pad(secs)}`
  }

  const handlePlayPause = () => setPlaying(!playing)
  const handleVolumeChange = (value: number[]) => setVolume(value[0])
  const handleToggleMute = () => setMuted(!muted)
  const handleProgress = (state: { played: number }) => {
    if (!seeking) setPlayed(state.played)
  }
  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0])
    setSeeking(true)
  }
  const handleSeekMouseUp = () => {
    setSeeking(false)
    playerRef.current?.seekTo(played)
  }
  const handleDuration = (duration: number) => setDuration(duration)
  const handleFullscreen = () => {
    playerContainerRef.current?.requestFullscreen().catch(err => {
      console.error('Không thể mở fullscreen:', err)
    })
  }
  const handleRestart = () => {
    playerRef.current?.seekTo(0)
    setPlaying(true)
  }

  return (
    <div 
      ref={playerContainerRef}
      className={cn(
        "relative group overflow-hidden rounded-lg bg-background/20 backdrop-blur-sm shadow-xl border border-border/40",
        className
      )}
    >
      <ReactPlayerBase
        ref={playerRef}
        url={url}
        width={width}
        height={height}
        playing={playing}
        loop={loop}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={handleDuration}
        progressInterval={500}
        className="aspect-video"
      />

      {controls && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-2 text-white">
            <Slider
              value={[played]}
              min={0}
              max={1}
              step={0.001}
              onValueChange={handleSeekChange}
              onValueCommit={handleSeekMouseUp}
              className="cursor-pointer h-1 mb-2"
            />
            
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePlayPause} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                </button>
                
                <button 
                  onClick={handleRestart}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                  <RefreshCcw size={16} />
                </button>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleToggleMute}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                  >
                    {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <Slider
                    value={[muted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-20 cursor-pointer h-1"
                  />
                </div>
                
                <div className="text-xs font-medium">
                  {formatTime(played * duration)} / {formatTime(duration)}
                </div>
              </div>
              
              <button 
                onClick={handleFullscreen}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <Maximize size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}