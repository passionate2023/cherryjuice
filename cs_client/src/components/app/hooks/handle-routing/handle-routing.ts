import { useEffect, useRef } from 'react';
import { navigate } from '::root/router/navigate';
import { routingLogic } from '::app/hooks/handle-routing/helpers/routing-logic';

const useHandleRouting = (documentId: string) => {
  const initialCall = useRef(true);
  useEffect(() => {
    routingLogic({
      documentId,
      pathname: navigate.location.pathname,
      isFirstCall: initialCall.current,
    });
    initialCall.current = false;
  }, [documentId, navigate.location.pathname]);
};

export { useHandleRouting };
