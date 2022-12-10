/**
 * Return an array of numbers between the start and the end
 * Includes both the start and the end
 * @param start
 * @param end
 */
export const rangeBetween = (start: number, end: number): number[] => {
  const values: number[] = [];
  for (let i = start; i <= end; i++) {
    values.push(i);
  }
  return values;
};

/**
 * Return an array of numbers between the start and the end
 * Includes both the start and the end
 * @param start
 * @param end
 */
export const repeat = (times: number): number[] => {
  const values: number[] = [];
  for (let i = 0; i < times; i++) {
    values.push(i);
  }
  return values;
};
