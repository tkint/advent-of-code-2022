export const uniqueValues = <T>(array: Readonly<T[]>): T[] => [...new Set(array)];
