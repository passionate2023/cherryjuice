import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';
import {
  CollapsableListItem,
  CollapsableListItemProps,
} from '::root/components/app/components/menus/widgets/components/collapsable-list/components/body/components/collapsable-list-item';
import { useEffect, useRef } from 'react';
import { smoothScrollIntoView } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/components/tab';

export type ListBodyProps = {
  items: CollapsableListItemProps[];
  autoScroll?: boolean;
};

const ListBody: React.FC<ListBodyProps> = ({ items, autoScroll = true }) => {
  const listBody = useRef<HTMLDivElement>();
  useEffect(() => {
    if (autoScroll && items.length) {
      const active = items.findIndex(item => item.active);
      if (active >= 0) smoothScrollIntoView(listBody.current.children[active]);
      else listBody.current.scroll(0, listBody.current.scrollHeight);
    }
  }, [items]);
  return (
    <div className={modDocumentOperations.collapsableList__body} ref={listBody}>
      {items.map(item => (
        <CollapsableListItem {...item} key={item.key} />
      ))}
    </div>
  );
};

export { ListBody };
