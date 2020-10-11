const fs = require('fs');
const path = require('path');

const stripDevDependencies = folder => {
  const filePath = path.join(process.cwd(), folder, 'package.json');
  const fileBackupPath = path.join(
    process.cwd(),
    folder,
    'package.json_backup',
  );
  const file = fs.readFileSync(filePath).toString();
  if (file) {
    const pckg = JSON.parse(file);
    pckg.devDependencies = {};
    pckg.optionalDependencies = {};
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

const paths = ['./', './apps/cs_client/', './libs/*'];

resolveGlobs(paths).forEach(module => {
  stripDevDependencies(module);
});
