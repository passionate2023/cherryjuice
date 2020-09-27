import * as React from 'react';
import { NodePrivacy, Privacy } from '::types/graphql';
import { modInfoBar } from '::sass-modules';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { joinClassNames } from '::helpers/dom/join-class-names';

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
  numberOfGuests: number;
  className?: string;
  displayNumberOfGuestsAsBadge?: boolean;
};

const VisibilityIcon: React.FC<Props> = ({
  numberOfGuests,
  privacy,
  className,
  displayNumberOfGuestsAsBadge = true,
}) => {
  const name = mapPrivacyToIcon(privacy);
  return (
    <>
      {name && (
        <div
          className={
            modInfoBar.infoBar__documentPrivacy + ' ' + (className || '')
          }
        >
          <div
            className={joinClassNames([
              modInfoBar.infoBar__documentPrivacy__iconContainer,
              [
                modInfoBar.infoBar__documentPrivacy__iconContainerBadge,
                displayNumberOfGuestsAsBadge,
              ],
            ])}
          >
            <Icon name={name} loadAsInlineSVG={'force'} size={14} />
            {Boolean(numberOfGuests) &&
              (privacy === Privacy.GUESTS_ONLY ||
                privacy === Privacy.PUBLIC) && (
                <span
                  className={joinClassNames([
                    modInfoBar.infoBar__documentPrivacy__icon__numberOfGuests,
                    [
                      modInfoBar.infoBar__documentPrivacy__icon__numberOfGuestsBadge,
                      displayNumberOfGuestsAsBadge,
                    ],
                  ])}
                >
                  {numberOfGuests}
                </span>
              )}
          </div>
        </div>
      )}
    </>
  );
};

export { VisibilityIcon };
