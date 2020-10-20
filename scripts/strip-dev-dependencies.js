/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const args = process.argv;
const stripOptional = args.includes('--opt');
const stripDev = args.includes('--dev');
const stripServerDeps = args.includes('--include-server');

const stripDevDependencies = folder => {
  const filePath = path.join(process.cwd(), folder, 'package.json');
  const fileBackupPath = path.join(
    process.cwd(),
    folder,
    'package.json_backup',
  );
  const file = fs.readFileSync(filePath).toString();
  if (file && (stripDev || stripOptional)) {
    const pckg = JSON.parse(file);
    if (stripDev) pckg.devDependencies = {};
    if (stripOptional) pckg.optionalDependencies = {};
    fs.writeFileSync(filePath, JSON.stringify(pckg, null, 4));
    fs.writeFileSync(fileBackupPath, file);
  }
};

const resolveGlobs = folders =>
  folders.reduce((folders, folder) => {
    if (folder.endsWith('*')) {
      let folderWithoutAsterisks = folder.substring(0, folder.length - 1);
      const ls = fs.readdirSync(folderWithoutAsterisks);
      folders.push(
        ...ls.map(subFolder => path.join(folderWithoutAsterisks, subFolder)),
      );
    } else folders.push(folder);

    return folders;
  }, []);

const paths = [
  './',
  stripServerDeps ? './apps/*' : './apps/cs_client/',
  './libs/*',
];

resolveGlobs(paths).forEach(module => {
  stripDevDependencies(module);
});
