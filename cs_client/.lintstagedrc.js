module.exports = {
  '../**/*.{js,jsx,ts,tsx,md,html,css}': 'prettier --write',
  '../**/*.{js,jsx,ts,tsx}': 'eslint',
  '*.{js,jsx,ts,tsx,md,html,css}': 'prettier --write',
  '*.{js,jsx,ts,tsx}': 'eslint',
};
