/**
 * Return an array without duplicates
 * @param array The subject
 */
export const distinct = <T>(array: Readonly<T[]>): T[] => [...new Set(array)];

/**
 * Count elements of an array that meet the condition specified in a callback function.
 * @param array The subject
 * @param predicate The method calls the predicate function one time for each element in the array.
 */
export const countWith = <T>(array: Readonly<T[]>, predicate: (item: T) => boolean) =>
  array.reduce((total, item) => (predicate(item) ? total + 1 : total), 0);

/**
 * Return the element of an array that returns the biggest number when passed to a callback function.
 * @param array The subject
 * @param predicate The method calls the predicate function one time for each element in the array.
 */
export const maxWith = <T>(array: Readonly<T[]>, predicate: (item: T) => number) =>
  array.reduce((previous, current) => (predicate(current) > predicate(previous) ? current : previous));

/**
 * Return the sum of every elements in an array
 * @param array The subject
 */
export const add = (values: Readonly<number[]>): number => values.reduce((total, value) => total + value, 0);

/**
 * Return the product of every elements in an array
 * @param array The subject
 */
export const multiply = (array: Readonly<number[]>) => array.reduce((a, b) => a * b);
