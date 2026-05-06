# API Design

The backend is planned as a FastAPI service. The API should keep the frontend simple while making the backend the source of truth for Giveaway Chess rules.

## Principles

- Validate all moves on the backend
- Return complete enough state for the frontend to render the board
- Keep early endpoints simple and local-development friendly
- Add model inference endpoints only after baseline gameplay works

## Planned Endpoints

### Health

```http
GET /health
```

Returns service status.

Example response:

```json
{
  "status": "ok"
}
```

### Create Game

```http
POST /games
```

Creates a new Giveaway Chess game.

Planned request fields:

- player color preference
- bot type, such as `random`, `heuristic`, or later `model`

Planned response fields:

- game id
- initial FEN
- side to move
- legal moves
- game status

### Get Game

```http
GET /games/{game_id}
```

Returns the current state of a game.

Planned response fields:

- game id
- current FEN
- move history
- side to move
- legal moves
- result status

### Make Move

```http
POST /games/{game_id}/moves
```

Applies a user move if legal, then optionally applies a bot response.

Planned request fields:

- move in UCI format

Planned response fields:

- updated FEN
- accepted user move
- bot move if one was made
- move history
- legal moves
- game status

### Legal Moves

```http
GET /games/{game_id}/legal-moves
```

Returns legal moves for the current position.

### Bot Suggestion

```http
POST /games/{game_id}/suggestion
```

Returns a suggested bot move for the current position without applying it.

Planned response fields:

- selected move
- bot type
- optional candidate moves
- optional scores or probabilities

### Model Info

```http
GET /models
```

Future endpoint for listing available model-backed bots.

## Early Data Formats

Moves should use UCI format initially because it is compact and compatible with `python-chess`.

Board state should use FEN where possible, with additional fields for UI needs:

- legal moves
- last move
- move history
- game result
- side to move

