from datetime import datetime, timedelta, timezone
import requests
import os
from prompts import pass_data_prompt



APIFY_TOKEN = os.getenv("APIFY_TOKEN")
MAIN_VIDEO_ACTOR_ID = "clockworks~tiktok-scraper"
TRANSCRIPT_ACTOR_ID = "scrape-creators~best-tiktok-transcripts-scraper"


def get_niche() -> str:
    """purely get the niche from the user"""
    return input("Please enter the niche you would like a viral TikTok script for: ")

def get_videos_dict(niche: str) -> dict:
    """get the videos dict from the user"""
    search_query = {"searchQueries": [f"{niche}"], "resultsPerPage": 20}
    url = f"https://api.apify.com/v2/acts/{MAIN_VIDEO_ACTOR_ID}/run-sync-get-dataset-items?token={APIFY_TOKEN}"
    response = requests.post(url, json=search_query)
    #in case we have a bad response
    response.raise_for_status()
    return response.json()

#getting only the data we want
def simplify_videos(videos: list) -> list:
    """Extract only the useful fields from the raw Apify response"""
    simplified = []
    for v in videos:
        simplified.append({
            "views": v.get("playCount"),
            "likes": v.get("diggCount"),
            "comments": v.get("commentCount"),
            "shares": v.get("shareCount"),
            "caption": v.get("text"),
            "url": v.get("webVideoUrl"),
            "duration": v.get("videoMeta", {}).get("duration"),
            "created": v.get("createTimeISO")
        })
    return simplified

#filtering by 24 hours
def filter_recent_viral(videos: list, hours: int = 168, limit: int = 10) -> list:
    """Keep only videos from the last X hours and rank by a simple viral score"""
    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
    recent = []
    for v in videos:
        created = datetime.fromisoformat(v["created"].replace("Z", "+00:00"))
        if created > cutoff:
            score = v["likes"] + v["comments"] + v["shares"] + v["views"]
            v["score"] = score
            recent.append(v)

    recent.sort(key=lambda x: x["score"], reverse=True)
    return recent[:limit]

def add_transcripts(videos: list) -> list:
    """Fetch transcripts for each TikTok video using the transcript actor"""
    urls = [v["url"] for v in videos if v.get("url")]
    if not urls:
        return videos
    payload = {
        "videos": urls
    }
    url = f"https://api.apify.com/v2/acts/{TRANSCRIPT_ACTOR_ID}/run-sync-get-dataset-items?token={APIFY_TOKEN}"
    response = requests.post(url, json=payload)
    if not response.ok:
        print("Transcript actor error response:", response.text)
        response.raise_for_status()
    transcripts = response.json()
    # Map transcripts by URL if available
    transcript_map = {}
    for item in transcripts:
        video_url = item.get("url") or item.get("videoUrl")
        transcript_map[video_url] = item.get("transcript")
    for v in videos:
        v["transcript"] = transcript_map.get(v["url"])
    return videos

def generate_script(niche: str, videos: list) -> str:
    """Send the viral video data to the Mistral API and return a generated script"""
    MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
    prompt = pass_data_prompt.format(niche=niche, videos_dict=videos)
    url = "https://api.mistral.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "mistral-small-latest",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]

#VALUE PROPOSITION: This tool fully automates short-form content research so creators can focus on what matters most: creating.