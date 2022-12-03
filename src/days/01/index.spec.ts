import os from 'os';
import { getInput } from '../../utils/files';
import { sumOf } from '../../utils/number';

it('Day 01', () => {
  const input = getInput();
  const lines = input.split(os.EOL);

  // Get baskets from lines
  const baskets = getBaskets(lines);

  // Sort baskets from the biggest to the smallest
  baskets.sort((a, b) => {
    if (a.total > b.total) return -1;
    if (a.total < b.total) return 1;
    return 0;
  });

  // Puzzle 1
  const biggestBasket = baskets[0].total;
  console.log(`Puzzle 1 : ${biggestBasket}`);

  // Puzzle 2
  const topThreeTotal = sumOf([baskets[0].total, baskets[1].total, baskets[2].total]);
  console.log(`Puzzle 2 : ${topThreeTotal}`);
});

class Basket {
  constructor(public values: number[]) {}

  public get total() {
    return sumOf(this.values);
  }
}

/**
 * Get baskets from lines
 * Use an accumulator (values) to get all the current basket values
 * For each line :
 *   if it is not empty, add the values to the accumulator
 *   else, register the basket and empty the accumulator
 * @param lines
 * @returns
 */
const getBaskets = (lines: string[]): Basket[] => {
  const baskets: Basket[] = [];
  let values: number[] = [];

  lines.forEach((line) => {
    if (line !== '') {
      values.push(parseInt(line));
    } else {
      baskets.push(new Basket([...values]));
      values.splice(0, values.length);
    }
  });

  return baskets;
};
