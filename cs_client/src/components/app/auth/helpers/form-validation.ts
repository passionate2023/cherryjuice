type TPattern = { pattern: string; description: string };
const patterns: { [k: string]: TPattern } = {
  notEmpty: {
    pattern: '^.{1,}',
    description: 'Please fill out this field',
  },
  userName: {
    pattern: '^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$',
    description:
      'username should be numeric and should not start or end with ._',
  },
  email: {
    pattern: '^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$',
    description: 'invalid email',
  },
};

const patternToString = (patterns: TPattern[]): string =>
  patterns.length
    ? '(' + patterns.map(({ pattern }) => pattern).join('|') + ')'
    : undefined;

export { patterns, patternToString };
export { TPattern };
