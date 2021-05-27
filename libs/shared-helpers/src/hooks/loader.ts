import { useEffect, useRef, useState } from 'react';

type Props = {
  waitBeforeShowing?: number;
  loading?: boolean;
  minimumLoadingDuration?: number;
};
type Timeout = ReturnType<typeof setTimeout>;
export const useLoader = (
  { waitBeforeShowing, loading = true, minimumLoadingDuration }: Props = {
    waitBeforeShowing: 250,
    minimumLoadingDuration: 0,
  },
) => {
  const [show, setShow] = useState(false);
  const showTimeoutRef = useRef<Timeout>();
  const hideTimeoutRef = useRef<Timeout>();
  useEffect(() => {
    clearTimeout(showTimeoutRef.current);
    clearTimeout(hideTimeoutRef.current);
    if (loading) {
      showTimeoutRef.current = setTimeout(() => {
        setShow(true);
      }, waitBeforeShowing);
    } else {
      hideTimeoutRef.current = setTimeout(() => {
        setShow(false);
      }, minimumLoadingDuration);
    }
    return () => {
      clearTimeout(showTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, [waitBeforeShowing, loading, minimumLoadingDuration]);
  return show;
};
