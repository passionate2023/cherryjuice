import { useEffect, useRef } from 'react';
import { dataAttributes } from '::hooks/modals/close-modal/use-modal-keyboard-events';

export enum ASSERTION {
  referenceContainsEventTarget,
  eventTargetClosestTo,
}

const ElementAssertions = {
  [ASSERTION.referenceContainsEventTarget]: (
    eventTarget: HTMLElement,
    selector: string,
  ): boolean => {
    const element = document.querySelector(selector);
    return element && element.contains(eventTarget);
  },
  [ASSERTION.eventTargetClosestTo]: (
    eventTarget: HTMLElement,
    selector: string,
  ) => Boolean(eventTarget.closest(selector)),
};

export type Assertion = {
  selector: string;
};

type Props = {
  callback: () => void;
  assertions: Assertion[];
};
const createEventHandler = ({ assertions, callback }: Props) => (
  event: MouseEvent,
) => {
  const state = {
    isClickInside: false,
  };
  for (let i = 0; i < assertions.length; i++) {
    const { selector } = assertions[i];
    state.isClickInside =
      ElementAssertions[ASSERTION.referenceContainsEventTarget](
        event['target'] as HTMLElement,
        selector,
      ) ||
      ElementAssertions[ASSERTION.eventTargetClosestTo](
        event['target'] as HTMLElement,
        selector,
      );
    if (state.isClickInside) break;
  }

  if (!state.isClickInside) {
    callback();
  }
};
const useClickOutsideModal = ({ assertions = [], callback }: Props) => {
  const ref = useRef<string>();
  if (!ref.current) ref.current = Date.now() + '';
  useEffect(() => {
    const handler = createEventHandler({
      assertions: [
        {
          selector: `[${dataAttributes.clickOutside}="${ref.current}"]`,
        },
        ...assertions,
      ],
      callback,
    });
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [assertions, callback]);
  return {
    clkOProps: { [dataAttributes.clickOutside]: ref.current },
    id: ref.current,
  };
};

export { useClickOutsideModal };
