import { useHistory } from 'react-router';
import { useEffect } from 'react';
import { scrollIntoToolbar } from '::helpers/ui';

const useScrollToHashElement = ({ html }: { html: string }) => {
  const history = useHistory();
  useEffect(() => {
    if (history.location.hash) {
      const redirectedFromServer = history.location.pathname === '/';
      if (!redirectedFromServer) {
        document
          .getElementById(
            `#${decodeURIComponent(history.location.hash.substr(1))}`,
          )
          ?.scrollIntoView();
        scrollIntoToolbar();
      }
    }
  }, [history.location.hash, html]);
};

export { useScrollToHashElement };
