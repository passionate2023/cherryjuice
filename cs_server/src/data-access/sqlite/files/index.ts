import * as path from 'path';
import * as fs from 'fs';
import slugify from 'slugify';
import * as crypto from 'crypto';
import * as shortHash from 'shorthash';
import { Ct_File } from '../../../types/generated';
const legacyFileIDToNewID = ({
  legacyID,
  files,
}: {
  legacyID: string;
  files: any[];
}) => files.find(file => file.legacyID === legacyID)?.id;
const adaptFileID = (file_id, files) =>
  file_id.length === 32
    ? legacyFileIDToNewID({
        legacyID: file_id,
        files: Array.from(files.values()),
      })
    : file_id;
const fileNames = {}
const resolve = ({ folderPath, res, userID }) => {
  const fullFolderPath = path.resolve(__dirname, folderPath);
  const dir = fs.readdirSync(fullFolderPath);
  dir.forEach(file => {
    const lePath = path.resolve(fullFolderPath, file);
    const stats = fs.lstatSync(lePath);
    if (stats.isDirectory()) {
      resolve({ folderPath: lePath, res, userID });
    } else if (file.endsWith('ctb')) {
      const { size, birthtimeMs, mtimeMs, ctimeMs, atimeMs } = fs.statSync(
        lePath,
      );
	  if(!fileNames[file]) fileNames[file]=0;
	  else fileNames[file]++;
      res.push({
        name: file,
        size,
        fileCreation: birthtimeMs,
        fileContentModification: mtimeMs,
        fileAttributesModification: ctimeMs,
        fileAccess: atimeMs,
        slug: slugify(file.replace('.ctb', '')).substr(0, 30),
        id: shortHash.unique(
          crypto
            .createHash('md5')
            .update(userID+file+fileNames[file])
            .digest('hex'),
        ),
        legacyID: crypto
          .createHash('md5')
          .update(file)
          .digest('hex'),
        filePath: lePath,
        fileFolder: fullFolderPath,
      });
    }
  });
};
const scanFolder: ({
  folders,
  userID,
}: {
  folders: string[];
  userID: string;
}) => Map<number, Ct_File> = ({ folders, userID }) => {
  const res = [];

  folders.forEach(folderPath => resolve({ folderPath, userID, res }));
  const files: Map<number, Ct_File> = new Map(
    res.sort().map(node => [node.id, node]),
  );
  return files;
};

export { scanFolder, adaptFileID };
