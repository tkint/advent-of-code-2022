import fs from 'fs';
import path from 'path';

/**
 * Return the content of an input file next to the test file
 *
 * @param filename name of the input file (default: `input.txt`)
 * @returns The content of the file
 */
export const getInput = (filename: string = 'input.txt'): string => {
  const { testPath } = expect.getState();

  if (!testPath) throw Error(`Error while searching for testPath : ${expect.getState()}`);

  const inputPath = path.join(path.dirname(testPath), filename);

  return fs.readFileSync(inputPath).toString();
};
