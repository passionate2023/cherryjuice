/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const generateNamedInputs = (
  maxDepth,
  svg = false,
  files,
  srcFolder,
  dirname,
) => {
  if (!fs.lstatSync(srcFolder).isDirectory()) return;
  const objects = fs.readdirSync(srcFolder);
  objects.forEach(object => {
    const fullPath = srcFolder + '/' + object;
    const isFile = svg
      ? /(?<!global.d)(?<!stories)(?<!index)\.svg$/.test(object)
      : /(?<!global.d)(?<!stories)(?<!index)\.tsx*$/.test(object);
    if (isFile) {
      const fileName = object.replace(/\.(tsx*|svg)$/, '');
      if (files.has(fileName)) {
        throw new Error('duplicate file: ' + fileName);
      }
      files.set(fileName, fullPath.replace(dirname, ''));
    } else if (maxDepth > 0) {
      generateNamedInputs(maxDepth - 1, svg, files, fullPath, dirname);
    }
  });
};

const files = new Map();
let depth = process.argv[2];
if (depth && depth.startsWith('--depth=')) depth = +depth.split('=')[1];
const svg = process.argv[3];
generateNamedInputs(
  isNaN(depth) ? 2 : depth,
  svg === '--svg',
  files,
  process.cwd() + '/src',
  process.cwd() + '/',
);
console.log(Object.fromEntries(files.entries()));
console.log(`found ${files.size} files`);
