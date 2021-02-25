import { useState, useRef, useEffect } from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import { calculateInterval } from '::hooks/relative-time/helpers/calculate-interval';

TimeAgo.addDefaultLocale(en);
export const timeAgo = new TimeAgo('en-US');

type RelativeTimeProps = {
  time: number;
  delay?: number;
};
export type Time = {
  relative: string;
  absolute: string;
  relativeOrAbsolute: string;
};
export const formatAbsolutTime = time => {
  if (time) {
    const date = new Date(time);
    return (
      date.toLocaleString('en-gb', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }) +
      ' - ' +
      date.toLocaleString('en-GB', { timeStyle: 'short' })
    );
  } else {
    return '';
  }
};
const useRelativeTime = ({ time, delay = 300 }: RelativeTimeProps): Time => {
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
    absoluteRef.current = formatAbsolutTime(time);
    return () => {
      clearTimeout(aliveRef.current);
    };
  }, [time]);
  const absoluteRef = useRef('');
  if (!absoluteRef.current) {
    absoluteRef.current = formatAbsolutTime(time);
  }
  return {
    relative: relativeTime,
    absolute: absoluteRef.current,
    relativeOrAbsolute: relativeTime || absoluteRef.current,
  };
};

export { useRelativeTime };
