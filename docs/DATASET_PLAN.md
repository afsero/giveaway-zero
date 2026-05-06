# Dataset Plan

GiveawayZero will use the Lichess open Antichess/Giveaway PGN database as the main source for supervised training data.

## Data Source

Lichess publishes open game databases, including Antichess games. These PGN files can be downloaded and parsed locally.

The project should document the exact source URLs and download steps when the data pipeline is implemented. Large raw data files must not be committed to the repository.

## Data Storage

Local dataset folders should be ignored by Git.

Planned local structure:

```text
training/
  raw/          Downloaded PGN archives
  processed/    Parsed and encoded training samples
```

These folders are intentionally not part of the committed scaffold because datasets can be large.

## Parsing Plan

The parser should:

- Read Antichess PGN games
- Validate moves using `python-chess`
- Skip corrupt or unsupported games
- Extract each position and the move played
- Preserve useful metadata such as ratings, time control, result, and game id when available

## Filtering Plan

Training quality may improve by filtering:

- very low-rated games
- aborted or incomplete games
- games with parsing errors
- extremely short games
- duplicate games if detected

Filtering rules should be documented and versioned through config files.

## Sample Format

Each processed sample should include:

- board representation
- side to move
- legal move mask or legal move list
- target move
- optional player rating
- optional game result

The first format should prioritize simplicity and reproducibility. More efficient formats can be introduced after the pipeline is correct.

## Version Control Policy

Do not commit:

- raw PGN files
- compressed database downloads
- processed datasets
- checkpoints
- experiment runs

Small example fixtures may be committed later for tests, as long as they are intentionally curated and lightweight.

