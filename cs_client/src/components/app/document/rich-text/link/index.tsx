import * as React from 'react';
import { Link as ReactROuterLink } from 'react-router-dom';

type Props = { href: string; target: string; text: string };

const Link: React.FC<Props> = ({ href, target, text }) => {
  console.log({ href, target });

  return target === '_blank' ? (
    <a href={href} target={target}>
      {text}
    </a>
  ) : target === 'node' ? (
    <ReactROuterLink to={href}>{text}</ReactROuterLink>
  ) : (
    <>text</>
  );
};

export { Link };
