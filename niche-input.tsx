"use client"

import { useState } from "react"
import { Search, ArrowRight, Hash } from "lucide-react"

interface NicheInputProps {
  onAnalyze: (niche: string) => void
}

const suggestedNiches = [
  "fitness",
  "cooking",
  "tech reviews",
  "fashion",
  "comedy",
  "productivity",
  "gaming",
  "beauty",
]

export function NicheInput({ onAnalyze }: NicheInputProps) {
  const [niche, setNiche] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (niche.trim()) {
      onAnalyze(niche.trim())
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setNiche(suggestion)
    onAnalyze(suggestion)
  }

  return (
    <section className="px-6 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Input form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--tiktok-pink)] to-[var(--tiktok-cyan)] rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
            
            <div className="relative flex items-center bg-card rounded-2xl border border-[var(--border)] overflow-hidden">
              <div className="pl-5 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Enter your niche (e.g., fitness, cooking, tech...)"
                className="flex-1 px-4 py-5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
              />
              <button
                type="submit"
                disabled={!niche.trim()}
                className="m-2 px-6 py-3 bg-gradient-to-r from-[var(--tiktok-pink)] to-[#ff0050] text-white font-medium rounded-xl flex items-center gap-2 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                Analyze
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Suggested niches */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-2">
            <Hash className="w-4 h-4" />
            Popular niches
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {suggestedNiches.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 rounded-full border border-[var(--border)] bg-card/50 text-sm text-muted-foreground hover:text-foreground hover:border-[var(--tiktok-cyan)]/50 hover:bg-card transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Value proposition */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <ValueCard
            number="01"
            title="Scrape Trends"
            description="Pull real-time viral videos from any TikTok niche"
          />
          <ValueCard
            number="02"
            title="AI Analysis"
            description="Extract patterns, hooks, and winning formats"
          />
          <ValueCard
            number="03"
            title="Create Content"
            description="Use insights to craft your own viral videos"
          />
        </div>
      </div>
    </section>
  )
}

function ValueCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-2xl border border-[var(--border)] bg-card/30 backdrop-blur-sm hover:border-[var(--tiktok-pink)]/30 transition-colors group">
      <div className="text-[var(--tiktok-cyan)] text-sm font-mono mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
