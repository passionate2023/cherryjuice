import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';
import { useCallback } from 'react';

const DrawerNavigationElement: React.FC<any> = ({
  title,
  selectedScreenTitle,
  icon,
  setSelectedScreenTitle,
}) => {
  const isSelected = selectedScreenTitle === title;
  const onClick = useCallback(() => setSelectedScreenTitle(title), []);
  return (
    <span
      className={`${modDrawer.drawer__navigation__list__item} ${
        isSelected ? modDrawer.drawer__navigation__list__itemActive : ''
      }`}
      onClick={onClick}
    >
      {icon && (
        <i className="material-icons mdc-list-item__graphic" aria-hidden="true">
          inbox
        </i>
      )}
      <span className="mdc-list-item__text">{title}</span>
    </span>
  );
};

export { DrawerNavigationElement };
