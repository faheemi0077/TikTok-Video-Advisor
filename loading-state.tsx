"use client"

import { useEffect, useState } from "react"
import type { AnalysisState } from "@/app/page"

interface LoadingStateProps {
  state: AnalysisState
  niche: string
}

const scrapingMessages = [
  "Connecting to TikTok...",
  "Searching viral content...",
  "Fetching video metadata...",
  "Analyzing engagement metrics...",
  "Extracting transcripts...",
]

const analyzingMessages = [
  "Processing video data...",
  "Identifying viral patterns...",
  "Extracting common hooks...",
  "Analyzing content formats...",
  "Generating insights...",
]

export function LoadingState({ state, niche }: LoadingStateProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const messages = state === "scraping" ? scrapingMessages : analyzingMessages

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Animated logo */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[var(--border)] opacity-20" />
          
          {/* Spinning gradient ring */}
          <div className="absolute inset-2 rounded-full animate-spin" style={{ animationDuration: "3s" }}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--tiktok-pink)] to-transparent opacity-60" />
          </div>
          
          {/* Spinning gradient ring 2 */}
          <div className="absolute inset-4 rounded-full animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--tiktok-cyan)] to-transparent opacity-60" />
          </div>

          {/* Center */}
          <div className="absolute inset-8 rounded-full bg-card flex items-center justify-center">
            <div className="text-3xl animate-pulse">🎵</div>
          </div>

          {/* Pulsing dots */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--tiktok-pink)] animate-ping" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--tiktok-cyan)] animate-ping" style={{ animationDelay: "0.5s" }} />
        </div>

        {/* State indicator */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--tiktok-pink)]/30 bg-[var(--tiktok-pink)]/10 text-[var(--tiktok-pink)] text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--tiktok-pink)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--tiktok-pink)]" />
            </span>
            {state === "scraping" ? "SCRAPING" : "ANALYZING"}
          </div>
        </div>

        {/* Niche */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Analyzing{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--tiktok-pink)] to-[var(--tiktok-cyan)]">
            {niche}
          </span>
        </h2>

        {/* Current message */}
        <p className="text-muted-foreground mb-8 h-6 transition-opacity duration-300">
          {messages[messageIndex]}
        </p>

        {/* Progress bar */}
        <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--tiktok-pink)] to-[var(--tiktok-cyan)] rounded-full transition-all duration-500"
            style={{ 
              width: state === "scraping" ? "40%" : "85%",
              animation: "pulse 2s ease-in-out infinite"
            }}
          />
        </div>

        {/* Stats being collected */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <StatBox label="Videos" value={state === "analyzing" ? "20" : "..."} />
          <StatBox label="Metrics" value={state === "analyzing" ? "80" : "..."} />
          <StatBox label="Patterns" value={state === "analyzing" ? "12" : "..."} />
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border border-[var(--border)] bg-card/30 backdrop-blur-sm">
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  )
}
