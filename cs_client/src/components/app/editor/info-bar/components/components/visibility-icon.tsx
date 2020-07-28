import * as React from 'react';
import { NodePrivacy, Privacy } from '::types/graphql/generated';
import { modInfoBar } from '::sass-modules/';
import { Icon, Icons } from '::shared-components/icon/icon';

const mapPrivacyToIcon = (privacy: NodePrivacy | Privacy) => {
  switch (privacy) {
    case Privacy.PRIVATE:
      return Icons.material['lock-closed'];
    case Privacy.GUESTS_ONLY:
      return Icons.material.person;
    case Privacy.PUBLIC:
      return Icons.material.globe;
  }
};

type Props = {
  privacy: NodePrivacy | Privacy;
  className?: string;
};

const VisibilityIcon: React.FC<Props> = ({ privacy, className }) => {
  return (
    <div
      className={modInfoBar.infoBar__documentPrivacy + ' ' + (className || '')}
    >
      <Icon
        name={mapPrivacyToIcon(privacy)}
        loadAsInlineSVG={'force'}
        size={14}
      />
    </div>
  );
};

export { VisibilityIcon };
