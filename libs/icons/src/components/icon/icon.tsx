import * as React from 'react';
import {
  SVGProps,
  useRenderSVG,
} from '::root/components/icon/hooks/render-svg';

type Props = SVGProps & {
  name: string;
};

export const Icon: React.FC<Props> = props => {
  const [element, fetched] = useRenderSVG(props);
  return <>{fetched ? element : undefined}</>;
};
