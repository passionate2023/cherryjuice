import fs from 'fs';
import path from 'path';
import { paths } from './paths';
import { FileMeta } from '../../imports/helpers/download/create-dowload-task/create-gdrive-download-task';

type FileLocation = { folder: string; path: string; relativePath: string };

const resolveFileLocation = ({
  userId,
  fileName,
  timeStamp,
  extension,
  type,
}: Omit<FileMeta, 'location'> & {
  type: 'import' | 'export';
}): FileLocation => {
  const fileFolder = path.resolve(
    type === 'import' ? paths.importsFolder : paths.exportsFolder,
    userId,
    timeStamp,
  );
  const filePath = path.resolve(fileFolder, `${fileName}.${extension}`);
  const relativePath = `${userId}/${timeStamp}${fileName}.${extension}`;
  if (!fs.existsSync(fileFolder)) {
    fs.mkdirSync(fileFolder, { recursive: true });
  }
  return { folder: fileFolder, path: filePath, relativePath };
};

export { resolveFileLocation };
export { FileLocation };
