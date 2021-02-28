import { useEffect, useRef, useState } from 'react';

type Props = {
  timeout?: number;
  loading?: boolean;
};
export const useLoader = (
  { timeout, loading = true }: Props = { timeout: 250 },
) => {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (loading) {
      timeoutRef.current = setTimeout(() => {
        setShow(true);
      }, timeout);
      return () => {
        clearTimeout(timeoutRef.current);
      };
    } else {
      setShow(false);
    }
  }, [timeout, loading]);
  return show;
};
