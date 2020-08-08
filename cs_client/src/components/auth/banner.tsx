import * as React from 'react';
import { modAuthBanner } from '::sass-modules/index';
import {
  AsyncError,
  properErrorMessage,
} from '::auth/hooks/proper-error-message';
import { useEffect, useRef, useState } from 'react';
type Timer = ReturnType<typeof window.setTimeout>;
type BannerProps = {
  error?: AsyncError;
  className?: string;
};

const Banner: React.FC<BannerProps> = ({ error, className = '' }) => {
  const [showMessage, setShowMessage] = useState(true);
  const message = properErrorMessage(error);
  const timeoutHandler = useRef<Timer>();
  useEffect(() => {
    if (error) {
      clearTimeout(timeoutHandler.current);
      setShowMessage(true);
      if (!('persistent' in error)) {
        timeoutHandler.current = setTimeout(() => {
          setShowMessage(false);
        }, 7000);
        return () => {
          clearTimeout(timeoutHandler.current);
        };
      }
    }
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
