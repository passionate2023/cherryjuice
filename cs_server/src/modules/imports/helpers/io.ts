import { google } from 'googleapis';
import * as fs from 'fs';
import { createWriteStream } from 'fs';
import { FileUpload } from '../../document/helpers/graphql';
import crypto from 'crypto';
import * as stream from 'stream';
import { Readable, Writable } from 'stream';
import { Logger } from '@nestjs/common';

const logger = new Logger('io');
type TDownloadResult = { hash: string };
type TDownloadTask = {
  fileName?: string;
  chunksContainer?: { current: any[] };
  readStream: Readable;
};
type TDownloadTaskProps = FileUpload | string;
type TDownloadTaskCreator = (
  meta: TDownloadTaskProps,
) => Promise<TDownloadTask>;

const createGDriveDownloadTask = (
  access_token: string,
): TDownloadTaskCreator => async (fileId: string): Promise<TDownloadTask> => {
  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({
    access_token,
  });
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const fileName = await drive.files.get({ fileId }).then(res => res.data.name);

  return {
    fileName,
    readStream: (
      await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' },
      )
    ).data as Readable,
  };
};
const UPLOADS_FOLDER = '/uploads/';
const resolveUploadsFolder = (fileName: string): string =>
  UPLOADS_FOLDER + fileName;
const deleteFile = (fileName: string): void => {
  try {
    fs.unlinkSync(resolveUploadsFolder(fileName));
  } catch (e) {
    logger.error(e);
  }
};

const cleanUploadsFolder = (): void => {
  const files = fs.readdirSync(UPLOADS_FOLDER);
  for (const fileName of files) {
    deleteFile(fileName);
  }
};

const createTemporaryWritableStream = (chunksContainer: {
  current: any[];
}): Writable =>
  new stream.Writable({
    write: (chunk, encoding, next) => {
      chunksContainer.current.push(chunk);
      next();
    },
  });

const download = async (
  { readStream, fileName, chunksContainer }: TDownloadTask,
  healthCheckCallback: () => Promise<void>,
  timeout = 3000,
): Promise<TDownloadResult> => {
  const writeStream = chunksContainer
    ? createTemporaryWritableStream(chunksContainer)
    : createWriteStream(resolveUploadsFolder(fileName));
  const hash = crypto.createHash('sha1');
  hash.setEncoding('hex');
  const state = {
    numberOfChunks: 0,
    lastNumberOfChunks: 0,
  };
  return new Promise<TDownloadResult>((resolve, reject) => {
    const intervalHandle = setInterval(async () => {
      const isDocumentDeleted = await healthCheckCallback()
        .then(() => false)
        .catch(() => true);
      if (
        isDocumentDeleted ||
        state.numberOfChunks <= state.lastNumberOfChunks
      ) {
        clearInterval(intervalHandle);
        writeStream.end();
        readStream.destroy();
        reject(new Error('upload timed-out'));
      } else {
        state.lastNumberOfChunks = state.numberOfChunks;
      }
    }, timeout);
    readStream
      .pipe(writeStream)
      .on('finish', () => {
        clearInterval(intervalHandle);
        writeStream.end();
        resolve({ hash: hash.digest('hex') });
      })
      .on('error', e => {
        clearInterval(intervalHandle);
        writeStream.end();
        reject(e);
      });

    readStream.on('data', chunk => {
      hash.update(chunk);
      state.numberOfChunks++;
    });
  });
};
const createGqlDownloadTask: TDownloadTaskCreator = async (
  file: FileUpload,
): Promise<TDownloadTask> => {
  const { createReadStream, filename } = await file;

  return {
    fileName: filename,
    readStream: createReadStream(),
  };
};

export {
  createGDriveDownloadTask,
  createGqlDownloadTask,
  download,
  cleanUploadsFolder,
};
export { TDownloadTask, TDownloadTaskCreator, TDownloadTaskProps };
