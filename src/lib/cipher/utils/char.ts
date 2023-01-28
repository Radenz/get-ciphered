import { mod } from "./math";

export const A = 65;
export const Z = 90;
const a = 97;
const z = 122;
export const J = 74;
export const j = 106;
export const X = 88;

export const NON_ALPHA = /[^a-zA-Z]/g;
export const J_REGEX = /[Jj]/g;

function alphaCodeOf(char: number): number {
  if (char >= A && char <= Z) return char - A;
  if (char >= a && char <= z) return char - a;
  return -1;
}

function alphaUpperCaseOf(char: number): number {
  const index = mod(char, 26);
  return index + A;
}

function alphaLowerCaseOf(char: number): number {
  const index = mod(char, 26);
  return index + a;
}

function toUpperCase(char: number): number {
  return alphaUpperCaseOf(alphaCodeOf(char));
}

function isAlpha(char: number): boolean {
  return (char >= A && char <= Z) || (char >= a && char <= z);
}

function chunked(text: string, length: number): string[] {
  const regex = new RegExp(`.{1,${length}}`, "g");
  return text.match(regex);
}

export {
  alphaCodeOf,
  alphaUpperCaseOf,
  alphaLowerCaseOf,
  isAlpha,
  toUpperCase,
  chunked,
};
