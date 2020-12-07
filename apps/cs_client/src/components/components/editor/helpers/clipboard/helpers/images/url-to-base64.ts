import { blobToBase64 } from '::root/components/editor/helpers/clipboard/helpers/images/blob-to-base64';

export const urlToBase64 = (url: string): Promise<string> =>
  fetch(url)
    .then(res => res.blob())
    .then(blobToBase64);
