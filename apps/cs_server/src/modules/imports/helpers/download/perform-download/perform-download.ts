import { createWriteStream } from 'fs';
import crypto from 'crypto';
import { createTemporaryWritableStream } from './helpers/create-temp-writable-stream';
import { DownloadTask } from '../create-dowload-task/create-gdrive-download-task';

type DownloadResult = { hash: string };

const performDownload = async (
  { readStream, fileMeta, chunksContainer }: DownloadTask,
  healthCheckCallback: () => Promise<void>,
  timeout = 3000,
): Promise<DownloadResult> => {
  const writeStream = chunksContainer
    ? createTemporaryWritableStream(chunksContainer)
    : createWriteStream(fileMeta.location.path);
  const hash = crypto.createHash('sha1');
  hash.setEncoding('hex');
  const state = {
    numberOfChunks: 0,
    lastNumberOfChunks: 0,
    retries: 0,
  };
  return new Promise<DownloadResult>((resolve, reject) => {
    const intervalHandle = setInterval(async () => {
      const isDocumentDeleted = await healthCheckCallback()
        .then(() => false)
        .catch(() => true);
      const uploadIsStale = state.numberOfChunks <= state.lastNumberOfChunks;
      state.retries = uploadIsStale ? state.retries + 1 : 0;

      if (isDocumentDeleted || state.retries === 5) {
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
      // @ts-ignore
      hash.set(chunk);
      state.numberOfChunks++;
    });
  });
};

export { performDownload };
