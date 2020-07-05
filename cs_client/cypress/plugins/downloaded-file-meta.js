/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const { exec } = require('child_process');

const getUserHomeFolder = async () =>
  new Promise((res, rej) => {
    exec('echo %userprofile%', (err, data) => {
      res(data.toString().replace('\r\n', ''));
      rej(err);
    });
  });

const copyFile = async (source, target) => {
  fs.mkdirSync(target.folder, { recursive: true });
  return new Promise(res => {
    fs.createReadStream(source.path)
      .pipe(fs.createWriteStream(target.path))
      .on('close', () => {
        res();
      });
  });
};
const resolveTempFixturePath = ({ name, tempSubFolder, extension, suffix }) => {
  const folder = `cypress/fixtures/temp/ctb/${tempSubFolder}`;
  const path = `${folder}/${name}-${suffix}.${extension}`;
  return { folder, path };
};
const copyDownloadedFile = async ({
  name,
  tempSubFolder,
  extension,
  suffix,
}) => {
  const source = {
    path: (await getUserHomeFolder()) + '\\downloads\\' + name,
  };
  if (!fs.existsSync(source.path))
    throw new Error(`${source.path} does not exist`);

  const target = resolveTempFixturePath({
    name,
    tempSubFolder,
    extension,
    suffix,
  });
  await copyFile(source, target);

  return target;
};
module.exports = { copyDownloadedFile };
