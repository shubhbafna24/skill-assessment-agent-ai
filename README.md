# AI-Powered Skill Assessment & Personalized Learning Plan Agent

## Project Overview
This platform automates the candidate screening process by matching uploaded resumes against Job Descriptions (JDs). It uses AI to extract skills, conduct automated conversational assessments to score proficiency, and generates a personalized learning roadmap for any identified skill gaps.

## Features
- **Document Processing Pipeline:** Robust extraction from PDF (pdf-parse), DOCX (mammoth), and TXT files.
- **AI Assessment Agent:** Conversational evaluation of required competencies.
- **Transparent Scoring Logic:** Skills are scored (0-10) with explicit reasoning extracted from the candidate's resume/chat context.
- **Learning Roadmap Generator:** Suggests adjacent skills, curated resources, and realistic timelines for upskilling.
- **Provider-Agnostic AI:** Seamlessly switch between OpenRouter, Groq, OpenAI, and Gemini via env vars.

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS, ShadCN/UI
- **Backend:** Node.js, Next.js API Routes
- **Database:** PostgreSQL (Prisma ORM)
- **AI Integration:** Multi-provider abstraction layer
- **DevOps:** Docker, Vercel ready

## Local Setup Instructions
1. Clone the repository.
2. Install dependencies: `npm install`
3. Copy the env file: `cp .env.example .env` and fill in your keys.
4. Set up the database: `npx prisma db push` (or migrate dev).
5. Run the dev server: `npm run dev`

## Docker Usage
To run the full stack (App + PostgreSQL) locally via Docker:
```bash
docker compose up --build