import { useEffect, useRef } from 'react';
import { router } from '::root/router/router';
import { routingLogic } from '::app/hooks/handle-routing/helpers/routing-logic';

const useHandleRouting = (documentId: string) => {
  const initialCall = useRef(true);
  useEffect(() => {
    routingLogic({
      documentId,
      pathname: router.location.pathname,
      isFirstCall: initialCall.current,
    });
    initialCall.current = false;
  }, [documentId, router.location.pathname]);
};

export { useHandleRouting };
