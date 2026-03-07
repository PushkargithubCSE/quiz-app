# QuizMaster — Elegant Quiz Web App

A production-ready 10-question MCQ quiz app built with Next.js 14, deployable on Vercel.

## Features

- 🎯 **10 MCQ Questions** — 4 options each, across 6 categories
- ✅ **Instant Answer Reveal** — See correct/incorrect answers after each selection
- 📊 **Interactive Dashboard** — Leaderboard + Analytics with charts
- 📥 **Export Results** — Download as Excel (.xlsx) or PDF
- ⌨️ **Keyboard Navigation** — Press 1–4 to select, Enter to continue
- 🔄 **Persistent Scores** — Stored in localStorage across sessions

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (charts/analytics)
- **xlsx** (Excel export)
- **jsPDF + jspdf-autotable** (PDF export)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo → Deploy

No environment variables needed. Works out of the box.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — enter name to start |
| `/quiz` | Quiz interface — 10 MCQ questions |
| `/results` | Score summary with answer review |
| `/dashboard` | Leaderboard + analytics + export |

## Customization

Edit `lib/questions.ts` to change questions, options, and correct answers.
