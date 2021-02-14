import * as React from 'react';
import { modTabs } from '::sass-modules';
import { NodeProps, Tab } from './components/tab';
import { ButtonSquare } from '@cherryjuice/components';
import { Icon, Icons } from '@cherryjuice/icons';
import { ContextMenuWrapper } from '@cherryjuice/components';

type Props = {
  nodes: NodeProps[];
  documentId: string;
};

const HiddenTabs: React.FC<Props> = ({ nodes, documentId }) => {
  return (
    <ContextMenuWrapper
      hookProps={{
        onSelectElement: () => undefined,
        getIdOfActiveElement: () => 'hidden-tabs',
      }}
      customBody={
        <div className={modTabs.tabsHidden}>
          {nodes.map(props => (
            <Tab
              key={props.node_id}
              documentId={documentId}
              hidden={true}
              {...props}
            />
          ))}
        </div>
      }
      style={{ paddingLeft: 0, paddingRight: 0 }}
    >
      {({ ref, show }) => (
        <ButtonSquare
          icon={<Icon name={Icons.material['arrow-down']} />}
          className={modTabs.hiddenTabsButton}
          onClick={show}
          _ref={ref}
        />
      )}
    </ContextMenuWrapper>
  );
};

export { HiddenTabs };
