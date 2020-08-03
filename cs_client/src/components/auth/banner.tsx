import * as React from 'react';
import { modAuthBanner } from '::sass-modules/index';
import { ApolloError } from 'apollo-client';
import { properErrorMessage } from '::auth/hooks/proper-error-message';

type BannerProps = {
  error: ApolloError | undefined;
  className?: string;
};

const Banner: React.FC<BannerProps> = ({ error, className = '' }) => {
  const message = properErrorMessage(error);
  return (
    <div className={modAuthBanner.banner__container}>
      <div
        className={`${className} ${modAuthBanner.banner} ${
          message ? modAuthBanner.bannerVisible : ''
        }`}
      >
        <span className={modAuthBanner.banner__text}>{message}</span>
      </div>
    </div>
  );
};

export { Banner };
export { BannerProps };
