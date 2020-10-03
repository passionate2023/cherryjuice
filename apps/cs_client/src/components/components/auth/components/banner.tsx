import * as React from 'react';
import { modAuthBanner } from '::sass-modules';
import {
  AsyncError,
  properErrorMessage,
} from '::root/components/auth/hooks/proper-error-message';
import { useEffect, useRef, useState } from 'react';
type Timer = ReturnType<typeof window.setTimeout>;
type BannerProps = {
  error?: AsyncError;
  className?: string;
};

const Banner: React.FC<BannerProps> = ({ error, className = '' }) => {
  const [message, setMessage] = useState('');
  const timeoutHandler = useRef<Timer>();
  useEffect(() => {
    if (error) {
      clearTimeout(timeoutHandler.current);
      const message = properErrorMessage(error);
      setMessage(message);
      if (!('persistent' in error)) {
        timeoutHandler.current = setTimeout(() => {
          setMessage('');
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
