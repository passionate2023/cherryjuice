import { google } from 'googleapis';
import fs, { createWriteStream } from 'fs';
import { FileUpload } from '../../document/helpers/graphql';

type TDownloadTask = Promise<{ fileName: any; start: () => Promise<boolean> }>;
type TDownloadTaskProps = FileUpload | string;
type TDownloadTaskCreator = (meta: TDownloadTaskProps) => TDownloadTask;

const createGDriveDownloadTask = (
  access_token: string,
): TDownloadTaskCreator => async (fileId: string): TDownloadTask => {
  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({
    access_token,
  });
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const fileName = await drive.files.get({ fileId }).then(res => res.data.name);

  return {
    fileName,
    start: async () =>
      await drive.files
        .get({ fileId, alt: 'media' }, { responseType: 'stream' })
        .then(res => {
          return new Promise((resolve, reject) => {
            const filePath = '/uploads/' + fileName;
            // console.log(`writing to ${filePath}`);
            const dest = fs.createWriteStream(filePath);
            let progress = 0;

            res.data
              // @ts-ignore
              .on('end', () => {
                // console.log('Done downloading file.');
                resolve(true);
              })
              .on('error', err => {
                // console.error('Error downloading file.');
                reject(err);
              })
              .on('data', d => {
                progress += d.length;
                if (process.stdout.isTTY) {
                  // @ts-ignore
                  process.stdout.clearLine();
                  process.stdout.cursorTo(0);
                  process.stdout.write(`Downloaded ${progress} bytes`);
                }
              })
              .pipe(dest);
          });
        }),
  };
};

const createGqlDownloadTask: TDownloadTaskCreator = async (
  file: FileUpload,
): TDownloadTask => {
  const { createReadStream, filename } = await file;
  const filePath = `${process.env.UPLOADS_PATH}${filename}`;
  return {
    fileName: filename,
    start: async (): Promise<boolean> =>
      await new Promise((resolve, reject) =>
        createReadStream()
          .pipe(createWriteStream(filePath))
          .on('finish', () => resolve(true))
          .on('error', () => reject(false)),
      ),
  };
};

export { createGDriveDownloadTask, createGqlDownloadTask };
export { TDownloadTask, TDownloadTaskCreator, TDownloadTaskProps };
