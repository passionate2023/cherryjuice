import * as React from 'react';
import { useFetchSVG } from '../hooks/fetch-svg';
import { useRenderSVG } from '../hooks/render-svg';
import { IconProps } from '../icon';
import { dimensions } from '../helpers/dimensions';

type Props = IconProps & { group: string };

const SvgIcon: React.FC<Props> = ({
  group,
  name,
  className,
  testId,
  onClick,
  size,
}) => {
  const { width, height } = dimensions(size || 18);
  const fetcthedSVG = useFetchSVG(`${group}/${name}`);
  const [element, fetched] = useRenderSVG(fetcthedSVG, {
    testId,
    onClick,
    className,
    name,
    width,
    height,
  });

  return fetched ? <>{element}</> : <span {...{ className, width, height }} />;
};

export { SvgIcon };
