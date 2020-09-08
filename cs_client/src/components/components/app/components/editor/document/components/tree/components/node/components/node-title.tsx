import * as React from 'react';
import { MutableRefObject } from 'react';
import nodeMod from '::sass-modules/tree/node.scss';
import { useSelector } from 'react-redux';
import { Store } from '::store/store';
import { HNodeName } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-title/components/h-node-name';

type Props = {
  titleRef: MutableRefObject<HTMLDivElement>;
  nodeStyle: Record<string, string>;
  nodeDndProps: any;
  name: string;
};

const NodeTitle: React.FC<Props> = ({
  name,
  nodeStyle,
  titleRef,
  nodeDndProps,
}) => {
  const nodesFilter = useSelector<Store, string>(
    state => state.document.nodesFilter,
  );
  return (
    <div
      className={nodeMod.node__title}
      style={{ ...nodeStyle }}
      ref={titleRef}
      {...nodeDndProps}
    >
      {nodesFilter && name.includes(nodesFilter) ? (
        <HNodeName name={name} query={nodesFilter} />
      ) : (
        name
      )}
    </div>
  );
};

export { NodeTitle };
