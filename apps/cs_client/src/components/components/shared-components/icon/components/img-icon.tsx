import * as React from 'react';
import { IconProps } from '../icon';
import { dimensions } from '../helpers/dimensions';
type Props = IconProps & { group: string };

const ImgIcon: React.FC<Props> = ({
  group,
  name,
  className,
  testId,
  onClick,
  size,
}) => {
  const { width, height } = dimensions(size || 18);
  return (
    <img
      {...{
        src: '/icons/' + `${group}/${name}` + '.svg',
        onClick,
        width,
        height,
        className,
        ...(testId && { 'data-testid': testId }),
      }}
    />
  );
};

export { ImgIcon };
