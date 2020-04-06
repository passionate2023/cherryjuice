import { useEffect } from 'react';
import { useHistory } from 'react-router';

type Props = {
  html: string;
};

const useReactRouterForAnchors = ({ html }: Props) => {
  const history = useHistory();
  useEffect(() => {
    if (html) {
      const editor = document.querySelector('#rich-text');
      const anchors = Array.from(editor.querySelectorAll('a'));
      anchors.forEach(anchor => {
        anchor.onclick = e => {
          const target = e.target as HTMLAnchorElement;
          const isLocalLink = target.host === location.host;
          const isWebLink = !isLocalLink && target.protocol.startsWith('http');
          if (isLocalLink) {
            history.push(target.pathname + target.hash);
            e.preventDefault();
          } else if (isWebLink) {
            window.open(target.href, '_blank');
          }
        };
      });
    }
  }, [html]);
};

export { useReactRouterForAnchors };
