import { Writable } from 'stream';
import * as stream from 'stream';

const createTemporaryWritableStream = (chunksContainer: {
  current: any[];
}): Writable =>
  new stream.Writable({
    write: (chunk, encoding, next) => {
      chunksContainer.current.push(chunk);
      next();
    },
  });

export { createTemporaryWritableStream };
