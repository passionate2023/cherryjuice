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
    // https://stackoverflow.com/a/201447/6549728
    // eslint-disable-next-line no-useless-escape
    pattern: '^\\S+@\\S{2,}\\.\\S{2,}$',
    description: 'invalid email',
  },
  name: {
    // https://stackoverflow.com/a/45871742/6549728
    // eslint-disable-next-line no-useless-escape
    pattern: "^[w'-,.][^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[]]{2,}$",
    description: 'only letters',
  },
  password: {
    // eslint-disable-next-line no-useless-escape
    pattern: '((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$',
    description: `password must have at least: 1 upper case letter, 1 lower case letter, 1 number or special character`,
  },
};

const patternToString = (patterns: TPattern[]): string =>
  patterns.length
    ? '(' + patterns.map(({ pattern }) => pattern).join('|') + ')'
    : undefined;

export { patterns, patternToString };
export { TPattern };
