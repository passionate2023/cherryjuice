import { modLogin } from '::sass-modules';
import * as React from 'react';

const FormSeparator = ({ text }) => (
  <div
    className={modLogin.login__separator}
    onContextMenu={e => {
      e.preventDefault();
      e.stopPropagation();
      alert(document.head.children[6]['content']);
    }}
  >
    <div className={modLogin.login__separator__line} />
    <span className={modLogin.login__separator__text}>{text}</span>
    <div className={modLogin.login__separator__line} />
  </div>
);

export { FormSeparator };
