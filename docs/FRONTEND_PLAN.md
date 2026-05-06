# Frontend Plan

The GiveawayZero frontend will be a React, TypeScript, and Vite application styled with Tailwind CSS. The first screen should be the playable board experience, not a marketing landing page.

## User Experience Goals

- Clean analysis-board layout
- Fast move feedback
- Clear game status
- Familiar chess review controls
- Minimal visual clutter
- Responsive layout for desktop and tablet-sized screens

## Planned Pages

### Play

Primary page for playing against a bot.

Planned elements:

- Chessboard
- Move history
- Bot selector
- Game status
- New game control
- Previous and next move navigation

### Analysis

Future page or mode for reviewing completed games.

Planned elements:

- Board position navigation
- Full move list
- Candidate bot lines
- Position metadata

### Evaluation Dashboard

Future page for model comparison and metrics.

Planned elements:

- Model selector
- Accuracy metrics
- Bot-vs-bot records
- Tournament summaries
- Evaluation run history

## Planned Components

- `ChessBoard`
- `Square`
- `Piece`
- `MoveHistory`
- `GameControls`
- `BotSelector`
- `GameStatus`
- `CandidateMoves`
- `EvaluationSummary`
- `Layout`

## State Management

The first version can use local React state and API calls directly. A dedicated state library should only be added if the app grows enough to justify it.

Important state:

- current game id
- current board FEN
- selected square
- legal moves
- move history
- viewed move index
- bot type
- game status

## API Integration

The frontend will call the FastAPI backend for:

- creating games
- submitting moves
- fetching legal moves
- fetching bot suggestions
- retrieving game state

The backend should remain the source of truth for legal moves and game results.

