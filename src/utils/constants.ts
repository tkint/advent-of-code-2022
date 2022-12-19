import { repeat } from './number';

export const ALPHABET_UPPER = repeat(26).map((_, i) => String.fromCharCode(i + 65));
export const ALPHABET_LOWER = ALPHABET_UPPER.map((l) => l.toLowerCase());
