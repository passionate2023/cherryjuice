import * as React from 'react';
import { EventHandler } from 'react';

const Icons = {
  material: {
    add: 'add',
    close: 'close',
    menu: 'menu',
    remove: 'remove',
    warning: 'warning',
    refresh: 'refresh',
    folder: 'folder',
    save: 'save',
    settings: 'settings',
  },
  cherrytree: {},
};

const getIconCategory = name =>
  Icons.material[name] ? 'material' : 'cherrytree';

const getIconPath = ({
  name,
  small,
  large,
  extraLarge,
}: {
  name: string;
  small?: boolean;
  large?: boolean;
  extraLarge?: boolean;
}) =>
  `/icons/${getIconCategory(name)}/${
    small ? '18' : large ? '36' : extraLarge ? '48' : '24'
  }/${name}.svg`;

const Icon = ({
  name,
  small,
  large,
  extraLarge,
  className,
  onClick,
}: {
  name: string;
  small?: boolean;
  large?: boolean;
  extraLarge?: boolean;
  className?: string;
  onClick?: EventHandler<any>;
}) => (
  <img
    src={getIconPath({ name, small, large, extraLarge })}
    alt={name}
    {...(className && { className })}
    {...(onClick && { onClick })}
  />
);

export { Icon, Icons };
