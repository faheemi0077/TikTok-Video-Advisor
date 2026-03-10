


pass_data_prompt = """You are analyzing viral TikTok content as a research assistant for a creator.

Below is data from recent high-performing TikTok videos in the niche {niche}.  
Each item may include metrics, captions, and transcripts if available.

Your goal is NOT to write a single script. Instead, extract objective insights so the creator can decide what to make.

Perform the following analysis:

1. Identify common **hooks** used in the videos.
2. Identify common **content formats** (e.g., POV, list, reveal, comparison, storytelling, etc.).
3. Identify patterns in **visual structure** (fast cuts, close-ups, text overlays, etc.).
4. Identify common **engagement tactics** (questions, comment bait, suspense, reveal, etc.).
5. Identify typical **video pacing** for a ~30 second video.

Then output:

SECTION 1 — Viral Pattern Summary  
List the main patterns you detected across the dataset.

SECTION 2 — Common Hooks  
List 3–5 hook styles that appear effective.

SECTION 3 — Format Ideas  
List 3 possible video formats someone could create in this niche.

SECTION 4 — Example 30‑Second Structure  
Provide ONE neutral example structure (hook → middle → ending) that follows the detected patterns.

Data:
{videos_dict}
"""