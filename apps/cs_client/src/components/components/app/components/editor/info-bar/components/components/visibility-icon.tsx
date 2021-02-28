import * as React from 'react';
import { NodePrivacy, Privacy } from '@cherryjuice/graphql-types';
import { modInfoBar } from '::sass-modules';
import { Icon, Icons } from '@cherryjuice/icons';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { InfoBarIcon } from '::app/components/editor/info-bar/components/info-bar-icon/info-bar-icon';

export const mapPrivacyToIcon = (privacy: NodePrivacy | Privacy) => {
  switch (privacy) {
    case Privacy.PRIVATE:
      return undefined; //Icons.material['lock-closed'];
    case Privacy.GUESTS_ONLY:
      return Icons.material.people;
    case Privacy.PUBLIC:
      return Icons.material.globe;
  }
};

type Props = {
  privacy: NodePrivacy | Privacy;
  numberOfGuests: number;
  className?: string;
  displayNumberOfGuestsAsBadge?: boolean;
  labelSubject?: 'document' | 'node';
};

const VisibilityIcon: React.FC<Props> = ({
  numberOfGuests,
  privacy,
  className,
  displayNumberOfGuestsAsBadge = true,
  labelSubject = 'document',
}) => {
  const name = mapPrivacyToIcon(privacy);
  return (
    <InfoBarIcon
      tooltip={
        privacy === Privacy.PRIVATE
          ? `This ${labelSubject} is private`
          : privacy === Privacy.GUESTS_ONLY
          ? `This ${labelSubject} is visible for guests`
          : privacy === Privacy.PUBLIC
          ? `This ${labelSubject} is public`
          : ''
      }
      className={className}
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
        <Icon name={name} size={14} />

        {Boolean(numberOfGuests) &&
          (privacy === Privacy.GUESTS_ONLY || privacy === Privacy.PUBLIC) && (
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
    </InfoBarIcon>
  );
};

export { VisibilityIcon };
