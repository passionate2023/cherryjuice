import { useEffect } from 'react';
import { scrollIntoToolbar } from '::helpers/ui';

const useScrollToHashElement = ({
  fetchNodeStarted,
}: {
  fetchNodeStarted: boolean;
}) => {
  useEffect(() => {
    if (location.hash && !fetchNodeStarted) {
      const redirectedFromServer = location.pathname === '/';
      if (!redirectedFromServer) {
        document
          .getElementById(`#${decodeURIComponent(location.hash.substr(1))}`)
          ?.scrollIntoView();
        scrollIntoToolbar();
      }
    }
  }, [location.hash, fetchNodeStarted]);
};

export { useScrollToHashElement };
