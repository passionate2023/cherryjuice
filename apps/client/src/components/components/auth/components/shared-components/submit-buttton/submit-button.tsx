import * as React from 'react';
import mod from './submit-button.scss';

type Props = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  noMarginTop?: boolean;
};
export const SubmitButton: React.FC<Props> = ({
  text,
  onClick,
  disabled,
  noMarginTop,
}) => {
  return (
    <input
      type={'submit'}
      value={text}
      className={`${mod.submitButton} ${
        noMarginTop ? '' : mod.submitButtonMarginTop
      }`}
      onClick={onClick}
      disabled={disabled}
    />
  );
};
