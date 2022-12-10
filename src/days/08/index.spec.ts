import os from 'os';
import { countWith, maxWith } from '../../utils/arrays';
import { getInput } from '../../utils/files';

it('Day 08', () => {
  const input = getInput();
  const lines = input.split(os.EOL);

  // Get forest from lines
  const forest = Forest.fromLines(lines);

  // Puzzle 1
  const visibleTrees = countWith(forest.trees, (tree) => tree.isVisibleFromOutside);
  console.log(visibleTrees);

  // Puzzle 2
  const highestScenicScore = maxWith(forest.trees, (tree) => tree.scenicScore).scenicScore;
  console.log(highestScenicScore);
});

class Tree {
  constructor(
    public readonly x: number,
    public readonly y: number,
    private readonly height: number,
    private readonly forest: Forest,
  ) {}

  /**
   * Return true if every tree on a side are smaller than this tree
   */
  get isVisibleFromOutside(): boolean {
    const isSmaller = ({ height }: Tree) => {
      return height > this.height;
    };

    if (this.topTrees.every(isSmaller)) return true;
    if (this.bottomTrees.every(isSmaller)) return true;
    if (this.leftTrees.every(isSmaller)) return true;
    if (this.rightTrees.every(isSmaller)) return true;

    return false;
  }

  /**
   * Calculate the scenic score by counting the number of trees on each side
   * until a higher tree is encountered
   */
  get scenicScore(): number {
    // Count trees until a higher tree is encountered
    const countUntilHigher = (trees: Tree[]) => {
      let count = 0;
      for (const tree of trees) {
        count++;
        if (tree.height >= this.height) break;
      }
      return count;
    };

    const score =
      countUntilHigher(this.topTrees.reverse()) *
      countUntilHigher(this.bottomTrees) *
      countUntilHigher(this.leftTrees.reverse()) *
      countUntilHigher(this.rightTrees);

    return score;
  }

  get column(): Tree[] {
    return this.forest.getColumn(this.x);
  }

  get row(): Tree[] {
    return this.forest.getRow(this.y);
  }

  get topTrees(): Tree[] {
    return this.column.slice(0, this.y);
  }

  get bottomTrees(): Tree[] {
    return this.column.slice(this.y + 1);
  }

  get leftTrees(): Tree[] {
    return this.row.slice(0, this.x);
  }

  get rightTrees(): Tree[] {
    return this.row.slice(this.x + 1);
  }
}

/**
 * By using rows and columns, we reduce the computations because it provides
 * direct access to the column and row of a given tree
 */
class Forest {
  public readonly trees: Readonly<Tree[]>;
  private readonly rows: Readonly<Tree[][]>;
  private readonly columns: Readonly<Tree[][]>;

  private constructor(lines: string[]) {
    const trees: Tree[] = [];
    const rows: Tree[][] = [];
    const columns: Tree[][] = [];

    lines.forEach((line, y) => {
      line.split('').forEach((height, x) => {
        const tree = new Tree(x, y, parseInt(height), this);
        trees.push(tree);

        if (!rows[y]) rows[y] = [];
        rows[y].push(tree);

        if (!columns[x]) columns[x] = [];
        columns[x].push(tree);
      });
    });

    this.trees = trees;
    this.rows = rows;
    this.columns = columns;
  }

  static fromLines(lines: string[]): Forest {
    return new Forest(lines);
  }

  public get width(): number {
    return this.columns.length;
  }

  public get height(): number {
    return this.rows.length;
  }

  getRow(index: number): Tree[] {
    return this.rows[index];
  }

  getColumn(index: number): Tree[] {
    return this.columns[index];
  }

  getTree(x: number, y: number): Tree {
    return this.rows[y][x];
  }
}
