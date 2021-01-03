import * as React from 'react';
import {
  SVGProps,
  useRenderSVG,
} from '::root/components/icon/hooks/render-svg';
import { Icons } from '::root/components/icon/data/icons';

export type IconName =
  | keyof typeof Icons.material
  | keyof typeof Icons.cherrytree.additionalIcons
  | keyof typeof Icons.cherrytree.cherries
  | keyof typeof Icons.cherrytree.custom_icons
  | keyof typeof Icons.misc;

type Props = SVGProps & {
  name: IconName;
};

export const Icon: React.FC<Props> = props => {
  const [element, fetched] = useRenderSVG(props);
  const placeholder = <div style={{ width: props.size, height: props.size }} />;
  return <>{fetched ? element : placeholder}</>;
};
