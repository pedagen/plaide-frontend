# Plaide Frontend

Assistant IA pour avocats — Analysez vos dossiers juridiques en 5 minutes au lieu de 5 heures.

## 🚀 Quick Start

```bash
# Install
npm install

# Dev
npm run dev

# Build
npm run build
```

## 📁 Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing
│   ├── (auth)/                     # Login, Signup
│   └── (dashboard)/
│       ├── dashboard/              # Liste dossiers
│       └── dossier/[id]/           # Vue dossier + pièces
├── components/
│   ├── ui/                         # Button, Card, Input...
│   └── dossier/                    # PieceProcessing
└── lib/
    ├── api.ts                      # Client API
    ├── store.ts                    # Zustand
    └── supabase/                   # Auth
```

## 🔐 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_API_URL=https://api.plaide.app
```

## 🚀 Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

### Option 2: GitHub Integration
1. Push to GitHub
2. Import on vercel.com
3. Add environment variables
4. Deploy

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Connexion |
| `/signup` | Inscription |
| `/dashboard` | Liste des dossiers |
| `/dashboard/new` | Créer un dossier |
| `/dossier/[id]` | Vue dossier (synthèse, chat, timeline, pièces) |
| `/dossier/[id]/piece/[pieceId]` | Vue pièce détaillée |

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Auth**: Supabase
- **Icons**: Lucide React

---

## Getting Started (Next.js default)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
