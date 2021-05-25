import * as React from 'react';
import mod from './information-link.scss';
type Props = { text: string; link: string };
export const InformationLink: React.FC<Props> = ({ link, text }) => {
  return (
    <a
      href={link}
      target={'_blank'}
      rel={'noreferrer'}
      className={mod.informationLink}
    >
      {text}
    </a>
  );
};
