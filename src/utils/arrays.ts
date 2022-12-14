/**
 * Return an array without duplicates
 * @param array The subject
 */
export const distinct = <T>(array: Readonly<T[]>): T[] => [...new Set(array)];

/**
 * Return an array without duplicates using a callback function to detect them.
 * Useful for array of objects
 * @param array The subject
 */
export const distinctWith = <T>(array: Readonly<T[]>, predicate: (item: T) => string): T[] => {
  const uniqueValues = new Set<string>();
  const items: T[] = [];
  array.forEach((item) => {
    const value = predicate(item);
    if (!uniqueValues.has(value)) {
      uniqueValues.add(value);
      items.push(item);
    }
  });
  return items;
};

/**
 * Count elements of an array that meet the condition specified in a callback function.
 * @param array The subject
 * @param predicate The method calls the predicate function one time for each element in the array.
 */
export const countWith = <T>(array: Readonly<T[]>, predicate: (item: T) => boolean): number =>
  array.reduce((total, item) => (predicate(item) ? total + 1 : total), 0);

/**
 * Return the element of an array that returns the biggest number when passed to a callback function.
 * @param array The subject
 * @param predicate The method calls the predicate function one time for each element in the array.
 */
export const maxWith = <T>(array: Readonly<T[]>, predicate: (item: T) => number) =>
  array.reduce((previous, current) => (predicate(current) > predicate(previous) ? current : previous));

/**
 * Return the element of an array that returns the smallest number when passed to a callback function.
 * @param array The subject
 * @param predicate The method calls the predicate function one time for each element in the array.
 */
export const minWith = <T>(array: Readonly<T[]>, predicate: (item: T) => number) =>
  array.reduce((previous, current) => (predicate(current) < predicate(previous) ? current : previous));

/**
 * Return the sum of every elements in an array
 * @param array The subject
 */
export const sum = (values: Readonly<number[]>): number => values.reduce((total, value) => total + value, 0);

/**
 * Return the product of every elements in an array
 * @param array The subject
 */
export const multiply = (array: Readonly<number[]>) => array.reduce((a, b) => a * b);
