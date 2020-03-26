import modErrorModal from '::sass-modules/shared-components/error-modal.scss';
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useRef } from 'react';
import { appActions } from '::app/reducer';
import { Scrim } from '::shared-components/scrim';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
type Props = {
  error: Error;
  dispatch: Function;
};

const ErrorModal: React.FC<Props> = ({ error, dispatch }) => {
  const dismissError = useCallback(() => {
    dispatch({ type: appActions.SET_ERROR, value: undefined });
  }, []);
  const focusAnchor = useRef<HTMLButtonElement>();
  useEffect(() => {
    if (focusAnchor.current) focusAnchor.current.focus();
  });
  useModalKeyboardEvents({
    onCloseModal: dismissError,
    modalSelector: `.${modErrorModal.errorModal}`,
  });
  return (
    <>
      <Scrim onClick={dismissError} />
      <div className={modErrorModal.errorModal}>
        <FontAwesomeIcon
          className={`${modErrorModal.errorModal__icon}`}
          icon={faExclamationTriangle}
          color={'#ff304f'}
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
          myref={focusAnchor}
        >
          Dismiss
        </ButtonSquare>
      </div>
    </>
  );
};
export { ErrorModal };
