import modLogin from './form-separator.scss';
import * as React from 'react';

export const FormSeparator = ({ text }) => (
  <div
    className={modLogin.formSeparator}
    onContextMenu={e => {
      e.preventDefault();
      e.stopPropagation();
      alert(document.head.children[6]['content']);
    }}
  >
    <div className={modLogin.formSeparator__line} />
    <span className={modLogin.formSeparator__text}>{text}</span>
    <div className={modLogin.formSeparator__line} />
  </div>
);
