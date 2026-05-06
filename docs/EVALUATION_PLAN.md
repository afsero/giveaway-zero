# Evaluation Plan

GiveawayZero needs clear evaluation methods so AI progress can be measured honestly. The project will use both prediction metrics and gameplay metrics.

## Prediction Metrics

These metrics compare model output to moves from held-out Lichess games.

### Top-1 Move Accuracy

Measures how often the model's highest-probability move matches the move played in the dataset.

### Top-3 Move Accuracy

Measures how often the played move appears among the model's three most likely moves.

### Legal Move Rate

Measures how often the model selects a legal Giveaway Chess move. This is especially important if the model predicts from a fixed move space.

## Gameplay Metrics

Prediction accuracy is useful, but the model must also play well. Gameplay metrics compare bots through actual games.

### Win Rate vs Random Bot

The model should quickly exceed random play. This is the first basic sanity check.

### Win Rate vs Heuristic Bot

The heuristic bot provides a stronger baseline than random play and helps reveal whether the model has learned useful strategy.

### Model-vs-Model Tournament

New model versions should play against earlier versions. This creates a practical promotion test for checkpoints.

## Optional External Benchmarks

If practical, the project may benchmark against external engines that support Antichess, such as Fairy-Stockfish. This should remain optional because external engine setup can complicate development.

## Evaluation Reports

Each evaluation run should eventually record:

- Model identifier
- Dataset split or opponent set
- Number of evaluated positions or games
- Top-k accuracy
- Legal move rate
- Win, loss, and draw counts where applicable
- Notes about configuration and limitations

Generated evaluation reports should be stored outside version control unless they are small curated examples.

