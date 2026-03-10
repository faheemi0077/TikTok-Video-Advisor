import { NextRequest, NextResponse } from 'next/server'

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY

interface TikTokVideo {
  id: string
  text: string
  createTimeISO: string
  authorMeta: {
    name: string
    nickName: string
    verified: boolean
    signature: string
  }
  musicMeta: {
    musicName: string
    musicAuthor: string
  }
  covers: string[]
  webVideoUrl: string
  videoMeta: {
    duration: number
    coverUrl: string
  }
  diggCount: number
  shareCount: number
  playCount: number
  commentCount: number
  hashtags: { name: string }[]
}

interface FilteredVideo {
  id: string
  text: string
  author: string
  authorNickname: string
  verified: boolean
  authorBio: string
  musicName: string
  musicAuthor: string
  coverUrl: string
  videoUrl: string
  duration: number
  likes: number
  shares: number
  views: number
  comments: number
  hashtags: string[]
  engagementRate: number
  viralScore: number
  transcript?: string
}

async function searchTikTok(niche: string): Promise<TikTokVideo[]> {
  const searchQueries = [
    niche,
    `${niche} tips`,
    `${niche} hack`,
    `viral ${niche}`,
  ]

  const input = {
    excludePinnedPosts: false,
    hashtags: searchQueries,
    resultsPerPage: 20,
    searchSection: '/video',
    shouldDownloadCovers: false,
    shouldDownloadSlideshowImages: false,
    shouldDownloadSubtitles: false,
    shouldDownloadVideos: false,
  }

  const response = await fetch(
    `https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  )

  if (!response.ok) {
    throw new Error(`Apify API error: ${response.status}`)
  }

  return response.json()
}

function filterViralVideos(videos: TikTokVideo[]): FilteredVideo[] {
  const dominated: FilteredVideo[] = []

  for (const video of videos) {
    if (!video.playCount || video.playCount < 100000) continue

    const engagementRate =
      ((video.diggCount + video.commentCount + video.shareCount) /
        video.playCount) *
      100

    if (engagementRate < 3) continue

    const viralScore =
      Math.log10(video.playCount) * engagementRate * (1 + video.shareCount / 1000)

    dominated.push({
      id: video.id,
      text: video.text,
      author: video.authorMeta?.name || 'unknown',
      authorNickname: video.authorMeta?.nickName || 'unknown',
      verified: video.authorMeta?.verified || false,
      authorBio: video.authorMeta?.signature || '',
      musicName: video.musicMeta?.musicName || '',
      musicAuthor: video.musicMeta?.musicAuthor || '',
      coverUrl: video.videoMeta?.coverUrl || video.covers?.[0] || '',
      videoUrl: video.webVideoUrl,
      duration: video.videoMeta?.duration || 0,
      likes: video.diggCount,
      shares: video.shareCount,
      views: video.playCount,
      comments: video.commentCount,
      hashtags: video.hashtags?.map((h) => h.name) || [],
      engagementRate,
      viralScore,
    })
  }

  return dominated.sort((a, b) => b.viralScore - a.viralScore).slice(0, 10)
}

async function getTranscript(videoUrl: string): Promise<string> {
  try {
    const input = {
      startUrls: [{ url: videoUrl }],
      shouldDownloadSubtitles: true,
      shouldDownloadVideos: false,
    }

    const response = await fetch(
      `https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }
    )

    if (!response.ok) return ''

    const data = await response.json()
    return data[0]?.subtitleText || data[0]?.text || ''
  } catch {
    return ''
  }
}

async function analyzeWithMistral(
  niche: string,
  videos: FilteredVideo[]
): Promise<string> {
  const videoSummaries = videos
    .slice(0, 5)
    .map(
      (v, i) =>
        `Video ${i + 1}:
- Views: ${v.views.toLocaleString()}, Likes: ${v.likes.toLocaleString()}, Shares: ${v.shares.toLocaleString()}
- Engagement Rate: ${v.engagementRate.toFixed(2)}%
- Duration: ${v.duration}s
- Caption: ${v.text.slice(0, 200)}
- Hashtags: ${v.hashtags.slice(0, 5).join(', ')}
${v.transcript ? `- Transcript: ${v.transcript.slice(0, 300)}` : ''}`
    )
    .join('\n\n')

  const prompt = `You are a TikTok viral content strategist. Analyze these top-performing videos in the "${niche}" niche and provide actionable insights.

${videoSummaries}

Provide your analysis in the following JSON format:
{
  "viralPatterns": ["pattern1", "pattern2", "pattern3", "pattern4", "pattern5"],
  "effectiveHooks": ["hook1", "hook2", "hook3", "hook4", "hook5"],
  "formatIdeas": ["idea1", "idea2", "idea3"],
  "thirtySecondStructure": {
    "hook": "0-3 seconds strategy",
    "problem": "3-8 seconds strategy", 
    "solution": "8-20 seconds strategy",
    "cta": "20-30 seconds strategy"
  },
  "summary": "2-3 sentence overall strategy summary"
}

Return ONLY valid JSON, no markdown or extra text.`

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Mistral API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function POST(request: NextRequest) {
  try {
    const { niche } = await request.json()

    if (!niche || typeof niche !== 'string') {
      return NextResponse.json(
        { error: 'Please provide a valid niche' },
        { status: 400 }
      )
    }

    if (!APIFY_API_TOKEN) {
      return NextResponse.json(
        { error: 'APIFY_API_TOKEN is not configured' },
        { status: 500 }
      )
    }

    if (!MISTRAL_API_KEY) {
      return NextResponse.json(
        { error: 'MISTRAL_API_KEY is not configured' },
        { status: 500 }
      )
    }

    // Step 1: Search TikTok
    const rawVideos = await searchTikTok(niche)

    // Step 2: Filter viral videos
    const viralVideos = filterViralVideos(rawVideos)

    if (viralVideos.length === 0) {
      return NextResponse.json(
        { error: 'No viral videos found for this niche. Try a different search term.' },
        { status: 404 }
      )
    }

    // Step 3: Get transcripts for top videos
    const videosWithTranscripts = await Promise.all(
      viralVideos.slice(0, 5).map(async (video) => {
        const transcript = await getTranscript(video.videoUrl)
        return { ...video, transcript }
      })
    )

    // Step 4: Analyze with Mistral
    const analysisRaw = await analyzeWithMistral(niche, videosWithTranscripts)

    let analysis
    try {
      // Clean the response - remove markdown code blocks if present
      const cleanedJson = analysisRaw
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      analysis = JSON.parse(cleanedJson)
    } catch {
      analysis = {
        viralPatterns: ['Unable to parse AI analysis'],
        effectiveHooks: ['Try again with a different niche'],
        formatIdeas: ['Check your API configuration'],
        thirtySecondStructure: {
          hook: 'N/A',
          problem: 'N/A',
          solution: 'N/A',
          cta: 'N/A',
        },
        summary: analysisRaw,
      }
    }

    return NextResponse.json({
      niche,
      videosAnalyzed: viralVideos.length,
      videos: viralVideos,
      analysis,
      rawOutput: analysisRaw,
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
