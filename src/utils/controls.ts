export const notUndefined = <T>(value: T | undefined): T => {
  if (value === undefined) throw Error('Value must not be undefined');
  return value;
};
