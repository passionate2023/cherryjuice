import * as React from 'react';
import { modToolbar } from '::sass-modules';

type Props = {};

const Separator: React.FC<Props> = () => {
  return <span className={modToolbar.toolBar__separator} />;
};

export { Separator };
