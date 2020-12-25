export type TPattern = { pattern: string; description: string };
export const patternToString = (patterns: TPattern[]): string =>
  patterns.length
    ? '(' + patterns.map(({ pattern }) => pattern).join('|') + ')'
    : undefined;
