import * as React from 'react';
import { modAuthBanner } from '::sass-modules/index';
import { ApolloError } from 'apollo-client';
import { useProperErrorMessage } from '::auth/hooks/proper-error-message';

type Props = {
  error: ApolloError | undefined;
  className?: string;
};

const Banner: React.FC<Props> = ({ error, className = '' }) => {
  const message = useProperErrorMessage(error);
  return (
    <div
      className={`${className} ${modAuthBanner.banner} ${
        message ? modAuthBanner.bannerVisible : ''
      }`}
    >
      <span className={modAuthBanner.banner__text}>{message}</span>
    </div>
  );
};

export { Banner };
