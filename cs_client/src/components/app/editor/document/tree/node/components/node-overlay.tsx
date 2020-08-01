import * as React from 'react';
import nodeMod from '::sass-modules/tree/node.scss';
import { useEffect, useRef } from 'react';

type Props = { nodePath: string; clickTimestamp: number };

const NodeOverlay: React.FC<Props> = ({ nodePath, clickTimestamp }) => {
  const clicks = useRef({ 0: true });

  useEffect(() => {
    const handle = setTimeout(() => {
      clicks.current[clickTimestamp] = true;
    }, 100);
    return () => {
      clearTimeout(handle);
    };
  }, [clickTimestamp]);
  return (
    <div
      className={
        !clicks.current[clickTimestamp] || location.pathname === nodePath
          ? nodeMod.node__titleOverlay
          : 0
      }
    />
  );
};

export { NodeOverlay };
