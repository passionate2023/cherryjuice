import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { modAuthBanner } from '::sass-modules';
import { AlertType, TAlert } from '::types/react';

type Timer = ReturnType<typeof window.setTimeout>;
type BannerProps = {
  error?: TAlert;
  className?: string;
};

const Banner: React.FC<BannerProps> = ({ error, className = '' }) => {
  const [message, setMessage] = useState('');
  const timeoutHandler = useRef<Timer>();
  useEffect(() => {
    if (error) {
      clearTimeout(timeoutHandler.current);
      setMessage(error.title);
      if (error.type === AlertType.Error) {
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
