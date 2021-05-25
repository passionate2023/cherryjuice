import * as React from 'react';
import mod from './information-text.scss';

type Props = { text: string };

export const InformationText: React.FC<Props> = ({ text }) => {
  return <span className={mod.informationText}>{text}</span>;
};
