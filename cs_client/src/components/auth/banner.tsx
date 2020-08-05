import * as React from 'react';
import { modAuthBanner } from '::sass-modules/index';
import { ApolloError } from 'apollo-client';
import { properErrorMessage } from '::auth/hooks/proper-error-message';
import { useEffect, useState } from 'react';

type BannerProps = {
  error: ApolloError | undefined;
  className?: string;
};

const Banner: React.FC<BannerProps> = ({ error, className = '' }) => {
  const [showMessage, setShowMessage] = useState(true);
  const message = properErrorMessage(error);
  useEffect(() => {
    const handle = setTimeout(() => {
      setShowMessage(false);
    }, 5000);
    setShowMessage(true);
    return () => {
      clearTimeout(handle);
    };
  }, [error]);
  return (
    <div className={modAuthBanner.banner__container}>
      <div
        className={`${className} ${modAuthBanner.banner} ${
          message && showMessage ? modAuthBanner.bannerVisible : ''
        }`}
      >
        <span className={modAuthBanner.banner__text}>{message}</span>
      </div>
    </div>
  );
};

export { Banner };
export { BannerProps };
