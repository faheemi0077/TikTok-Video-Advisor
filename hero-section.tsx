"use client"

import { Music, TrendingUp, Zap, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-10 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Logo/Brand */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-[var(--border)] bg-card/50 backdrop-blur-sm">
          <div className="relative">
            <Music className="w-5 h-5 text-[var(--tiktok-pink)]" />
            <div className="absolute inset-0 text-[var(--tiktok-cyan)] translate-x-0.5 opacity-50">
              <Music className="w-5 h-5" />
            </div>
          </div>
          <span className="text-sm font-medium tracking-wide">
            viral.ai
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="relative inline-block">
            <span className="relative z-10 text-foreground">Decode</span>
            <span className="absolute inset-0 text-[var(--tiktok-cyan)] translate-x-1 translate-y-0.5 opacity-40 blur-[1px]">
              Decode
            </span>
            <span className="absolute inset-0 text-[var(--tiktok-pink)] -translate-x-1 -translate-y-0.5 opacity-40 blur-[1px]">
              Decode
            </span>
          </span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--tiktok-pink)] to-[var(--tiktok-cyan)]">
            Viral
          </span>
          <br />
          <span className="text-foreground">TikTok Patterns</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          AI-powered analysis of trending content. Uncover the hooks, formats,
          and structures that make videos go viral in any niche.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <FeaturePill icon={<Zap className="w-4 h-4" />} text="Real-time Scraping" />
          <FeaturePill icon={<TrendingUp className="w-4 h-4" />} text="Viral Analysis" />
          <FeaturePill icon={<Sparkles className="w-4 h-4" />} text="AI Insights" />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-px h-32 bg-gradient-to-b from-transparent via-[var(--tiktok-pink)] to-transparent opacity-30" />
      <div className="absolute top-1/3 right-0 w-px h-48 bg-gradient-to-b from-transparent via-[var(--tiktok-cyan)] to-transparent opacity-30" />
    </section>
  )
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-card/30 backdrop-blur-sm text-sm text-muted-foreground hover:text-foreground hover:border-[var(--tiktok-pink)]/50 transition-colors">
      <span className="text-[var(--tiktok-cyan)]">{icon}</span>
      {text}
    </div>
  )
}
