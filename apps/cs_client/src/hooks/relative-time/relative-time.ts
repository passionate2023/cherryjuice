import { useState, useRef, useEffect } from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import { calculateInterval } from '::hooks/relative-time/helpers/calculate-interval';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

type RelativeTimeProps = {
  time: number;
  delay?: number;
};

const useRelativeTime = ({ time, delay = 300 }: RelativeTimeProps) => {
  const [relativeTime, setRelativeTime] = useState();
  const aliveRef = useRef(undefined);

  useEffect(() => {
    const update = () => {
      const difference = Date.now() - new Date(time).getTime();
      const newRelativeTime = timeAgo.format(time, 'round');
      setRelativeTime(newRelativeTime);
      const interval = time ? calculateInterval(difference) : 1000;
      if (interval) aliveRef.current = setTimeout(update, interval);
    };
    aliveRef.current = setTimeout(update, delay);
    return () => {
      clearTimeout(aliveRef.current);
    };
  }, [time]);
  return relativeTime || '';
};

export { useRelativeTime };
