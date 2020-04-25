import * as React from 'react';
import { modAuthBanner } from '::sass-modules/index';

type Props = {
  message: string;
};

const Banner: React.FC<Props> = ({ message }) => {
  return (
    <div
      className={`${modAuthBanner.banner} ${
        message ? modAuthBanner.bannerVisible : ''
      }`}
    >
      <span className={modAuthBanner.banner__text}>{message}</span>
    </div>
  );
};

export { Banner };
