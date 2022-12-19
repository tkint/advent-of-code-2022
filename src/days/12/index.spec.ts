import os from 'os';
import { distinctWith, maxWith, minWith } from '../../utils/arrays';
import { ALPHABET_LOWER, ALPHABET_UPPER } from '../../utils/constants';
import { getInput } from '../../utils/files';

it.skip('Day 12', () => {
  const input = getInput();
  const lines = input.split(os.EOL);

  const heightMap = HeightMap.fromLines(lines);

  const starter: MoveResult = {
    position: heightMap.start,
    path: [],
  };

  let result = move(heightMap, starter);
  let i = 0;
  while (i < heightMap.squares.length && !result.position.isFinish) {
    result = move(heightMap, result);
    i++;
  }

  console.log(result.path);
});

const POSSIBLE_ELEVATIONS = Array.from(ALPHABET_LOWER);

class Square {
  constructor(public readonly x: number, public readonly y: number, public readonly elevation: string) {}

  get elevationWeight(): number {
    return POSSIBLE_ELEVATIONS.indexOf(this.elevation);
  }

  get isFinish(): boolean {
    return this.elevationWeight === POSSIBLE_ELEVATIONS.length - 1;
  }
}

class HeightMap {
  public readonly squares: Readonly<Square[]>;
  private readonly rows: Readonly<Square[][]>;
  private readonly columns: Readonly<Square[][]>;
  public readonly start: Square;
  public readonly end: Square;

  private constructor(lines: string[]) {
    const squares: Square[] = [];
    const rows: Square[][] = [];
    const columns: Square[][] = [];

    let startSquare: Square;
    let endSquare: Square;

    lines.forEach((line, y) => {
      line.split('').forEach((elevation, x) => {
        let square: Square;
        switch (elevation) {
          case 'S':
            startSquare = square = new Square(x, y, POSSIBLE_ELEVATIONS[0]);
            break;
          case 'E':
            endSquare = square = new Square(x, y, POSSIBLE_ELEVATIONS[POSSIBLE_ELEVATIONS.length - 1]);
            break;
          default:
            square = new Square(x, y, elevation);
            break;
        }

        squares.push(square);

        if (!rows[y]) rows[y] = [];
        rows[y].push(square);

        if (!columns[x]) columns[x] = [];
        columns[x].push(square);
      });
    });

    this.squares = squares;
    this.rows = rows;
    this.columns = columns;
    this.start = startSquare!;
    this.end = endSquare!;
  }

  static fromLines(lines: string[]): HeightMap {
    return new HeightMap(lines);
  }

  public get width(): number {
    return this.columns.length;
  }

  public get height(): number {
    return this.rows.length;
  }

  getRow(index: number): Square[] {
    return this.rows[index];
  }

  getColumn(index: number): Square[] {
    return this.columns[index];
  }

  getSquare(x: number, y: number): Square {
    return this.rows[y][x];
  }
}

type MoveResult = {
  position: Square;
  path: Square[];
};

const move = (heightMap: HeightMap, previous: MoveResult): MoveResult => {
  const { position, path } = previous;

  const possibleSquares = [
    [position.x - 1, position.y],
    [position.x + 1, position.y],
    [position.x, position.y - 1],
    [position.x, position.y + 1],
  ]
    .map(([x, y]) => {
      if (x > -1 && x < heightMap.width && y > -1 && y < heightMap.height) {
        const square = heightMap.getSquare(x, y);
        if (!path.includes(square))
          // if (Math.abs(square.elevationWeight - position.elevationWeight) < 6) return square;
          return square;
      }
      return undefined;
    })
    .filter((s) => !!s) as Square[];

  const nextSquare = maxWith(possibleSquares, ({ elevationWeight }) => elevationWeight);

  return {
    position: nextSquare,
    path: [...path, nextSquare],
  };
};
