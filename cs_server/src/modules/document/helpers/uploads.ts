import { google } from 'googleapis';
import fs from 'fs';

const createGDriveDownloadTask = async ({
  access_token,
  fileId,
}: {
  fileId: string;
  access_token: string;
}): Promise<{ fileName: string; start: () => Promise<string> }> => {
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
                resolve(filePath);
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

export { createGDriveDownloadTask };
