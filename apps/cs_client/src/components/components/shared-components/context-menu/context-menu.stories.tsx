import React, { useState } from 'react';
import { ButtonSquare } from '@cherryjuice/components';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';
import { modApp, modTreeToolBar } from '::sass-modules';

const config = {
  title: 'shared/context-menu',
};
export const Square = () => {
  const [CMShown, setCMShown] = useState(false);
  const hide = () => setCMShown(false);
  const show = () => setCMShown(true);
  const expandNode = () => undefined;
  const expandAllChildren = () => undefined;
  const expandAllNodes = () => undefined;
  const subItems = [
    {
      name: 'sort asc',
      onClick: expandNode,
      hideOnClick: true,
    },
    {
      name: 'sort asc',
      onClick: expandAllChildren,
      hideOnClick: true,
    },
  ];
  const items = [
    {
      name: 'focus selected node',
      onClick: expandNode,
      hideOnClick: true,
    },
    {
      name: 'expand all children',
      onClick: expandAllChildren,
      hideOnClick: true,
      items: subItems,
    },
    {
      name: 'expand all nodes',
      onClick: expandAllNodes,
      hideOnClick: true,
    },
  ];
  return (
    <div
      style={{
        backgroundColor: 'black',
        width: '100%',
        height: '30vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className={modApp.app}
    >
      <div style={{ height: 30, width: 30 }}>
        <ContextMenuWrapper
          shown={CMShown}
          hide={hide}
          show={show}
          items={items}
        >
          <ButtonSquare
            text={'...'}
            className={modTreeToolBar.tree_focusButton}
          />
        </ContextMenuWrapper>
      </div>
    </div>
  );
};

export default config;
