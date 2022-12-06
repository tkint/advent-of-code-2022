import os from 'os';
import { uniqueValues } from '../../utils/arrays';
import { getInput } from '../../utils/files';

it('Day 06', () => {
  const input = getInput();
  const buffer = input.split(os.EOL)[0];

  // Result of puzzle 1
  const startOfPacketMarker = getMarker(buffer, 4);
  console.log(startOfPacketMarker);

  // Result of puzzle 2
  const startOfMessageMarker = getMarker(buffer, 14);
  console.log(startOfMessageMarker);
});

type Marker = {
  value: string;
  index: number;
};

/**
 * Get the first marker of given size (A marker is a sequence of unique characters)
 *
 * Loop through every character until the marker is found.
 * For each character, add it to the marker while removing the extra character if there is one
 * If the marker is only composed of unique values, then break the loop
 * The index returned is the index of the marker's last character
 * @param buffer
 * @param size
 * @returns
 */
const getMarker = (buffer: string, size: number): Marker => {
  let i = 0;
  const marker: string[] = [];
  while (i < buffer.length) {
    if (marker.length === size && uniqueValues(marker).length === size) {
      break;
    }
    marker.push(buffer[i]);
    if (marker.length > size) {
      marker.shift();
    }
    i++;
  }
  return { value: marker.join(''), index: i };
};
