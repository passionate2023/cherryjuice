import * as React from 'react';
import { modRichText } from '::sass-modules';
import { Icon, Icons } from '@cherryjuice/icons';

type Props = {};

const OfflineBanner: React.FC<Props> = () => {
  return (
    <div className={modRichText.offlineBanner__container}>
      <span className={modRichText.offlineBanner__text}>You are offline</span>
      <Icon name={Icons.material['no-connection']} size={40} />
    </div>
  );
};

export { OfflineBanner };
