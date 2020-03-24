import modIcons from '::sass-modules/tree/node.scss';
import { cherries, custom_icons } from '::helpers/cons';

import * as React from 'react';

type Props = {
  depth: number;
  icon_id: number;
};

const Icon: React.FC<Props> = ({ depth, icon_id }) => {
  let cherry = icon_id
    ? custom_icons[icon_id]
    : cherries[depth >= 11 ? 11 : depth];
  return <img src={cherry} alt="icon" className={modIcons.node__titleCherry} />;
};

export { Icon };
