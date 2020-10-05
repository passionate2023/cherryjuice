const fs = require('fs');
const path = require('path');
const stripDevDependencies = folder => {
  const filePath = path.join(process.cwd(), folder, 'package.json');
  const file = fs.readFileSync(filePath).toString();
  if (file) {
    const pckg = JSON.parse(file);
    pckg.devDependencies = {};
    pckg.optionalDependencies = {};
    fs.writeFileSync(filePath, JSON.stringify(pckg, null, 4));
  }
};
const paths = [
  './',
  './apps/cs_client/',
  './libs/graphql-types',
  './libs/ahtml-to-html',
  './libs/ctb-to-ahtml',
];
paths.forEach(path => {
  stripDevDependencies(path);
});
