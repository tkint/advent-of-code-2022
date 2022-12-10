import os from 'os';
import { add } from '../../utils/arrays';
import { getInput } from '../../utils/files';

it('Day 07', () => {
  const input = getInput();
  const lines = input.split(os.EOL);

  // Get filesystem tree from lines
  const fileSystem = FileSystem.fromLines(lines);

  // Puzzle 1
  // List directories smaller than 100000
  const smallDirectories = fileSystem.listDirectories((dir) => dir.size < 100000);

  // Result for puzzle 1
  const sizeOfSmallDirectories = add(smallDirectories.map((d) => d.size));
  console.log(sizeOfSmallDirectories);

  // Puzzle 2
  const spaceToFree = 30000000 - fileSystem.unusedSpace;
  // List directories bigger than the space to free
  const bigDirectories = fileSystem.listDirectories((dir) => dir.size > spaceToFree);

  // Result for puzzle 2
  const sizeOfDirectoryToDelete = bigDirectories.reduce((a, b) => (a.size < b.size ? a : b)).size;
  console.log(sizeOfDirectoryToDelete);
});

interface File {
  name: string;
  size: number;
  parent?: Directory;
}

class PlainFile implements File {
  constructor(public name: string, public size: number, public parent?: Directory) {}
}

class Directory implements File {
  constructor(public name: string, public parent?: Directory, public files: File[] = []) {}

  get size(): number {
    return add(this.files.map((file) => file.size));
  }

  get directories(): Directory[] {
    return this.files.filter((f) => f instanceof Directory) as Directory[];
  }

  getDirectory(name: string): Directory | undefined {
    return this.directories.find((f) => f.name === name);
  }
}

class FileSystem {
  private maxSpace = 70000000;

  private constructor(public tree: Directory) {}

  static fromLines(lines: string[]): FileSystem {
    return new FileSystem(this.collectTree(lines));
  }

  get usedSpace(): number {
    return this.tree.size;
  }

  get unusedSpace(): number {
    return this.maxSpace - this.usedSpace;
  }

  /**
   * List directories in the whole tree that meet the condition specified in a callback function
   * The collector is a recursive function, so it can go deep into the tree
   * @param predicate
   * @returns
   */
  listDirectories(predicate: (directory: Directory) => boolean): Directory[] {
    const collectDirectories = (directory: Directory): Directory[] => {
      const directories: Directory[] = [];
      directory.directories.forEach((dir) => {
        if (predicate(dir)) {
          directories.push(dir);
        }
        directories.push(...collectDirectories(dir));
      });
      return directories;
    };
    return collectDirectories(this.tree);
  }

  /**
   * Collect the whole tree based on the terminal output
   * Use a cursor (currentDir) to know where we are
   *
   * We suppose the first line of the output is `$ cd /`,
   * so we place the cursor on the root and start collecting
   * with the second line
   *
   * For each line :
   *   if `$ cd /`, place the cursor at the root
   *   if `$ cd ..`, go back to the parent directory
   *   if `$ cd x`, go deeper into the x directory
   *   if `$ ls`, collect the files of the current directory
   *
   * @param lines
   * @returns
   */
  private static collectTree(lines: string[]): Directory {
    let root = new Directory('/');

    let currentDir: Directory = root;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line === '$ cd /') {
        currentDir = root;
      } else if (!currentDir) {
        throw Error(`Can't use ${line} when not in a directory`);
      } else if (line === '$ cd ..') {
        if (!currentDir.parent) {
          throw Error(`Dir ${currentDir} has no parent !`);
        }
        currentDir = currentDir.parent;
      } else if (line.startsWith('$ cd')) {
        const name = line.slice(5);
        const subDir = currentDir.getDirectory(name);
        if (!subDir) {
          throw Error(`File ${name} is not a valid directory`);
        }
        currentDir = subDir;
      } else if (line === '$ ls') {
        const files = this.collectFiles(currentDir, lines.slice(i + 1));
        currentDir.files = files;
        i += files.length;
      }
    }

    return root;
  }

  /**
   * Collect every files (directories and plain files) until the next command
   * Doesn't mutate the lines nor the passed directory
   * @param currentDir
   * @param lines
   * @returns
   */
  private static collectFiles(currentDir: Directory, lines: string[]): File[] {
    const files: File[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('$')) {
        break;
      }

      if (line.startsWith('dir')) {
        const [_, name] = line.split(' ');
        files.push(new Directory(name, currentDir));
      } else {
        const [size, name] = line.split(' ');
        files.push(new PlainFile(name, parseInt(size), currentDir));
      }
    }
    return files;
  }
}
