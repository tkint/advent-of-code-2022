import os from 'os';
import { getInput } from '../../utils/files';
import { rangeOf } from '../../utils/number';

it('Day 05', () => {
  const input = getInput();
  const lines = input.split(os.EOL);

  const { stacks, moves } = getStacksAndMoves(lines);

  // Puzzle 1
  // Execute moves one after the other
  const result = moves.reduce((previous, move) => executeMove(previous, move), stacks);

  // Result for puzzle 1
  const topCrates = getTopCrates(result);
  console.log(topCrates.join(''));

  // Puzzle 2
  // Execute moves by batch one after the other
  const resultBatched = moves.reduce((previous, move) => executeBatchMove(previous, move), stacks);

  // Result for puzzle 2
  const topCratesBatched = getTopCrates(resultBatched);
  console.log(topCratesBatched.join(''));
});

const movePattern = /^move (\d*) from (\d*) to (\d*)$/;
const cratePattern = /.*\[\w\].*/;

type Stacks = {
  [key: number]: string[];
};

class Move {
  private constructor(public quantity: number, public from: number, public to: number) {}

  static fromLine(line: string): Move {
    const [_, quantity, from, to] = movePattern.exec(line) || [];
    return new Move(parseInt(quantity), parseInt(from), parseInt(to));
  }
}

/**
 * Get stacks and moves from lines
 * For each line :
 *   if it is a move, register it
 *   else, register the crate into the correct stack
 *
 * For the stacks, because we are reading lines and conveting it into columns,
 * we use a `stackId` to know on which stack we have to put the crate.
 * A loop is processing a line, assuming every 4 characters is a crate or a blank space
 *
 * A stack is an array starting with the top crate
 * @param lines
 * @returns
 */
const getStacksAndMoves = (lines: string[]): { stacks: Stacks; moves: Move[] } => {
  const stacks: Stacks = {};
  const moves: Move[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.match(movePattern)) {
      moves.push(Move.fromLine(line));
    } else if (line.match(cratePattern)) {
      let stackId = 1;
      for (let j = 0; j < line.length; j += 4) {
        const crate = line.slice(j, j + 4);
        if (crate.trim()) {
          const crateId = crate.charAt(1);
          if (!stacks[stackId]) {
            stacks[stackId] = [];
          }
          stacks[stackId].push(crateId);
        }
        stackId++;
      }
    }
    i++;
  }

  return { stacks, moves };
};

/**
 * Get the top crate of each stack
 * @param stacks
 * @returns
 */
const getTopCrates = (stacks: Stacks) => Object.values(stacks).map((stack) => stack[0]);

/**
 * Execute a move one crate after the other
 * This method returns a copy of the given stacks without modifying it
 * @param stacks
 * @param move
 * @returns
 */
const executeMove = (stacks: Stacks, move: Move): Stacks => {
  const from = Array.from(stacks[move.from]);
  const to = Array.from(stacks[move.to]);
  const crates = from.splice(0, move.quantity);
  crates.forEach((crate) => {
    to.unshift(crate);
  });
  return {
    ...stacks,
    [move.from]: from,
    [move.to]: to,
  };
};

/**
 * Execute a move all crates at once
 * This method returns a copy of the given stacks without modifying it
 * @param stacks
 * @param move
 * @returns
 */
const executeBatchMove = (stacks: Stacks, move: Move): Stacks => {
  const from = Array.from(stacks[move.from]);
  const to = Array.from(stacks[move.to]);
  const crates = from.splice(0, move.quantity);
  to.unshift(...crates);
  return {
    ...stacks,
    [move.from]: from,
    [move.to]: to,
  };
};
