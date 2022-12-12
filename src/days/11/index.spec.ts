import os from 'os';
import { multiply } from '../../utils/arrays';
import { notUndefined } from '../../utils/controls';
import { getInput } from '../../utils/files';
import { compareNumber, lcmOf, repeat } from '../../utils/number';

it('Day 11', () => {
  const input = getInput();
  const lines = input.split(os.EOL);

  // Get monkeys from lines
  const monkeys = getMonkeys(lines);

  // Puzzle 1
  // Define the worry manager for puzzle 1
  const basicManager: WorryHandler = (previous) => Math.floor(previous / 3);

  // Result for puzzle 1
  const monkeyBusiness = executeRounds(monkeys, 20, basicManager);
  console.log(monkeyBusiness);

  // Puzzle 2
  // Define the worry manager for puzzle 2
  // Apparently, we had to figure out to use the least common multiplier of
  // every monkey divider
  const lcmOfDividers = monkeys.map(({ divider }) => divider).reduce(lcmOf);
  const lcmManager: WorryHandler = (previous) => previous % lcmOfDividers;

  // Result for puzzle 2
  const lcmMonkeyBusiness = executeRounds(monkeys, 10000, lcmManager);
  console.log(lcmMonkeyBusiness);
});

const monkeyPattern = /Monkey (\d+):$/;
const itemsPattern = /Starting items: (.*)/;
const operationPattern = /Operation: new = old ([+*]) (\d+|old)$/;
const testDividerPattern = /Test: divisible by (\d+)$/;
const testTargetPattern = /If true: throw to monkey (\d+)$/;
const testBackupPattern = /If false: throw to monkey (\d+)$/;

/**
 * A WorryHandler is a function taking a worry level and returning
 * a result of a computation.
 */
type WorryHandler = (previous: number) => number;

type Monkey = {
  readonly index: number;
  readonly items: number[];
  readonly operation: WorryHandler;
  readonly divider: number;
  readonly target: number;
  readonly backup: number;
};

class MonkeyBuilder {
  public items?: number[];
  public operation?: WorryHandler;
  public divider?: number;
  public target?: number;
  public backup?: number;

  constructor(private index: number) {}

  build(): Monkey {
    return {
      index: this.index,
      items: notUndefined(this.items),
      operation: notUndefined(this.operation),
      divider: notUndefined(this.divider),
      target: notUndefined(this.target),
      backup: notUndefined(this.backup),
    };
  }
}

/**
 * Get monkeys from lines.
 * Use a builder because the informations are on different lines
 * @param lines
 * @returns
 */
const getMonkeys = (lines: string[]): Monkey[] => {
  const monkeys: Monkey[] = [];
  let monkeyBuilder: MonkeyBuilder;

  lines.forEach((line) => {
    if (line.match(monkeyPattern)) {
      // Init a new builder
      const index = parseInt(line.split(' ')[1].replace(/:$/, ''));
      monkeyBuilder = new MonkeyBuilder(index);
    } else if (line.match(itemsPattern)) {
      // Set starting items
      const [_, itemList] = itemsPattern.exec(line) || [];
      const items = itemList.split(',').map((item) => parseInt(item));
      monkeyBuilder.items = items;
    } else if (line.match(operationPattern)) {
      // Set operation
      const [_, operator, amount] = operationPattern.exec(line) || [];
      monkeyBuilder.operation = eval(`(old) => old ${operator} ${amount};`);
    } else if (line.match(testDividerPattern)) {
      // Set divider
      const [_, divider] = testDividerPattern.exec(line) || [];
      monkeyBuilder.divider = parseInt(divider);
    } else if (line.match(testTargetPattern)) {
      // Set target when true
      const [_, target] = testTargetPattern.exec(line) || [];
      monkeyBuilder.target = parseInt(target);
    } else if (line.match(testBackupPattern)) {
      // Set target when false
      const [_, backup] = testBackupPattern.exec(line) || [];
      monkeyBuilder.backup = parseInt(backup);
    } else if (line === '') {
      // Build the monkey and add it to the list
      monkeys.push(monkeyBuilder.build());
    }
  });

  return monkeys;
};

type RoundResult = {
  monkeys: Monkey[];
  inspections: number[];
};

/**
 * Execute a round and return the result without mutating the previous round
 * For each monkey :
 *  - increment its inspections number by the amount of items it starts with
 *  - remove an item and evaluate it :
 *    - execute the operation of the monkey
 *    - execute the worryManager passed
 *  - if the level evaluated hit the spot, add the item to target
 *  - else add the item to backup
 * @param previous
 * @param worryManager
 * @returns
 */
const executeRound = (previous: RoundResult, worryManager: WorryHandler): RoundResult => {
  const monkeys = previous.monkeys.map((monkey) => ({ ...monkey, items: Array.from(monkey.items) }));
  const inspections = Array.from(previous.inspections);

  for (const monkey of monkeys) {
    const { index, items, operation, divider, target, backup } = monkey;

    inspections[index] = (inspections[index] ?? 0) + items.length;

    while (items.length > 0) {
      const item = items.shift()!;
      const worryLevel = worryManager(operation(item));
      if (worryLevel % divider === 0) {
        monkeys[target].items.push(worryLevel);
      } else {
        monkeys[backup].items.push(worryLevel);
      }
    }
  }

  return {
    monkeys,
    inspections,
  };
};

/**
 * Execute a number of rounds with given monkeys and worry manager
 * Returns the monkey business (product of top 2 inspections)
 * @param monkeys
 * @param rounds
 * @param manager
 * @returns
 */
const executeRounds = (monkeys: Monkey[], rounds: number, manager: WorryHandler): number => {
  const start: RoundResult = {
    monkeys,
    inspections: [],
  };
  const result = repeat(rounds).reduce((previous) => executeRound(previous, manager), start);
  const mostActives = result.inspections.sort(compareNumber).slice(-2);
  return multiply(mostActives);
};
