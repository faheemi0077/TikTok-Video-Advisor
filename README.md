# TikTok Video Idea Generator

This project generates high-quality TikTok video ideas based on a chosen niche by analyzing successful TikTok content. It collects data from TikTok using the Apify API and uses a large language model (LLM) to analyze transcripts, engagement metrics, and patterns from top-performing videos.

The goal is to identify what types of videos perform well in a niche and generate new video ideas inspired by those insights.

## How It Works

1. The user inputs a niche (for example: fitness, productivity, study tips, etc.).
2. The program queries the Apify API to collect data on trending or high-performing TikTok videos in that niche.
3. The system retrieves information such as:
   - video transcripts
   - captions
   - engagement metrics (likes, views, comments)
4. A large language model analyzes this data to identify patterns in:
   - topics
   - hooks
   - storytelling structures
   - content formats
5. Based on these insights, the program generates a list of optimized TikTok video ideas designed to perform well in the chosen niche.

## Features

- Niche-based TikTok content research
- Automated data collection via Apify API
- Transcript and engagement analysis
- LLM-powered pattern detection
- Generation of optimized video ideas


## Requirements

- Python
- Apify API access
- Access to an LLM provider
- Required Python libraries listed in 'requirements.txt'

## Setup

1. Clone the repository
2. Install dependencies
3. Add your API keys to a '.env' file.

4. Run the program and input a niche to generate video ideas.

## Purpose

This project demonstrates how AI and data analysis can be used to reverse engineer high-performing short-form content and generate new ideas based on real engagement patterns.
