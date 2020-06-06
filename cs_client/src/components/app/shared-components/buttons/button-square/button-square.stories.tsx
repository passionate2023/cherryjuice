import React from 'react';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';

const config = {
  title: 'shared/button/square',
};
export const withText = () => <ButtonSquare>Hello Button</ButtonSquare>;

export const withEmoji = ({ onClick, disabled }) => (
  <ButtonSquare {...{ onClick, disabled }}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </ButtonSquare>
);
export default config;
