import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';
import {
  CollapsableListItem,
  CollapsableListItemProps,
} from '::root/components/app/components/menus/widgets/components/collapsable-list/components/body/components/collapsable-list-item';
import { useEffect, useRef } from 'react';

export type ListBodyProps = {
  items: CollapsableListItemProps[];
  autoScroll?: boolean;
};

const ListBody: React.FC<ListBodyProps> = ({ items ,autoScroll=true}) => {
  const listBody = useRef<HTMLDivElement>();
  useEffect(() => {
    if (autoScroll && items.length) {
      listBody.current.scroll(0, listBody.current.scrollHeight);
    }
  }, [items]);
  return (
    <div
      className={modDocumentOperations.documentOperations__documentsContainer}
      ref={listBody}
    >
      {items.map(item => (
        <CollapsableListItem
          {...item}
          key={item.name + '/' + item.description}
        />
      ))}
    </div>
  );
};

export { ListBody };
