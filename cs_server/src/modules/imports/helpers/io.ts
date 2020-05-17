import { google } from 'googleapis';
import { createWriteStream } from 'fs';
import { FileUpload } from '../../document/helpers/graphql';
import crypto from 'crypto';
import { Readable } from 'stream';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { Document } from '../../document/entities/document.entity';

const logger = new Logger('io');
type TDownloadResult = { hash: string };
type TDownloadTask = {
  fileName: string;
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
const uploadsFolder = (fileName: string): string => UPLOADS_FOLDER + fileName;
const deleteFile = (fileName: string): void => {
  try {
    fs.unlinkSync(uploadsFolder(fileName));
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

const download = async (
  { readStream, fileName }: TDownloadTask,
  document: Document,
  timeout = 3000,
): Promise<TDownloadResult> => {
  const writeStream = createWriteStream(uploadsFolder(fileName));
  const hash = crypto.createHash('sha1');
  hash.setEncoding('hex');
  const state = {
    numberOfChunks: 0,
    lastNumberOfChunks: 0,
  };
  return new Promise<TDownloadResult>((resolve, reject) => {
    const intervalHandle = setInterval(async () => {
      const isDocumentDeleted = await document
        .reload()
        .then(() => false)
        .catch(() => true);
      if (
        isDocumentDeleted ||
        state.numberOfChunks <= state.lastNumberOfChunks
      ) {
        clearInterval(intervalHandle);
        writeStream.end();
        readStream.destroy();
        reject({ hash: '' });
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
      .on('error', () => {
        clearInterval(intervalHandle);
        writeStream.end();
        reject({ hash: '' });
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