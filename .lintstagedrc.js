const files = '*.(js|jsx|ts|tsx|json|css|scss)';
module.exports = {
  [`**/${files}`]: ['pnpm prettier:fix', 'pnpm eslint:validate-root'],
};
