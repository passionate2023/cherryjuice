import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';
import { handleToggle } from '::shared-components/material/drawer/drawer-navigation/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { CircleButton } from '::shared-components/buttons/circle-button';

const DrawerToggle: React.FC<{}> = () => (
  // <button
  //   className={`mdc-button ${modDrawer.drawer__drawerToggle}`}
  //   id={'drawer-toggle'}
  //   onClick={handleToggle()}
  // >
  //   <div
  //     className={`mdc-button__ripple ${modDrawer.drawer__drawerToggle__circle}`}
  //   />
  //   <span className="mdc-button__label">
  //     <FontAwesomeIcon icon={faBars} color={'black'} />
  //   </span>
  // </button>
  <CircleButton
    className={`${modDrawer.drawer__drawerToggle}`}
    onClick={handleToggle()}
  >
    <FontAwesomeIcon icon={faBars} color={'black'} />
  </CircleButton>
);

export { DrawerToggle };
