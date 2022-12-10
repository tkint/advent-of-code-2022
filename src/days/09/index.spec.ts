import os from 'os';
import { countWith, distinctWith, maxWith } from '../../utils/arrays';
import { getInput } from '../../utils/files';
import { rangeBetween, repeat } from '../../utils/number';

it('Day 09', () => {
  const input = getInput();
  const lines = input.split(os.EOL);

  // Get moves from lines
  const moves = lines.map((line) => Move.fromLine(line));

  // Puzzle 1
  const tailPositions = executeMoves(moves);
  console.log(tailPositions.length);

  // Puzzle 2
  const longRopeTailPositions = executeMovesMultiKnots(moves, 10);
  console.log(longRopeTailPositions.length);
});

enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

namespace Direction {
  export const valueOf = (str: string): Direction => {
    switch (str) {
      case 'U':
        return Direction.UP;
      case 'D':
        return Direction.DOWN;
      case 'L':
        return Direction.LEFT;
      case 'R':
        return Direction.RIGHT;
      default:
        throw Error(`${str} is not a valid direction`);
    }
  };
}

class Move {
  private constructor(public readonly direction: Direction, public readonly distance: number) {}

  static fromLine(line: string): Move {
    const [direction, distance] = line.split(' ');
    return new Move(Direction.valueOf(direction), parseInt(distance));
  }
}

class Position {
  public readonly x: number;
  public readonly y: number;

  constructor(from: { x: number; y: number }) {
    this.x = from.x;
    this.y = from.y;
  }

  isAdjacent(position: Position): boolean {
    return Math.abs(this.x - position.x) <= 1 || Math.abs(this.y - position.y) <= 1;
  }

  distanceWith(other: Position): { x: number; y: number } {
    return { x: this.x - other.x, y: this.y - other.y };
  }

  copy(position?: { x?: number; y?: number }): Position {
    return new Position({ x: position?.x ?? this.x, y: position?.y ?? this.y });
  }

  moveX(x: number): Position {
    return this.copy({ x: this.x + x });
  }

  moveY(y: number): Position {
    return this.copy({ y: this.y + y });
  }

  get hash(): string {
    return `${this.x}-${this.y}`;
  }
}

/**
 * Execute a list of moves and return the list of positions
 * the tail visited.
 * @param moves
 * @returns
 */
const executeMoves = (moves: Move[]): Position[] => {
  let headPosition: Position = new Position({ x: 0, y: 0 });
  let tailPosition: Position = headPosition;

  const distinctGuard = new Set([tailPosition.hash]);
  const tailPositions: Position[] = [tailPosition];

  moves.forEach((move) => {
    for (let step = 0; step < move.distance; step++) {
      switch (move.direction) {
        case Direction.UP:
          headPosition = headPosition.moveY(-1);
          break;
        case Direction.DOWN:
          headPosition = headPosition.moveY(1);
          break;
        case Direction.LEFT:
          headPosition = headPosition.moveX(-1);
          break;
        case Direction.RIGHT:
          headPosition = headPosition.moveX(1);
          break;
      }

      const { x: distanceX, y: distanceY } = tailPosition.distanceWith(headPosition);

      // If the tail need to move
      if (Math.abs(distanceX) > 1 || Math.abs(distanceY) > 1) {
        tailPosition = tailPosition
          .moveX(distanceX > 0 ? -1 : distanceX < 0 ? 1 : 0)
          .moveY(distanceY > 0 ? -1 : distanceY < 0 ? 1 : 0);

        if (!distinctGuard.has(tailPosition.hash)) {
          distinctGuard.add(tailPosition.hash);
          tailPositions.push(tailPosition);
        }
      }
    }
  });

  return tailPositions;
};

/**
 * Execute a list of moves and return the list of positions
 * the tail visited.
 * The difference with `executeMoves` is that this method is able
 * to move a serie of knots
 * @param moves
 * @returns
 */
const executeMovesMultiKnots = (moves: Move[], knots: number): Position[] => {
  const start: Position = new Position({ x: 0, y: 0 });
  const knotsPositions = repeat(knots).map(() => start);

  const distinctGuard = new Set([start.hash]);
  const tailPositions: Position[] = [start];

  moves.forEach((move) => {
    for (let step = 0; step < move.distance; step++) {
      // Move the head
      switch (move.direction) {
        case Direction.UP:
          knotsPositions[0] = knotsPositions[0].moveY(-1);
          break;
        case Direction.DOWN:
          knotsPositions[0] = knotsPositions[0].moveY(1);
          break;
        case Direction.LEFT:
          knotsPositions[0] = knotsPositions[0].moveX(-1);
          break;
        case Direction.RIGHT:
          knotsPositions[0] = knotsPositions[0].moveX(1);
          break;
      }

      // Move every knots except
      for (let i = 1; i < knots; i++) {
        const { x: distanceX, y: distanceY } = knotsPositions[i].distanceWith(knotsPositions[i - 1]);

        // If the knot need to move
        if (Math.abs(distanceX) > 1 || Math.abs(distanceY) > 1) {
          knotsPositions[i] = knotsPositions[i]
            .moveX(distanceX > 0 ? -1 : distanceX < 0 ? 1 : 0)
            .moveY(distanceY > 0 ? -1 : distanceY < 0 ? 1 : 0);

          // Register the tail position
          if (i === knots - 1 && !distinctGuard.has(knotsPositions[i].hash)) {
            distinctGuard.add(knotsPositions[i].hash);
            tailPositions.push(knotsPositions[i]);
          }
        }
      }
    }
  });

  return tailPositions;
};
