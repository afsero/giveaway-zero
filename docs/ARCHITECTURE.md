# Architecture

GiveawayZero is planned as a monorepo with separate frontend, backend, and training workspaces. Each workspace has a focused responsibility so the product can grow without mixing UI, API, and machine learning concerns.

## High-Level Layout

```text
frontend/   Browser UI for playing and analyzing games
backend/    FastAPI service for game state, validation, and bots
training/   Data processing, model training, and evaluation workflows
docs/       Project planning and design documentation
```

## Frontend

The frontend will be a React, TypeScript, and Vite application styled with Tailwind CSS.

Primary responsibilities:

- Render the chessboard and move list
- Send user moves to the backend
- Display legal moves, game status, and bot replies
- Support analysis-style navigation through move history
- Later, display candidate lines and evaluation dashboards

The frontend should not implement authoritative game rules. It may show client-side hints for responsiveness, but the backend should remain the source of truth for move legality and game state.

## Backend

The backend will be a FastAPI service that manages the game API.

Primary responsibilities:

- Create game sessions
- Validate Giveaway/Antichess moves with `python-chess`
- Apply legal moves
- Return board state and move history
- Select bot moves
- Later, call model inference code for policy-based suggestions

The backend will start with simple in-memory game state for local development. Persistent storage can be added later if the product needs saved games, users, or match history.

## Training

The training workspace is separate from the production API so experiments can evolve independently.

Primary responsibilities:

- Parse Lichess Antichess PGN files
- Convert games into position-to-move samples
- Train PyTorch models
- Evaluate models with prediction metrics and bot matches
- Store experiment configs and evaluation outputs

Large datasets, generated samples, checkpoints, and experiment outputs should remain outside version control.

## Future Deployment Shape

The eventual deployment may use Docker Compose with separate services:

- `frontend`: built static client or development server
- `backend`: FastAPI API server
- optional `model-service`: dedicated inference service if model loading becomes heavy

This split is not required for the first playable prototype, but the repository structure leaves room for it.

