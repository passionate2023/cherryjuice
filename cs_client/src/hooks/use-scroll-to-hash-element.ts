import { useEffect } from 'react';
import { scrollIntoToolbar } from '::helpers/ui';

const useScrollToHashElement = ({ html }: { html: string }) => {
  useEffect(() => {
    if (location.hash) {
      const redirectedFromServer = location.pathname === '/';
      if (!redirectedFromServer) {
        document
          .getElementById(`#${decodeURIComponent(location.hash.substr(1))}`)
          ?.scrollIntoView();
        scrollIntoToolbar();
      }
    }
  }, [location.hash, html]);
};

export { useScrollToHashElement };
