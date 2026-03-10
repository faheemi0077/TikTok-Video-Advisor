"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { NicheInput } from "@/components/niche-input"
import { AnalysisResults } from "@/components/analysis-results"
import { LoadingState } from "@/components/loading-state"
import { ScanLines } from "@/components/scan-lines"

export type AnalysisState = "idle" | "scraping" | "analyzing" | "complete" | "error"

export interface VideoData {
  views: number
  likes: number
  comments: number
  shares: number
  caption: string
  url: string
  duration: number
  created: string
  score?: number
  transcript?: string
}

export interface AnalysisResult {
  viralPatterns: string[]
  commonHooks: string[]
  formatIdeas: string[]
  exampleStructure: {
    hook: string
    middle: string
    ending: string
  }
  rawOutput: string
}

export default function Home() {
  const [state, setState] = useState<AnalysisState>("idle")
  const [niche, setNiche] = useState("")
  const [videos, setVideos] = useState<VideoData[]>([])
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (nicheInput: string) => {
    setNiche(nicheInput)
    setError(null)
    setState("scraping")

    try {
      // Simulate API call - In production, this would call your backend
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Mock video data for demonstration
      const mockVideos: VideoData[] = [
        {
          views: 2500000,
          likes: 450000,
          comments: 12000,
          shares: 35000,
          caption: "POV: You finally understand the assignment #viral #fyp",
          url: "https://tiktok.com/@user/video/1",
          duration: 28,
          created: new Date().toISOString(),
          score: 2997000,
        },
        {
          views: 1800000,
          likes: 320000,
          comments: 8500,
          shares: 22000,
          caption: "Wait for it... 😱 #mindblown #trending",
          url: "https://tiktok.com/@user/video/2",
          duration: 32,
          created: new Date().toISOString(),
          score: 2150500,
        },
        {
          views: 3200000,
          likes: 580000,
          comments: 25000,
          shares: 48000,
          caption: "Nobody asked but here's the secret #hack #lifehack",
          url: "https://tiktok.com/@user/video/3",
          duration: 25,
          created: new Date().toISOString(),
          score: 3853000,
        },
      ]

      setVideos(mockVideos)
      setState("analyzing")

      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock analysis results
      const mockResults: AnalysisResult = {
        viralPatterns: [
          "High-energy hooks within first 0.5 seconds",
          "Pattern interrupts every 3-5 seconds",
          "Trending audio usage with lip-sync elements",
          "Text overlays reinforcing spoken content",
          "Call-to-action in final 3 seconds",
        ],
        commonHooks: [
          '"POV: You just discovered..." - Immersive perspective hooks',
          '"Wait for it..." - Suspense-based retention',
          '"Nobody talks about this..." - Secret/exclusive content',
          '"This changed everything..." - Transformation hooks',
          '"Stop scrolling if..." - Direct audience callouts',
        ],
        formatIdeas: [
          "Before/After Reveal: Quick transformation with dramatic music drop",
          "List Format: 3 tips with rapid-fire delivery and text overlays",
          "Storytime: Personal anecdote with emotional arc in under 30s",
        ],
        exampleStructure: {
          hook: "0-3s: Direct eye contact + controversial statement or question",
          middle: "4-22s: Deliver value with pattern interrupts, quick cuts, and text overlays",
          ending: "23-30s: Strong CTA with engagement bait (comment prompt or cliffhanger)",
        },
        rawOutput: `SECTION 1 — Viral Pattern Summary
- Videos averaging 2M+ views use hooks in first 0.5 seconds
- 85% use trending sounds with original voiceover
- Fast-paced editing with 2-3 second shot changes
- Heavy use of text overlays (97% of top performers)
- Engagement baiting in final frames

SECTION 2 — Common Hooks
1. POV hooks - immersive, personal perspective
2. "Wait for it" suspense builders
3. Direct challenges to viewer ("If you can...")
4. Secret/hack reveals
5. Emotional storytelling openers

SECTION 3 — Format Ideas
1. Before/After transformations
2. Rapid-fire list formats
3. Storytime with visual b-roll

SECTION 4 — Example 30-Second Structure
Hook (0-3s): Eye contact + bold claim
Middle (4-22s): Value delivery with cuts
Ending (23-30s): CTA with engagement hook`,
      }

      setResults(mockResults)
      setState("complete")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setState("error")
    }
  }

  const handleReset = () => {
    setState("idle")
    setNiche("")
    setVideos([])
    setResults(null)
    setError(null)
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ScanLines />
      
      {/* Background grid pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(254,44,85,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(254,44,85,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(254,44,85,0.15)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(37,244,238,0.15)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {state === "idle" && (
          <>
            <HeroSection />
            <NicheInput onAnalyze={handleAnalyze} />
          </>
        )}

        {(state === "scraping" || state === "analyzing") && (
          <LoadingState state={state} niche={niche} />
        )}

        {state === "complete" && results && (
          <AnalysisResults
            niche={niche}
            videos={videos}
            results={results}
            onReset={handleReset}
          />
        )}

        {state === "error" && (
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="neon-border rounded-2xl p-8 max-w-md text-center bg-card">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-[var(--tiktok-pink)] mb-2">
                Analysis Failed
              </h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-[var(--tiktok-pink)] text-white font-medium rounded-full hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
