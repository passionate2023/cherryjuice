import {
  DownloadTask,
  DownloadTaskCreator,
} from './create-gdrive-download-task';
import { resolveFileLocation } from '../../../../shared/fs/resolve-file-location';

const createGqlDownloadTask: DownloadTaskCreator = async ({
  fileUpload,
  userId,
}): Promise<DownloadTask> => {
  const { createReadStream, filename } = await fileUpload;

  const meta = {
    userId,
    fileName: filename.replace(/.ctb$/, ''),
    timeStamp: new Date().getTime().toString(),
    extension: 'ctb',
  };

  return {
    fileMeta: {
      ...meta,
      location: resolveFileLocation({ ...meta, type: 'import' }),
    },
    readStream: createReadStream(),
  };
};

export { createGqlDownloadTask };
