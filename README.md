# Voice AI Assistant — Web

Next.js 15 (App Router) frontend for a healthcare front-desk voice agent. The
token is minted in a serverless route, so the app deploys to Vercel as-is with
no separate token backend.

## Features

- Server-side token minting in `app/api/token/route.ts` (Vercel serverless function).
- Explicit agent dispatch baked into the token via `RoomConfiguration`.
- `LiveKitRoom` + `RoomAudioRenderer` for in-browser audio playback.
- `useVoiceAssistant` for agent state and avatar (Tavus video) detection.
- Live tool-call status cards and an end-of-call summary, driven over the
  LiveKit data channel.
- Welcome ↔ Session view transition with `motion`.

## Architecture

```
Browser ──POST /api/token──▶ Serverless function ──▶ mints JWT + dispatches agent
   │                                                        │
   └────────── connects to LiveKit Cloud ◀──────────────────┘
                          │
        Python agent worker (STT + LLM + TTS + avatar) joins the room
```

The Python agent runs separately as a LiveKit worker — it is **not** deployed to
Vercel. Only this web UI and the token route deploy to Vercel.

## Local development

```bash
cp .env.example .env.local      # fill in LIVEKIT_URL / KEY / SECRET
npm install
npm run dev                     # http://localhost:5000
```

Run the agent worker in another terminal so it can join rooms:

```bash
cd ../backend && source .venv/bin/activate && python -m agent.agent start
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On vercel.com → **Add New → Project** → import the repo. If this is a
   subfolder of a larger repo, set **Root Directory** to this folder.
3. The framework auto-detects as **Next.js**; leave build settings default.
4. Add environment variables (Settings → Environment Variables):

   | Name | Value |
   |------|-------|
   | `LIVEKIT_URL` | `wss://your-app.livekit.cloud` |
   | `LIVEKIT_API_KEY` | your key |
   | `LIVEKIT_API_SECRET` | your secret |
   | `AGENT_NAME` | `agent-test` |

5. **Deploy** — the live link is `https://<project>.vercel.app`.

> The Python agent worker is long-running and cannot run on Vercel. Keep it
> running locally, or host it on a platform that supports long-running
> processes (Render, Railway, Fly.io, a VM, or LiveKit Cloud Agents).

## Environment variables

| Name | Description |
|------|-------------|
| `LIVEKIT_URL` | LiveKit server URL (`wss://...`) |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `AGENT_NAME` | Must match the worker's `agent_name` (default `agent-test`) |

## Structure

```
web/
├── app/
│   ├── api/token/route.ts   serverless token + agent dispatch
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── app.tsx              LiveKitRoom + RoomAudioRenderer + view switch
│   ├── welcome-view.tsx     start screen
│   ├── session-view.tsx     in-call layout + data-channel handling
│   ├── avatar.tsx           Tavus video or animated avatar
│   ├── tool-call-display.tsx
│   ├── transcript.tsx
│   └── call-summary.tsx
├── lib/types.ts
└── app-config.ts
```
