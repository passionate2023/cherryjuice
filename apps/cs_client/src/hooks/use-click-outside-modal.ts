import { useEffect, useRef } from 'react';
import { dataAttributes } from '::hooks/modals/close-modal/use-modal-keyboard-events';

const createEventHandler = ({
  additionalSelectors,
  callback,
  id,
}: Props & { id: string }) => (event: MouseEvent) => {
  let element: HTMLElement = document.querySelector(
    `[${dataAttributes.clickOutside}="${id}"]`,
  );

  while (!element && additionalSelectors.length > 0) {
    const _selector = additionalSelectors.pop();
    element = document.querySelector(_selector);
  }

  if (!element) return;
  const isClickInside = element.contains(event['target'] as Node);

  if (!isClickInside) {
    callback();
  }
};
type Props = {
  additionalSelectors?: string[];
  callback: () => void;
};
const useClickOutsideModal = ({
  additionalSelectors = [],
  callback,
}: Props) => {
  const ref = useRef<string>();
  if (!ref.current) ref.current = Date.now() + '';
  useEffect(() => {
    const handler = createEventHandler({
      additionalSelectors,
      callback,
      id: ref.current,
    });
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [additionalSelectors, callback]);
  return {
    clkOProps: { [dataAttributes.clickOutside]: ref.current },
    id: ref.current,
  };
};

export { useClickOutsideModal };
