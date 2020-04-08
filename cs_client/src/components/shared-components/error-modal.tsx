import modErrorModal from '::sass-modules/shared-components/error-modal.scss';
import * as React from 'react';
import { useCallback } from 'react';
import { useTransition, animated } from 'react-spring';
import { appActionCreators } from '::app/reducer';
import { Scrim } from '::shared-components/scrim';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import { Icon, Icons } from '::shared-components/icon';
type Props = {
  error: Error;
  dismissError: Function;
};
const ErrorModal = ({ error, dismissError }) => {
  useModalKeyboardEvents({
    onCloseModal: dismissError,
    modalSelector: `.${modErrorModal.errorModal}`,
  });
  return (
    <>
      <div className={modErrorModal.errorModal}>
        <Icon
          name={Icons.material.warning}
          className={`${modErrorModal.errorModal__icon}`}
          extraLarge={true}
        />
        <span className={modErrorModal.errorModal__body}>
          <span className={`${modErrorModal.errorModal__header}`}>
            Something went wrong
          </span>
          <span className={`${modErrorModal.errorModal__message}`}>
            {error?.message || ''}
          </span>
        </span>
        <ButtonSquare
          className={`${modErrorModal.errorModal__dismissButton}`}
          onClick={dismissError}
          autoFocus={true}
        >
          Dismiss
        </ButtonSquare>
      </div>
    </>
  );
};
const ErrorModalWrapper: React.FC<Props> = ({ error }) => {
  // @ts-ignore
  const transitions = useTransition(error, null, {
    from: { opacity: 0, xy: [0, -25] },
    enter: { opacity: 1, xy: [0, 0] },
    leave: { opacity: 0, xy: [0, -5] },
  });
  const dismissError = useCallback(() => {
    appActionCreators.throwError(undefined);
  }, []);
  return (
    <>
      {error && <Scrim onClick={dismissError} errorModal={true}/>}
      {
        <div className={modErrorModal.errorModal__wrapper}>
          {transitions.map(({ key, item, props: style }) => (
            <>
              <animated.div
                key={key}
                style={{
                  ...style,
                  transform: style.xy.interpolate(
                    (x, y) => `translate3d(${x}px,${y}px,0)`,
                  ),
                }}
              >
                {item && (
                  <ErrorModal error={error} dismissError={dismissError} />
                )}
              </animated.div>
            </>
          ))}
        </div>
      }
    </>
  );
};

export default ErrorModalWrapper;
