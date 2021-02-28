import * as React from 'react';
import { CMItem, Popper } from '::root/popups';
import { PopperProps } from '::root/popups/popper/popper';
import { ContextMenuItem } from '::root/popups/context-menu/components/context-menu-item';

type Props = {
  items?: CMItem[];
} & Pick<
  PopperProps,
  'getContext' | 'positionPreferences' | 'level' | 'children'
>;

const style = { paddingBottom: 5, paddingTop: 5 };
export const ContextMenu: React.FC<Props> = ({
  items,
  getContext,
  children,
  level,
  positionPreferences,
}) => {
  return (
    <Popper
      getContext={getContext}
      style={style}
      body={({ hide, context, id, level }) => (
        <>
          {items.map(item => (
            <ContextMenuItem
              {...item}
              key={item.name}
              hide={hide}
              id={id}
              context={context}
              level={level}
            />
          ))}
        </>
      )}
      level={level}
      positionPreferences={positionPreferences}
    >
      {children}
    </Popper>
  );
};
