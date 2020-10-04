import { useEffect, useState } from 'react';

type TProps = {
  showAfter?: number;
};
const useSpinner = ({ showAfter }: TProps = { showAfter: 250 }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handle = setTimeout(() => {
      setShow(true);
    }, showAfter);
    return () => {
      clearTimeout(handle);
    };
  }, []);
  return show;
};
export { useSpinner };
