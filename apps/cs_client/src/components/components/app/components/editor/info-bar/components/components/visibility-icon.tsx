import * as React from 'react';
import { NodePrivacy, Privacy } from '@cherryjuice/graphql-types';
import { modInfoBar } from '::sass-modules';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { joinClassNames } from '::helpers/dom/join-class-names';
import {
  LabelPosition,
  Tooltip,
} from '::root/components/shared-components/tooltip/tooltip';

const mapPrivacyToIcon = (privacy: NodePrivacy | Privacy) => {
  switch (privacy) {
    case Privacy.PRIVATE:
      return Icons.material['lock-closed'];
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
  labelPosition?: LabelPosition;
  labelSubject?: 'document' | 'node';
  showTooltip?: boolean;
};

const VisibilityIcon: React.FC<Props> = ({
  numberOfGuests,
  privacy,
  className,
  displayNumberOfGuestsAsBadge = true,
  labelPosition = 'top-left',
  labelSubject = 'document',
  showTooltip = true,
}) => {
  const name = mapPrivacyToIcon(privacy);
  return (
    <>
      <Tooltip
        label={
          privacy === Privacy.PRIVATE
            ? `This ${labelSubject} is private`
            : privacy === Privacy.GUESTS_ONLY
            ? `This ${labelSubject} is visible for guests`
            : privacy === Privacy.PUBLIC
            ? `This ${labelSubject} is public`
            : ''
        }
        position={labelPosition}
        show={showTooltip}
      >
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
      </Tooltip>
    </>
  );
};

export { VisibilityIcon };
