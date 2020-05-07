import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useIsNotProcessed } from '::hooks/misc/isnot-processed';

type Props = {
  file_id: string;
  processLinks: (number | string)[];
};

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

const useReactRouterForAnchors = ({ file_id, processLinks }: Props) => {
  const history = useHistory();
  const isNotProcessed = useIsNotProcessed(processLinks);
  useEffect(() => {
    if (!isNotProcessed) {
      const editor = document.querySelector('#rich-text');
      const anchors = Array.from(editor.querySelectorAll('a,img[data-href]'));
      anchors.forEach(anchor => {
        // @ts-ignore
        anchor.onclick = e => {
          const url = getURL({ file_id, target: e.target });
          if (url) {
            const isLocalLink = url.host === location.host;
            const isWebLink = !isLocalLink && url.protocol.startsWith('http');
            if (isLocalLink) {
              history.push(url.pathname + url.hash);
              e.preventDefault();
            } else if (isWebLink) {
              window.open(url.href, '_blank');
            }
          }
        };
      });
    }
  }, [processLinks]);
};

export { useReactRouterForAnchors };
