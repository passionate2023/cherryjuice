import React from 'react';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';

export default { title: 'shared/button/circle' };

export const withText = () => <ButtonCircle text={'Hello Button'} />;

export const withEmoji = () => (
  <ButtonCircle
    icon={
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    }
  />
);
