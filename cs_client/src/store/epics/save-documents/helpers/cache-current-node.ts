import { updateCachedHtmlAndImages } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/apollo-cache';

const cacheCurrentNode = () =>
  new Promise(res => {
    updateCachedHtmlAndImages();
    res();
  });

export { cacheCurrentNode };
