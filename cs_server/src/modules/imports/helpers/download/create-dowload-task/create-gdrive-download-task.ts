import { google } from 'googleapis';
import { Readable } from 'stream';
import { FileUpload } from '../../../../document/helpers/graphql';
import {
  FileLocation,
  resolveFileLocation,
} from '../../../../shared/fs/resolve-file-location';

type FileMeta = {
  fileName: string;
  userId: string;
  timeStamp: string;
  extension: string;
  location: FileLocation;
};

type DownloadTask = {
  fileMeta?: FileMeta;
  chunksContainer?: { current: any[] };
  readStream: Readable;
};
type DownloadTaskProps = {
  fileUpload?: FileUpload;
  gDriveFileId?: string;
  userId: string;
};
type DownloadTaskCreator = (props: DownloadTaskProps) => Promise<DownloadTask>;

const createGDriveDownloadTask = (
  access_token: string,
): DownloadTaskCreator => async ({
  gDriveFileId,
  userId,
}): Promise<DownloadTask> => {
  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({
    access_token,
  });
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const fileName = await drive.files
    .get({ fileId: gDriveFileId })
    .then(res => res.data.name);

  const meta = {
    fileName: fileName.replace(/.ctb$/, ''),
    timeStamp: new Date().getTime().toString(),
    userId,
    extension: 'ctb',
  };
  return {
    fileMeta: {
      ...meta,
      location: resolveFileLocation({ ...meta, type: 'import' }),
    },
    readStream: (
      await drive.files.get(
        { fileId: gDriveFileId, alt: 'media' },
        { responseType: 'stream' },
      )
    ).data as Readable,
  };
};

export { createGDriveDownloadTask };
export { DownloadTask, DownloadTaskCreator, DownloadTaskProps, FileMeta };
