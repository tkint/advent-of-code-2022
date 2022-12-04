/**
 * Return the sum of passed numbers
 */
export const sumOf = (values: number[]): number => values.reduce((total, value) => total + value, 0);

export const rangeOf = (start: number, end: number): number[] => {
  const values: number[] = [];
  for (let i = start; i <= end; i++) {
    values.push(i);
  }
  return values;
};
