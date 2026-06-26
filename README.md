# Nexora TV — Smart TV Streaming Platform

A pixel-perfect TV-first streaming platform built with React, TypeScript, Tailwind CSS, and Framer Motion, replicating the Figma Smart TV homepage design.

---

## Stack

| Layer       | Tech                            |
|-------------|----------------------------------|
| UI          | React 18 + TypeScript            |
| Styling     | Tailwind CSS v3                  |
| Animations  | Framer Motion                    |
| Routing     | React Router v6                  |
| Video       | HTML5 + hls.js (HLS-ready)       |
| State       | React Context + localStorage     |
| Backend     | Supabase (wiring included)       |

---

## Features

- Home with auto-rotating hero, carousels, categories
- Content Details with cast, episodes, related content
- Full-screen video player (keyboard shortcuts, seek, volume, fullscreen)
- Live search with debounce + category filters
- Series / Movies browse pages with genre filters
- User profiles with watchlist and watch history
- Settings (quality, autoplay, HDR, notifications)
- Auth: Login / Sign Up / Password Reset

### TV Navigation
- Tab, Arrow keys, Enter for full keyboard nav
- Player: Space/k=play, ←/→=seek±10s, m=mute, f=fullscreen, Esc=close
- Nav rail expands on hover with smooth animation

---

## Project Structure

```
src/
├── components/
│   ├── cards/        HeroBanner, ContentCard, ContentCarousel
│   ├── layout/       NavRail, ProtectedRoute
│   ├── player/       VideoPlayer
│   └── ui/           Toast
├── context/          AppContext (global state)
├── data/             content.ts (13 mock titles)
├── pages/            Home, Details, Search, Series, Movies, Profile, Settings, Auth
└── types/            TypeScript types
```

---

## Setup

```bash
npm install
npm start          # http://localhost:3000
npm run build      # production build -> /build
```

---

## Deployment

### Vercel
```bash
npx vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=build
```

### Nginx (self-hosted)
```nginx
server {
    listen 80;
    root /var/www/castify/build;
    location / { try_files $uri $uri/ /index.html; }
}
```

### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Supabase Auth (Production)

```env
REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

Replace mock login/signup in `src/context/AppContext.tsx`:

```typescript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.REACT_APP_SUPABASE_URL!, process.env.REACT_APP_SUPABASE_ANON_KEY!);

// login:
const { error } = await supabase.auth.signInWithPassword({ email, password });

// signup:
const { error } = await supabase.auth.signUp({ email, password });
```

---

## HLS Video (Production)

In `VideoPlayer.tsx`, replace the demo video with HLS:

```typescript
import Hls from 'hls.js';

if (Hls.isSupported()) {
  const hls = new Hls();
  hls.loadSource(content.streamUrl); // your .m3u8 URL
  hls.attachMedia(videoRef.current);
}
```

---

## Demo Login

Any email + password (6+ chars). Session persists in localStorage.

Example: `ozzie@nexora.tv` / `castify123`

---

Built by Oscar Opemba (oxghostx) — Nexora TV Industrial Attachment 2026
