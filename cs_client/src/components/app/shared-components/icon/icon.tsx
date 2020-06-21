import * as React from 'react';
import { EventHandler } from 'react';
import { Icons } from './helpers/icons';
import { getIconGroup } from './helpers/get-icon-group';
import { SvgIcon } from './components/svg-icon';
import { ImgIcon } from './components/img-icon';
type Attributes = { className?: string };
type SVGAttributes = Attributes & { fill?: string };
type IconProps = {
  name: string;
  size?: number;
  onClick?: EventHandler<any>;
  testId?: string;
  className?: string;
  loadAsInlineSVG?: 'force';
};
const Icon = (iconProps: IconProps) => {
  const group = getIconGroup(iconProps.name);
  return iconProps.loadAsInlineSVG === 'force' ? (
    <SvgIcon {...iconProps} group={group} />
  ) : (
    <ImgIcon {...iconProps} group={group} />
  );
};

export { Icon, Icons };
export { SVGAttributes, IconProps };
