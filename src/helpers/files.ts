import * as path from 'path';
import * as fs from 'fs';
import slugify from 'slugify';
import * as crypto from 'crypto';
import { TFile } from '../types/types';

const scanFolder: ({
  folders
}: {
  folders: string[];
}) => Map<number, TFile> = ({ folders }) => {
  const res = [];

  const resolve = folderPath => {
    const fullFolderPath = path.resolve(__dirname, folderPath);
    const dir = fs.readdirSync(fullFolderPath);
    dir.forEach(file => {
      const lePath = path.resolve(fullFolderPath, file);
      const stats = fs.lstatSync(lePath);
      if (stats.isDirectory()) {
        resolve(lePath);
      } else if (file.endsWith('ctb')) {
        const { size, birthtimeMs, mtimeMs, ctimeMs, atimeMs } = fs.statSync(
          lePath
        );
        res.push({
          name: file,
          size,
          fileCreation: birthtimeMs,
          fileContentModification: mtimeMs,
          fileAttributesModification: ctimeMs,
          fileAccess: atimeMs,
          slug: slugify(file.replace('.ctb', '')).substr(0, 30),
          id: crypto
            .createHash('md5')
            .update(file)
            .digest('hex'),
          filePath: lePath
        });
      }
    });
  };

  folders.forEach(resolve);
  const files: Map<number, TFile> = new Map(
    res.sort().map(node => [node.id, node])
  );
  return files;
};
export { scanFolder };
