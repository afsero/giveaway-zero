# Codex Context

This file is the main handoff document for future Codex sessions working on GiveawayZero. It summarizes the project, current boundaries, and rules for making changes.

## Project Summary

GiveawayZero is a web-based Giveaway Chess / Antichess AI platform. Users will play Giveaway Chess against an AI bot on a clean analysis-board style web interface.

The project will start with a simple playable bot and correct Giveaway/Antichess legal move validation. Later phases will train AI models using Lichess Antichess/Giveaway data and eventually explore AlphaZero-inspired self-play.

## Product Vision

GiveawayZero should become both a polished chess variant web app and a practical AI portfolio project.

The user-facing product should feel like a focused chess analysis board:

- interactive board
- legal move feedback
- move history
- previous and next move navigation
- play against a bot
- candidate move suggestions in later versions

The engineering side should demonstrate clean full-stack architecture, reliable variant chess rules, data processing, model training, and model evaluation.

## Planned Tech Stack

- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- Backend: FastAPI
- Chess rules / variants: `python-chess`, especially Antichess/Giveaway support
- Machine learning: Python, PyTorch
- Dataset: Lichess open Antichess/Giveaway PGN database
- Deployment later: Docker and Docker Compose

## Repository Structure

```text
giveaway-zero/
  frontend/
    README.md
  backend/
    README.md
  training/
    README.md
    data_processing/
    models/
    evaluation/
    configs/
  docs/
    PROJECT_OVERVIEW.md
    ROADMAP.md
    ARCHITECTURE.md
    AI_TRAINING_PLAN.md
    EVALUATION_PLAN.md
    API_DESIGN.md
    FRONTEND_PLAN.md
    DATASET_PLAN.md
    CODEX_CONTEXT.md
  README.md
  .gitignore
```

## Current Development Status

The project is currently in the documentation and repository scaffold phase.

Current state:

- initial monorepo folder structure exists
- planning documentation exists
- no frontend app has been scaffolded yet
- no backend app has been scaffolded yet
- no training code exists yet
- no dependencies have been installed yet
- no datasets, model checkpoints, or generated artifacts should be present in Git

## Core Features

Planned core product features:

- Web chessboard for Giveaway Chess
- Legal move validation according to Giveaway/Antichess rules
- Play against AI bot
- Move history
- Previous and next move navigation like chess analysis boards
- Bot move suggestions / candidate lines
- Later: model-powered bot
- Later: model evaluation dashboard

## AI / Model Roadmap

### Phase 1: Baseline Bots

- Random legal move bot
- Simple heuristic bot
- Working app loop before heavy ML work

### Phase 2: Supervised Learning From Lichess Data

- Parse Lichess Antichess/Giveaway PGN data
- Convert games into position-to-move training samples
- Train a policy network to predict strong human moves
- Use legal move masks or another safe legality strategy

### Phase 3: Evaluation Framework

- Top-1 move accuracy
- Top-3 move accuracy
- Legal move rate
- Win rate vs random bot
- Win rate vs heuristic bot
- Model-vs-model tournaments
- Optional benchmark vs Fairy-Stockfish or other external engines

### Phase 4: AlphaZero-Inspired Self-Play

- Policy/value network
- Monte Carlo Tree Search
- Replay buffer
- Self-play game generation
- Model iteration evaluation and promotion

## Evaluation Strategy

Evaluation should measure both prediction quality and actual playing strength.

Prediction metrics:

- top-1 move accuracy on held-out positions
- top-3 move accuracy on held-out positions
- legal move rate

Gameplay metrics:

- win rate vs random bot
- win rate vs heuristic bot
- model-vs-model tournament results

Evaluation should guide whether a new model is actually better before it is exposed as the main bot.

## Frontend Design Direction

The frontend should prioritize the playable board experience, not a marketing landing page.

Design direction:

- clean analysis-board style layout
- board-centered interface
- compact move history
- clear game status
- simple bot controls
- previous and next move navigation
- responsive layout
- minimal visual clutter

The frontend may provide convenience UI hints, but the backend should remain the source of truth for legal move validation.

## Backend Design Direction

The backend should be a FastAPI service responsible for authoritative game state and move validation.

Planned backend responsibilities:

- create game sessions
- validate Giveaway/Antichess moves with `python-chess`
- apply legal moves
- return board state and move history
- provide random and heuristic bot moves
- later, expose model-backed move suggestions

Early backend state can be in-memory for local development. Persistence should only be added when needed.

## Docker / Development Environment Goal

Docker and Docker Compose are planned for later development and deployment workflows.

The eventual goal is to support separate services such as:

- frontend service
- backend service
- optional model inference service

Do not introduce Docker complexity before the basic frontend and backend structure needs it.

## Coding Guidelines for Codex

- Read the existing documentation before making architectural changes.
- Keep implementation aligned with the documented roadmap.
- Prefer small, reviewable changes.
- Prefer clear TypeScript types in the frontend.
- Prefer typed Python interfaces where practical in the backend and training code.
- Keep modules focused and easy to test.
- Use `python-chess` for chess rules instead of hand-rolling variant logic.
- Use established libraries for core chessboard/UI behavior when appropriate.
- Add tests when behavior or game rules are implemented.
- Keep generated data, models, caches, and local environment files out of Git.
- Update documentation when architectural decisions change.

## Strict Rules for Codex

- Do not redesign the full project unless explicitly asked.
- Do not modify unrelated folders.
- Do not implement future phases early.
- Do not download large datasets.
- Do not commit model files, PGN files, datasets, cache files, or virtual environments.
- Keep changes small and reviewable.
- Prefer clean, typed, modular code.
- Update documentation when architectural decisions change.

## How to Use This File in Future Codex Chats

Before making changes, read README.md and docs/CODEX_CONTEXT.md, then perform only the requested task.

