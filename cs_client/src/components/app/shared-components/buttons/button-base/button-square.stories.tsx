import React from 'react';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';

const config = {
  title: 'shared/button/square',
};
export const withText = () => <ButtonSquare text={'Hello Button'} />;

export const withEmoji = ({ onClick, disabled }) => (
  <ButtonSquare
    {...{ onClick, disabled }}
    icon={
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    }
  />
);
export default config;
