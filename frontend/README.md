# GiveawayZero Frontend

Initial React, TypeScript, Vite, and Tailwind CSS frontend for GiveawayZero.

The Board page connects to the FastAPI backend for Antichess legal moves and
move application. The frontend does not validate real Giveaway Chess rules or
run model inference.

## Requirements

- Node.js 20 or newer
- npm

## Setup

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Vite will print the local development URL, usually `http://localhost:5173`.

## Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` type-checks the app and creates a production build.
- `npm run preview` serves the production build locally.

## Current Views

- Landing page with project positioning, feature cards, and the AI pipeline.
- Board page with a chessboard, backend-backed legal move state, move history,
  candidate moves, controls, model status, and API connection status.

## Notable UI Dependencies

- `react-chessboard` provides the chessboard rendering surface.
- `lucide-react` provides interface icons.
