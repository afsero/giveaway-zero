# AI Training Plan

GiveawayZero will improve its AI in stages. The project should become playable before it becomes research-heavy, then move from simple bots to supervised learning and finally self-play.

## Phase 1: Baseline Bots

The first AI opponents should be simple and reliable:

- Random legal move bot
- Simple heuristic bot

These bots make the web app useful early and provide baselines for later model evaluation.

## Phase 2: Supervised Pretraining

The first model-powered bot will be trained from Lichess Antichess/Giveaway games.

### Data Source

Use the Lichess open database for Antichess games. Games will be parsed from PGN and converted into supervised learning examples.

### Training Sample Format

Each training sample should represent:

- Input: board position, side to move, and relevant rule state
- Target: move played by a strong human player

The target is a policy label rather than a value estimate. The model learns to predict plausible strong moves from historical games.

### Board Encoding

The initial encoding should be simple and inspectable:

- Piece locations by type and color
- Side to move
- Legal move mask
- Optional move count or repetition-related features if useful later

The project should prefer correctness and debuggability over clever encodings at the start.

### Policy Model

The first supervised model can be a small PyTorch policy network. It should predict a move distribution over a fixed move representation or over legal moves mapped into a known indexing scheme.

Initial goals:

- Produce legal moves reliably
- Beat random bot
- Provide reasonable candidate moves
- Establish a repeatable training and evaluation loop

## Phase 3: Evaluation-Driven Improvement

Before adding complex self-play, the project should build evaluation tools:

- Top-1 move accuracy
- Top-3 move accuracy
- Legal move rate
- Win rate against baseline bots
- Model-vs-model tournament results

Evaluation should decide whether a new model is actually better, not just whether training loss improved.

## Phase 4: AlphaZero-Inspired Self-Play

The later research track can add self-play.

Planned components:

- Policy/value network
- Monte Carlo Tree Search
- Self-play game generation
- Replay buffer
- Model iteration and promotion

Self-play should be introduced only after the rules engine, baseline bots, dataset pipeline, and evaluation framework are stable.

