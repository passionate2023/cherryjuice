import * as React from 'react';
import modLogin from './link.scss';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useRef } from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';

type Props = {
  text: string;
  to: string;
  decorated?: boolean;
};

export const Link: React.FC<Props> = ({ text, to, decorated = true }) => {
  const ref = useRef<HTMLAnchorElement>();
  return (
    <span
      className={joinClassNames([
        modLogin.link,
        [modLogin.linkDecorated, decorated],
      ])}
      tabIndex={0}
      onKeyUp={e => {
        if (e.key === ' ') ref.current.click();
      }}
    >
      <ReactRouterLink ref={ref} to={to} tabIndex={-1}>
        {text}
      </ReactRouterLink>
    </span>
  );
};
