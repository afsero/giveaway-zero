# GiveawayZero

GiveawayZero is a portfolio project for building a web-based Giveaway Chess, also known as Antichess, AI platform. The long-term goal is to let users play Giveaway Chess against increasingly capable AI bots on a clean analysis-board style interface, with model evaluation and training workflows documented from the start.

This repository is currently in the planning and scaffold phase. It contains the initial monorepo structure and documentation only. No application code, dependencies, training scripts, or models have been generated yet.

## Vision

Giveaway Chess reverses many of the incentives of standard chess: the objective is to lose all pieces, captures are often mandatory, and traditional checkmate logic does not define the win condition. GiveawayZero will explore this variant as both a playable web app and a machine learning project.

The project is designed to grow in stages:

- Start with a working web experience powered by random and heuristic bots.
- Add correct Giveaway Chess move validation using `python-chess` variant support.
- Train supervised policy models from Lichess Antichess PGN games.
- Evaluate model quality with move prediction metrics and bot-vs-bot matches.
- Explore AlphaZero-inspired self-play with policy/value networks, MCTS, and model iteration.

## Planned Stack

- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- Backend: FastAPI
- Chess rules and variants: `python-chess`, especially Antichess/Giveaway support
- Training and ML: Python, PyTorch
- Dataset: Lichess open Antichess/Giveaway PGN database
- Deployment later: Docker and Docker Compose

## Planned Product Features

- Web chessboard for Giveaway Chess
- Legal move validation under Giveaway/Antichess rules
- Play against an AI bot
- Move history
- Previous and next move navigation like chess analysis boards
- Bot move suggestions and candidate lines
- Model-powered bot
- Model evaluation dashboard

## Repository Layout

```text
giveaway-zero/
  frontend/              React + TypeScript + Vite app
  backend/               FastAPI service and game logic API
  training/              Data processing, ML models, evaluation, configs
  docs/                  Planning and architecture documentation
  README.md              Project overview
  .gitignore             Shared ignore rules
```

## AI Roadmap

### Phase 1: Playable Baseline

Build the early product loop with legal move validation and simple bots:

- Random legal move bot
- Simple heuristic bot
- Game state API
- Usable analysis-board interface

### Phase 2: Supervised Learning

Train a policy model from Lichess Antichess games:

- Parse compressed Lichess PGN files
- Convert games into position-to-move samples
- Train a policy network to predict strong human moves
- Evaluate prediction quality and legal move behavior

### Phase 3: Evaluation

Create a model evaluation framework:

- Top-1 move accuracy
- Top-3 move accuracy
- Legal move rate
- Win rate against random and heuristic bots
- Model-vs-model tournaments
- Optional benchmarks against external engines

### Phase 4: Self-Play

Explore AlphaZero-inspired improvement:

- Policy/value network
- Monte Carlo Tree Search
- Replay buffer
- Iterative model evaluation and promotion

## Documentation

Detailed planning documents are available in `docs/`:

- [Project Overview](docs/PROJECT_OVERVIEW.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [AI Training Plan](docs/AI_TRAINING_PLAN.md)
- [Evaluation Plan](docs/EVALUATION_PLAN.md)
- [API Design](docs/API_DESIGN.md)
- [Frontend Plan](docs/FRONTEND_PLAN.md)
- [Dataset Plan](docs/DATASET_PLAN.md)

## Current Status

The repository currently contains only the initial folder structure and documentation. The next implementation step will be to scaffold the frontend and backend projects without introducing ML complexity too early.

