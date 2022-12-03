import os from 'os';
import { getInput } from '../../utils/files';
import { sumOf } from '../../utils/number';

it('Day 02', () => {
  const input = getInput();
  const lines = input.split(os.EOL);

  // Puzzle 1
  // Rounds based on the guessed meaning of the guide
  const guessingRounds = lines.map((line) => Round.fromGuessingLine(line));

  // Result for puzzle 1
  const guessingTotalScore = sumOf(...guessingRounds.map((round) => round.score));
  console.log(guessingTotalScore);

  // Puzzle 2
  // Rounds based on the real meaning of the guide
  const realRounds = lines.map((line) => Round.fromRealLine(line));

  // Result for puzzle 2
  const realTotalScore = sumOf(...realRounds.map((round) => round.score));
  console.log(realTotalScore);
});

enum Shape {
  ROCK = 'ROCK',
  PAPER = 'PAPER',
  SCISSORS = 'SCISSORS',
}

enum Outcome {
  WINNING = 'SELF',
  LOSING = 'OPPONENT',
  DRAW = 'DRAW',
}

// DICTIONNARIES

// Mapping for opponent shapes
const guidedOpponentShapes: Record<string, Shape> = {
  A: Shape.ROCK,
  B: Shape.PAPER,
  C: Shape.SCISSORS,
};

// Mapping for self shapes (while guessing the guide)
const guessedSelfShapes: Record<string, Shape> = {
  X: Shape.ROCK,
  Y: Shape.PAPER,
  Z: Shape.SCISSORS,
};

// Mapping for round winners (with the true meaning of the guide)
const guidedWinners: Record<string, Outcome> = {
  X: Outcome.LOSING,
  Y: Outcome.DRAW,
  Z: Outcome.WINNING,
};

/**
 * Mapping of the winning shapes
 *   Key: winning shape
 *   Value: losing shape
 */
const winningShapes: Record<Shape, Shape> = {
  [Shape.ROCK]: Shape.SCISSORS,
  [Shape.PAPER]: Shape.ROCK,
  [Shape.SCISSORS]: Shape.PAPER,
};

/**
 * Mapping of the losing shapes
 *   Key: losing shape
 *   Value: winning shape
 * Is the reversed representation of `winningShapes`
 */
const losingShapes: Record<Shape, Shape> = Object.fromEntries(
  Object.entries(winningShapes).map(([winning, losing]) => [losing, winning]),
) as Record<Shape, Shape>;

// Mapping for the score of every shapes
const shapeScores: Record<Shape, number> = {
  [Shape.ROCK]: 1,
  [Shape.PAPER]: 2,
  [Shape.SCISSORS]: 3,
};

// Mapping for the score of every outcome
const outcomeScores: Record<Outcome, number> = {
  [Outcome.WINNING]: 6,
  [Outcome.LOSING]: 0,
  [Outcome.DRAW]: 3,
};

class Round {
  private constructor(private selfShape: Shape, private opponentShape: Shape, private winner: Outcome) {}

  /**
   * Build a round based on the supposed meaning of a line
   * @param line first element is the opponent shape, the second is the self shape
   * @returns Round
   */
  static fromGuessingLine(line: string): Round {
    const items = line.split(' ');

    const opponentShape = guidedOpponentShapes[items[0]];
    const selfShape = guessedSelfShapes[items[1]];

    let outcome: Outcome;
    if (winningShapes[selfShape] === opponentShape) {
      // When winning
      outcome = Outcome.WINNING;
    } else if (winningShapes[opponentShape] === selfShape) {
      // When losing
      outcome = Outcome.LOSING;
    } else {
      // When draw
      outcome = Outcome.DRAW;
    }

    return new Round(selfShape, opponentShape, outcome);
  }

  /**
   * Build a round based on the real meaning of a line
   * @param line first element is the opponent shape, the second is the outcome of the round
   * @returns Round
   */
  static fromRealLine(line: string): Round {
    const items = line.split(' ');

    const opponentShape = guidedOpponentShapes[items[0]];
    const winner = guidedWinners[items[1]];

    let selfShape: Shape;
    switch (winner) {
      case Outcome.WINNING:
        selfShape = losingShapes[opponentShape];
        break;
      case Outcome.LOSING:
        selfShape = winningShapes[opponentShape];
        break;
      case Outcome.DRAW:
        selfShape = opponentShape;
        break;
    }

    return new Round(selfShape, opponentShape, winner);
  }

  public get score(): number {
    return shapeScores[this.selfShape] + outcomeScores[this.winner];
  }
}
