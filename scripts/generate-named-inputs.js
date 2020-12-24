const fs = require('fs');

const generateNamedInputs = (files, maxDepth, srcFolder, dirname) => {
  if (!fs.lstatSync(srcFolder).isDirectory()) return;
  const objects = fs.readdirSync(srcFolder);
  objects.forEach(object => {
    const fullPath = srcFolder + '/' + object;
    const isFile = /(?<!global.d)(?<!stories)(?<!index)\.tsx*$/.test(object);
    if (isFile) {
      files.push([object.replace(/.tsx*$/, ''), fullPath.replace(dirname, '')]);
    } else if (maxDepth > 0) {
      generateNamedInputs(files, maxDepth - 1, fullPath, dirname);
    }
  });
};

const files = [];
generateNamedInputs(files, 2, process.cwd() + '/src', process.cwd() + '/');
console.log(Object.fromEntries(files));
