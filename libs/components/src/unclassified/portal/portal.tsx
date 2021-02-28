import { createPortal } from 'react-dom';
import React, { useEffect, useState } from 'react';

type PortalProps = { targetSelector: string; predicate?: boolean };

export const Portal: React.FC<PortalProps> = ({
  targetSelector,
  children,
  predicate = true,
}) => {
  const [targetMounted, serTargetMounted] = useState(false);
  useEffect(() => {
    const handle = setInterval(() => {
      if (document.querySelector(targetSelector)) {
        clearInterval(handle);
        serTargetMounted(true);
      }
      return () => clearInterval(handle);
    }, 100);
  }, []);
  return predicate ? (
    targetMounted ? (
      createPortal(children, document.querySelector(targetSelector))
    ) : (
      <></>
    )
  ) : (
    <>{children}</>
  );
};
