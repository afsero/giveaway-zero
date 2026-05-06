# GiveawayZero Backend

FastAPI backend for GiveawayZero.

This service uses `python-chess` Antichess variant support for real
Giveaway/Antichess legal move validation. It does not load AI models yet.

## Requirements

- Python 3.11 or newer
- pip

## Setup

From this directory:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run Locally

```bash
uvicorn app.main:app --reload
```

The API will usually be available at `http://127.0.0.1:8000`.

## Endpoints

- `GET /health`
- `POST /api/game/new`
- `POST /api/game/legal-moves`
- `POST /api/game/move`
- `POST /api/bot/move`
- `GET /api/model/status`

## Current Behavior

Game creation, legal move generation, and move application use
`chess.variant.AntichessBoard`. Bot responses are still simple placeholders
selected from real legal moves.

## Rule Check

```bash
python scripts/check_antichess_rules.py
```
