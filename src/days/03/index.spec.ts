import os from 'os';
import { sum, distinct } from '../../utils/arrays';
import { ALPHABET_LOWER, ALPHABET_UPPER } from '../../utils/constants';
import { getInput } from '../../utils/files';

it('Day 03', () => {
  const input = getInput();
  const lines = input.split(os.EOL);

  // Get rucksacks from lines
  const rucksacks = lines.map((line) => Rucksack.fromLine(line));

  // Result for puzzle 1
  const totalSharedItemsPriorities = sum(
    rucksacks.map(({ sharedItems }) => {
      const sharedItemsPriorities = sharedItems.map((item) => getItemPriority(item));
      return sum(sharedItemsPriorities);
    }),
  );
  console.log(totalSharedItemsPriorities);

  // Puzzle 2
  // Group rucksacks
  const groups = getGroups(rucksacks);

  // Result for puzzle 2
  const totalBadgePriorities = sum(groups.map(({ badge }) => getItemPriority(badge)));
  console.log(totalBadgePriorities);
});

// Dictionnary of possible items in rucksacks
const possibleItems = [...ALPHABET_LOWER, ...ALPHABET_UPPER];

/**
 * Get an item priority
 * Corresponds to its index in the dictionnary + 1
 *  a through z have priorities 1 through 26
 *  A through Z have priorities 27 through 52
 * @param item
 * @returns item priority
 */
const getItemPriority = (item: string): number => {
  const index = possibleItems.indexOf(item);
  if (index < 0) {
    throw Error(`Item ${item} is not valid`);
  }
  return index + 1;
};

class Rucksack {
  private constructor(public items: string[]) {}

  static fromLine(line: string): Rucksack {
    const items = line.split('');
    return new Rucksack(items);
  }

  get uniqueItems(): string[] {
    return distinct(this.items);
  }

  get middle(): number {
    return Math.round(this.items.length / 2);
  }

  get firstCompartment(): string[] {
    return this.items.slice(0, this.middle);
  }

  get secondCompartment(): string[] {
    return this.items.slice(this.middle);
  }

  get sharedItems(): string[] {
    return distinct(
      this.uniqueItems.filter((item) => this.firstCompartment.includes(item) && this.secondCompartment.includes(item)),
    );
  }
}

class Group {
  constructor(private rucksacks: Rucksack[]) {}

  get groupItems(): string[] {
    return distinct(this.rucksacks.flatMap(({ items }) => items));
  }

  get badge(): string {
    const sharedItem = this.groupItems.find((item) => this.rucksacks.every(({ items }) => items.includes(item)));

    if (sharedItem === undefined) {
      throw Error('No shared item found for this group');
    }

    return sharedItem;
  }
}

/**
 * Group rucksacks by three
 * @param rucksacks every rucksacks
 * @returns group of 3 rucksacks
 */
const getGroups = (rucksacks: Rucksack[]): Group[] => {
  const groups: Group[] = [];
  let i = 0;
  while (i < rucksacks.length) {
    const groupRucksacks: Rucksack[] = [];
    for (let j = 0; j < 3; j++) {
      groupRucksacks.push(rucksacks[i]);
      i++;
    }
    groups.push(new Group(groupRucksacks));
  }

  return groups;
};
