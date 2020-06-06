import React from 'react';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';

export default { title: 'shared/button/circle' };

export const withText = () => <ButtonCircle>Hello Button</ButtonCircle>;

export const withEmoji = () => (
  <ButtonCircle>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </ButtonCircle>
);
