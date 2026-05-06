# GiveawayZero Backend

Initial FastAPI backend skeleton for GiveawayZero.

This service is mock-only. It does not validate real Giveaway/Antichess rules,
does not use `python-chess` yet, and does not load AI models.

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

All game, legal move, bot, and model responses are deterministic placeholders
designed to be frontend-friendly and ready for future `python-chess`
integration.
