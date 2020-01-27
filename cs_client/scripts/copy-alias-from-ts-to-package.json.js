const fs = require('fs');
const path = require('path');
const tsconfig = fs
  .readFileSync(path.resolve(__dirname, '../tsconfig.json'))
  .toString();
if (tsconfig) {
  let pairs = [];
  const paths = JSON.parse(tsconfig).compilerOptions.paths;
  pairs = Object.entries(paths).map(([key, value]) => `"${key.replace('/*', '')}": "${value[0].replace('*', '')}"`
  );
  console.log(pairs.join(',\n'));
}
