import os from 'os';
import { sum } from '../../utils/arrays';
import { getInput } from '../../utils/files';

it('Day 10', () => {
  const input = getInput();
  const lines = input.split(os.EOL);

  const cpu = CPU.fromLines(lines);

  // Puzzle 1
  // Run all instructions and get cycles history
  const cycles = cpu.run();

  // Get the signal strength for every milestones from 20 to 220
  const signalStrengths = [20, 60, 100, 140, 180, 220].map((milestone) => cycles[milestone - 1] * milestone);

  // Result puzzle 1
  const totalSignalStrength = sum(signalStrengths);
  console.log(totalSignalStrength);

  // Puzzle 2
  // Instanciate the CRT
  const crt = new CRT({ width: 40, height: 6 });

  // Compute the canvas based on the cycles of the cpu
  const canvas = crt.compute(cycles);

  // Result puzzle 2
  canvas.forEach((row) => {
    console.log(row.join(''));
  });
});

interface Instruction {
  execute(value: number): number[];
}

class Noop implements Instruction {
  execute(register: number): number[] {
    return [register];
  }
}

class Add implements Instruction {
  constructor(public readonly amount: number) {}

  execute(register: number): number[] {
    return [register, register + this.amount];
  }
}

class CPU {
  private register: number;

  private constructor(public readonly instructions: Instruction[]) {
    this.register = 1;
  }

  static fromLines(lines: string[]): CPU {
    const instructions: Instruction[] = lines.map((line) => {
      if (line === 'noop') return new Noop();
      else {
        const [_, amount] = line.split(' ');
        return new Add(parseInt(amount));
      }
    });
    return new CPU(instructions);
  }

  run(): number[] {
    return this.instructions.reduce(
      (result, instruction) => [...result, ...instruction.execute(result[result.length - 1])],
      [this.register],
    );
  }
}

class CRT {
  public readonly width: number;
  public readonly height: number;

  constructor(size: { width: number; height: number }) {
    this.width = size.width;
    this.height = size.height;
  }

  /**
   * Loop through the screen while being synchronized with the cycles.
   * For each pixel, if it is aligned with the pointer position, then
   * draw an `#`, else, draw a `.`.
   * @param cycles
   */
  compute(cycles: number[]): string[][] {
    const canvas: string[][] = [];

    let cycleIndex = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!canvas[y]) canvas[y] = [];

        const cyclePointer = cycles[cycleIndex];
        if ([cyclePointer - 1, cyclePointer, cyclePointer + 1].includes(x)) {
          canvas[y][x] = '#';
        } else if (!canvas[y][x]) {
          canvas[y][x] = '.';
        }

        cycleIndex++;
      }
    }

    return canvas;
  }
}
