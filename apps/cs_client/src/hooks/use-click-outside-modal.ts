import { useEffect } from 'react';

const createEventHandler = ({ selector, callback }: Props) => (
  event: MouseEvent,
) => {
  if (!selector) return;
  let element;
  if (typeof selector === 'string') {
    element = document.querySelector(selector);
  } else {
    while (!element && selector.length > 0) {
      const _selector = selector.pop();
      element = document.querySelector(_selector);
    }
  }
  if (!element) return;
  const isClickInside = element.contains(event['target'] as Node);

  if (!isClickInside) {
    callback();
  }
};
type Props = {
  selector: string | string[];
  callback: () => void;
};
const useClickOutsideModal = ({ selector, callback }: Props) => {
  useEffect(() => {
    const handler = createEventHandler({
      selector,
      callback,
    });
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [selector, callback]);
};

export { useClickOutsideModal };
