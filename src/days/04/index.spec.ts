import os from 'os';
import { countWith } from '../../utils/arrays';
import { getInput } from '../../utils/files';
import { rangeBetween } from '../../utils/number';

it('Day 04', () => {
  const input = getInput();
  const lines = input.split(os.EOL);

  // Get asignment pairs from lines
  const pairs = lines.map((line) => Pair.fromLine(line));

  // Result for puzzle 1
  const totalDuplicates = countWith(pairs, (pair) => pair.duplicate);
  console.log(totalDuplicates);

  // Result for puzzle 2
  const totalOverlaps = countWith(pairs, (pair) => pair.overlap);
  console.log(totalOverlaps);
});

class Assignment {
  private constructor(public start: number, public end: number) {}

  static fromBoundaries(boundaries: string): Assignment {
    const [start, end] = boundaries.split('-');
    return new Assignment(parseInt(start), parseInt(end));
  }

  get sections(): number[] {
    return rangeBetween(this.start, this.end);
  }

  fullyContains(other: Assignment): boolean {
    return this.start <= other.start && this.end >= other.end;
  }

  overlap(other: Assignment): boolean {
    return this.sections.some((section) => other.sections.includes(section));
  }
}

class Pair {
  private constructor(public first: Assignment, public second: Assignment) {}

  static fromLine(line: string): Pair {
    const items = line.split(',');
    return new Pair(Assignment.fromBoundaries(items[0]), Assignment.fromBoundaries(items[1]));
  }

  get duplicate(): boolean {
    return this.first.fullyContains(this.second) || this.second.fullyContains(this.first);
  }

  get overlap(): boolean {
    return this.first.overlap(this.second) || this.second.overlap(this.first);
  }
}
