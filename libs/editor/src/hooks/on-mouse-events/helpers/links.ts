import { extractDocumentFromPathname } from '@cherryjuice/shared-helpers';
import { bridge } from '::root/bridge';

const getURL = ({ target, file_id }): URL => {
  let url: URL;
  if (target.localName === 'img') {
    if (target.dataset.type === 'web') url = new URL(target.dataset.href);
    else if (target.dataset.type === 'node')
      url = new URL(
        `${location.origin}/document/${file_id}/node/${target.dataset.href}`,
      );
  } else {
    url = new URL(target.href);
  }
  return url;
};

export const onLinkClicked = (target: HTMLElement, file_id: string) => {
  const url = getURL({ file_id, target });
  if (url) {
    const isLocalLink = url.host === location.host;
    const isWebLink = !isLocalLink && url.protocol.startsWith('http');
    if (isLocalLink) {
      const { documentId, node_id } = extractDocumentFromPathname(url.pathname);
      bridge.current.selectNode({ documentId, node_id, hash: url.hash });
    } else if (isWebLink) {
      window.open(url.href, '_blank');
    }
  }
};
