"use client"

import { useState } from "react"
import {
  ArrowLeft,
  TrendingUp,
  Zap,
  Layout,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react"
import type { VideoData, AnalysisResult } from "@/app/page"

interface AnalysisResultsProps {
  niche: string
  videos: VideoData[]
  results: AnalysisResult
  onReset: () => void
}

export function AnalysisResults({
  niche,
  videos,
  results,
  onReset,
}: AnalysisResultsProps) {
  const [showRaw, setShowRaw] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(results.rawOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-card/50 text-muted-foreground hover:text-foreground hover:border-[var(--tiktok-cyan)]/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </button>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--tiktok-cyan)]/30 bg-[var(--tiktok-cyan)]/10 text-[var(--tiktok-cyan)] text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[var(--tiktok-cyan)]" />
            Analysis Complete
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Viral Patterns for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--tiktok-pink)] to-[var(--tiktok-cyan)]">
              {niche}
            </span>
          </h1>
          <p className="text-muted-foreground">
            Based on analysis of {videos.length} top-performing videos
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Viral Patterns */}
          <ResultCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="Viral Patterns Detected"
            color="pink"
          >
            <ul className="space-y-3">
              {results.viralPatterns.map((pattern, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--tiktok-pink)]/20 text-[var(--tiktok-pink)] text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground leading-relaxed">{pattern}</span>
                </li>
              ))}
            </ul>
          </ResultCard>

          {/* Common Hooks */}
          <ResultCard
            icon={<Zap className="w-5 h-5" />}
            title="Effective Hooks"
            color="cyan"
          >
            <ul className="space-y-3">
              {results.commonHooks.map((hook, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--tiktok-cyan)]/20 text-[var(--tiktok-cyan)] text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground leading-relaxed">{hook}</span>
                </li>
              ))}
            </ul>
          </ResultCard>

          {/* Format Ideas */}
          <ResultCard
            icon={<Layout className="w-5 h-5" />}
            title="Format Ideas"
            color="pink"
          >
            <ul className="space-y-4">
              {results.formatIdeas.map((format, i) => (
                <li key={i} className="p-4 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)]">
                  <span className="text-foreground leading-relaxed">{format}</span>
                </li>
              ))}
            </ul>
          </ResultCard>

          {/* Example Structure */}
          <ResultCard
            icon={<Clock className="w-5 h-5" />}
            title="30-Second Structure"
            color="cyan"
          >
            <div className="space-y-4">
              <StructureBlock
                label="HOOK"
                time="0-3s"
                content={results.exampleStructure.hook}
                color="pink"
              />
              <StructureBlock
                label="MIDDLE"
                time="4-22s"
                content={results.exampleStructure.middle}
                color="white"
              />
              <StructureBlock
                label="ENDING"
                time="23-30s"
                content={results.exampleStructure.ending}
                color="cyan"
              />
            </div>
          </ResultCard>
        </div>

        {/* Top Videos Analyzed */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[var(--tiktok-pink)]" />
            Top Videos Analyzed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((video, i) => (
              <VideoCard key={i} video={video} rank={i + 1} formatNumber={formatNumber} />
            ))}
          </div>
        </div>

        {/* Raw Output */}
        <div className="neon-border rounded-2xl overflow-hidden bg-card">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="w-full px-6 py-4 flex items-center justify-between text-foreground hover:bg-[var(--muted)]/30 transition-colors"
          >
            <span className="font-medium">Raw Analysis Output</span>
            {showRaw ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {showRaw && (
            <div className="relative px-6 pb-6">
              <button
                onClick={handleCopy}
                className="absolute top-0 right-6 px-3 py-1.5 rounded-lg bg-[var(--muted)] text-muted-foreground hover:text-foreground text-sm flex items-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[var(--tiktok-cyan)]" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto pt-8">
                {results.rawOutput}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ResultCard({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode
  title: string
  color: "pink" | "cyan"
  children: React.ReactNode
}) {
  const borderColor = color === "pink" ? "var(--tiktok-pink)" : "var(--tiktok-cyan)"
  
  return (
    <div className="neon-border rounded-2xl p-6 bg-card">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: `${borderColor}20`,
            color: borderColor,
          }}
        >
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function StructureBlock({
  label,
  time,
  content,
  color,
}: {
  label: string
  time: string
  content: string
  color: "pink" | "cyan" | "white"
}) {
  const colorMap = {
    pink: "var(--tiktok-pink)",
    cyan: "var(--tiktok-cyan)",
    white: "var(--foreground)",
  }
  
  return (
    <div className="p-4 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)]">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="px-2 py-0.5 rounded text-xs font-bold"
          style={{
            backgroundColor: `${colorMap[color]}20`,
            color: colorMap[color],
          }}
        >
          {label}
        </span>
        <span className="text-xs text-muted-foreground font-mono">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
    </div>
  )
}

function VideoCard({
  video,
  rank,
  formatNumber,
}: {
  video: VideoData
  rank: number
  formatNumber: (num: number) => string
}) {
  return (
    <div className="p-4 rounded-xl border border-[var(--border)] bg-card/50 hover:border-[var(--tiktok-pink)]/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="px-2 py-1 rounded bg-[var(--tiktok-pink)]/20 text-[var(--tiktok-pink)] text-xs font-bold">
          #{rank}
        </span>
        <span className="text-xs text-muted-foreground">{video.duration}s</span>
      </div>
      <p className="text-sm text-foreground mb-4 line-clamp-2">{video.caption}</p>
      <div className="grid grid-cols-4 gap-2 text-center">
        <StatMini icon={<Eye className="w-3 h-3" />} value={formatNumber(video.views)} />
        <StatMini icon={<Heart className="w-3 h-3" />} value={formatNumber(video.likes)} />
        <StatMini icon={<MessageCircle className="w-3 h-3" />} value={formatNumber(video.comments)} />
        <StatMini icon={<Share2 className="w-3 h-3" />} value={formatNumber(video.shares)} />
      </div>
    </div>
  )
}

function StatMini({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  )
}
