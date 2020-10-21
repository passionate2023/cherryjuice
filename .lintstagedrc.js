const files = '*.(js|jsx|ts|tsx|json|css|scss)';
module.exports = {
  [`**/${files}`]: ['yarn prettier:fix', 'yarn eslint:validate-root'],
};
