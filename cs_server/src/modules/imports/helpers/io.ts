import { google } from 'googleapis';
import { createWriteStream } from 'fs';
import { FileUpload } from '../../document/helpers/graphql';
import crypto from 'crypto';
import { Readable } from 'stream';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

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

const cleanUploadsFolder = () => {
  const files = fs.readdirSync(UPLOADS_FOLDER);
  for (const fileName of files) {
    deleteFile(fileName);
  }
};

const download = async ({
  readStream,
  fileName,
}: TDownloadTask): Promise<TDownloadResult> => {
  const writeStream = createWriteStream(uploadsFolder(fileName));
  const hash = crypto.createHash('sha1');
  hash.setEncoding('hex');
  return new Promise((resolve, reject) => {
    readStream
      .pipe(writeStream)
      .on('finish', () => {
        writeStream.end();
        resolve({ hash: hash.digest('hex') });
      })
      .on('error', () => {
        writeStream.end();
        reject({ hash: '' });
      });

    readStream.on('data', chunk => {
      hash.update(chunk);
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
