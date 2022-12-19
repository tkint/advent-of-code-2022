import os from 'os';
import { getInput } from '../../utils/files';

it('Day 13', () => {
  const input = getInput();
  const lines = input.split(os.EOL);

  // Get packets from lines
  const packets = getPackets(lines);

  // Puzzle 1
  // Result puzzle 1
  const indices = packets.reduce((total, [left, right], index) => {
    const result = compareValues(left, right);
    if (result < 0) return total + index + 1;
    return total;
  }, 0);
  console.log(indices);

  // Puzzle 2
  // Declare dividers
  const dividers: [Packet, Packet] = [[[2]], [[6]]];

  // Sort packets with dividers
  const sortedPackets = [...packets, dividers].flat(1).sort((a, b) => compareValues(a, b));

  // Result puzzle 2
  const decoderKey = dividers.reduce((total, divider) => total * (sortedPackets.indexOf(divider) + 1), 1);
  console.log(decoderKey);
});

type Value = number[] | Value[] | number;

type Packet = Value[];

const compareValues = (left: Value, right: Value): number => {
  if (typeof left === 'number' && typeof right === 'number') {
    // If both values are integers
    return left - right;
  } else if (Array.isArray(left) && Array.isArray(right)) {
    // If both values are lists
    const maxLength = Math.max(left.length, right.length);
    let i = 0;
    while (i < maxLength) {
      const l = left[i];
      const r = right[i];
      // If left run out of values
      if (l === undefined) return -1;
      // If right run out of values
      if (r === undefined) return 1;

      const result = compareValues(l, r);
      // If comparison is decisive
      if (result !== 0) return result;
      i++;
    }
  } else if (typeof left === 'number') {
    // If left is an integer
    return compareValues([left], right);
  } else if (typeof right === 'number') {
    // If right is an integer
    return compareValues(left, [right]);
  }
  return 0;
};

/**
 * Get packets from lines
 * The use of `eval` is a neat shortcut to avoid parsing everything
 * @param lines
 * @returns
 */
const getPackets = (lines: string[]): [Packet, Packet][] => {
  const packets: [Packet, Packet][] = [];

  for (let i = 0; i < lines.length; i += 3) {
    const left = eval(lines[i]);
    const right = eval(lines[i + 1]);
    packets.push([left, right]);
  }

  return packets;
};
