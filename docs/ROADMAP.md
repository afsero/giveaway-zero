# Roadmap

This roadmap organizes GiveawayZero into milestones that build from a simple playable product toward model-driven AI.

## Milestone 0: Repository Scaffold

Status: In progress

- Create monorepo folder structure
- Add planning documentation
- Add root and package-level README files
- Add `.gitignore`

## Milestone 1: Playable Local Prototype

Goal: Build the smallest useful version of the app.

- Scaffold React, TypeScript, and Vite frontend
- Scaffold FastAPI backend
- Add basic board rendering
- Add game session creation
- Add legal move validation using `python-chess`
- Add random bot
- Display move history and game status

## Milestone 2: Analysis Board Experience

Goal: Make the product feel polished and usable.

- Add previous and next move navigation
- Add board orientation controls
- Add legal move highlighting
- Add captured pieces or remaining material summary
- Add bot thinking and move result states
- Improve responsive layout

## Milestone 3: Heuristic Bot

Goal: Add a stronger non-ML baseline.

- Define simple Giveaway-specific heuristics
- Prefer moves that reduce material when strategically useful
- Avoid obviously losing tactical choices when possible
- Compare heuristic bot against random bot

## Milestone 4: Lichess Data Pipeline

Goal: Prepare real training data.

- Download Lichess Antichess PGN files manually or through documented scripts
- Parse games with `python-chess`
- Filter invalid, incomplete, or low-quality games
- Convert positions into training samples
- Store processed datasets in ignored local folders

## Milestone 5: Supervised Policy Model

Goal: Train a model to predict strong human moves.

- Define board encoding
- Define legal move representation
- Train a PyTorch policy network
- Track top-k accuracy
- Save checkpoints locally

## Milestone 6: Evaluation Framework

Goal: Measure model strength beyond training loss.

- Evaluate top-1 and top-3 move accuracy
- Measure legal move rate
- Run games against random and heuristic bots
- Run model-vs-model tournaments
- Produce evaluation summaries

## Milestone 7: Model-Powered Bot API

Goal: Connect trained models to the app.

- Load selected model checkpoints
- Return model move suggestions
- Support candidate lines
- Add fallback behavior when no model is available

## Milestone 8: Self-Play Research Track

Goal: Explore AlphaZero-inspired improvement.

- Add policy/value network
- Add MCTS
- Add replay buffer
- Generate self-play games
- Promote models based on evaluation results

